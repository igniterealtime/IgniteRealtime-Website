<%@ page import="java.io.File,
                 java.io.FileFilter,
                 java.text.DecimalFormat,
                 java.time.LocalDate,
                 java.time.format.DateTimeFormatter" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.function.Function" %>
<%@ page import="java.util.regex.Matcher" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>


<%!
    private static class FileComparator implements Comparator<File> {
        private String clean(String in) {
            int pos = in.indexOf("src_");
            if (pos > -1) {
                return in.substring(0,pos) + in.substring(pos+"src_".length(), in.length());
            }
            return in;
        }
        public int compare(File o1, File o2) {
            String s1 = o1.getName();
            String s2 = o2.getName();
            return -clean(s1).compareTo(clean(s2));
        }
    }
%>

<%
    DecimalFormat mbFormat = new DecimalFormat("#0.00");

    String buildsPath = (String)application.getInitParameter("builds-path");
    String path = null;
    File buildDir = null;
%>

<html>
<head>
<title>Openfire Nightly Builds</title>
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
                <h1>Downloads</h1> <strong>Openfire Nightly Builds</strong>
            </div>
            <!-- END body header -->


            <div class="ignite_int_body_padding">
                <a href="index.jsp" class="ignite_back">Back to Downloads</a>
            </div>

            <div>
            <p>
            Below are nightly builds for Openfire.
            Please see the <a href="index.jsp">official builds</a>
            page if you're looking for a specific release. Each day has 3 builds:</p>
            <ul>
             <li>generic binary build in gzip compressed tar format (.tar.gz)</li>
             <li>generic binary build in zip format (.zip)</li>
             <li>binary build installer for Ubuntu/Debian (.deb)</li>
            </ul>

    <p>If you are looking for the latest source code, please see our
    <a href="https://github.com/Igniterealtime/Openfire">GitHub Repository</a>.</p>


            <p>
            Daily builds are provided for those that require early access to
            changes before they are officially
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
    path = buildsPath + "/openfire/dailybuilds/";
    buildDir = new File(path);
    File[] allFiles = buildDir.listFiles( new FileFilter()
    {
        @Override
        public boolean accept( File pathname )
        {
            return !pathname.getName().contains( "_src" );
        }
    } );
    boolean odd = false;
    if (allFiles != null)
    {
        // Group and sort by date (as denoted in the filename).
        final Pattern datePattern = Pattern.compile( "([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})");
        final SortedMap<String, List<File>> filesByDate = new TreeMap<>( Collections.reverseOrder() );
        filesByDate.putAll(
            Arrays.stream( allFiles )
                .sorted( new FileComparator() )
                .collect( Collectors.groupingBy( new Function<File, String>()
                {
                    @Override
                    public String apply( File file )
                    {
                        final Matcher matcher = datePattern.matcher( file.getName() );
                        if ( matcher.find() )
                        {
                            return matcher.group( 1 );
                        }
                        else
                        {
                            return "unknown date";
                        }
                    }
            } ) )
        );

        // Print all date-entries.
        for ( Map.Entry<String, List<File>> entry : filesByDate.entrySet() )
        {
            final String date = entry.getKey();
            final List<File> files = entry.getValue();
            files.sort( new FileComparator() );

            odd = !odd;

    %>
                <div class="<%= (odd ? "ignite_download_item_odd" : "ignite_download_item_even") %>">
                    <table border="0" width="100%">
    <%
            final String formattedDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd" ) ).format( DateTimeFormatter.ofPattern( "MMMM dd, yyyy" ) );
            boolean isFirst = true;
            for ( final File file : files )
            {
                String icon = "../images/icon_zip.gif";
                if ( file.getName().toLowerCase().endsWith( ".deb" ) )
                {
                    icon = "../images/icon_debian.gif";
                }
                if ( file.getName().toLowerCase().endsWith( ".rpm" ) )
                {
                    icon = "../images/icon_linux.gif";
                }
                if ( file.getName().toLowerCase().endsWith( ".exe" ) )
                {
                    icon = "../images/icon_win.gif";
                }
    %>
                        <tr>
                            <td width="1%"><img src="<%= icon %>" alt="" width="17" height="16" border="0"></td>
                            <td>
                                <a href="http://download.igniterealtime.org/openfire/dailybuilds/<%= file.getName() %>"><%= file.getName() %></a></td>
                            <% if ( isFirst ) {
                                isFirst = false;
                            %>
                            <td rowspan="<%= files.size() %>"><%= formattedDate %></td>
                            <% } %>
                            <td style="text-align:right;"><%= mbFormat.format(file.length()/(1024.0*1024.0)) %> MB</td>
                        </tr>
    <%
            }
    %>
                    </table>
                </div>
    <%
        }
    }
    %>

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