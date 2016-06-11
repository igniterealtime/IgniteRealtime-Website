<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="java.text.DecimalFormat" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

<%
    String path = request.getContextPath();
    String buildsPath = application.getInitParameter("builds-path");

    String version = Versions.getVersion("connection_manager");
    if (version == null) {
        version = "0.0";
    }

    DecimalFormat formatter = new DecimalFormat("0.00");
    String basedir = buildsPath + "/connectionmanager";
    String ver = version.replace('.', '_');
    File zip = new File(basedir, "connection_manager_" + ver + ".zip");
    File binTarGz = new File(basedir, "connection_manager_" + ver + ".tar.gz");
    File srcZip = new File(basedir, "connection_manager_src_" + ver + ".zip");
    File srcTarGz = new File(basedir, "connection_manager_src_" + ver + ".tar.gz");

    String buildDate = "UNKNOWN";
    if (zip.exists()) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM d, yyyy");
        buildDate = dateFormat.format(new Date(zip.lastModified()));
    }

%>
<html>
<head>
<title>Openfire Server</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
	@import "../../styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Openfire</a></li>
			<li id="subnav03"><a href="plugins.jsp">Plugins</a></li>
			<li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
			<li id="subnav05"><a href="http://issues.igniterealtime.org/browse/JM">Issue Tracker</a></li>
			<li id="subnav06"><a href="http://download.igniterealtime.org/openfire/docs/latest/documentation/javadoc/">JavaDocs</a></li>
			<li id="subnav07"><a href="connection_manager.jsp" class="ignite_subnav_current">Connection Manager Module</a></li>
            <li id="subnav08"><a href="http://issues.igniterealtime.org/browse/OF#selectedTab=com.atlassian.jira.plugin.system.project%3Aroadmap-panel">Roadmap</a></li>
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
					<h2>Openfire (formerly Wildfire) Connection Manager Module</h2><br>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_padding" style="padding-top: 5px;">
				
					<!-- <h2>Openfire Connection Manager Module</h2> -->
					<!-- <p>Provides greatly improved scalability to Openfire.</p> -->
					
					<h5>What is it?</h5><img src="../../images/connection-managers.gif" width="294" height="250" alt="Connection Manager Module" class="ignite_body_image_right" />
					<p>Each Openfire Connection Manager module you deploy improves the scalability of  your Openfire server by handling a portion of the client connections. It's suitable for very large installations of Openfire (many thousand concurrent users). Download the connection manager module implementation below.</p>
					
					<h5>How many users can each connection manager handle?</h5>
					<p>Each connection manager should handle at least five thousand concurrent  users. Experimental support for non-blocking connections is under development, which will greatly increase the number of connections that each connection manager module can support.</p>
					
					<h5>Can connection managers be used with other servers?</h5>
					<p>Yes (in theory). The connection manager protocol is being developed through the open <a href="http://www.xmpp.org/extensions/">XEP</a> process. We hope to work with other server vendors so that the entire XMPP/Jabber community supports the protocol. We also expect there will be other implementations of connection managers that will be compatible with Openfire. For example, a connection manager written with native code may be able to achieve very high scalability on a specific platform.</p>
					
					<h5>Does Openfire Connection Manager Module use the same license as Openfire?</h5>
					<p>Yes, the module is dual-licensed under the Open Source <a href="http://www.gnu.org/copyleft/gpl.html">GPL</a> license or a comercial software license agreement available from Jive Software.</p>
					
					<h5>How do I get support?</h5>
					<p>Support is available from the user community in the <a href="http://community.igniterealtime.org/main-threads.jspa">discussion forums</a>. Enterprise-grade email and phone support is also <a href="http://www.jivesoftware.com/products/openfire?source=Website-Ignite">available</a> from Jive Software.</p>
					
					
					<h5>Download</h5>
					<p>Download the  release of the Openfire connection manager module (requires Openfire 3.0 ). Full setup and usage instructions are included in the release.</p>
					
					<div class="ignite_download_panel ignite_download_source_panel">
						<div class="ignite_download_panel_label">
							<h4>Connection Manager Module <%= version %> -- <%= buildDate %></h4>
						</div>
						<div class="ignite_download_item_odd">
							<span class="ignite_download_item_details">
								<img src="../../images/icon_zip.gif" alt="" width="17" height="16" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=connectionmanager/<%= zip.getName() %>"><%= zip.getName() %></a> - Windows archive file
							</span>
							<span class="ignite_download_item_date">
								<%= buildDate %>
							</span>
							<span class="ignite_download_item_size">
								<%= formatter.format((double)zip.length()/1024.0/1024.0) %> MB
							</span>
						</div>
						<div class="ignite_download_item_even">
							<span class="ignite_download_item_details">
								<img src="../../images/icon_zip.gif" alt="" width="17" height="16" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=connectionmanager/<%= binTarGz.getName() %>"><%= binTarGz.getName() %></a> - Unix/Linux archive file
							</span>
							<span class="ignite_download_item_date">
								<%= buildDate %>
							</span>
							<span class="ignite_download_item_size">
								<%= formatter.format((double)binTarGz.length()/1024.0/1024.0) %> MB
							</span>
						</div>
					</div>

                    <div class="ignite_download_panel ignite_download_source_panel">
						<div class="ignite_download_panel_label">
							<h4>Source Code - <%= version %></h4>
						</div>
						<div class="ignite_download_item_odd">
							<span class="ignite_download_item_details">
								<img src="../../images/icon_zip.gif" alt="" width="17" height="16" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=connectionmanager/<%= srcZip.getName() %>"><%= srcZip.getName() %></a> - Windows archive file
							</span>
							<span class="ignite_download_item_date">
								<%= buildDate %>
							</span>
							<span class="ignite_download_item_size">
								<%= formatter.format((double)srcZip.length()/1024.0/1024.0) %> MB
							</span>
						</div>
						<div class="ignite_download_item_even">
							<span class="ignite_download_item_details">
								<img src="../../images/icon_zip.gif" alt="" width="17" height="16" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=connectionmanager/<%= srcTarGz.getName() %>"><%= srcTarGz.getName() %></a> - Unix/Linux archive file
							</span>
							<span class="ignite_download_item_date">
								<%= buildDate %>
							</span>
							<span class="ignite_download_item_size">
								<%= formatter.format((double)srcTarGz.length()/1024.0/1024.0) %> MB
							</span>
						</div>
					</div>
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
