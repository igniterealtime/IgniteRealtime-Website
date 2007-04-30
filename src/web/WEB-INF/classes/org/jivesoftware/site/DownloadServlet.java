
package org.jivesoftware.site;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.activation.MimetypesFileTypeMap;

/**
 * Servlet used for downloading and capturing of data for all projects on
 * Jive Software (http://www.jivesoftware.org).
 */
public class DownloadServlet extends HttpServlet {

    private static MimetypesFileTypeMap typeMap = new MimetypesFileTypeMap();

    /**
     * Enumeration of possible downloads.
     */
    public enum DownloadInfo {
        openfire("openfire", 0),
        spark("spark", 1),
        smack("smack", 2),
        xiff("xiff", 3),
        spark_update("spark_update", 4),
        openfire_plugin("openfire_plugin", 5),
        spark_plugin("spark_plugin", 6),
        wildfire("wildfire", 7),
        wildfire_plugin("wildfire_plugin", 8);

        private int type;
        private String name;

        DownloadInfo(String name, int type) {
            this.name = name;
            this.type = type;
        }

        public int getType() {
            return type;
        }

        public String getName() {
            return name;
        }

    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws
            ServletException, IOException
    {
        final String filename = request.getParameter("filename");

        try {
			if (!validateFilename(filename)) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;				
			}
			
            final File downloadFile = new File(DownloadStats.getBuildsDirectory(), filename);
            // Check whether this file exists and is really a file
            if (!(downloadFile.exists() && downloadFile.isFile())) {
                // Not a file, return 404
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            if (downloadFile.length() == 0) {
                // File empty, return 500
                System.out.println("File " + downloadFile.getAbsolutePath() + " had size zero.");
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }
            
            int filenameIndex = filename.lastIndexOf("/");
            String nameOfFile = filename.substring(filenameIndex + 1);

            int slash = filename.indexOf("/");

            String product = filename.substring(0, slash);

            boolean downloadComplete = writeBytesToStream(downloadFile, response);
            if (downloadComplete) {
                // Log to database
                String ipAddress = request.getRemoteAddr();

                DownloadInfo downloadInfo = null;
                for (DownloadInfo info : DownloadInfo.values()) {
                    if (product.toLowerCase().equals(info.getName().toLowerCase())) {
                        downloadInfo = info;
                        product = info.getName();
                        break;
                    }
                }

                String version = getVersionNumber(nameOfFile);
                String fileType = getFileType(nameOfFile);

                // Log to Database.
                DownloadStats.addUpdateToDatabase(ipAddress, product, version, fileType, nameOfFile, downloadInfo);
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
			// Ignore this one
            /* e.printStackTrace(); */
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
     * @param fileName the name of the file.
     * @return the version.
     */
    private String getVersionNumber(String fileName) {
        fileName = fileName.replace("_online", "");
        int index = fileName.indexOf("_");

        // Add version number
        String versionNumber = fileName.substring(index + 1);
        int indexOfPeriod = versionNumber.indexOf(".");

        versionNumber = versionNumber.substring(0, indexOfPeriod);
        versionNumber = versionNumber.replaceAll("_", ".");
        return versionNumber;
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

	private boolean validateFilename(String filename) {
		if (filename.indexOf("..") != -1)
			return false;
		
		return true;
	}
}