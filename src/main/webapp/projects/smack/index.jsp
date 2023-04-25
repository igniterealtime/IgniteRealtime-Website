<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Smack API</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="smack" />
<style type="text/css" media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./" class="ignite_subnav_project">Smack</a></li>
            <li id="subnav02"><a href="//igniterealtime.org/projects/smack/readme">Readme</a></li>
            <li id="subnav03"><a href="//download.igniterealtime.org/smack/docs/latest/javadoc/">Javadoc</a></li>
            <li id="subnav04"><a href="https://github.com/igniterealtime/Smack/blob/master/CHANGELOG.md">Changelog</a></li>
            <li id="subnav05"><a href="//issues.igniterealtime.org/browse/SMACK">Issue Tracker</a></li>
            <li id="subnav06"><a href="https://github.com/igniterealtime/Smack">Source</a></li>
            <li id="subnav07"><a href="${baseUrl}/projects/smack/resources">Resources</a></li>
            <li id="subnav08"><a href="https://download.igniterealtime.org/smack/dailybuilds/javadoc/">Nightly Javadoc</a></li>
            <li id="subnav09"><a href="https://download.igniterealtime.org/smack/dailybuilds/jacoco/">Nightly CodeCov</a></li>
            <li id="subnav10"><a href="https://download.igniterealtime.org/smack/dailybuilds/sinttest-javadoc/org/igniterealtime/smack/inttest/package-summary.html">Nightly Sinttest Javadoc</a></li>
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
                if (cookie.getName().equals("smack")) { 
                              panelCookieSet = true;
                          }
                     }
               }
            %>
            <div id="ignite_bigpanel" <% if (!panelCookieSet) { %> style="display:block" <% } %>>
                <div id="ignite_bigpanel_content" style="width: 630px;">
                    <h1 class="smack">Smack <span><%= Versions.getVersion("smack") %></span></h1>
                    <p>
                        Smack is an Open Source XMPP client library for instant messaging and presence.
                        A pure Java library, it can be embedded into your applications to create anything from
                        a full XMPP client to simple XMPP integrations such as sending notification messages
                        and presence-enabling devices.
                    </p>
                </div>
                
                <div id="ignite_bigpanel_close">
                    <a href="#" onClick="closePanel('smack'); return false;"></a>
                </div>
                
                <div id="ignite_bigpanel_download">
                    <a href="../../downloads/#smack">Download</a>
                    <span>
                        <strong>Smack <%= Versions.getVersion("smack") %></strong> Latest build: <%= Versions.getVersionDate("smack") %>
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
                <h1 class="smack">Smack <span><%= Versions.getVersion("smack") %></span></h1>
                <div id="ignite_smallpanel_open">
                    <a href="#" onClick="closePanel('smack'); return false;"></a>
                </div>
            </div>
            <!-- END small panel -->

        </div>
        <!-- END left column (main content) -->

        <!-- BEGIN right column (sidebar) -->
        <div id="ignite_body_rightcol">
            
            <jsp:include page="/includes/sidebar_projectside.jsp">
                <jsp:param name="project" value="smack"/>
            </jsp:include>
            
        </div>
        <!-- END right column (sidebar) -->
    
    </div>
    <!-- END body area -->



</body>
</html>
