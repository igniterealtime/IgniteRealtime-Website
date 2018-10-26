package org.jivesoftware.site;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.activation.MimetypesFileTypeMap;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Servlet used for downloading and capturing of data for all Openfire and Spark plugins on Ignite.
 */
public class PluginDownloadServlet extends HttpServlet {

    private static final Logger Log = LoggerFactory.getLogger( PluginDownloadServlet.class );

    private static MimetypesFileTypeMap typeMap = new MimetypesFileTypeMap();
    private Map<String, PluginCacheEntry> pluginCache = Collections.synchronizedMap( new HashMap<>());
    private String sparkPluginsPath;
    private String openfirePluginsPath;
    private String openfirePluginsBetaPath;
    private String openfirePluginsDevPath;

    private String openfirePluginUri = "/projects/openfire/plugins/";
    private String openfirePluginBetaUri = "/projects/openfire/plugins-beta/";
    private String openfirePluginDevUri = "/projects/openfire/plugins-dev/";
    private String sparkPluginUri = "/updater/sparkplugs/";

    public void init(ServletConfig config) throws ServletException
    {
        super.init(config);

        sparkPluginsPath        = config.getServletContext().getInitParameter("spark-plugins-path");
        openfirePluginsPath     = config.getServletContext().getInitParameter("openfire-plugins-path");
        openfirePluginsBetaPath = config.getServletContext().getInitParameter("openfire-plugins-beta-path");
        openfirePluginsDevPath  = config.getServletContext().getInitParameter("openfire-plugins-dev-path");
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        final String pluginName;
        final DownloadServlet.DownloadInfo pluginType;
        final Path plugin;
        final String requestedFile;

        final String requestURI = request.getRequestURI();
        if ( !validateFilename( requestURI ) )
        {
            response.sendError( HttpServletResponse.SC_NOT_FOUND );
            return;
        }

        final boolean isPlugin = requestURI.endsWith( ".jar" );
        if ( requestURI.startsWith( sparkPluginUri ) )
        {
            pluginName = requestURI.substring( sparkPluginUri.length(), requestURI.indexOf( isPlugin ? "." : "/" , sparkPluginUri.length() + 1) );
            pluginType = isPlugin ? DownloadServlet.DownloadInfo.spark_plugin : null;
            plugin = Paths.get( sparkPluginsPath, pluginName + ".jar" );
            requestedFile = isPlugin ? null : requestURI.replace( sparkPluginUri + pluginName + "/", "" );
        }
        else if ( requestURI.startsWith( openfirePluginUri ) )
        {
            pluginName = requestURI.substring( openfirePluginUri.length(), requestURI.indexOf( isPlugin ? "." : "/" , openfirePluginUri.length() + 1) );
            pluginType = isPlugin ? DownloadServlet.DownloadInfo.openfire_plugin : null;
            plugin = Paths.get( openfirePluginsPath, pluginName + ".jar" );
            requestedFile = isPlugin ? null : requestURI.replace( openfirePluginUri + pluginName + "/", "" );
        }
        else if ( requestURI.startsWith( openfirePluginBetaUri ) )
        {
            pluginName = requestURI.substring( openfirePluginBetaUri.length(), requestURI.indexOf( isPlugin ? "." : "/" , openfirePluginBetaUri.length() + 1) );
            pluginType = isPlugin ? DownloadServlet.DownloadInfo.openfire_plugin : null;
            plugin = Paths.get( openfirePluginsBetaPath, pluginName + ".jar" );
            requestedFile = isPlugin ? null : requestURI.replace( openfirePluginBetaUri + pluginName + "/", "" );
        }
        else if ( requestURI.startsWith( openfirePluginDevUri ) )
        {
            pluginName = requestURI.substring( openfirePluginDevUri.length(), requestURI.indexOf( isPlugin ? "." : "/" , openfirePluginDevUri.length() + 1) );
            pluginType = isPlugin ? DownloadServlet.DownloadInfo.openfire_plugin : null;
            plugin = Paths.get( openfirePluginsDevPath, pluginName + ".jar" );
            requestedFile = isPlugin ? null : requestURI.replace( openfirePluginDevUri + pluginName + "/", "" );
        }
        else
        {
            response.sendError( HttpServletResponse.SC_NOT_FOUND );
            return;
        }

        // Check whether this plugin exists and really is a file.
        if ( !Files.exists( plugin ) || !Files.isRegularFile( plugin ) )
        {
            // Not a file, return 404
            Log.info( "File {} does not exist (or is not a regular file).", plugin );
            response.sendError( HttpServletResponse.SC_NOT_FOUND );
            return;
        }

        if ( Files.size( plugin ) <= 0 )
        {
            // File empty, return 500
            Log.info( "File {} had size {}.", plugin, Files.size( plugin ) );
            response.sendError( HttpServletResponse.SC_INTERNAL_SERVER_ERROR );
            return;
        }
        try
        {
            if ( !isPlugin )
            {
                // This is a request for a file that is stored in a plugin.
                doGetPluginFile( request, response, plugin, requestedFile );
            }
            else
            {
                // This is a request for a file itself is a plugin.
                doGetPlugin( request, response, plugin, pluginType );
            }
        }
        catch (IOException ioe)
        {
            // Ignore this sucker because it is caused by client disconnects most frequently
            Log.debug( "An exception occurred while processing request for '{}'. This was likely caused by a disconnecting client.", requestURI, ioe);
        }
        catch (Exception e)
        {
            Log.warn( "An exception occurred while processing request for '{}'", requestURI, e );
        }
    }

    /**
     * Processes a GET request for one of the entries in a plugin archive file.
     * This is typically used to retrieve the readme or changelog file.
     *
     * @param request The HTTP request.
     * @param response The HTTP response.
     * @param plugin The plugin archive file.
     * @param requestedFile The file name of the requested archive entry.
     */
    protected void doGetPluginFile( HttpServletRequest request, HttpServletResponse response, Path plugin, String requestedFile ) throws IOException
    {
        try ( final JarFile jarFile = new JarFile( plugin.toFile() ) )
        {
            try (final InputStream inputStream = getUncompressedEntryFromArchive( jarFile, requestedFile ) )
            {
                // Check if the plugin file contains the file that's requested.
                if ( inputStream == null )
                {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }
                else
                {
                    writeBytesToStream( requestedFile, inputStream, response, false );
                }
            }
        }
    }

    /**
     * Processes a GET request a plugin archive file. This is typically used to
     * download a plugin.
     *
     * @param request The HTTP request.
     * @param response The HTTP response.
     * @param plugin The plugin archive file.
     * @param pluginType the type of the plugin.
     */
    protected void doGetPlugin( HttpServletRequest request, HttpServletResponse response, Path plugin, DownloadServlet.DownloadInfo pluginType ) throws IOException, DocumentException
    {
        boolean downloadComplete = false;
        try ( InputStream inputStream = Files.newInputStream( plugin ) )
        {
            downloadComplete = writeBytesToStream( plugin.toString(), inputStream, response, pluginType != null );
        }

        if ( downloadComplete && (null != pluginType) )
        {
            // Log to database if VALID plugin
            String ipAddress = request.getHeader( "X-FORWARDED-FOR" );
            if ( ipAddress == null || ipAddress.length() == 0 )
            {
                ipAddress = request.getRemoteAddr();
            }

            String product = pluginType.getName();
            String version = getVersionNumber( pluginType, plugin );
            String fileType = getFileType( plugin.getFileName().toString() );

            // Log to Database
            DownloadStats.addUpdateToDatabase( ipAddress, product, version, fileType, plugin.getFileName().toString(), pluginType );
        }
    }

    /**
     * Writes out a file to the ServletOuputStream.
     *
     * @param fileName the name of the file to send to the client.
     * @param in The stream that provides the data to be send to the client.
     * @param response the servlet response.
     * @param isAttachment whether the file should be downloaded, instead of displayed, by the browser
     * @return true if the file was downloaded.
     */
    public static boolean writeBytesToStream(String fileName, InputStream in, HttpServletResponse response, Boolean isAttachment)
    {
        String contentType = typeMap.getContentType(fileName.toLowerCase());
        response.setContentType(contentType);
        if (isAttachment) {
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        }

        try ( final OutputStream out = response.getOutputStream() )
        {
            // Copy the contents of the file to the output stream
            byte[] buf = new byte[1024];
            int totalWritten = 0;
            int count;
            while ((count = in.read(buf)) >= 0) {
                out.write(buf, 0, count);
                totalWritten += count;
            }

            response.setContentLength( totalWritten );
            return true;
        }
        catch (IOException ioe) {
            // Ignore this sucker because it is caused by client disconnects most frequently
            Log.debug( "An exception occurred while processing file '{}'. This was likely caused by a disconnecting client.", fileName, ioe);
        }
        catch (Exception e) {
            Log.warn( "An exception occurred while processing file '{}'", fileName, e);
        }

        return false;
    }

    /**
     * Return the version of the file (ex.1.0.0)
     *
     * @param pluginType the type of plugin being downloaded
     * @param file the plugin file being served
     * @return the version.
     * @throws IOException when an IO problem occurs
     * @throws DocumentException when a document exception occurs
     */
    private String getVersionNumber(DownloadServlet.DownloadInfo pluginType, Path file) throws IOException, DocumentException {
        // The key includes the plugin type and filename to avoid name collisions
        final String key = pluginType.getName() + file.getFileName().toString();
        PluginCacheEntry pluginEntry = pluginCache.get(key);

        // Return the cached result as long as long as the entry is not older than five minutes.
        if (pluginEntry != null && pluginEntry.getLastModified() < System.currentTimeMillis() - ( 5*60*1000 ) ) {
            return pluginEntry.getVersionNumber();
        }

        // No valid cached plugin data was found so collect the data from the plugin file and cache it
        // Fortunately the Spark and Openfire plugins share a very similar XML structure and both contain
        // <plugin><version> :)
        try ( final JarFile archive = new JarFile( file.toFile() );
              final InputStream in = getUncompressedEntryFromArchive( archive, "plugin.xml" ) )
        {
            final SAXReader saxReader = new SAXReader();
            final Document doc = saxReader.read(in);
            final Element pluginVersion = (Element)doc.selectSingleNode("/plugin/version");
            pluginEntry = new PluginCacheEntry(pluginVersion.getTextTrim(), System.currentTimeMillis());
            pluginCache.put(key, pluginEntry);

            return pluginVersion.getTextTrim();
        }
    }

    /**
     * Return the type of file (suffix).
     *
     * @param fileName the name of the file.
     * @return the file suffix.
     */
    private String getFileType(String fileName) {
        int indexOfPeriod = fileName.indexOf(".");
        return fileName.substring(indexOfPeriod + 1);
    }

    public static boolean archiveContainsEntry( ZipFile archive, String entryName )
    {
        final Enumeration<? extends ZipEntry> entries = archive.entries();
        while ( entries.hasMoreElements() )
        {
            final ZipEntry entry = entries.nextElement();
            if ( entryName.equalsIgnoreCase( entry.getName() ) )
            {
                return true;
            }
        }
        return false;
    }

    public static long getUncompressedSizeOfFileInArchive( ZipFile archive, String entryName )
    {
        final Enumeration<? extends ZipEntry> entries = archive.entries();
        while ( entries.hasMoreElements() )
        {
            final ZipEntry entry = entries.nextElement();
            if ( entryName.equalsIgnoreCase( entry.getName() ) )
            {
                return entry.getSize();
            }
        }
        return -1;
    }

    public InputStream getUncompressedEntryFromArchive( ZipFile archive, String entryName ) throws IOException {
        final Enumeration<? extends ZipEntry> entries = archive.entries();
        while ( entries.hasMoreElements() )
        {
            final ZipEntry entry = entries.nextElement();
            if ( entryName.equalsIgnoreCase( entry.getName() ) )
            {
                return new BufferedInputStream( archive.getInputStream( entry ) );
            }
        }
        return null;
    }

    private byte[] getPluginFile(File jarFile, String name) throws IOException {
        ZipFile zipFile = new JarFile(jarFile);
        for (Enumeration e=zipFile.entries(); e.hasMoreElements(); ) {
            JarEntry entry = (JarEntry)e.nextElement();
            if (name.equals(entry.getName().toLowerCase())) {
                InputStream in = new BufferedInputStream(zipFile.getInputStream(entry));
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] b = new byte[512];
                int len = 0;
                while ((len=in.read(b)) != -1) {
                    out.write(b,0,len);
                }
                out.flush();
                out.close();
                return out.toByteArray();
            }
        }
        return null;
    }

    /**
     * A cache of the plugin version number is maintained for performance reasons. The cache entry contains
     * the version number of the plugin and the last modified date of the plugin file. The last modified
     * date is used to periodically update the cache.
     */
    private class PluginCacheEntry {
        private String versionNumber;
        private long lastModified;

        public PluginCacheEntry(String versionNumber, long lastModified) {
            this.versionNumber = versionNumber;
            this.lastModified = lastModified;
        }

        public String getVersionNumber() {
            return versionNumber;
        }

        public void setVersionNumber(String versionNumber) {
            this.versionNumber = versionNumber;
        }

        public long getLastModified() {
            return lastModified;
        }
    }

    private boolean validateFilename(String filename) {
        if (filename.indexOf("..") != -1)
            return false;
        
        return true;
    }
}
