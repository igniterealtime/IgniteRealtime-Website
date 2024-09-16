<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("tinder"));
    request.setAttribute("versionDate", Versions.getVersionDate("tinder"));
%>
<html>
<head>
    <title>Tinder API</title>
    <meta name="body-id" content="projects" />
    <meta name="panel-name" content="tinder" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="tinder"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="tinder" productName="Tinder API"
                             version="${version}" versionDate="${versionDate}">
            <p>
                Tinder is a Java based XMPP library, providing an implementation for XMPP stanzas and components.
            </p>
            <p>
                Tinder's origins lie in code that's shared between Jive Software's Openfire and Whack implementations.
                The implementation that's provided in Tinder hasn't been written again "from scratch". Instead, code has
                moved from the Openfire and Whack projects into Tinder, preserving all the existing features and
                functionality.
            </p>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="tinder" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="tinder"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
