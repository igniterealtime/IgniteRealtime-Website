<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Products</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
	@import "../styles/interior.css";
</style>
</head>
<body>


	<!-- BEGIN body area -->
	<div id="ignite_body">
		
		<!-- BEGIN left column (main content) -->
		<div id="ignite_body_leftcol">
			
			<!-- BEGIN body content area -->
			<div id="ignite_int_body">
			
				<!-- BEGIN body header -->
				<div id="ignite_body_header">
					<h1>Projects</h1> <strong>Open Source Real-Time Communication</strong>
				</div>
				<!-- END body header -->
				
				<!-- BEGIN project - openfire -->
				<div class="ignite_project_big ignite_project_big_left">
				<div class="ignite_project_type">Server</div>
					<div class="ignite_project_content">
						<a href="openfire/index.jsp" class="ignite_project_openfire">
						<h1 class="openfire">Openfire <span><%= Versions.getVersion("openfire") %></span></h1></a>
						<p>Openfire is a cross-platform real-time collaboration server based on the XMPP (Jabber) protocol.</p> 
						<p><a href="openfire/index.jsp" class="ignite_link_arrow"><strong>Learn More</strong></a></p>
					</div>
				</div>
				<!-- END project - openfire -->
				
				<!-- BEGIN project - spark -->
				<div class="ignite_project_big">
				<div class="ignite_project_type">Client</div>
					<div class="ignite_project_content">
						<a href="spark/index.jsp" class="ignite_project_spark">
						<h1>Spark <span><%= Versions.getVersion("spark") %></span></h1></a>
						<p>Cross-platform real-time collaboration client optimized for business and organizations.</p>
						<p><a href="spark/index.jsp" class="ignite_link_arrow"><strong>Learn More</strong></a></p>
					</div>
				</div>
				<!-- END project - spark -->
				
				<!-- BEGIN project - smack -->
				<div class="ignite_project_big">
				<div class="ignite_project_type">Client Library</div>
					<div class="ignite_project_content">
						<a href="smack/index.jsp" class="ignite_project_smack">
						<h1>Smack <span><%= Versions.getVersion("smack") %></span></h1></a>
						<p>Easy to use Java XMPP client library.</p>
						<p><a href="smack/index.jsp" class="ignite_link_arrow"><strong>Learn More</strong></a></p>
					</div>
				</div>
				<!-- END project - smack -->
				
				
				<!-- BEGIN other projects -->
				<div class="ignite_project_type">Other Projects</div>
				<div class="ignite_project_table">
					<table border cellpadding="0" cellspacing="0" border="0" width="100%">
                        			<tr class="ignite_project_table-row-odd">
							<td class="ignite_project_table-title" nowrap="nowrap">
								<a href="tinder/index.jsp">Tinder</a>
							</td>
							<td class="ignite_project_table-description">
							A Java based XMPP library, providing an implementation for XMPP stanzas and components.
							</td>
							<td class="ignite_project_table-version">
								<%= Versions.getVersion("tinder") %>
							</td>
							<td class="ignite_project_table-link" nowrap="nowrap">
								<a href="tinder/index.jsp">Learn More</a>
							</td>
						</tr>
						<tr class="ignite_project_table-row-even">
							<td class="ignite_project_table-title" nowrap="nowrap">
								<a href="whack/index.jsp">Whack</a>
							</td>
							<td class="ignite_project_table-description">
								Easy to use Java XMPP component library.
							</td>
							<td class="ignite_project_table-version">
								<%= Versions.getVersion("whack") %>
							</td>
							<td class="ignite_project_table-link" nowrap="nowrap">
								<a href="whack/index.jsp">Learn More</a>
							</td>
						</tr>
					</table>
				</div>
				<!-- END other projects -->
				
				<!-- BEGIN discontinued projects -->
				<div class="ignite_project_type">Discontinued Projects</div>
				<div class="ignite_project_table">
					<table border cellpadding="0" cellspacing="0" border="0" width="100%">
						<tr class="ignite_project_table-row-odd">
							<td class="ignite_project_table-title" nowrap="nowrap">
								<a href="xiff/index.jsp">XIFF</a>
							</td>
							<td class="ignite_project_table-description">
								Flash XMPP client library.
							</td>
							<td class="ignite_project_table-version">
								<%= Versions.getVersion("xiff") %>
							</td>
							<td class="ignite_project_table-link" nowrap="nowrap">
								<a href="xiff/index.jsp">Learn More</a>
							</td>
						</tr>
						<tr class="ignite_project_table-row-even">
							<td class="ignite_project_table-title" nowrap="nowrap">
								<a href="sparkweb/index.jsp">SparkWeb</a>
							</td>
							<td class="ignite_project_table-description">
								Web based real-time collaboration client.
							</td>
							<td class="ignite_project_table-version">
								<%= Versions.getVersion("sparkweb") %>
							</td>
							<td class="ignite_project_table-link" nowrap="nowrap">
								<a href="sparkweb/index.jsp">Learn More</a>
							</td>
						</tr>
					</table>
				</div>
				<!-- END other projects -->
				
				
			</div>
			<!-- END body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
			
			<%@ include file="/includes/sidebar_enterprise.jspf" %>
			
            <!-- RANDOM SCREENSHOT HERE -->
			
	<%--		<%@ include file="/includes/sidebar_testimonial.jspf" %> --%>
			
			<%@ include file="/includes/sidebar_chat.jspf" %>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>
