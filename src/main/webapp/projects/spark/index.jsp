<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.webservices.RestClient" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="net.sf.json.JSONArray" %>

<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Spark IM Client</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="spark" />
<style type="text/css" media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./" class="ignite_subnav_project">Spark</a></li>
            <li id="subnav03"><a href="sparkplug-kit.jsp">Sparkplug Kit</a></li>
            <li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
            <li id="subnav05"><a href="https://issues.igniterealtime.org/projects/SPARK/">Issue Tracker</a></li>
            <!--<li id="subnav06"><a href="../../roadmap.jsp">Roadmap</a></li>-->
        </ul>
    </div>

    <!-- BEGIN body area -->
    <div id="ignite_body">
        
        <!-- BEGIN left column (main content) -->
        <div id="ignite_body_leftcol">
            
            <!-- BEGIN large panel -->
            <!-- 
                if there is no cookie, show this panel
                (there is an 'onload' in the decorator that runs a script from 
                /scripts/ignite.js, may want to change that).
                the cookie is defined by the meta 'panel-name' in the head, and
                set with the onclick of the links below, closePanel().
            -->
            <% boolean panelCookieSet = false;
               Cookie [] cookies = request.getCookies();
                 if (cookies != null) {
                   for (Cookie cookie: request.getCookies()) {
                if (cookie.getName().equals("spark")) { 
                              panelCookieSet = true;
                          }
                     }
               }
            %>
            <div id="ignite_bigpanel" <% if (!panelCookieSet) { %> style="display:block" <% } %>>
                <div id="ignite_bigpanel_content">
                    <h1 class="spark">Spark <span><%= Versions.getVersion("spark") %></span></h1>
                    <p>Spark is an Open Source, cross-platform IM client optimized for businesses and 
                    organizations. It features built-in support for group chat, telephony integration, 
                    and strong security. It also offers a great end-user experience with features like 
                    in-line spell checking, group chat room bookmarks, and tabbed conversations.</p>
                    
                    <p>Combined with the <a href="../../projects/openfire/">Openfire</a> server,
                        Spark is the easiest and best alternative to using un-secure public
                        IM networks. </p>
                </div>
                
                <div id="ignite_bigpanel_close">
                    <a href="#" onClick="closePanel('spark'); return false;"></a>
                </div>
                
                <div id="ignite_bigpanel_screenshot">
                    <img src="../../images/ignite_projects_spark_ss.gif" width="210" height="210" alt="" />
                </div>
                
                <div id="ignite_bigpanel_download">
                    <a href="../../downloads/#spark">Download</a>
                    <span>
                        <strong>Spark <%= Versions.getVersion("spark") %></strong> Latest build: <%= Versions.getVersionDate("spark") %>
                    </span>
                </div>
                
            </div>
            <!-- END large panel -->
            
            <!-- BEGIN small panel -->
            <!-- 
                if there is a cookie, show this panel
                (same details as above for 'large panel')
            -->
            <div id="ignite_smallpanel" <% if (panelCookieSet) { %> style="display:block" <% } %>>
                <h1 class="spark">Spark <span><%= Versions.getVersion("spark") %></span></h1>
                <div id="ignite_smallpanel_open">
                    <a href="#" onClick="closePanel('spark'); return false;"></a>
                </div>
            </div>
            <!-- END small panel -->
            
            
        </div>
        <!-- END left column (main content) -->
        
        <!-- BEGIN right column (sidebar) -->
        <div id="ignite_body_rightcol">
            
            <jsp:include page="/includes/sidebar_projectside.jsp">
                <jsp:param name="project" value="spark"/>
            </jsp:include>

        </div>
        <!-- END right column (sidebar) -->
    
    </div>
    <!-- END body area -->



</body>
</html>
