<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("whack"));
    request.setAttribute("versionDate", Versions.getVersionDate("whack"));
%>
<html>
<head>
    <title>Whack API</title>
    <meta name="body-id" content="projects" />
    <meta name="panel-name" content="whack" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="whack"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="whack" productName="Whack API"
                             version="${version}" versionDate="${versionDate}">
            <p>
                Whack is an Open Source XMPP component library for XMPP components. A pure Java library, it can be
                embedded into your applications to create anything from a full XMPP component to simple XMPP
                integrations such as sending intercepting and acting on certain messages.
            </p>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="whack" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="whack"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
