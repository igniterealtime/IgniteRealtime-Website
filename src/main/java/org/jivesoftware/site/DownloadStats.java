package org.jivesoftware.site;

import com.maxmind.geoip.Location;
import com.maxmind.geoip.LookupService;
import org.jivesoftware.database.DbConnectionManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.Hashtable;
import java.util.Map;

/**
 * A utility class which provides download statistics for the site. It is implemented as a Servlet
 * so that it can hook into the ServletConfig.
 */
public class DownloadStats extends HttpServlet {

    private static final Logger Log = LoggerFactory.getLogger( DownloadStats.class );

    private static ServletConfig config;

    // SQL for inserting the plugin listing info
    private static final String ADD_PLUGIN_LISTING_INFO = "insert into pluginListing (ipAddress, os, country, region, city, product, version, time, type) values (INET_ATON(?),?,?,?,?,?,?,NOW(),?)";

    // SQL for inserting the download info
    private static final String ADD_DOWNLOAD_INFO = "insert into downloadInfo (ipAddress, country, region, city, product, version, fileType, fileName, time, type) values (INET_ATON(?),?,?,?,?,?,?,?,NOW(),?)";

    // SQL for inserting the update info check
    private static final String ADD_UPDATE_INFO = "insert into checkUpdateInfo (ipAddress, os, type, time, country, region, city, currentVersion, latestVersion) values (INET_ATON(?),?,?,NOW(),?,?,?,?,?)";

    // SQL for counting the total number of downloads by type.
    private static String COUNT_TOTAL_DOWNLOADS_BY_TYPE = "SELECT type, count(type) FROM downloadInfo GROUP BY type";

    // SQL for counting the total number of downloads in the last 7 days.
    private static String COUNT_TOTAL_DOWNLOADS_LAST_7_DAYS = "SELECT count(*) FROM downloadInfo WHERE time >= DATE(NOW() - INTERVAL 7 DAY)";

    // Period between cache updates
    private static long CACHE_PERIOD = 30 * 60 * 1000; // 30 minutes

    // epoch time of the last update
    private static long lastUpdate = 0;

    // Using a Hashtable for synchronization
    private static Map<String, Long> counts = new Hashtable<>();
    private static final String TOTAL = "total";
    private static final String TOTAL7DAYS = "total7days";

    // A reference to the builds directory
    private static File buildsDirectory;

    // A reference to download hostname
    private static String downloadHost;

    // The lookup service
    private static LookupService lookupService;

    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
        config = servletConfig;
        String buildsPath = config.getServletContext().getInitParameter("builds-path");
        buildsDirectory = new File(buildsPath);
        downloadHost = config.getServletContext().getInitParameter("download-host");
    }

    /**
     * Close any resources held open.
     */
    public void destroy() {
        super.destroy();
        if (lookupService != null) {
            lookupService.close();
        }
    }

    public ServletConfig getServletConfig() {
        return config;
    }

    /**
     * Return the "builds" directory for the application.
     *
     * @return the builds directory
     */
    public static File getBuildsDirectory() {
        return buildsDirectory;
    }
    
    /**
     * Return the "download" hostname for redirecting to S3/Cloudfront stored files.
     * 
     * @return the download hostname 
     */
    public static String getDownloadHost() {
        return downloadHost;
    }

    /**
     * Allow other classes to use this instance of the lookup service.
     *
     * @return the lookup service
     */
    public static LookupService getLookupService() {
        if (lookupService == null) {
            try {
                lookupService = new LookupService( config.getServletContext().getInitParameter("geoip-database-path") );
            }
            catch (Exception e) {
                Log.error( "An exception occurred while obtaining the lookup service.", e);
            }
        }
        return lookupService;
    }

    /**
     * Count the total number of downloads.
     *
     * @param type the type of download to get the values for
     * @return the total number of downloads.
     */
    public static long getDownloadsForType(DownloadServlet.DownloadInfo type) {
        collectTotals();
        return counts.get(type.getName());
    }

    /**
     * Count the total number of downloads.
     *
     * @return the total number of downloads.
     */
    public static long getTotalDownloads() {
        collectTotals();
        if (counts.containsKey(TOTAL)) {
            return counts.get(TOTAL);
        }
        return 0;
    }

    /**
     * Count the total number of downloads in the last 7 days.
     *
     * @return the total number of downloads in the last 7 days.
     */
    public static long getTotalDownloadsLast7Days() {
        collectTotals();
        if (counts.containsKey(TOTAL7DAYS)) {
            return counts.get(TOTAL7DAYS);
        }
        return 0;
    }

    /**
     * Collects all of the totals from the database. Has a rudimentary caching mechanism
     * so that the queries are only run every CACHE_PERIOD milliseconds.
     */
    private synchronized static void collectTotals() {
        // See if we need to update the totals
        if ((lastUpdate + CACHE_PERIOD) > System.currentTimeMillis()) {
            return;
        }
        lastUpdate = System.currentTimeMillis();

        // Collect the new totals on a background thread since they could take a while
        Thread collectorThread = new Thread(new DownloadStatsRunnable(counts));
        collectorThread.start();
        if (counts.isEmpty()) {
            // Need to wait for the collectorThread to finish since the counts are not initialized yet
            try {
                collectorThread.join();
            }
            catch (Exception e) { Log.debug( "An exception occurred that can probably be ignored.", e); }
        }
    }

    private static class DownloadStatsRunnable implements Runnable {
        private Map<String, Long> counts;

        public DownloadStatsRunnable(Map<String, Long> counts) {
            this.counts = counts;
        }

        public void run() {
            final DbConnectionManager connectionManager = DbConnectionManager.getInstance();
            Connection con = null;
            PreparedStatement pstmt = null;
            ResultSet rs = null;

            final Map<String, Long> results = new Hashtable<>();
            long total = 0L;
            try {
                con = connectionManager.getConnection();
                pstmt = con.prepareStatement(COUNT_TOTAL_DOWNLOADS_BY_TYPE);
                rs = pstmt.executeQuery();

                while (rs.next()) {
                    final int type = rs.getInt(2);
                    long amount = rs.getLong(1);

                    final DownloadServlet.DownloadInfo downloadInfo = DownloadServlet.DownloadInfo.getDownloadInfo(type);
                    if (downloadInfo == null) {
                        continue;
                    }

                    // The count starts at an estimate of the number of downloads prior to
                    // accurate download stats being collected. This number was derived by performing a linear
                    // regression from the time the project was first available until November 30, 2006.
                    switch (downloadInfo) {
                        case openfire:
                            amount += 675774L;
                            break;
                        case spark:
                            amount += 438159L;
                            break;
                        case smack:
                            amount += 332007L;
                            break;
                        case xiff:
                            amount += 4683L;
                            break;
                        default:
                            break;
                    }
                    total += amount;
                    results.put(downloadInfo.getName(), amount);
                }
                results.put(TOTAL, total);

                // Combine Openfire and Wildfire results (as they're different historical names for the same project).
                results.put(DownloadServlet.DownloadInfo.openfire.getName(), results.get(DownloadServlet.DownloadInfo.openfire.getName()) + results.get(DownloadServlet.DownloadInfo.wildfire.getName()));
                results.remove(DownloadServlet.DownloadInfo.wildfire.getName());
                results.put(DownloadServlet.DownloadInfo.openfire_plugin.getName(), results.get(DownloadServlet.DownloadInfo.openfire_plugin.getName()) + results.get(DownloadServlet.DownloadInfo.wildfire_plugin.getName()));
                results.remove(DownloadServlet.DownloadInfo.wildfire_plugin.getName());

                results.forEach((key, value) -> System.out.println(key + ": " + value));

                rs.close();
                pstmt.close();

                pstmt = con.prepareStatement(COUNT_TOTAL_DOWNLOADS_LAST_7_DAYS);
                rs = pstmt.executeQuery();
                long lastDays = 0L;
                if (rs.next()) {
                    lastDays = rs.getLong(1);
                }
                results.put(TOTAL7DAYS, lastDays);

                // Replace all values in the object used by the website in one go.
                counts.clear();
                counts.putAll(results);
            } catch (Exception e) {
                Log.warn("Error counting downloads.", e);
            }
            finally {
                if (rs != null) {
                    try { rs.close(); } catch (Exception e) { Log.debug( "An exception occurred that can probably be ignored.", e); }
                }
                DbConnectionManager.close(pstmt, con);
            }
        }
    }

    /**
     * Adds an entry into the pluginListing table to track all plugin listing downloads on Ignite.
     *
     * @param ipAddress the ipAddress of the user.
     * @param product   the name of the product (ex. spark or openfire).
     * @param os        the os making the request
     * @param type      the type of file.
     * @param context   the servlet context
     * @see org.jivesoftware.site.DownloadServlet.DownloadInfo
     */
    public static void addListingToDatabase( String ipAddress, String product, String os, int type, ServletContext context )
    {
        final DbConnectionManager connectionManager = DbConnectionManager.getInstance();
        Connection con = null;
        PreparedStatement pstmt = null;
        try
        {
            con = connectionManager.getConnection();
            pstmt = con.prepareStatement( ADD_PLUGIN_LISTING_INFO );

            String country= null;
            String region = null;
            String city = null;

            try
            {
                Location location = getLookupService().getLocation( ipAddress );
                if ( location != null )
                {
                    country = location.countryName;
                    region  = location.region;
                    city    = location.city;
                }
            }
            catch ( Exception e )
            {
                Log.warn( "Unable to retrieve info", e );
            }

            pstmt.setString( 1, ipAddress );
            pstmt.setString( 2, os );
            pstmt.setString( 3, country );
            pstmt.setString( 4, region );
            pstmt.setString( 5, city );
            pstmt.setString( 6, product );
            pstmt.setNull( 7, Types.VARCHAR );
            pstmt.setInt( 8, type );
            pstmt.executeUpdate();
        }
        catch ( Exception e )
        {
            Log.warn( "Unable to process spark plugin listing information for " + ipAddress, e );
        }
        finally
        {
            DbConnectionManager.close( pstmt, con );
        }
    }


    /**
     * Adds an entry into the DownloadInfo to track all downloads on Jivesoftware.org.
     *
     * @param ipAddress    the ipAddress of the user.
     * @param product      the name of the product (ex. spark or openfire).
     * @param version      the version of the product.
     * @param fileType     the type of file (suffix)
     * @param fileName     the full name of the file.
     * @param downloadInfo the type of file.
     * @see org.jivesoftware.site.DownloadServlet.DownloadInfo
     */
    public static void addUpdateToDatabase( String ipAddress, String product, String version, String fileType,
                                            String fileName, DownloadServlet.DownloadInfo downloadInfo )
    {
        final DbConnectionManager connectionManager = DbConnectionManager.getInstance();
        Connection con = null;
        PreparedStatement pstmt = null;
        try
        {
            con = connectionManager.getConnection();
            pstmt = con.prepareStatement( ADD_DOWNLOAD_INFO );

            String country = null;
            String region = null;
            String city = null;

            try
            {
                Location location = getLookupService().getLocation( ipAddress );
                if ( location != null )
                {
                    country = location.countryName;
                    region  = location.region;
                    city    = location.city;
                }
            }
            catch ( Exception e )
            {
                Log.warn( "Unable to retrieve info", e );
            }

            pstmt.setString( 1, ipAddress );
            pstmt.setString( 2, country );
            pstmt.setString( 3, region );
            pstmt.setString( 4, city );
            pstmt.setString( 5, product );
            pstmt.setString( 6, version );
            pstmt.setString( 7, fileType );
            pstmt.setString( 8, fileName );
            pstmt.setInt( 9, downloadInfo.getType() );
            pstmt.executeUpdate();
        }
        catch ( Exception e )
        {
            Log.warn( "Unable to process download information for " + ipAddress, e );
        }
        finally
        {
            DbConnectionManager.close( pstmt, con );
        }

    }

    public static void addCheckUpdate( String ipAddress, String os, String currentVersion, String latestVersion,
                                       DownloadServlet.DownloadInfo info )
    {
        final DbConnectionManager connectionManager = DbConnectionManager.getInstance();
        Connection con = null;
        PreparedStatement pstmt = null;
        try
        {
            con = connectionManager.getConnection();
            pstmt = con.prepareStatement( ADD_UPDATE_INFO );

            String country = null;
            String region = null;
            String city = null;

            try
            {
                Location location = getLookupService().getLocation( ipAddress );
                if ( location != null )
                {
                    country = location.countryName;
                    region  = location.region;
                    city    = location.city;
                }
            }
            catch ( Exception e )
            {
                Log.warn( "Unable to retrieve info", e );
            }

            pstmt.setString( 1, ipAddress );
            pstmt.setString( 2, os );
            pstmt.setInt( 3, info.getType() );
            pstmt.setString( 4, country );
            pstmt.setString( 5, region );
            pstmt.setString( 6, city );
            pstmt.setString( 7, currentVersion );
            pstmt.setString( 8, latestVersion );
            pstmt.executeUpdate();
        }
        catch ( Exception e )
        {
            Log.warn( "Unable to process update checking information information for " + ipAddress, e );
        }
        finally
        {
            DbConnectionManager.close( pstmt, con );
        }
    }
}
