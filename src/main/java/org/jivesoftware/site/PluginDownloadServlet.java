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
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.zip.ZipFile;

/**
 * Servlet used for downloading and capturing of data for all Openfire and Spark plugins on Ignite.
 */
public class PluginDownloadServlet extends HttpServlet {

    private static final Logger Log = LoggerFactory.getLogger( PluginDownloadServlet.class );

    private static MimetypesFileTypeMap typeMap = new MimetypesFileTypeMap();
    private Map<String, PluginCacheEntry> pluginCache = Collections.synchronizedMap(new HashMap<String, PluginCacheEntry>());
    private String sparkPluginsPath;
    private String openfirePluginsPath;
    private String openfirePluginsBetaPath;
    private String openfirePluginsDevPath;

	private String openfirePluginUri = "/projects/openfire/plugins/";
	private String openfirePluginBetaUri = "/projects/openfire/plugins-beta/";
    private String openfirePluginDevUri = "/projects/openfire/plugins-dev/";
	private String sparkPluginUri = "/updater/sparkplugs/";
	private String pluginExtensionJar = ".jar";
	private String pluginExtensionWar = ".war";

    public void init(ServletConfig config) throws ServletException
    {
        super.init(config);

        sparkPluginsPath        = config.getServletContext().getInitParameter("spark-plugins-path");
        openfirePluginsPath     = config.getServletContext().getInitParameter("openfire-plugins-path");
        openfirePluginsBetaPath = config.getServletContext().getInitParameter("openfire-plugins-beta-path");
        openfirePluginsDevPath  = config.getServletContext().getInitParameter("openfire-plugins-dev-path");
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        final DownloadServlet.DownloadInfo pluginType;
        final Path download;

        final String requestURI = request.getRequestURI();
        if ( !validateFilename( requestURI ) )
        {
            response.sendError( HttpServletResponse.SC_NOT_FOUND );
            return;
        }

        final boolean isPlugin = requestURI.endsWith( pluginExtensionJar ) || requestURI.endsWith( pluginExtensionWar );
        if ( requestURI.startsWith( sparkPluginUri ) )
        {
            pluginType = isPlugin ? DownloadServlet.DownloadInfo.spark_plugin : null;
            download = Paths.get( sparkPluginsPath, requestURI.replace( sparkPluginUri, "" ) );
        }
        else if ( requestURI.startsWith( openfirePluginUri ) )
        {
            pluginType = isPlugin ? DownloadServlet.DownloadInfo.openfire_plugin : null;
            download = Paths.get( openfirePluginsPath, requestURI.replace( openfirePluginUri, "" ) );
        }
        else if ( requestURI.startsWith( openfirePluginBetaUri ) )
        {
            pluginType = isPlugin ? DownloadServlet.DownloadInfo.openfire_plugin : null;
            download = Paths.get( openfirePluginsBetaPath, requestURI.replace( openfirePluginBetaUri, "" ) );
        }
        else if ( requestURI.startsWith( openfirePluginDevUri ) )
        {
            pluginType = isPlugin ? DownloadServlet.DownloadInfo.openfire_plugin : null;
            download = Paths.get( openfirePluginsDevPath, requestURI.replace( openfirePluginDevUri, "" ) );
        }
        else
        {
            response.sendError( HttpServletResponse.SC_NOT_FOUND );
            return;
        }

        try
        {
            final File downloadFile = download.toFile();

            // Check whether this file exists and is really a file
            if (!(downloadFile.exists() && downloadFile.isFile())) {
                // Not a file, return 404
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            if (downloadFile.length() == 0) {
                // File empty, return 500
				if (null == pluginType) {
                    Log.info("Plugin " + downloadFile.getAbsolutePath() + " had size zero.");
				} else {
                    Log.info("File " + downloadFile.getAbsolutePath() + " had size zero.");
				}
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }

            final String nameOfFile = download.getFileName().toString();

            final boolean downloadComplete = writeBytesToStream(downloadFile, response, pluginType != null);
            if (downloadComplete && (null != pluginType)) {
                // Log to database if VALID plugin
                String ipAddress = request.getHeader( "X-FORWARDED-FOR" );
                if (ipAddress == null || ipAddress.length() == 0 )
                {
                    ipAddress = request.getRemoteAddr();
                };

                String product = pluginType.getName();
                String version = getVersionNumber(pluginType, downloadFile);
                String fileType = getFileType(nameOfFile);

                // Log to Database
                DownloadStats.addUpdateToDatabase(ipAddress, product, version, fileType, nameOfFile, pluginType);
            }
        }
        catch (IOException ioe) {
            // Ignore this sucker because it is caused by client disconnects most frequently
            Log.debug( "An exception occurred while processing request for '{}'. This was likely caused by a disconnecting client.", download, ioe);
        }
        catch (Exception e) {
            Log.warn( "An exception occurred while processing request for '{}'", download, e );
        }
    }

    /**
     * Writes out a file to the ServletOuputStream.
     *
     * @param file the file to send to the client.
     * @param response the servlet response.
     * @param isAttachment whether the file should be downloaded, instead of displayed, by the browser
     * @return true if the file was downloaded.
     */
    public boolean writeBytesToStream(File file, HttpServletResponse response, Boolean isAttachment) {
        int fileLength = (int)file.length();

        // Set content size
        String contentType = typeMap.getContentType(file.getName().toLowerCase());
        response.setContentType(contentType);
        if (isAttachment) {
            response.setHeader("Content-Disposition", "attachment; filename=" + file.getName());
        }
        response.setContentLength(fileLength);

        FileInputStream in = null;
        OutputStream out = null;
        try {
            // Open the file and output streams
            in = new FileInputStream(file);
            out = response.getOutputStream();

            // Copy the contents of the file to the output stream
            byte[] buf = new byte[1024];
            int totalWritten = 0;
            int count;
            while ((count = in.read(buf)) >= 0) {
                out.write(buf, 0, count);
                totalWritten += count;
            }

            if (fileLength == totalWritten) {
                return true;
            }
            else {
                Log.warn("Download servlet only wrote {} bytes out of {} for file {}.", totalWritten, fileLength, file.getName());
            }
        }
        catch (IOException ioe) {
            // Ignore this sucker because it is caused by client disconnects most frequently
            Log.debug( "An exception occurred while processing file '{}'. This was likely caused by a disconnecting client.", file, ioe);
        }
        catch (Exception e) {
            Log.warn( "An exception occurred while processing file '{}'", file, e);
        }
        finally {
            if (in != null) {
                try { in.close(); } catch (Exception e) { Log.debug( "An exception occurred (which is likely safe to ignore).", e); }
            }
            if (out != null) {
                try { out.close(); } catch (Exception e) { Log.debug( "An exception occurred (which is likely safe to ignore).", e); }
            }
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
    private String getVersionNumber(DownloadServlet.DownloadInfo pluginType, File file) throws IOException, DocumentException {
        // The key includes the plugin type and filename to avoid name collisions
        String key = pluginType.getName() + file.getName();
        PluginCacheEntry pluginEntry = pluginCache.get(key);

        // Return the cached result as long as long as the entry is not older than five minutes.
        if (pluginEntry != null && pluginEntry.getLastModified() < System.currentTimeMillis() - ( 5*60*1000 ) ) {
            return pluginEntry.getVersionNumber();
        }

        // No valid cached plugin data was found so collect the data from the plugin file and cache it
        // Fortunately the Spark and Openfire plugins share a very similar XML structure and both contain
        // <plugin><version> :)
        String pluginXML = new String(getPluginFile(file, "plugin.xml"));
        SAXReader saxReader = new SAXReader();
        ByteArrayInputStream in = new ByteArrayInputStream(pluginXML.getBytes());
        Document doc = saxReader.read(in);
        Element pluginVersion = (Element)doc.selectSingleNode("/plugin/version");
        pluginEntry = new PluginCacheEntry(pluginVersion.getTextTrim(), System.currentTimeMillis());
        pluginCache.put(key, pluginEntry);

        return pluginVersion.getTextTrim();
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
