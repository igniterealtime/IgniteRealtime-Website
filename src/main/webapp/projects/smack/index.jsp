<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("smack"));
    request.setAttribute("versionDate", Versions.getVersionDate("smack"));
%>
<html>
<head>
<title>Smack API</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="smack" />
<style media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="smack"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="smack" productName="Smack"
                             version="${version}" versionDate="${versionDate}">
            <p>
                Smack is an Open Source XMPP client library for instant messaging and presence. A pure Java library, it
                can be embedded into your applications to create anything from a full XMPP client to simple XMPP
                integrations such as sending notification messages and presence-enabling devices.
            </p>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="smack" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="smack"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
