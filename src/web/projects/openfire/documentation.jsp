<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Openfire Server</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Openfire</a></li>
			<li id="subnav02"><a href="screenshots.jsp">Screenshots</a></li>
			<li id="subnav03"><a href="plugins.jsp">Plugins</a></li>
			<li id="subnav04"><a href="documentation.jsp" class="ignite_subnav_current">Documentation</a></li>
			<li id="subnav05"><a href="http://www.igniterealtime.org/issues/browse/JM">Issue Tracker</a></li>
			<li id="subnav06"><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/javadoc/">JavaDocs</a></li>
			<li id="subnav07"><a href="connection_manager.jsp">Connection Manager Module</a></li>
            <li id="subnav08"><a href="../../roadmap.jsp">Roadmap</a></li>
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
					<h2>Openfire <%= Versions.getVersion("openfire") %> Documentation</h2>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_padding">
					
					
					<p>The current Openfire (formerly Wildfire) documentation can be found below. All documentation is also distributed in each release.</p>
					
					<h3>Documentation:</h3>
					<ul>
					<li><img src="/images/icon_txt.gif" width="16" height="16" alt="txt" border="0" />
					<a href="http://www.igniterealtime.org/builds/openfire/docs/latest/README.html">Readme &amp; License</a></li>
					<li><img src="/images/icon_txt.gif" width="16" height="16" alt="txt" border="0" />
					<a href="http://www.igniterealtime.org/builds/openfire/docs/latest/changelog.html">Changelog</a>
					<br>
					<br></li>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/install-guide.html">Installation Guide</a> - How to install Openfire.</li>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/database.html">Database Installation Guide</a> -  How to setup your database for use with Openfire.</li>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/ssl-guide.html">SSL Guide</a> - A guide to setting up Openfire's SSL secure socket support.</li>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/ldap-guide.html">LDAP Guide</a> - A guide to setting up Openfire to work with LDAP user stores.</li>
                    <li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/db-integration-guide.html">Custom Database Integration Guide</a> - A guide to integrating Openfire authentication, user, and group data with a custom database.</li>

                    </ul>
					
					<h3>Developer Documentation:</h3>
					<ul>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/javadoc/index.html">JavaDocs</a> - Openfire API documentation.</li>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/source-build.html">Building the Source</a> - Instructions for downloading and compiling the Openfire source code.</li>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/protocol-support.html">Protocol Support</a> - Provides details on the XMPP support and JEPs that Openfire implements.</li>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/plugin-dev-guide.html">Plugin Developer Guide</a> - A guide to writing and installing plugins for Openfire.</li>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/translator-guide.html">Translator Guide</a> - Information for those interested in translating the admin console of Openfire into other languages.</li>
					<li><a href="http://www.igniterealtime.org/builds/openfire/docs/latest/documentation/database-guide.html">Database Schema Guide</a> - A tour of the Openfire database schema for developers and database administrators.</li>
					</ul>
					
					<!-- <h3>Other:</h3>
					<ul>
					<li><a href="/articles/index.jsp">Articles</a></li>
					</ul> -->
				
				
				
				</div>
				
				
			</div>
			<!-- END body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
            <jsp:include page="/includes/sidebar_projectlead.jsp">
                <jsp:param name="project" value="openfire" />
            </jsp:include>
			
			<jsp:include page="/includes/sidebar_snapshot.jsp">
			    <jsp:param name="project" value="openfire"/>
			</jsp:include>
			
			<%@ include file="/includes/sidebar_enterprise.jspf" %>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>