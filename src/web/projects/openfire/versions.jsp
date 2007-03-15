<%@ page import="org.jivesoftware.site.OpenfireVersionChecker"%>
<%@ page import="org.jivesoftware.site.DownloadServlet" %>
<%@ page import="org.jivesoftware.site.DownloadStats" %>
<%@ page import="org.dom4j.Element" %>
<%@ page import="org.dom4j.io.SAXReader" %>
<%@ page import="java.io.StringReader" %>
<%@ page import="org.jivesoftware.site.Versions" %>

<%
    // Get the real path where plugins are stored
    String path = request.getRealPath("/projects/openfire/plugins");
    // Set the content type of the response
    response.setContentType("text/xml");
    String queryType = request.getParameter("type");
    String ipAddress = request.getRemoteAddr();
    String os = request.getParameter("os");
    DownloadServlet.DownloadInfo info = DownloadServlet.DownloadInfo.openfire;
    if ("update".equals(queryType)) {
        // Check for updates of installed plugins and server
        out.println(OpenfireVersionChecker.checkVersions(request.getParameter("query")));
        // Log to the database after successful output
        String latestVersion = Versions.getVersion("openfire");
        String currentVersion = null;
        try {
            Element xmlRequest = new SAXReader().read(new StringReader(request.getParameter("query"))).getRootElement();
            Element currentOpenfire = xmlRequest.element("openfire");
            currentVersion = currentOpenfire.attributeValue("current");
        }
        catch (Exception e) { /* ignored */ }

        DownloadStats.addCheckUpdate(ipAddress, os, currentVersion, latestVersion, info);
    } else {
        // Check for available (i.e. not installed) plugins
        out.println(OpenfireVersionChecker.getAvailablePlugins(path, request.getParameter("query")));
        // Log to the database after successful output
        DownloadStats.addListingToDatabase(ipAddress, info.getName(), os, info.getType(),
                getServletConfig().getServletContext());
    }
    // Flush answer
    out.flush();


%>