<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Downloads</title>
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
                    <h1>Downloads</h1>
                </header>

                <jsp:directive.include file="/includes/download-box-openfire.jspf" />
                <jsp:directive.include file="/includes/download-box-spark.jspf" />
                <jsp:directive.include file="/includes/download-box-smack.jspf" />
                <jsp:directive.include file="/includes/download-box-tinder.jspf" />
                <jsp:directive.include file="/includes/download-box-whack.jspf" />
                <jsp:directive.include file="/includes/download-box-xiff.jspf" />
                <jsp:directive.include file="/includes/download-box-sparkweb.jspf" />
                
            </article>
        </main>

        <section id="ignite_body_sidebar">
            <jsp:directive.include file="/includes/sidebar_7daySnapshot.jspf" />
            <jsp:directive.include file="/includes/sidebar_install4j.jspf" />
            <jsp:directive.include file="/includes/sidebar_testimonial.jspf" />
        </section>

    </section>

</body>
</html>
