<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Downloads</title>
<meta name="body-id" content="downloads" />
<style type="text/css" media="screen">
    @import "/styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_current">Releases</a></li>
			<li id="subnav02"><a href="source.jsp">Source</a></li>
			<li id="subnav03"><a href="beta.jsp">Beta Releases</a></li>
            <li id="subnav04"><a href="/projects/openfire/plugins.jsp">Openfire Plugins</a></li>
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
                    <h1>Downloads</h1>
                </div>
                <!-- END body header -->


                <div class="ignite_int_body_padding">
                    <p>
                        Below are links to the current releases for all projects. If you're looking for
                        source code or SVN access, please read the <a href="source.jsp">source code</a>
                        access page. If you would like to test the latest (possibly unstable) code,
                        check out the <a href="beta.jsp">current betas</a>. Nightly builds are also maintained for the 
                        <a href="nightly_openfire.jsp">Openfire</a> and
                        <a href="nightly_smack.jsp">Smack</a> projects.
                    </p>
                </div>


                <!-- BEGIN openfire downloads -->
                <%@ include file="/includes/download-box-openfire.jspf" %>
                <!-- END openfire downloads -->

				<!-- BEGIN spark downloads -->
                <%@ include file="/includes/download-box-spark.jspf" %>
				<!-- END spark downloads -->

				<!-- BEGIN smack downloads -->
                <%@ include file="/includes/download-box-smack.jspf" %>
				<!-- END smack downloads -->

				
				<!-- BEGIN xiff downloads -->
                <%@ include file="/includes/download-box-xiff.jspf" %>
				<!-- END xiff downloads -->
				
				
				
			</div>
			<!-- END body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
			
			<%@ include file="/includes/sidebar_enterprise.jspf" %>
			
			<%@ include file="/includes/sidebar_48hrsnapshot.jspf" %>
			
			<%@ include file="/includes/sidebar_testimonial.jspf" %>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>