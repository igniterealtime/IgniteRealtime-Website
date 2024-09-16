<%@ page import="java.io.File" %>
<%@ page import="java.time.LocalDate" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.regex.Matcher" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="java.time.ZoneId" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%!
    private static class FileComparator implements Comparator<File> {
        private String clean(String in) {
            int pos = in.indexOf("src_");
            if (pos > -1) {
                return in.substring(0,pos) + in.substring(pos+"src_".length());
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
<html>
<head>
<title>Spark Nightly Builds</title>
<meta name="body-id" content="downloads" />
<style media="screen">
    @import "../styles/interior.css";
</style>
</head>
<body>

    <nav id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./" class="ignite_subnav_current">Releases</a></li>
            <li id="subnav02"><a href="source.jsp">Source</a></li>
            <li id="subnav03"><a href="beta.jsp">Beta Releases</a></li>
            <li id="subnav04"><a href="../projects/openfire/plugins.jsp">Openfire Plugins</a></li>
        </ul>
    </nav>

    <section id="ignite_body">

        <main id="ignite_body_leftcol">
            <article id="ignite_int_body">

                <header id="ignite_body_header">
                    <h1>Downloads</h1> <strong>Spark Nightly Builds</strong>
                </header>

                <div class="ignite_int_body_padding">
                    <a href="./" class="ignite_back">Back to Downloads</a>
                </div>

                <p>
                    Below are nightly builds for Spark. Please see the <a href="./">official builds</a>
                    page if you're looking for a specific release.
                </p>

                <p>
                    Daily builds are provided for those that require early access to changes before they are officially
                    released. These builds are <b>not extensively tested</b>, so most users should use
                    <a href="./">official releases</a> instead.
                </p>

                <div class="ignite_download_panel ignite_download_source_panel">
                    <div class="ignite_download_panel_label">
                        <h4>Binary Builds</h4>
                    </div>


<%
    String buildsPath = application.getInitParameter("builds-path");

    // Binaries
    String path = buildsPath + "/spark/dailybuilds/";
    File buildDir = new File(path);
    File[] allFiles = buildDir.listFiles(pathname -> !pathname.getName().contains( "_src" ));
    if (allFiles != null && allFiles.length > 0) {
        // Group and sort by date (as denoted in the filename).
        final Pattern datePattern = Pattern.compile( "([0-9]{4}[0-9]{2}[0-9]{2})");
        final SortedMap<String, List<File>> filesByDate = new TreeMap<>( Collections.reverseOrder() );
        filesByDate.putAll(
            Arrays.stream( allFiles )
                .filter(File::isFile)
                .sorted( new FileComparator() )
                .collect( Collectors.groupingBy(file -> {
                    final Matcher matcher = datePattern.matcher( file.getName() );
                    if ( matcher.find() ) {
                        return matcher.group( 1 );
                    } else {
                        return "unknown date";
                    }
                }) )
        );

        // Print all date-entries.
        for ( Map.Entry<String, List<File>> entry : filesByDate.entrySet() )
        {
            final String date = entry.getKey();
            final List<File> files = entry.getValue();
            files.sort( new FileComparator() );
    %>
                <div class="ignite_download_item">
    <%
        request.setAttribute("buildDate", Date.from(LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyyMMdd")).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        request.setAttribute("files", files);
    %>
                    <c:forEach var="file" items="${files}" varStatus="varStatus">
                        <span class="ignite_download_item_details">
                            <c:choose>
                                <c:when test="${file.name.toLowerCase().endsWith('.deb')}">
                                    <img src="../images/icon_debian.gif" alt="" width="17" height="16">
                                </c:when>
                                <c:when test="${file.name.toLowerCase().endsWith('.rpm')}">
                                    <img src="../images/icon_linux.gif" alt="" width="17" height="16">
                                </c:when>
                                <c:when test="${file.name.toLowerCase().endsWith('.exe')}">
                                    <img src="../images/icon_win.gif" alt="" width="17" height="16">
                                </c:when>
                                <c:when test="${file.name.toLowerCase().endsWith('.msi')}">
                                    <img src="../images/icon_win.gif" alt="" width="17" height="16">
                                </c:when>
                                <c:when test="${file.name.toLowerCase().endsWith('.dmg')}">
                                    <img src="../images/icon_macosx.gif" alt="" width="17" height="16">
                                </c:when>
                                <c:otherwise>
                                    <img src="../images/icon_zip.gif" alt="" width="17" height="16">
                                </c:otherwise>
                            </c:choose>
                            <a href="https://download.igniterealtime.org/spark/dailybuilds/<c:out value="${file.name}"/>"><c:out value="${file.name}"/></a><br />
                        </span>
                        <span class="ignite_download_item_date">
                            <c:if test="${varStatus.first}">
                                <fmt:formatDate type="date" dateStyle="long" value="${buildDate}"/>
                            </c:if>
                        </span>
                        <span class="ignite_download_item_size">
                            <fmt:formatNumber type="number" pattern="#0.00" value="${file.length()/(1024.0*1024.0)}" /> MB
                        </span>
                    </c:forEach>
                </div>
    <%
        }
    } else {
    %>
                    <div style="width: 100%; padding: 25px; text-align:center">
                        <strong>No nightly builds currently available.</strong>
                    </div>
    <% } %>
                    <br>
                </div>
            </article>
        </main>

        <section id="ignite_body_sidebar">
            <jsp:directive.include file="/includes/sidebar_48hrsnapshot.jspf" />
            <jsp:directive.include file="/includes/sidebar_testimonial.jspf" />
        </section>

    </section>

</body>
</html>
