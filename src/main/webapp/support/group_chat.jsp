<%@ page import="org.jivesoftware.site.Versions, java.util.Calendar, java.util.TimeZone"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

<%
    // Compute current offset of PST to UTC.
    int offset = Math.abs(TimeZone.getTimeZone("America/Los_Angeles").getOffset(System.currentTimeMillis())/(1000*60*60));
%>

<html>
<head>
    <title>Group Chat</title>
    <meta name="body-id" content="support" />

    <style type="text/css" media="screen">
        @import "../styles/interior.css";
    </style>
    
    <style type="text/css">
        ul.changelogentry li {
            margin-left: 2.5em;
            list-style-type: disc;
        }
        
        ul.changelogentry li.changelogheader {
            list-style-type:none; 
            margin-left: 0em;
        }
    </style>
    
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./" class="ignite_subnav_project">Support</a></li>
            <%--<li id="subnav02"><a href="articles.jsp">Articles</a></li>--%>
            <li id="subnav03"><a href="group_chat.jsp">Group Chat</a></li>
            <li id="subnav04"><a href="https://issues.igniterealtime.org/">Issue Tracker</a></li>
            <li id="subnav05"><a href="service_providers.jsp">Professional Partners</a></li>
        </ul>
    </div>

    <!-- BEGIN body area -->
    <div id="ignite_body">

        <!-- BEGIN body header -->
        <!-- <div id="ignite_body_header">
           <h2>Group Chat</h2>
        </div> -->
        <!-- END body header -->

                 <!-- BEGIN group chat area -->
                        <div class="ignite_int_body_groupchat">

                            <p>Chat live with the community about Ignite Realtime projects. The chat
                            service is available at all times. Feel free to ask any question you like, but please note
                            that you're talking to volunteers, not people that are paid to be readily available and answer
                            your questions. It might take some time for anyone to read your message.</p>

                            <iframe src="converse.jsp" style="width:100%;height:574px;"></iframe>

                            <!-- <p>Alternatively, you may use any <a href="https://xmpp.org/software/clients.html">XMPP client</a>
                            to connect to the group chat service at conference.igniterealtime.org. The chat name is
                            &quot;Open Chat&quot; and its address is open_chat@conference.igniterealtime.org.</p> -->

                            <p>The web-based group chat client used is <a href="https://conversejs.org/">ConverseJS</a>.</p>

                        </div>
                 <!-- END group chat area -->
        
        <!-- BEGIN right column (sidebar) -->
        <!-- <div id="ignite_body_rightcol">

        <%--    <%@ include file="/includes/sidebar_chat.jspf" %> --%>

         <%--   <%@ include file="/includes/sidebar_enterprise.jspf" %> --%>
            
         <%--   <%@ include file="/includes/sidebar_48hrsnapshot.jspf" %> --%>
            
         <%--   <%@ include file="/includes/sidebar_testimonial.jspf" %> --%>
            
        </div> -->
        <!-- END right column (sidebar) -->
    
    </div>
    <!-- END body area -->



</body>
</html>
