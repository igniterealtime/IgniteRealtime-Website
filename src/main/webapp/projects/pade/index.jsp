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
<meta name="panel-name" content="pade" />
<style type="text/css" media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Pàdé</a></li>   
            <li id="subnav02"><a href="https://github.com/igniterealtime/Pade/releases">Releases</a></li>    
            <li id="subnav03"><a href="https://github.com/igniterealtime/Pade">Source Code</a></li>            
            <li id="subnav04"><a href="https://igniterealtime.github.io/Pade/">Documentation</a></li>
            <li id="subnav05"><a href="https://github.com/igniterealtime/pade/issues">Issue Tracker</a></li>
            <li id="subnav06"><a href="https://conversejs.org/">Converse</a></li>
            <li id="subnav07"><a href="https://jitsi.org/jitsi-meet/">Jitsi-Meet</a></li>            
            <li id="subnav08"><a href="https://collecttix.github.io/ctxSip/">CTX SIP Phone</a></li>             
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
                if (cookie.getName().equals("pade")) { 
                              panelCookieSet = true;
                          }
                     }
               }
            %>
            <div id="ignite_bigpanel" <% if (!panelCookieSet) { %> style="display:block" <% } %>>
                <div id="ignite_bigpanel_content">
                    <h1 class="pade">Pàdé <span><%= Versions.getVersion("pade") %></span></h1>
                    <p>Pàdé is the Yoruba word for "Meet". It is a unified real-time collaboration client optimized for business and organizations implemented as a cross-platform browser extension.</p>
                    <ul>
                        <li>Converse.js for XMPP chat/groupchat with Openfire</li>
                        <li>Jitsi Meet for SFU-based WebRTC audio/video conferencing, screen share and real-time application collaboration with Jitsi Video-bridge.</li>
                        <li>CTXPhone for SIP based telephony and MCU audio/video conferencing with FreeSWITCH.</li>                    
                    </ul>
                </div>
                
                <div id="ignite_bigpanel_close">
                    <a href="#" onClick="closePanel('pade'); return false;"></a>
                </div>
                
                <div id="ignite_bigpanel_screenshot">
                    <img src="images/pade_contacts.png" width="100" alt="" />
                </div>
                
                <div id="ignite_bigpanel_download">
                    <a href="https://chrome.google.com/webstore/detail/pade-unified-communicatio/fohfnhgabmicpkjcpjpjongpijcffaba">Install</a>
                    <span>
                      <strong>Pàdé <%= Versions.getVersion("pade") %></strong> Latest build: <%= Versions.getVersionDate("pade") %>
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
                <h1 class="pade">Pàdé <span><%= Versions.getVersion("pade") %></span></h1>
                <div id="ignite_smallpanel_open">
                    <a href="#" onClick="closePanel('pade'); return false;"></a>
                </div>
            </div>
            <!-- END small panel -->
            
            
        </div>
        <!-- END left column (main content) -->
        
        <!-- BEGIN right column (sidebar) -->
        <div id="ignite_body_rightcol">
            
            <jsp:include page="/includes/sidebar_projectside.jsp">
                <jsp:param name="project" value="pade"/>
            </jsp:include>

        </div>
        <!-- END right column (sidebar) -->
    
    </div>
    <!-- END body area -->



</body>
</html>
