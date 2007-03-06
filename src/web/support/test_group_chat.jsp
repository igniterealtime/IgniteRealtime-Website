<%@ page import="org.jivesoftware.site.Versions, java.util.Calendar, java.util.TimeZone"%>

<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

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
	width: 500,
    height: 450,
    x: 0,
    y: 0,
    constrained: "false",
    draggable: "true",
    resizable: "true",
    closable: "true",
    bottomPane: "false",
    mucServer: "conference.igniterealtime.org",
    server: "http://www.igniterealtime.org",
    connectionAddress: "http://www.igniterealtime.org",
    roomName: "test"
	}
	</script>

	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/sarissa.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/getElementsBySelector.js" type="text/javascript"></script>

	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/prototype.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/connection.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/yahoo.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/dom.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/event.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/container_core.js" type="text/javascript"></script>

	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/menu.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/dragdrop.js" type="text/javascript"></script>		
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/yutil.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/element.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/domhelper.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/compositeelement.js" type="text/javascript"></script>

	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/eventmanager.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/autocomplete.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/tabpanel.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/resizable.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/state.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/basicdialog.js" type="text/javascript"></script>

	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/splitbar.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/mixedcollection.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/layoutmanager.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/borderlayout.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/contentpanels.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/layoutregion.js" type="text/javascript"></script>

	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/layoutstatemanager.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/splitlayoutregion.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/borderlayoutregions.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/grid/AbstractColumnModel.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/grid/DefaultColumnModel.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/grid/Grid.js" type="text/javascript"></script>

	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/grid/GridView.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/grid/SelectionModel.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/data/AbstractDataModel.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/data/DefaultDataModel.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/loadabledatamodel.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/CSS.js" type="text/javascript"></script>

	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/spank.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/groupchat-scripts/control.js" type="text/javascript"></script>
	<script src="http://www.igniterealtime.org/support/groupchat/group_chat.js" type="text/javascript"></script>

	<link rel="stylesheet" type="text/css" href="http://www.igniterealtime.org/support/groupchat/style/basic-dialog.css">
 	<link rel="stylesheet" type="text/css" href="http://www.igniterealtime.org/support/groupchat/style/layout.css">
 	<link rel="stylesheet" type="text/css" href="http://www.igniterealtime.org/support/groupchat/style/fonts.css">
 	<link rel="stylesheet" type="text/css" href="http://www.igniterealtime.org/support/groupchat/style/grid.css">
 	<link rel="stylesheet" type="text/css" href="http://www.igniterealtime.org/support/groupchat/style/reset-min.css">
 	<link rel="stylesheet" type="text/css" href="http://www.igniterealtime.org/support/groupchat/style/roster.css">
 	<link rel="stylesheet" type="text/css" href="http://www.igniterealtime.org/support/groupchat/style/spank.css">
 	<link rel="stylesheet" type="text/css" href="http://www.igniterealtime.org/support/groupchat/style/ignitechat.css">
 	<link rel="stylesheet" type="text/css" href="http://www.igniterealtime.org/support/groupchat/style/jive-muc.css">
	
</head>

<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Support</a></li>
			<li id="subnav02"><a href="articles.jsp">Articles</a></li>
			<li id="subnav03"><a href="group_chat.jsp" class="ignite_subnav_current">Group Chat</a></li>
			<li id="subnav04"><a href="http://www.igniterealtime.org/issues/secure/Dashboard.jspa">Issue Tracker</a></li>
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
					
					<div id="groupchat"></div>

					<h3>Previous Chats</h3>
					<p>Transcripts of the weekly chats are posted in the 
					<a href="http://www.igniterealtime.org/forum/">discussion forums</a>. Try a search for
					"chat transcript" to find them.</p>
					
					<h3>About Group Chat</h3>
					<p>The web-based group chat client used on this site is powered by the group chat 
					feature in <a href="http://www.jivesoftware.com/products/forums">Jive Forums</a>, a 
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