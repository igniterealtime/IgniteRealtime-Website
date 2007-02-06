<%@ page import="java.text.DecimalFormat,
                 java.io.File,
                 java.util.Arrays,
                 java.util.Comparator,
                 java.io.FileFilter,
                 java.util.Date,
                 java.text.DateFormat,
                 java.text.SimpleDateFormat" %>
<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>


<%!
    private static class FileComparator implements Comparator {
        private String clean(String in) {
            int pos = in.indexOf("src_");
            if (pos > -1) {
                return in.substring(0,pos) + in.substring(pos+"src_".length(), in.length());
            }
            return in;
        }
        public int compare(Object o1, Object o2) {
            String s1 = ((File)o1).getName();
            String s2 = ((File)o2).getName();
            return -clean(s1).compareTo(clean(s2));
        }
    }
%>

<%
    DecimalFormat mbFormat = new DecimalFormat("#0.00");
    DateFormat dateFormat = new SimpleDateFormat("MMMM dd, yyyy");

    String buildsPath = (String)application.getInitParameter("builds-path");
    String path = null;
    File buildDir = null;
    File[] files = null;
%>

<html>
<head>
<title>Smack API Nightly Builds</title>
<meta name="body-id" content="downloads" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp">Releases</a></li>
			<li id="subnav02"><a href="source.jsp">Source</a></li>
			<li id="subnav03"><a href="beta.jsp">Beta Releases</a></li>
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
                <h1>Downloads</h1> <strong>Smack API Nightly Builds</strong>
            </div>
            <!-- END body header -->


            <div class="ignite_int_body_padding">
                <a href="index.jsp" class="ignite_back">Back to Downloads</a>
            </div>

            <div>
                <p>
                Below are nightly builds for the Smack API. Please see the <a href="index.jsp">official builds</a>
                page if you're looking for a specific release. Each day has 2 builds -- a GZIP and ZIP release
                for the binary builds.
                </p>

                <p>
                Daily builds are provided for those that require early access to changes before they are officially
                released. These builds are <b>not extensively tested</b>, so most users should use
                <a href="index.jsp">official releases</a> instead.
                </p>
            </div>

            <div class="ignite_download_panel ignite_download_source_panel">
                <div class="ignite_download_panel_label">
                    <h4>Binary Builds</h4>
                </div>

                <%
                    // Binaries
                    path = buildsPath + "/smack/dailybuilds/";
                    buildDir = new File(path);
                    files = buildDir.listFiles();
                    if (files != null && files.length > 0) {
                        Arrays.sort(files, new FileComparator());
                        boolean odd = false;
                        for (int i=0; i< (files.length / 2); i++) {
                            File file1 = files[2 * i];
                            File file2 = files[2 * i + 1];
                            if (i%2 == 0) {
                                odd = !odd;
                            }
                    %>
                        <div class="<%= (odd ? "ignite_download_item_odd" : "ignite_download_item_even") %>">
                            <span class="ignite_download_item_details">
                                <img src="/images/icon_zip.gif" alt="" width="17" height="16" border="0">
                                <a href="/builds/smack/dailybuilds/<%= file1.getName() %>"><%= file1.getName() %></a><br>
                                <img src="/images/icon_zip.gif" alt="" width="17" height="16" border="0">
                                <a href="/builds/smack/dailybuilds/<%= file2.getName() %>"><%= file2.getName() %></a>
                            </span>
                            <span class="ignite_download_item_date">
                                <%= dateFormat.format(new Date(file1.lastModified())) %>
                            </span>
                            <span class="ignite_download_item_size">
                                <%= mbFormat.format(file1.length()/(1024.0*1024.0)) %> MB<br>
                                <%= mbFormat.format(file2.length()/(1024.0*1024.0)) %> MB
                            </span>
                        </div>

                    <%  } %>

                <%  } %>
					<br>
					<br>
					</div>

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