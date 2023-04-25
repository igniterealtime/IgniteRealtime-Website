<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Botz</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="botz" />
<style type="text/css" media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./" class="ignite_subnav_project">Botz</a></li>
            <li id="subnav02"><a href="documentation.jsp">Documentation</a></li>
            <li id="subnav03"><a href="https://github.com/igniterealtime/Botz/releases">Releases</a></li>
            <li id="subnav04"><a href="https://github.com/igniterealtime/Botz">Source Code</a></li>
            <li id="subnav05"><a href="https://github.com/igniterealtime/Botz/issues">Issue Tracker</a></li>
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
                if (cookie.getName().equals("pade")) { 
                              panelCookieSet = true;
                          }
                     }
               }
            %>
            <div id="ignite_bigpanel" <% if (!panelCookieSet) { %> style="display:block" <% } %>>
                <div id="ignite_bigpanel_content">
                    <h1 class="botz">Botz <span><%= Versions.getVersion("botz") %></span></h1>
                    <p>The Botz library adds to the already rich and extensible Openfire with the ability to create internal user bots. With the Botz library, programmers may choose to develop a user bot to run as a service bearing myservice@example.com as its JID. To Openfire, the user bot is just like other (human) users.</p>
                </div>
                
                <div id="ignite_bigpanel_close">
                    <a href="#" onClick="closePanel('botz'); return false;"></a>
                </div>
                

            </div>
            <!-- END large panel -->
            
            <!-- BEGIN small panel -->
            <!-- 
                if there is a cookie, show this panel
                (same details as above for 'large panel')
            -->
            <div id="ignite_smallpanel" <% if (panelCookieSet) { %> style="display:block" <% } %>>
                <h1 class="botz">Botz <span><%= Versions.getVersion("botz") %></span></h1>
                <div id="ignite_smallpanel_open">
                    <a href="#" onClick="closePanel('botz'); return false;"></a>
                </div>
            </div>
            <!-- END small panel -->
            
            
        </div>
        <!-- END left column (main content) -->
        
        <!-- BEGIN right column (sidebar) -->
        <div id="ignite_body_rightcol">
            
            <jsp:include page="/includes/sidebar_projectside.jsp">
                <jsp:param name="project" value="botz"/>
            </jsp:include>

        </div>
        <!-- END right column (sidebar) -->
    
    </div>
    <!-- END body area -->



</body>
</html>
