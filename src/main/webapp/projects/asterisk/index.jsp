<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("asterisk-im"));
    request.setAttribute("versionDate", Versions.getVersionDate("asterisk-im"));
%>
<html>
<head>
<title>Asterisk-IM</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="asterisk" />
<style media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="asterisk-im"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="asterisk" productName="Asterisk-IM"
                             version="${version}" versionDate="${versionDate}"
                             image="../../images/ignite_screenshot_asterisk.gif">
            <p>
                The Asterisk-IM project integrates the <a href="https://www.asterisk.org/" target="_blank">
                Asterisk <abbr title="Private Branch eXchange -- A Phone System">PBX</abbr></a> and Openfire
                XMPP server to create a unified communication platform for telephony and instant messaging.
            </p>
            <p>
                Asterisk-IM is easily deployed as a plugin for <a href="../openfire/">Openfire</a> and is fully
                supported in the <a href="../spark/">Spark</a> IM client.
            </p>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="asterisk" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="asterisk-im"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
