<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("openfire"));
    request.setAttribute("versionDate", Versions.getVersionDate("openfire"));
%>
<html>
<head>
<title>Openfire Server</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="openfire" />
<style media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="openfire"/>
</jsp:include>

<section id="ignite_body">
        
    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="openfire" productName="Openfire"
                      version="${version}" versionDate="${versionDate}"
                      image="../../images/ignite_screenshot_openfire3.gif">
            <p>
                Openfire is a real time collaboration (RTC) server licensed under the Open Source Apache License. It
                uses the only widely adopted open protocol for instant messaging, XMPP Openfire is incredibly easy
                to setup and administer, but offers rock-solid security and performance.
            </p>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="openfire" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="openfire"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
