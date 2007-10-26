package org.jivesoftware.site;

import org.dom4j.io.SAXReader;
import org.dom4j.Element;
import org.dom4j.Document;
import org.dom4j.DocumentException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import javax.servlet.ServletContext;
import javax.activation.MimetypesFileTypeMap;
import java.io.*;
import java.util.*;
import java.util.zip.ZipFile;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

/**
 * Servlet used for downloading and capturing of data for all Openfire and Spark plugins on Ignite.
 */
public class PluginDownloadServlet extends HttpServlet {

    private static MimetypesFileTypeMap typeMap = new MimetypesFileTypeMap();
    private Map<String, PluginCacheEntry> pluginCache = Collections.synchronizedMap(new HashMap<String, PluginCacheEntry>());

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws
            ServletException, IOException
    {
        DownloadServlet.DownloadInfo pluginType = DownloadServlet.DownloadInfo.openfire_plugin;
        // If path includes "/updater/sparkplugs/" then this is actually a sparkplug, not a openfire plugin
        if (request.getRequestURI().startsWith("/updater/sparkplugs/")) {
            pluginType = DownloadServlet.DownloadInfo.spark_plugin;
        }

        String filename = null;
        // Files for openfire and spark plugins are served from different places on the file system
        if (pluginType == DownloadServlet.DownloadInfo.openfire_plugin) {
            ServletContext context = request.getSession().getServletContext();
            filename = context.getRealPath(request.getServletPath());
        }
        else {
            String buildsPath = request.getRequestURI().replace("/updater/", "");
            ServletContext application = config.getServletContext();
            String pluginsPath = application.getInitParameter("plugins-path");
            filename = new File(pluginsPath, buildsPath).getAbsolutePath();
        }

        try {
            final File downloadFile = new File(filename);

			if (!validateFilename(filename)) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;				
			}
			
            // Check whether this file exists and is really a file
            if (!(downloadFile.exists() && downloadFile.isFile())) {
                // Not a file, return 404
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            if (downloadFile.length() == 0) {
                // File empty, return 500
                System.out.println("Plugin " + downloadFile.getAbsolutePath() + " had size zero.");
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }

            int filenameIndex = filename.lastIndexOf(File.separator);
            String nameOfFile = filename.substring(filenameIndex + 1);

            boolean downloadComplete = writeBytesToStream(downloadFile, response);
            if (downloadComplete) {
                // Log to database
                String ipAddress = request.getRemoteAddr();


                String product = pluginType.getName();

                String version = getVersionNumber(pluginType, downloadFile);
                String fileType = getFileType(nameOfFile);

                // Log to Database.
                DownloadStats.addUpdateToDatabase(ipAddress, product, version, fileType, nameOfFile, pluginType);
            }
            else {
                // Do Not Log
            }
        }
        catch (IOException ioe) {
            // Ignore this sucker because it is caused by client disconnects most frequently
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Writes out a file to the ServletOuputStream.
     *
     * @param file the file to send to the client.
     * @param response the servlet response.
     * @return true if the file was downloaded.
     */
    public boolean writeBytesToStream(File file, HttpServletResponse response) {
        int fileLength = (int)file.length();

        // Set content size
        String contentType = typeMap.getContentType(file.getName().toLowerCase());
        response.setContentType(contentType);
        response.setHeader("Content-Disposition", "attachment; filename=" + file.getName());
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
                System.out.println("Warning: download servlet only wrote " + totalWritten +
                        " bytes out of " + fileLength + " for file " + file.getName());
            }
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            if (in != null) {
                try { in.close(); } catch (Exception e) { /* do nothing */ }
            }
            if (out != null) {
                try { out.close(); } catch (Exception e) { /* do nothing */  }
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

        // Return the cached result as long as the plugin file has not been modified
        // and there is a cached entry
        if (pluginEntry != null && pluginEntry.getLastModified() <= file.lastModified()) {
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
        pluginEntry = new PluginCacheEntry(pluginVersion.getTextTrim(), file.lastModified());
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
     * date is used to update the cache if the plugin file has changed.
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

        public void setLastModified(long lastModified) {
            this.lastModified = lastModified;
        }
    }

	private boolean validateFilename(String filename) {
		if (filename.indexOf("..") != -1)
			return false;
		
		return true;
	}
}
