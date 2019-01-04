<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Beta Downloads</title>
<meta name="body-id" content="downloads" />
<style type="text/css" media="screen">
    @import "../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="index.jsp">Releases</a></li>
            <li id="subnav02"><a href="source.jsp">Source</a></li>
            <li id="subnav03"><a href="beta.jsp" class="ignite_subnav_current">Beta Releases</a></li>
            <li id="subnav04"><a href="../projects/openfire/plugins.jsp">Openfire Plugins</a></li>
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
                    <h1>Downloads</h1> <strong>Beta</strong>
                </div>
                <!-- END body header -->


                <div class="ignite_int_body_padding">
                    <p>
                        Below are links to the current <b>beta</b> releases.
                    </p>
                </div>

             <%
                String openfireBetaVersion = Versions.getVersion("openfire-beta");
                if (openfireBetaVersion != null) {
            %>
                    <!-- BEGIN openfire downloads -->
                    <%@ include file="/includes/download-box-openfire-beta.jspf" %>
                    <!-- END openfire downloads -->
            <%
                }
                String sparkBetaVersion = Versions.getVersion("spark-beta");
                if (sparkBetaVersion != null) {
            %>
                    <!-- BEGIN spark downloads -->
                    <%@ include file="/includes/download-box-spark-beta.jspf" %>
                    <!-- END spark downloads -->
            <%  }
                String smackBetaVersion = Versions.getVersion("smack-beta");
                if (smackBetaVersion != null) {
            %>
                    <!-- BEGIN smack downloads -->
                    <%@ include file="/includes/download-box-smack-beta.jspf" %>
                    <!-- END smack downloads -->
            <%  }
                String xiffBetaVersion = Versions.getVersion("xiff-beta");
                if (xiffBetaVersion != null) {
            %>
                    <!-- BEGIN xiff downloads -->
                    <%@ include file="/includes/download-box-xiff-beta.jspf" %>
                    <!-- END xiff downloads -->
            <%  } %>

            <% if (openfireBetaVersion == null 
                    && sparkBetaVersion == null 
                    && smackBetaVersion == null 
                    && xiffBetaVersion == null) { %>
                <br clear="left"/>
                <div style="width: 100%; padding: 25px; text-align:center">
                    <strong>No beta releases currently available.</strong>
                </div>
            <%  } %>

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
