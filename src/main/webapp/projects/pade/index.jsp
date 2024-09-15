<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("pade"));
    request.setAttribute("versionDate", Versions.getVersionDate("pade"));
%>
<html>
<head>
<title>Pade</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="pade" />
<style media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="pade"/>
</jsp:include>

<section id="ignite_body">
        
    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="pade" productName="Pàdé"
                             version="${version}" versionDate="${versionDate}"
                             image="images/pade_contacts.png">
            <p>Pàdé is the Yoruba word for "Meet". It is a unified real-time collaboration client optimized for business and organizations implemented as a cross-platform browser extension.</p>
            <ul>
                <li>Converse.js for XMPP chat/groupchat with Openfire</li>
                <li>Jitsi Meet for SFU-based WebRTC audio/video conferencing, screen share and real-time application collaboration with Jitsi Video-bridge.</li>
                <li>CTXPhone for SIP based telephony and MCU audio/video conferencing with FreeSWITCH.</li>
            </ul>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="pade" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="pade"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
