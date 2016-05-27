<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Spark IM Client</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
	@import "../../styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Spark</a></li>
			<li id="subnav03"><a href="sparkplug-kit.jsp">Sparkplug Kit</a></li>
			<li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
			<li id="subnav05"><a href="https://igniterealtime.org/issues/projects/SPARK/issues">Issue Tracker</a></li>
            		<li id="subnav06"><a href="https://igniterealtime.org/issues/projects/SPARK?selectedItem=com.atlassian.jira.jira-projects-plugin:release-page">Roadmap</a></li>
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
					<h2>Sparkplug Kit</h2>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_padding">
					<p>
                        Sparkplug was designed to help developers extend Spark capabilities, add various new
                        features by using plugin API. <b>Note:</b> Sparkplug Kit hasn't been updated for more
                        than 10 years, so it may not work well with the current Spark source code.
                    </p>

                    <table>
                    <tr>
                        <td><img src="../../images/icon_zip.gif"></td>
                        <td><a href="../../builds/sparkplug_kit/sparkplug_kit_2_0_7.zip">sparkplug_kit_2_0_7.zip</a></td>
                        <td>11.5 MB</td>
                    </tr>
                    </table>

                    <br/>

                    <h4>
                    Included
                    </h4>

                    <ul>
                        <li><a href="../../builds/sparkplug_kit/docs/latest/sparkplug_dev_guide.html">Development Guide</a></li>
                        <li><a href="../../builds/sparkplug_kit/docs/latest/api/index.html">Javadocs</a></li>
                        <li><a href="../../builds/sparkplug_kit/docs/latest/examples.jar">Source Code Examples</a></li>
                    </ul>

                    <h4>Resources</h4>
                    <ul>
                        <li><a href="https://community.igniterealtime.org/community/developers/spark_dev">Spark Development Forum</a></li>
                    </ul>

                </div>
				
				
			</div>
			<!-- END body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
            <jsp:include page="/includes/sidebar_projectlead.jsp">
                <jsp:param name="project" value="spark" />
            </jsp:include>

			<jsp:include page="/includes/sidebar_snapshot.jsp">
			    <jsp:param name="project" value="spark"/>
			</jsp:include>
			
			<%@ include file="/includes/sidebar_enterprise.jspf" %>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>
