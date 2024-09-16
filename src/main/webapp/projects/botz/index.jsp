<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("botz"));
    request.setAttribute("versionDate", Versions.getVersionDate("botz"));
%>
<html>
<head>
    <title>Botz</title>
    <meta name="body-id" content="projects" />
    <meta name="panel-name" content="botz" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="botz"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="botz" productName="Botz"
                             version="${version}" versionDate="${versionDate}">
            <p>
                The Botz library adds to the already rich and extensible Openfire with the ability to create
                internal user bots. With the Botz library, programmers may choose to develop a user bot to run as a
                service bearing myservice@example.com as its JID. To Openfire, the user bot is just like other
                (human) users.
            </p>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="botz" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="botz"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
