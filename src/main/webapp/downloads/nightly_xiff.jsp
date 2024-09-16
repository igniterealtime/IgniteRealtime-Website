<%@ page import="java.io.File" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="java.util.regex.Matcher" %>
<%@ page import="java.util.function.Function" %>
<%@ page import="java.time.LocalDate" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.time.ZoneId" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<html>
<head>
    <title>XIFF Nightly Builds</title>
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
                <h1>Downloads</h1> <strong>XIFF Nightly Builds</strong>
            </header>

            <div class="ignite_int_body_padding">
                <a href="./" class="ignite_back">Back to Downloads</a>
            </div>

            <p>
                Below are nightly builds for XIFF. Please see the <a href="./">official builds</a>
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
                    String path = buildsPath + "/xiff/dailybuilds/";
                    File buildDir = new File(path);
                    File[] allFiles = buildDir.listFiles();
                    if (allFiles != null && allFiles.length > 0) {
                        // Group and sort by date (as denoted in the filename).
                        final Pattern datePattern = Pattern.compile("([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})");
                        final SortedMap<Date, File> filesByDate = new TreeMap<>(Collections.reverseOrder());
                        filesByDate.putAll(
                            Arrays.stream(allFiles)
                                .collect(Collectors.toMap(file -> {
                                    final Matcher matcher = datePattern.matcher(file.getName());
                                    if (matcher.find()) {
                                        return Date.from(LocalDate.parse(matcher.group(1), DateTimeFormatter.ofPattern("yyyy-MM-dd")).atStartOfDay(ZoneId.systemDefault()).toInstant());
                                    } else {
                                        return new Date(0);
                                    }
                                }, Function.identity()))
                        );

                        request.setAttribute("filesByDate", filesByDate);
                    }
                %>
                <c:choose>
                    <c:when test="${not empty filesByDate}">
                        <c:forEach var="fileByDate" items="${filesByDate.entrySet()}" varStatus="varStatus">
                            <c:set var="buildDate" value="${fileByDate.key}"/>
                            <c:set var="file" value="${fileByDate.value}"/>

                            <div class="ignite_download_item">
                                    <span class="ignite_download_item_details">
                                        <img src="../images/icon_zip.gif" alt="" width="17" height="16">
                                            <a href="https://download.igniterealtime.org/xiff/dailybuilds/<c:out value="${file.name}"/>"><c:out value="${file.name}"/></a>
                                    </span>
                                <span class="ignite_download_item_date">
                                        <fmt:formatDate type="date" dateStyle="long" value="${buildDate}"/>
                                    </span>
                                <span class="ignite_download_item_size">
                                        <fmt:formatNumber type="number" pattern="#0.00" value="${file.length()/(1024.0*1024.0)}" /> MB<br>
                                    </span>
                            </div>
                        </c:forEach>
                    </c:when>
                    <c:otherwise>
                        <div style="width: 100%; padding: 25px; text-align:center">
                            <strong>No nightly builds currently available.</strong>
                        </div>
                    </c:otherwise>
                </c:choose>
                <br>
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
