<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Asterisk-IM</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Asterisk-IM</a></li>
			<li id="subnav02"><a href="screenshots.jsp" class="ignite_subnav_current">Screenshots</a></li>
			<!-- <li id="subnav03"><a href="plugins.jsp">Plugins</a></li> -->
			<li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
			<li id="subnav05"><a href="http://www.igniterealtime.org/issues/browse/PHONE">Issue Tracker</a></li>
			<!-- <li id="subnav06"><a href="http://www.igniterealtime.org/builds/asterisk-im/docs/latest/javadoc/">JavaDocs</a></li> -->
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
					<h2>Asterisk Screenshots</h2>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_padding">
					<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut nisl eros, venenatis non, placerat non, eleifend non, lacus. Proin at sapien. In convallis nisi eget velit. Mauris placerat porttitor nulla. In hac habitasse platea dictumst. Vivamus iaculis dui et lectus condimentum convallis. Suspendisse sagittis sollicitudin magna. Etiam eu urna.</p>
				
				
				
				</div>
				
				
			</div>
			<!-- END body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
            <jsp:include page="/includes/sidebar_projectlead.jsp">
                <jsp:param name="project" value="asterisk-im" />
            </jsp:include>

			<jsp:include page="/includes/sidebar_snapshot.jsp">
			    <jsp:param name="project" value="asterisk-im"/>
			</jsp:include>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>