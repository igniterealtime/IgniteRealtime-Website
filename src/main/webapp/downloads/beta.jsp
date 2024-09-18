<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<%
    request.setAttribute("openfireBeta", Versions.getVersion("openfire-beta"));
    request.setAttribute("sparkBeta", Versions.getVersion("spark-beta"));
    request.setAttribute("smackBeta", Versions.getVersion("smack-beta"));
    request.setAttribute("xiffBeta", Versions.getVersion("xiff-beta"));
%>
<html>
<head>
<title>Beta Downloads</title>
<meta name="body-id" content="downloads" />
<style media="screen">
    @import "../styles/interior.css";
</style>
</head>
<body>

    <nav id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./">Releases</a></li>
            <li id="subnav02"><a href="source.jsp">Source</a></li>
            <li id="subnav03"><a href="beta.jsp" class="ignite_subnav_current">Beta Releases</a></li>
            <li id="subnav04"><a href="../projects/openfire/plugins.jsp">Openfire Plugins</a></li>
        </ul>
    </nav>

    <section id="ignite_body">

        <main id="ignite_body_leftcol">
            <article id="ignite_int_body">

                <header id="ignite_body_header">
                    <h1>Downloads</h1> <strong>Beta</strong>
                </header>

                <p class="ignite_int_body_padding">
                    Below are links to the current <b>beta</b> releases.
                </p>
                <c:if test="${not empty openfireBeta}">
                    <jsp:directive.include file="/includes/download-box-openfire-beta.jspf" />
                </c:if>
                <c:if test="${not empty sparkBeta}">
                    <jsp:directive.include file="/includes/download-box-spark-beta.jspf" />
                </c:if>
                <c:if test="${not empty smackBeta}">
                    <jsp:directive.include file="/includes/download-box-smack-beta.jspf" />
                </c:if>
                <c:if test="${not empty xiffBeta}">
                    <jsp:directive.include file="/includes/download-box-xiff-beta.jspf" />
                </c:if>
                <c:if test="${empty openfireBeta and empty sparkBeta and empty smackBeta and empty xiffBeta}">
                    <br clear="left"/>
                    <div style="width: 100%; padding: 25px; text-align:center">
                        <strong>No beta releases currently available.</strong>
                    </div>
                </c:if>

            </article>
        </main>

        <section id="ignite_body_sidebar">
            <jsp:directive.include file="/includes/sidebar_7daySnapshot.jspf" />
            <jsp:directive.include file="/includes/sidebar_testimonial.jspf" />
        </section>

    </section>

</body>
</html>
