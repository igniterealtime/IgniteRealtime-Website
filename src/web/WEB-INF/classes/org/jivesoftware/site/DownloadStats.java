package org.jivesoftware.site;

import org.jivesoftware.database.DbConnectionManager;
import org.jivesoftware.util.StringUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.Map;
import java.util.Hashtable;
import java.util.Date;
import java.io.File;

import com.maxmind.geoip.LookupService;
import com.maxmind.geoip.Region;
import com.maxmind.geoip.Country;
import com.maxmind.geoip.Location;

import javax.servlet.*;
import javax.servlet.http.HttpServlet;

/**
 * A utility class which provides download statistics for the site. It is implemented as a Servlet
 * so that it can hook into the ServletConfig.
 */
public class DownloadStats extends HttpServlet {
    private static ServletConfig config;

    // SQL for inserting the plugin listing info
    private static final String ADD_PLUGIN_LISTING_INFO = "insert into pluginListing (ipAddress, os, country, city," +
            " state, product, version, time, type) values (?,?,?,?,?,?,?,?,?)";
    // SQL for inserting the download info
    private static final String ADD_DOWNLOAD_INFO = "insert into downloadInfo (ipAddress, country, region, city, " +
            "product, version, fileType, fileName, time, type) values (?,?,?,?,?,?,?,?,?,?)";
    // SQL for inserting the update info check
    private static final String ADD_UPDATE_INFO = "insert into checkUpdateInfo (ipAddress, os, type, time, country, " +
            "city, state, currentVersion, latestVersion) values (?,?,?,?,?,?,?,?,?)";

    // SQL for counting the total number of downloads
    private static String COUNT_TOTAL_DOWNLOADS = "SELECT count(*) FROM downloadInfo";
    // SQL for counting the total number of downloads for a particular download type
    private static String COUNT_TOTAL_DOWNLOADS_FOR_TYPE = "SELECT count(*) FROM downloadInfo WHERE type = ?";

    // Period between cache updates
    private static long CACHE_PERIOD = 30 * 60 * 1000; // 30 minutes
    // epoch time of the last update
    private static long lastUpdate = 0;
    // Using a Hashtable for synchronization
    private static Map<String, Long> counts = new Hashtable<String, Long>();
    private static final String TOTAL = "total";

    // A reference to the builds directory
    private static File buildsDirectory;

    // The lookup service
    private static LookupService lookupService;

    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
        config = servletConfig;
        String buildsPath = config.getServletContext().getInitParameter("builds-path");
        buildsDirectory = new File(buildsPath);
        File geoDatabase = new File(buildsDirectory, "geoip.dat");
        try {
            lookupService = new LookupService(geoDatabase);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
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
     * Allow other classes to use this instance of the lookup service.
     *
     * @return the lookup service
     */
    public static LookupService getLookupService() {
        if (lookupService == null || lookupService.isClosed()) {
            File geoDatabase = new File(buildsDirectory, "geoip.dat");
            try {
                lookupService = new LookupService(geoDatabase);
            }
            catch (Exception e) {
                e.printStackTrace();
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
        return counts.get(TOTAL);
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
            catch (Exception ignored) { /* ignored */ }
        }
    }

    private static class DownloadStatsRunnable implements Runnable {
        private Map<String, Long> counts = null;

        public DownloadStatsRunnable(Map<String, Long> counts) {
            this.counts = counts;
        }

        public void run() {
            final DbConnectionManager connectionManager = DbConnectionManager.getInstance();
            Connection con = null;
            PreparedStatement pstmt = null;
            ResultSet rs = null;
            // The count starts at 1282298 which is an estimate of the number of downloads prior to
            // accurate download stats being collected. This number was derived by performing a linear
            // regression from the time the project was first available until November 30, 2006.
            long count = 1282298L;

            // Get the total count
            try {
                con = connectionManager.getConnection();
                pstmt = con.prepareStatement(COUNT_TOTAL_DOWNLOADS);
                rs = pstmt.executeQuery();
                if (rs.next()) {
                    count += rs.getLong(1);
                }
            }
            catch (Exception e) {
                System.err.println("Error counting total downloads.");
                e.printStackTrace();
            }
            finally {
                if (rs != null) {
                    try { rs.close(); } catch (Exception ignored) { /* ignored */ }
                }
                DbConnectionManager.close(pstmt, con);
            }
            counts.put(TOTAL, count);

            // Get the count for each type
            for (DownloadServlet.DownloadInfo type : DownloadServlet.DownloadInfo.values()) {
                // The count starts at an estimate of the number of downloads prior to
                // accurate download stats being collected. This number was derived by performing a linear
                // regression from the time the project was first available until November 30, 2006.
                switch (type) {
                    case openfire:
                        count = 675774L;
                        break;
                    case spark:
                        count = 438159L;
                        break;
                    case smack:
                        count = 332007L;
                        break;
                    case xiff:
                        count = 4683L;
                        break;
                    default:
                        count = 0L;
                }

                try {
                    con = connectionManager.getConnection();
                    pstmt = con.prepareStatement(COUNT_TOTAL_DOWNLOADS_FOR_TYPE);
                    pstmt.setInt(1, type.getType());
                    rs = pstmt.executeQuery();
                    if (rs.next()) {
                        count += rs.getLong(1);
                    }
                }
                catch (Exception e) {
                    String name = null;
                    if (type != null) {
                        name = type.getName();
                    }
                    System.err.println("Error counting downloads for type " + name);
                    e.printStackTrace();
                }
                finally {
                    if (rs != null) {
                        try { rs.close(); } catch (Exception ignored) { /* ignored */ }
                    }
                    DbConnectionManager.close(pstmt, con);
                }
                counts.put(type.getName(), count);
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
    public static void addListingToDatabase(String ipAddress, String product, String os, int type, ServletContext context) {

        final DbConnectionManager connectionManager = DbConnectionManager.getInstance();
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = connectionManager.getConnection();
            pstmt = con.prepareStatement(ADD_PLUGIN_LISTING_INFO);

            final String timeOfDownload = StringUtils.dateToMillis(new Date());
            final LookupService lookupService = getLookupService();

            String ctry = "n/a";
            String state = "n/a";
            String city = "n/a";


            try {
                Location location = lookupService.getLocation(ipAddress);
                if (location != null) {
                    Country country = location.getCountry();
                    if (country != null) {
                        ctry = country.getName();
                    }

                    Region region = location.getRegion();
                    if (region != null) {
                        state = region.getRegionName();
                    }

                    if (location.getCity() != null) {
                        city = location.getCity();
                    }
                }
            }
            catch (Exception e) {
                context.log("Unable to retrieve info using");
                e.printStackTrace();
            }

            pstmt.setString(1, ipAddress);
            pstmt.setString(2, os);
            pstmt.setString(3, ctry);
            pstmt.setString(4, city);
            pstmt.setString(5, state);
            pstmt.setString(6, product);
            pstmt.setNull(7, Types.VARCHAR);
            pstmt.setString(8, timeOfDownload);
            pstmt.setInt(9, type);
            pstmt.executeUpdate();
        }
        catch (Exception e) {
            System.err.print("Unable to process spark plugin listing information for " + ipAddress);
            e.printStackTrace();
        }
        finally {
            DbConnectionManager.close(pstmt, con);
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
    public static void addUpdateToDatabase(String ipAddress, String product, String version, String fileType,
                                           String fileName, DownloadServlet.DownloadInfo downloadInfo)
    {
        final DbConnectionManager connectionManager = DbConnectionManager.getInstance();
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = connectionManager.getConnection();
            pstmt = con.prepareStatement(ADD_DOWNLOAD_INFO);

            final String timeOfDownload = StringUtils.dateToMillis(new Date());

            final LookupService lookupService = DownloadStats.getLookupService();

            String ctry = "n/a";
            String state = "n/a";
            String city = "n/a";


            try {
                Location location = lookupService.getLocation(ipAddress);
                if (location != null) {
                    Country country = location.getCountry();
                    if (country != null) {
                        ctry = country.getName();
                    }

                    Region region = location.getRegion();
                    if (region != null) {
                        state = region.getRegionName();
                    }

                    if (location.getCity() != null) {
                        city = location.getCity();
                    }
                }
            }
            catch (Exception e) {
                System.err.print("Unable to retrieve info");
                e.printStackTrace();
            }

            pstmt.setString(1, ipAddress);
            pstmt.setString(2, ctry);
            pstmt.setString(3, state);
            pstmt.setString(4, city);
            pstmt.setString(5, product);
            pstmt.setString(6, version);
            pstmt.setString(7, fileType);
            pstmt.setString(8, fileName);
            pstmt.setString(9, timeOfDownload);
            pstmt.setInt(10, downloadInfo.getType());
            pstmt.executeUpdate();
        }
        catch (Exception e) {
            System.err.print("Unable to process download information for " + ipAddress);
            e.printStackTrace();
        }
        finally {
            DbConnectionManager.close(pstmt, con);
        }

    }

    public static void addCheckUpdate(String ipAddress, String os, String currentVersion, String latestVersion,
                                      DownloadServlet.DownloadInfo info)
    {
        final DbConnectionManager connectionManager = DbConnectionManager.getInstance();
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = connectionManager.getConnection();
            pstmt = con.prepareStatement(ADD_UPDATE_INFO);

            final String timeOfDownload = StringUtils.dateToMillis(new Date());

            final LookupService lookupService = DownloadStats.getLookupService();

            String ctry = "n/a";
            String state = "n/a";
            String city = "n/a";


            try {
                Location location = lookupService.getLocation(ipAddress);
                if (location != null) {
                    Country country = location.getCountry();
                    if (country != null) {
                        ctry = country.getName();
                    }

                    Region region = location.getRegion();
                    if (region != null) {
                        state = region.getRegionName();
                    }

                    if (location.getCity() != null) {
                        city = location.getCity();
                    }
                }
            }
            catch (Exception e) {
                System.err.print("Unable to retrieve info");
                e.printStackTrace();
            }

            pstmt.setString(1, ipAddress);
            pstmt.setString(2, os);
            pstmt.setInt(3, info.getType());
            pstmt.setString(4, timeOfDownload);
            pstmt.setString(5, ctry);
            pstmt.setString(6, state);
            pstmt.setString(7, city);
            if (currentVersion == null) {
                pstmt.setNull(8, Types.VARCHAR);
            }
            else {
                pstmt.setString(8, currentVersion);
            }
            if (latestVersion == null) {
                pstmt.setNull(9, Types.VARCHAR);
            }
            else {
                pstmt.setString(9, latestVersion);
            }
            pstmt.executeUpdate();
        }
        catch (Exception e) {
            System.err.print("Unable to process update checking information information for " + ipAddress);
            e.printStackTrace();
        }
        finally {
            DbConnectionManager.close(pstmt, con);
        }

    }

}
