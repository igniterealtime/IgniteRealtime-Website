<%@ page import="java.io.BufferedReader" %><%@ page import="java.io.File" %><%@ page import="java.io.IOException" %><%@ page import="java.io.InputStreamReader" %><%@ page import="java.util.jar.JarFile" %><%@ page import="java.util.zip.ZipEntry" %><%@ page import="java.util.zip.ZipFile" %>
<%@ page import="org.jivesoftware.site.DownloadServlet" %>
<%@ page import="org.jivesoftware.site.DownloadStats" %>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String sparkPluginsPath = application.getInitParameter("spark-plugins-path");
    File pluginDir = new File(new File( sparkPluginsPath ), "sparkplugs");

    String readme = request.getParameter("readme");
    String changeLog = request.getParameter("changeLog");
    String filename = request.getParameter("filename");
    StringBuffer pluginBuf = new StringBuffer();

    if ((readme != null && readme.trim().length() > 0) || changeLog != null) {
        if (filename != null) {
            File file = new File(pluginDir, filename);
            ZipFile zipFile = new JarFile(file);

            // Ensure that this JAR is a plugin.
            ZipEntry zipEntry = null;
            if (readme != null) {
                zipEntry = zipFile.getEntry("readme.html");
            } else if (changeLog != null) {
                zipEntry = zipFile.getEntry("changelog.html");
            }

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
            }
        }
    }
%>
    <%= pluginBuf.toString() %>
