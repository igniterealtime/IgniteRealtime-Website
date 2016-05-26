<%@ page import="org.jivesoftware.site.WildfireVersionChecker"%>
<%@ page import="org.jivesoftware.site.DownloadServlet" %>
<%@ page import="org.jivesoftware.site.DownloadStats" %>
<%@ page import="org.dom4j.Element" %>
<%@ page import="org.dom4j.io.SAXReader" %>
<%@ page import="java.io.StringReader" %>
<%@ page import="org.jivesoftware.site.Versions" %>
<%@ page import="org.slf4j.LoggerFactory" %>

<%
    // Get the real path where plugins are stored
    String path = request.getRealPath("/projects/wildfire/plugins");
    // Set the content type of the response
    response.setContentType("text/xml");
    String queryType = request.getParameter("type");
    String ipAddress = request.getHeader( "X-FORWARDED-FOR" );
    if (ipAddress == null || ipAddress.length() == 0 )
    {
        ipAddress = request.getRemoteAddr();
    }
    String os = request.getParameter("os");
    DownloadServlet.DownloadInfo info = DownloadServlet.DownloadInfo.openfire;
    if ("update".equals(queryType)) {
        // Check for updates of installed plugins and server
        out.println(WildfireVersionChecker.checkVersions(request.getParameter("query")));
        // Log to the database after successful output
        String latestVersion = Versions.getVersion("wildfire");
        String currentVersion = null;
        try {
            Element xmlRequest = new SAXReader().read(new StringReader(request.getParameter("query"))).getRootElement();
            Element currentWildfire = xmlRequest.element("wildfire");
            currentVersion = currentWildfire.attributeValue("current");
        }
        catch (Exception e) { LoggerFactory.getLogger( this.getClass() ).debug( "An exception occurred that can probably be ignored.", e); }

        DownloadStats.addCheckUpdate(ipAddress, os, currentVersion, latestVersion, info);
    } else {
        // Check for available (i.e. not installed) plugins
        out.println(WildfireVersionChecker.getAvailablePlugins(path, request.getParameter("query")));
        // Log to the database after successful output
        DownloadStats.addListingToDatabase(ipAddress, info.getName(), os, info.getType(),
                getServletConfig().getServletContext());
    }
    // Flush answer
    out.flush();


%>