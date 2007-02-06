<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Support - Articles</title>
<meta name="body-id" content="support" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Support</a></li>
			<li id="subnav02"><a href="articles.jsp" class="ignite_subnav_current">Articles</a></li>
			<li id="subnav03"><a href="group_chat.jsp">Group Chat</a></li>
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
					<h2>Articles</h2>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_support">
					
					
					<div class="ignite_article_excerpt">
						<h3><a href="/support/articles/pubsub.jsp">All About Pubsub</a></h3>
						<span class="ignite_support_author">April 17, 2006, by Gaston Dombiak and Matt Tucker</span>
						<p>Publish-subscribe (pubsub) is a powerful protocol extension to XMPP. It's like RSS for 
						instant messaging: users subscribe to an item and get notifications when it's updated. The 
						general notification pattern that underlies the protocol... 
						<a href="/support/articles/pubsub.jsp">Read More ></a></p>
					</div>
					
					<div class="ignite_article_excerpt">
						<h3><a href="/support/articles/sparkplug_day.jsp">Sparkplug Day</a></h3>
						<span class="ignite_support_author">February 7 2006, by Matt Tucker</span>
						<p>Once per quarter, the Jive Software engineering team spends a full day on a special 
						project. A few weeks ago, we held Sparkplug Day to build out plugins for our Spark instant 
						messaging client. The goals for Sparkplug Day... <a href="/support/articles/sparkplug_day.jsp">Read More ></a></p>
					</div>
					
					<div class="ignite_article_excerpt">
						<h3><a href="/support/articles/filetransfer.jsp">IM File Transfer Made Easy</a></h3>
						<span class="ignite_support_author">February 7, 2006, by Matt Tucker</span>
						<p>Why do most instant messaging systems get file transfer so wrong? Typically, file 
						transfers don't work reliably (especially when firewalls are involved) and the file transfer 
						UI is non-intuitive with problems like... <a href="/support/articles/filetransfer.jsp">Read More ></a></p>
					</div>
					
					<div class="ignite_article_excerpt">
						<h3><a href="/support/articles/wildfire_optimization.jsp">Behind the Scenes: Wildfire Optimization</a></h3>
						<span class="ignite_support_author">December 19, 2005, by Matt Tucker</span>
						<p>A major priority for Wildfire is to provide the fastest and most scalable XMPP server 
						implementation available. The Pampero project will be the major effort over the next several 
						months to help us achieve that goal. However... <a href="/support/articles/wildfire_optimization.jsp">Read More ></a></p>
					</div>
					
					
					<p>&nbsp;</p>
					
				</div>
			
			
			</div>
			<!-- END body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
			
			<%@ include file="/includes/sidebar_enterprise.jspf" %>
			
			<%@ include file="/includes/sidebar_48hrsnapshot.jspf" %>
			
			<%@ include file="/includes/sidebar_createaccount.jspf" %>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>