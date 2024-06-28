<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.webservices.RestClient"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    String baseUrl = config.getServletContext().getInitParameter("discourse_baseurl");
    if ( baseUrl == null || baseUrl.isEmpty() )
    {
        baseUrl = "https://discourse.igniterealtime.org/";
    }

    request.setAttribute( "baseUrl", baseUrl );
    request.setAttribute( "feedManager", FeedManager.getInstance() );
    request.setAttribute( "restClient", new RestClient() );
%>
<html>
<head>
<title>Pade</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="pade" />
<style type="text/css" media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./" class="ignite_subnav_project">P&agrave;d&eacute;</a></li>
            <li id="subnav02"><a href="https://github.com/igniterealtime/Pade/releases">Releases</a></li>    
            <li id="subnav03"><a href="https://github.com/igniterealtime/Pade">Source Code</a></li>            
            <li id="subnav04"><a href="https://igniterealtime.github.io/pade/help/">Documentation</a></li>
            <li id="subnav05"><a href="https://github.com/igniterealtime/pade/issues">Issue Tracker</a></li>
            <li id="subnav06"><a href="https://conversejs.org/">Converse</a></li>
            <li id="subnav07"><a href="https://jitsi.org/jitsi-meet/">Jitsi-Meet</a></li>
            <li id="subnav08"><a href="https://github.com/igniterealtime/openfire-pade-plugin">Openfire Plugin</a></li>             
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
                    <h1 class="pade">P&agrave;d&eacute; <span><%= Versions.getVersion("pade") %></span></h1>
                    <p>P&agrave;d&eacute; is the Yoruba word for "Meet". It is a unified real-time collaboration client optimized for business and organizations implemented as a cross-platform browser extension.</p>
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
                      <strong>P&agrave;d&eacute; <%= Versions.getVersion("pade") %></strong> Latest build: <%= Versions.getVersionDate("pade") %>
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
                <h1 class="pade">P&agrave;d&eacute; <span><%= Versions.getVersion("pade") %></span></h1>
                <div id="ignite_smallpanel_open">
                    <a href="#" onClick="closePanel('pade'); return false;"></a>
                </div>
            </div>
            <!-- END small panel -->

            <!-- BEGIN 'latest blog entries' column -->
            <div id="ignite_home_body_leftcol">
                <!-- BEGIN blog header -->
                <div id="ignite_blog_header">
                    <span id="ignite_blog_header_label">
                        Latest <a href="${baseUrl}/tags/c/blogs/ignite-realtime-blogs/5/pade">Blog</a> Entries
                    </span>
                </div>
                <!-- END blog header -->

                <%-- Show blog feed --%>
                <cache:cache time="600" key="${baseUrl.concat('/tags/c/blogs/ignite-realtime-blogs/5/pade')}">
                    <c:forEach items="${feedManager.getTaggedItems( baseUrl, '/c/blogs/ignite-realtime-blogs.rss', 'pade', 5 )}" var="item" varStatus="status">
                        <ir:blogpost item="${item}" isOdd="${status.count % 2 != 0}"/>
                    </c:forEach>
                </cache:cache>
            </div>
            <!-- END 'latest blog entries' column -->

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
