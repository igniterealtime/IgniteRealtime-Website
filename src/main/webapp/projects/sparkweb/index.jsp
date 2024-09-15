<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("sparkweb"));
    request.setAttribute("versionDate", Versions.getVersionDate("sparkweb"));
%>
<html>
<head>
    <title>SparkWeb IM Client</title>
    <meta name="body-id" content="projects" />
    <meta name="panel-name" content="sparkweb" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="sparkweb"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <div class="ignite_project_banner_warning">
            <h1>Discontinued</h1>
            <p>
                This project uses Adobe Flash, a technology that has been discontinued and sees little to no active
                deployment nowadays. As a result, our SparkWeb project has also been discontinued.
            </p>
        </div>

        <ir:heroproductpanel productId="sparkweb" productName="SparkWeb"
                             version="${version}" versionDate="${versionDate}"
                             image="../../images/ignite_projects_sparkweb_ss.gif">
            <p>
                SparkWeb is an Open Source, Flash based IM web client optimized for businesses and organizations. It
                features built-in support for group chat and strong security. It also offers a great end-user experience
                with features like group chat room bookmarks, and tabbed conversations.
            </p>
            <p>
                <a href="../../sparkweb/">Try it live!</a>
            </p>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="sparkweb" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="sparkweb"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
