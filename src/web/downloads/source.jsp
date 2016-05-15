<%@ page import="org.jivesoftware.site.Versions, java.io.File, java.text.SimpleDateFormat, java.util.Date, java.text.DecimalFormat"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

<%  String path = request.getContextPath();
    String buildsPath = application.getInitParameter("builds-path");
    DecimalFormat formatter = new DecimalFormat("0.00");
    SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM d, yyyy");

    // Openfire Source
    String openfireVersion = Versions.getVersion("openfire");
    if (openfireVersion == null) {
        openfireVersion = "0.0";
    }

    String openfireBaseDir = buildsPath + "/openfire";
    String ver = openfireVersion.replace('.', '_');
    File openfireSrcZip = new File(openfireBaseDir, "openfire_src_" + ver + ".zip");
    File openfireSrcTar = new File(openfireBaseDir, "openfire_src_" + ver + ".tar.gz");

    String openfireBuildDate = "UNKNOWN";
    if (openfireSrcZip.exists()) {
        openfireBuildDate = dateFormat.format(new Date(openfireSrcZip.lastModified()));
    }

    // Smack Source
    String smackVersion = Versions.getVersion("smack");
    if (smackVersion == null) {
        smackVersion = "0.0";
    }

    String smackBasedir = buildsPath + "/smack";
    String smackVer = smackVersion.replace('.', '_');
    File smackSrcZip = new File(smackBasedir, "smack_src_" + smackVer + ".zip");
    File smackSrcTarGz = new File(smackBasedir, "smack_src_" + smackVer + ".tar.gz");

    String smackBuildDate = "UNKNOWN";
    if (smackSrcZip.exists()) {
        smackBuildDate = dateFormat.format(new Date(smackSrcZip.lastModified()));
    }
    
    // Tinder Source
    String tinderVersion = Versions.getVersion("tinder");
    if (tinderVersion == null) {
        tinderVersion = "0.0";
    }

    String tinderBasedir = buildsPath + "/tinder";
    String tinderVer = tinderVersion.replace('.', '_');
    File tinderSrcZip = new File(tinderBasedir, "tinder_src_" + tinderVer + ".zip");
    File tinderSrcTarGz = new File(tinderBasedir, "tinder_src_" + tinderVer + ".tar.gz");

    String tinderBuildDate = "UNKNOWN";
    if (tinderSrcZip.exists()) {
        tinderBuildDate = dateFormat.format(new Date(tinderSrcZip.lastModified()));
    }

    // Whack Source
    String whackVersion = Versions.getVersion("whack");
    if (whackVersion == null) {
        whackVersion = "0.0";
    }

    String whackBasedir = buildsPath + "/whack";
    String whackVer = whackVersion.replace('.', '_');
    File whackSrcZip = new File(whackBasedir, "whack_src_" + whackVer + ".zip");
    File whackSrcTarGz = new File(whackBasedir, "whack_src_" + whackVer + ".tar.gz");

    String whackBuildDate = "UNKNOWN";
    if (whackSrcZip.exists()) {
        whackBuildDate = dateFormat.format(new Date(whackSrcZip.lastModified()));
    }
%>

<html>
<head>
<title>Source Code</title>
<meta name="body-id" content="downloads" />
<style type="text/css" media="screen">
	@import "../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp">Releases</a></li>
			<li id="subnav02"><a href="source.jsp" class="ignite_subnav_current">Source</a></li>
			<li id="subnav03"><a href="beta.jsp">Beta Releases</a></li>
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
					<h1>Downloads</h1> <strong>Source Code</strong>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_padding">
					<a href="index.jsp" class="ignite_back">Back to Downloads</a>
				</div>
				
				
					<div class="ignite_download_panel ignite_download_source_panel">
						<div class="ignite_download_panel_label">
							<h4>Openfire Source</h4>
						</div>
						<div class="ignite_download_item_odd">
							<span class="ignite_download_item_details">
								<img src="../images/icon_zip.gif" alt="" width="17" height="16" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=openfire/<%= openfireSrcZip.getName() %>"><%= openfireSrcZip.getName() %></a>
							</span>
							<span class="ignite_download_item_date"><%= openfireBuildDate %></span>
							<span class="ignite_download_item_size"><%= formatter.format((double)openfireSrcZip.length()/1024.0/1024.0) %> MB</span>
						</div>
						<div class="ignite_download_item_even">
							<span class="ignite_download_item_details">
								<img src="../images/icon_zip.gif" alt="" width="17" height="18" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=openfire/<%= openfireSrcTar.getName() %>"><%= openfireSrcTar.getName() %></a>
							</span>
							<span class="ignite_download_item_date"><%= openfireBuildDate %></span>
							<span class="ignite_download_item_size"><%= formatter.format((double)openfireSrcTar.length()/1024.0/1024.0) %> MB</span>
						</div>
                        <div class="ignite_download_panel_label">
							<h4>Tinder Source</h4>
						</div>
						<div class="ignite_download_item_odd">
							<span class="ignite_download_item_details">
								<img src="../images/icon_zip.gif" alt="" width="17" height="16" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=tinder/<%= tinderSrcZip.getName() %>"><%= tinderSrcZip.getName() %></a>
							</span>
							<span class="ignite_download_item_date"><%= tinderBuildDate %></span>
							<span class="ignite_download_item_size"><%= formatter.format((double)tinderSrcZip.length()/1024.0/1024.0) %> MB</span>
						</div>
						<div class="ignite_download_item_even">
							<span class="ignite_download_item_details">
								<img src="../images/icon_zip.gif" alt="" width="17" height="18" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=tinder/<%= tinderSrcTarGz.getName() %>"><%= tinderSrcTarGz.getName() %></a>
							</span>
							<span class="ignite_download_item_date"><%= tinderBuildDate %></span>
							<span class="ignite_download_item_size"><%= formatter.format((double)tinderSrcTarGz.length()/1024.0/1024.0) %> MB</span>
                        </div>
						<div class="ignite_download_panel_label">
							<h4>Whack Source</h4>
						</div>
						<div class="ignite_download_item_odd">
							<span class="ignite_download_item_details">
								<img src="../images/icon_zip.gif" alt="" width="17" height="16" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=whack/<%= whackSrcZip.getName() %>"><%= whackSrcZip.getName() %></a>
							</span>
							<span class="ignite_download_item_date"><%= whackBuildDate %></span>
							<span class="ignite_download_item_size"><%= formatter.format((double)whackSrcZip.length()/1024.0/1024.0) %> MB</span>
						</div>
						<div class="ignite_download_item_even">
							<span class="ignite_download_item_details">
								<img src="../images/icon_zip.gif" alt="" width="17" height="18" border="0">
								<a href="<%= path %>/downloads/download-landing.jsp?file=whack/<%= whackSrcTarGz.getName() %>"><%= whackSrcTarGz.getName() %></a>
							</span>
							<span class="ignite_download_item_date"><%= whackBuildDate %></span>
							<span class="ignite_download_item_size"><%= formatter.format((double)whackSrcTarGz.length()/1024.0/1024.0) %> MB</span>
                        </div>
                    </div>

		<p>You can access the source code of all the Ignite Realtime projects on the <a href="https://github.com/igniterealtime">Github - Ignite Realtime</a></p> 

        <!--        <p>There are many ways to view the source code for the Ignite Realtime
                    Open Source projects:</p>

                <div class="ignite_source_table">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tbody>
                            <tr>
                                <td width="1%" class="item" valign="top">
                                    Github
                                </td>
                                <td width="99%">
                                    <p>Openfire:<br />
 git clone https://github.com/igniterealtime/Openfire.git</p>
                                    <p>Smack:<br />
 git clone https://github.com/igniterealtime/Smack.git</p>
                                    <p>Spark:<br />
 git clone https://github.com/igniterealtime/Spark.git</p>
                                </td>
                            </tr>
                        <tr>
                            <td width="1%" rowspan="3" class="item finalRow" valign="top">
                                Other
                            </td>
                            <td width="99%">
                                <a href="index.jsp">Binary Builds</a>
                            </td>
                        </tr>
                        <tr>
                            <td width="99%">
                                <a href="nightly_openfire.jsp">Openfire Nightly Builds</a>
                            </td>
                        </tr>
                        <tr>
                            <td width="99%">
                                <a href="nightly_smack.jsp">Smack Nightly Builds</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>Bugs/Issues</h4>

            <p>To view and report bugs and issues, please view our
                <a href="https://igniterealtime.org/issues/">issue tracker</a>.
                Specific projects include:
                <a href="https://igniterealtime.org/issues/browse/OF">Openfire</a>,
                <a href="https://igniterealtime.org/issues/browse/SPARK">Spark</a>,
                <a href="https://igniterealtime.org/issues/browse/SW">SparkWeb</a>,
                <a href="https://igniterealtime.org/issues/browse/SMACK">Smack API</a>,
                <a href="https://igniterealtime.org/issues/browse/TINDER">Tinder API</a>,
                <a href="https://igniterealtime.org/issues/browse/WHACK">Whack API</a>,
                <a href="https://igniterealtime.org/issues/browse/XIFF">XIFF</a>,
                <a href="https://igniterealtime.org/issues/browse/GATE">Gateway Plugin</a>, and
                <a href="https://igniterealtime.org/issues/browse/PHONE">Asterisk-IM</a>.
            </p>

            <br>
            <br> -->

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
