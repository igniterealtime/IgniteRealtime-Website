<%@ page import="org.jivesoftware.site.Versions, java.util.Calendar, java.util.TimeZone"%>

<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<%@ include file="/includes/ws_locator.jspf" %>

<%
    // Compute current offset of PST to UTC.
    int offset = Math.abs(TimeZone.getTimeZone("America/Los_Angeles").getOffset(System.currentTimeMillis())/(1000*60*60));
%>

<html>
<head>
<title>Support - Group Chat</title>
<meta name="body-id" content="support" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>

	<script type="text/javascript">
	jive_groupchat_config = {
		width: 1000, //Taken over by groupchat-container if fitToParent: "true" and Height and Width are specified in the CSS
		height: 450, // Same as above
		x: 0, // 0 centers it on the page. Setting XY coords. will absolutely position the dlg on the page, unless fitToParent: "true"
		y: 0, // Same as above
		constrained: "false",
		draggable: "false",
		resizable: "false",
		closable: "false",
		bottomPane: "false",
		mucServer: "conference.igniterealtime.org",
		server: "http://www.igniterealtime.org",
		connectionAddress: "http://www.igniterealtime.org",
		roomName: "open_chat",
		fitToParent: "true", // forces the dlg to find #groupchat-container and conform to its layout and size
	}
	</script>

	<script src="/support/groupchat/combined.compressed.js" type="text/javascript"></script>

	<link rel="stylesheet" type="text/css" href="/support/groupchat/style/basic-dialog.css">
 	<link rel="stylesheet" type="text/css" href="/support/groupchat/style/layout.css">
 	<link rel="stylesheet" type="text/css" href="/support/groupchat/style/fonts.css">
 	<link rel="stylesheet" type="text/css" href="/support/groupchat/style/grid.css">
 	<link rel="stylesheet" type="text/css" href="/support/groupchat/style/reset-min.css">
 	<link rel="stylesheet" type="text/css" href="/support/groupchat/style/roster.css">
 	<link rel="stylesheet" type="text/css" href="/support/groupchat/style/spank.css">
 	<link rel="stylesheet" type="text/css" href="/support/groupchat/style/ignitechat.css">
 	<link rel="stylesheet" type="text/css" href="/support/groupchat/style/jive-muc.css">
	
</head>

<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Support</a></li>
			<li id="subnav02"><a href="articles.jsp">Articles</a></li>
			<li id="subnav03"><a href="group_chat.jsp" class="ignite_subnav_current">Group Chat</a></li>
			<li id="subnav04"><a href="http://issues.igniterealtime.org/secure/Dashboard.jspa">Issue Tracker</a></li>
			<li id="subnav05"><a href="service_providers.jsp">Service providers</a></li>
		</ul>
	</div>

	<!-- BEGIN body area -->
	<div id="ignite_body">
		
		<!-- BEGIN left column (main content) -->
		<div id="ignite_body_leftcol">
			
			<!-- BEGIN body content area -->
			<div id="ignite_int_body">
			
				<!-- BEGIN body header -->
				<div id="ignite_body_header">
					<h2>Group Chat</h2>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_support">
							
					<p>Chat live with the community about igniterealtime.org projects. The chat
					service is available at all times. However, project developers will specifically be 
					available to answer questions <b>every Wednesday at 10:00 AM PST (<%= 10 + offset %>:00 UTC/GMT)</b>
					for one hour.</p>
					
					<div id="groupchat-container">
						<div id="groupchat"></div>
					</div>
					
					<p>Alternatively, you may use any XMPP client (Spark, Exodus, Pandion, Trillian, etc) 
					to connect to the group chat service at conference.igniterealtime.org. The chat name is
                    &quot;Open Chat&quot; and its address is open_chat@conference.igniterealtime.org.</p>

					<h3>Previous Chats</h3>
					<p>Transcripts of the weekly chats are posted in the 
					<a href="/community/main-threads.jspa">discussion forums</a>. Try a search for
					"chat transcript" to find them.</p>
					
					<h3>About Group Chat</h3>
					<p>The web-based group chat client used on this site is powered by the group chat 
					feature in <a href="http://www.jivesoftware.com/products/forums?source=Website-Ignite">Jive Forums</a>, a 
					commercial product from Jive Software.</p>
					
					<p>&nbsp;</p>
					
				</div>
			
			
			</div>
			<!-- END body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">

            <%@ include file="/includes/sidebar_chat.jspf" %>

            <%@ include file="/includes/sidebar_enterprise.jspf" %>

			<%@ include file="/includes/sidebar_48hrsnapshot.jspf" %>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>