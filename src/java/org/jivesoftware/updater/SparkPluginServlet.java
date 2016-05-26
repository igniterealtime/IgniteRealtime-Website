/**
 * $Revision$
 * $Date$
 *
 * Copyright (C) 1999-2005 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

package org.jivesoftware.updater;

import org.jivesoftware.database.DbConnectionManager;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * The SparkPluginServlet is used to send plugin logos to the Spark client.
 */
public class SparkPluginServlet extends HttpServlet {
    private File pluginDir;

    public void init(ServletConfig config) throws ServletException {
        super.init(config);

        ServletContext application = config.getServletContext();
        String pluginsPath = application.getInitParameter("plugins-path");
        pluginDir = new File(new File(pluginsPath), "sparkplugs");
    }

    public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String filename = request.getParameter("filename");
        String smallIcon = request.getParameter("smallIcon");
        if (filename != null) {
            File file = new File(pluginDir, filename);


            if (!file.exists()) {
                sendDefaultIcon(response);
            }

            ZipFile zipFile = new JarFile(file);

            // Ensure that this JAR is a plugin.
            ZipEntry zipEntry = null;
            if (smallIcon != null) {
                zipEntry = zipFile.getEntry("logo_small.gif");
            }
            else {
                zipEntry = zipFile.getEntry("logo_large.gif");
            }

            if (zipEntry != null) {
                // Write out image to stream
                InputStream is = zipFile.getInputStream(zipEntry);
                try {
                    write(is, response);
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
            else {
                sendDefaultIcon(response);
            }

        }
    }

    private void sendDefaultIcon(HttpServletResponse response) {
        try {
            File imageFile = new File(pluginDir.getParentFile(), "images/plugin-16x16.gif");
            FileInputStream fis = new FileInputStream(imageFile);
            write(fis, response);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
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
     * @param bytes the bytes to write to the <code>ServletOutputStream</code>.
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


}
