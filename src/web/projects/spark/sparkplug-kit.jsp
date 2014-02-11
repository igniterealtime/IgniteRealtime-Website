<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Spark IM Client</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Spark</a></li>
			<li id="subnav02"><a href="screenshots.jsp">Screenshots</a></li>
			<li id="subnav03"><a href="sparkplug-kit.jsp">Sparkplug Kit</a></li>
			<li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
			<li id="subnav05"><a href="http://issues.igniterealtime.org/browse/SPARK">Issue Tracker</a></li>
            <li id="subnav06"><a href="../../roadmap.jsp">Roadmap</a></li>
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
                        Sparkplugs dynamically extend the features of the <a href="/projects/spark/">Spark</a>
                        instant messaging client.
                        Use Sparkplugs to customize Spark for your business or organization or to add an
                        innovative twist to instant messaging. The extensive plugin API allows for complete
                        client flexibility but is still simple and (we hope!) fun to use.
                    </p>

                    <table>
                    <tr>
                        <td><img src="/images/icon_zip.gif"></td>
                        <td><a href="/builds/sparkplug_kit/sparkplug_kit_2_0_7.zip">sparkplug_kit_2_0_7.zip</a></td>
                        <td>11.5 MB</td>
                    </tr>
                    </table>

                    <br/>

                    <h4>
                    Included
                    </h4>

                    <ul>
                        <li><a href="/builds/sparkplug_kit/docs/latest/sparkplug_dev_guide.html">Development Guide</a></li>
                        <li><a href="/builds/sparkplug_kit/docs/latest/api/index.html">Javadocs</a></li>
                        <li><a href="/builds/sparkplug_kit/docs/latest/examples.jar">Source Code Examples</a></li>
                    </ul>

                    <h4>Resources</h4>
                    <ul>
                        <li><a href="http://community.igniterealtime.org/developers/spark_dev">Sparkplug Discussion Forum</a></li>
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
