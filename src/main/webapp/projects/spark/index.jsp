<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("spark"));
    request.setAttribute("versionDate", Versions.getVersionDate("spark"));
%>
<html>
<head>
    <title>Spark IM Client</title>
    <meta name="body-id" content="projects" />
    <meta name="panel-name" content="spark" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="spark"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="spark" productName="Spark"
                             version="${version}" versionDate="${versionDate}"
                             image="../../images/ignite_projects_spark_ss.gif">
            <p>
                Spark is an Open Source, cross-platform IM client optimized for businesses and organizations. It
                features built-in support for group chat, telephony integration, and strong security. It also offers a
                great end-user experience with features like in-line spell checking, group chat room bookmarks, and
                tabbed conversations.
            </p>

            <p>
                Combined with the <a href="../../projects/openfire/">Openfire</a> server, Spark is the easiest and best
                alternative to using un-secure public IM networks.
            </p>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="spark" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="spark"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
