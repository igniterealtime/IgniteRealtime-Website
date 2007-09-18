/**
 * $Revision$
 * $Date$
 *
 * Copyright (C) 1999-2005 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

package org.jivesoftware.updater;

import com.thoughtworks.xstream.XStream;
import org.jivesoftware.site.DownloadServlet.DownloadInfo;
import org.jivesoftware.site.DownloadStats;
import org.jivesoftware.site.Versions;

import javax.activation.MimetypesFileTypeMap;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Provides support for global updating of the Jive Spark IM client.
 * (<a href="http://www.jivesoftware.org/spark">Spark</a>).<p>
 * <p/>
 * The basic functionality is to query the server for the latest client
 * version and return that information. The version comparison is left to
 * the client itself, so this keeps the Updater very simple.
 * <p/>
 *
 * @author Derek DeMoro
 */
public class SparkUpdateServlet extends HttpServlet {
    private final XStream xstream = new XStream();
    private File sparkDirectory;

    private static MimetypesFileTypeMap typeMap = new MimetypesFileTypeMap();

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        xstream.alias("Version", Version.class);

        sparkDirectory = new File(DownloadStats.getBuildsDirectory(), "spark");
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Handle Version Request. Only handle windows and mac version at this time.
        final String fileName = request.getParameter("filename");

        if (fileName != null) {
            File file = new File(sparkDirectory, fileName);

            try {
                boolean ok = writeBytesToStream(file, response);
                if (!ok) {
                    return;
                }
                // Log to database
                String ipAddress = request.getRemoteAddr();
                String product = "Spark";
                String version = getVersionNumber(fileName);
                String fileType = getFileType(fileName);
                String fName = file.getName();

                // Add a spark update.
                DownloadStats.addUpdateToDatabase(ipAddress, product, version, fileType, fName, DownloadInfo.spark_update);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Handle Version Request. Only handle windows and mac version at this time.
        final String os = request.getParameter("os");
        boolean includeBeta = request.getParameter("beta") != null;

        // Add check to database.
        String latestVersion = Versions.getVersion("spark");
        String currentVersion = null;
        DownloadStats.addCheckUpdate(request.getRemoteAddr(), os, currentVersion, latestVersion, DownloadInfo.spark);


        if ("windows".equals(os)) {
            sendVersionInformation(response, ".exe", includeBeta);
        }
        else if ("mac".equals(os)) {
            sendVersionInformation(response, ".dmg", includeBeta);
        }
        else if ("linux".equals(os)) {
            sendVersionInformation(response, ".tar.gz", includeBeta);
        }
    }

    private void sendVersionInformation(HttpServletResponse response, final String suffix, boolean includeBeta) throws IOException {

        final File[] files = sparkDirectory.listFiles(new FileFilter() {
            public boolean accept(File pathname) {
                return pathname.getAbsolutePath().endsWith(suffix);
            }
        });

        final List<String> listOfSparks = new ArrayList<String>();
        final int no = files != null ? files.length : 0;
        for (int i = 0; i < no; i++) {
            File sparkBuild = files[i];
            String name = sparkBuild.getName();
            if (includeBeta) {
                listOfSparks.add(name);
            }
            else {
                if (!name.contains("beta") && !name.contains("alpha")) {
                    listOfSparks.add(name);
                }
            }
        }

        Collections.sort(listOfSparks);

        int size = listOfSparks.size();
        String latestFile = listOfSparks.get(size - 1);

        Version version = new Version();
        int index = latestFile.indexOf("_");

        // Add version number
        String versionNumber = latestFile.substring(index + 1);
        int indexOfPeriod = versionNumber.indexOf(".");

        versionNumber = versionNumber.substring(0, indexOfPeriod);
        versionNumber = versionNumber.replaceAll("_", ".");

        // Set Version
        version.setVersion(versionNumber);

        // Set uploaded
        File build = new File(sparkDirectory, latestFile);
        version.setUpdateTime(build.lastModified());

        // Set download url
       // version.setDownloadURL("http://www.igniterealtime.org/updater/updater?filename=" + latestFile);
        version.setDownloadURL("http://s3.amazonaws.com/jive/spark/" + latestFile);

        // Include the url to the change log.
        version.setChangeLogURL("http://www.igniterealtime.org/updater/changelog.jsp");

        final String xml = xstream.toXML(version);

        // Send Version XML
        byte[] bytes = xml.getBytes();
        response.setContentType("text/xml");
        response.setContentLength(bytes.length);
        ServletOutputStream out = response.getOutputStream();

        out.write(bytes);
        out.flush();
        out.close();
    }

    /**
     * Writes out a <code>byte</code> to the ServletOuputStream.
     *
     * @param clientFile the name of the file for downloading.
     * @param response   the servlet response.
     * @return true if the file was downloaded.
     */
    public boolean writeBytesToStream(File clientFile, HttpServletResponse response) {
        // Set content size
        String contentType = typeMap.getContentType(clientFile.getName().toLowerCase());
        response.setContentType(contentType);
        response.setHeader("Content-Disposition", "attachment; filename=" + clientFile.getName());
        response.setContentLength((int)clientFile.length());

        try {
            // Open the file and output streams
            FileInputStream in = new FileInputStream(clientFile);
            OutputStream out = response.getOutputStream();

            // Copy the contents of the file to the output stream
            byte[] buf = new byte[1024];
            int count = 0;
            while ((count = in.read(buf)) >= 0) {
                out.write(buf, 0, count);
            }
            in.close();
            out.close();
            return true;
        }
        catch (IOException e) {
            e.printStackTrace();
        }

        return false;
    }

    private void write(InputStream is, HttpServletResponse response) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // Transfer bytes from the ZIP file to the output file
        byte[] buf = new byte[1024];
        int len;
        while ((len = is.read(buf)) > 0) {
            baos.write(buf, 0, len);
        }

        // Close the streams
        baos.close();
        is.close();

        byte[] bytes = baos.toByteArray();
        writeBytesToStream(bytes, response);
    }

    /**
     * Writes out a <code>byte</code> to the ServletOuputStream.
     *
     * @param bytes    the bytes to write to the <code>ServletOutputStream</code>.
     * @param response the servlet response.
     */
    public void writeBytesToStream(byte[] bytes, HttpServletResponse response) {
        if (bytes == null) {
            return;
        }

        response.setContentType("image/jpeg");

        // Send back image
        try {
            ServletOutputStream sos = response.getOutputStream();
            sos.write(bytes);
            sos.flush();
            sos.close();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
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


}

