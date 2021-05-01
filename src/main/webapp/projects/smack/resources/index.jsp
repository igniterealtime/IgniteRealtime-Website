<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Smack API</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
    @import "../../../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="//igniterealtime.org/projects/smack" class="ignite_subnav_project">Smack</a></li>
            <li id="subnav02"><a href="//igniterealtime.org/projects/smack/readme">Readme</a></li>
            <li id="subnav03"><a href="//download.igniterealtime.org/smack/docs/latest/javadoc/">JavaDocs</a></li>
            <li id="subnav04"><a href="//download.igniterealtime.org/smack/docs/latest/documentation/">Documentation</a></li>
            <li id="subnav05"><a href="//download.igniterealtime.org/smack/docs/latest/changelog.html">Changelog</a></li>
            <li id="subnav06"><a href="//issues.igniterealtime.org/browse/SMACK">Issue Tracker</a></li>
            <li id="subnav07"><a href="https://github.com/igniterealtime/Smack">Source</a></li>
            <li id="subnav08"><a href="${baseUrl}/projects/smack/resources">Resources</a></li>
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
                    <h2>Smack - Additional Resources</h2>
                </div>
                <!-- END body header -->


                <div class="ignite_int_body_padding">


                    <p>This page contains additional external resources and documents related to Smack.</p>

                    <h3>Audits:</h3>
                    <ul>
                    <li><a href="https://download.igniterealtime.org/smack/docs/smack-omemo-audit-0.2.pdf">Security Audit: smack-omemo</a></li>
                    </ul>

                </div>


            </div>
            <!-- END body content area -->

        </div>
        <!-- END left column (main content) -->

        <!-- BEGIN right column (sidebar) -->
        <div id="ignite_body_rightcol">

            <jsp:include page="/includes/sidebar_projectlead.jsp">
                <jsp:param name="project" value="smack" />
            </jsp:include>

            <jsp:include page="/includes/sidebar_snapshot.jsp">
                <jsp:param name="project" value="smack"/>
            </jsp:include>

            <%@ include file="/includes/sidebar_enterprise.jspf" %>

        </div>
        <!-- END right column (sidebar) -->

    </div>
    <!-- END body area -->



</body>
</html>

