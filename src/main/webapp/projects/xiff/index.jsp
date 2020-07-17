<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.webservices.RestClient" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="net.sf.json.JSONArray" %>

<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="i" %>
<html>
<head>
<title>XIFF API</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="xiff" />
<style type="text/css" media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./" class="ignite_subnav_project">XIFF</a></li>
            <!-- <li id="subnav03"><a href="plugins.jsp">Plugins</a></li> -->
            <li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
            <li id="subnav05"><a href="https://issues.igniterealtime.org/browse/XIFF">Issue Tracker</a></li>
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
                if (cookie.getName().equals("xiff")) { 
                              panelCookieSet = true;
                          }
                     }
               }
            %>
            <div id="ignite_bigpanel" <% if (!panelCookieSet) { %> style="display:block" <% } %>>
                <div id="ignite_bigpanel_content" style="width: 630px;">
                    <h1 class="xiff">XIFF <span><%= Versions.getVersion("xiff") %></span></h1>
                    <p>
                        XIFF is an Open Source Flash library for instant messaging and presence clients
                        using the XMPP protocol. XIFF includes an extension architecture that makes
                        it easy to add functionality for additional protocol extensions, or even your own
                        special-needs extensions. There are quite a few extensions already included in the
                        library, giving it support for XML-RPC over XMPP (<a href="https://xmpp.org/extensions/xep-0009.html">XEP-0009</a>),
                        Multi-user conferencing (<a href="https://xmpp.org/extensions/xep-0045.html">XEP-0045</a>),
                        Service browsing (<a href="https://xmpp.org/extensions/xep-0030.html">XEP-0030</a>),
                        and XHTML message support (<a href="https://xmpp.org/extensions/xep-0009.html">XEP-0071</a>).
                    </p>
                </div>
                
                <div id="ignite_bigpanel_close">
                    <a href="#" onClick="closePanel('xiff'); return false;"></a>
                </div>
                
                <div id="ignite_bigpanel_download">
                    <a href="../../downloads/#xiff">Download</a>
                    <span>
                        <strong>XIFF <%= Versions.getVersion("xiff") %></strong> Latest build: <%= Versions.getVersionDate("xiff") %>
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
                <h1 class="xiff">XIFF <span><%= Versions.getVersion("xiff") %></span></h1>
                <div id="ignite_smallpanel_open">
                    <a href="#" onClick="closePanel('xiff'); return false;"></a>
                </div>
            </div>
            <!-- END small panel -->
            
            
        </div>
        <!-- END left column (main content) -->
        
        <!-- BEGIN right column (sidebar) -->
        <div id="ignite_body_rightcol">
            
            <jsp:include page="/includes/sidebar_projectside.jsp">
                <jsp:param name="project" value="xiff"/>
            </jsp:include>
            
        </div>
        <!-- END right column (sidebar) -->
    
    </div>
    <!-- END body area -->



</body>
</html>
