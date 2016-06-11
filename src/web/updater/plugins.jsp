<%@ page contentType="text/xml" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.util.zip.ZipFile"%>
<%@ page import="java.util.jar.JarFile"%>
<%@ page import="java.util.zip.ZipEntry"%>
<%@ page import="java.io.InputStreamReader"%>
<%@ page import="org.jivesoftware.site.DownloadServlet" %>
<%@ page import="org.jivesoftware.site.DownloadStats" %>

<%
    String sparkPluginPath = application.getInitParameter("spark-plugins-path");
    File pluginDir = new File(new File( sparkPluginPath ), "sparkplugs");
    File[] files = pluginDir.listFiles();
    final int no = files != null ? files.length : 0;
    StringBuffer buf = new StringBuffer();
    buf.append("<plugins>");
    for (int i = 0; i < no; i++) {

        File plugin = files[i];
        ZipFile zipFile = new JarFile(plugin);

        // Ensure that this JAR is a plugin.
        ZipEntry zipEntry = zipFile.getEntry("plugin.xml");

        StringBuffer pluginBuf = new StringBuffer();

        if (zipEntry != null) {
            // Read contents and append.
            try {
                BufferedReader in = new BufferedReader(new InputStreamReader(zipFile.getInputStream(zipEntry)));
                String str;
                while ((str = in.readLine()) != null) {
                    pluginBuf.append(str);
                }
                in.close();
            }
            catch (IOException e) {
            }


            String plugStr = pluginBuf.toString();

            plugStr = plugStr.replaceAll("</plugin>", "");

            // Ensure that this JAR is a plugin.
            ZipEntry changeLogEntry = zipFile.getEntry("changelog.html");
            if (changeLogEntry != null) {
                plugStr += "<changeLog>true</changeLog>";
            }


            ZipEntry readMeEntry = zipFile.getEntry("readme.html");
            if (readMeEntry != null) {
                plugStr += "<readme>true</readme>";
            }

            ZipEntry smallIcon = zipFile.getEntry("logo_small.gif");
            ZipEntry largeIcon = zipFile.getEntry("logo_large.gif");
            if (smallIcon != null) {
                plugStr += "<smallIcon>true</smallIcon>";
            }

            if (largeIcon != null) {
                plugStr += "<largeIcon>true</largeIcon>";
            }

            String downloadURL = request.getRequestURL().toString();
            downloadURL = downloadURL.replaceAll("plugins.jsp", "sparkplugs/" + plugin.getName());
            plugStr += "<downloadURL>" + downloadURL + "</downloadURL></plugin>";
            buf.append(plugStr);


        }
    }
    buf.append("</plugins>");

    // Log to the database after successful output
    String ipAddress = request.getHeader( "X-FORWARDED-FOR" );
    if (ipAddress == null || ipAddress.length() == 0 )
    {
        ipAddress = request.getRemoteAddr();
    }
    String os = request.getParameter("os");
    // Yep, its only Spark :)
    String product = DownloadServlet.DownloadInfo.spark.getName();
    int type = DownloadServlet.DownloadInfo.spark.getType();
    DownloadStats.addListingToDatabase(ipAddress, product, os, type, getServletConfig().getServletContext());

    out.println(buf.toString());
%>

