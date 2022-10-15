<%@ page import="java.text.DecimalFormat,
                 java.io.File,
                 java.util.Arrays,
                 java.util.Comparator,
                 java.io.FileFilter,
                 java.util.Date,
                 java.text.DateFormat,
                 java.text.SimpleDateFormat" %>
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
<title>Spark Nightly Builds</title>
<meta name="body-id" content="downloads" />
<style type="text/css" media="screen">
    @import "../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./">Releases</a></li>
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
                <h1>Downloads</h1> <strong>Spark Nightly Builds</strong>
            </div>
            <!-- END body header -->


            <div class="ignite_int_body_padding">
                <a href="./" class="ignite_back">Back to Downloads</a>
            </div>

            <div>
            <p>
            Below are nightly builds for Spark. Please see the <a href="./">official builds</a>
            page if you're looking for a specific release. 
            </p>

            <p>
            Daily builds are provided for those that require early access to changes before they are officially
            released. These builds are <b>not extensively tested</b>, so most users should use
            <a href="./">official releases</a> instead.
            </p>
            </div>

            <div class="ignite_download_panel ignite_download_source_panel">
                <div class="ignite_download_panel_label">
                    <h4>Binary Builds</h4>
                </div>


<%
    // Binaries
    path = buildsPath + "/spark/dailybuilds/";
    buildDir = new File(path);
    files = buildDir.listFiles(new FileFilter() {
        public boolean accept(File pathname) {
            return pathname.getName().indexOf("_src") == -1;
        }
    });
    if (files != null && files.length > 0) {
        Arrays.sort(files, new FileComparator());
        boolean odd = false;
        for (int i=0; i < (files.length / 13); i++) {
            File file1 = files[13 * i];
            File file2 = files[13 * i + 1];
            File file3 = files[13 * i + 2];
            File file4 = files[13 * i + 3];
            File file5 = files[13 * i + 4];
            File file6 = files[13 * i + 5];
            File file7 = files[13 * i + 6];
            File file8 = files[13 * i + 7];
            File file9 = files[13 * i + 8];
            File file10 = files[13 * i + 9];
            File file11 = files[13 * i + 10];
            File file12 = files[13 * i + 11];
            File file13 = files[13 * i + 12];
            odd = !odd;
    %>
                <div class="<%= (odd ? "ignite_download_item_odd" : "ignite_download_item_even") %>">
                    <span class="ignite_download_item_details">
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file1.getName() %>"><%= file1.getName() %></a> (<%= mbFormat.format(file1.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file2.getName() %>"><%= file2.getName() %></a> (<%= mbFormat.format(file2.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file3.getName() %>"><%= file3.getName() %></a> (<%= mbFormat.format(file3.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file4.getName() %>"><%= file4.getName() %></a> (<%= mbFormat.format(file4.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file5.getName() %>"><%= file5.getName() %></a> (<%= mbFormat.format(file5.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file6.getName() %>"><%= file6.getName() %></a> (<%= mbFormat.format(file6.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file7.getName() %>"><%= file7.getName() %></a> (<%= mbFormat.format(file7.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file8.getName() %>"><%= file8.getName() %></a> (<%= mbFormat.format(file8.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file9.getName() %>"><%= file9.getName() %></a> (<%= mbFormat.format(file9.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file10.getName() %>"><%= file10.getName() %></a> (<%= mbFormat.format(file10.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file11.getName() %>"><%= file11.getName() %></a> (<%= mbFormat.format(file11.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file12.getName() %>"><%= file12.getName() %></a> (<%= mbFormat.format(file12.length()/(1024.0*1024.0)) %> MB)<br />
                        <img src="../images/logo_spark_16x16.gif" alt="" width="17" height="16" border="0"><a href="https://download.igniterealtime.org/spark/dailybuilds/<%= file13.getName() %>"><%= file13.getName() %></a> (<%= mbFormat.format(file13.length()/(1024.0*1024.0)) %> MB)
                    </span>
                    <span class="ignite_download_item_date">
                        <%= dateFormat.format(new Date(file1.lastModified())) %>
                    </span>
                    <span class="ignite_download_item_size">
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
