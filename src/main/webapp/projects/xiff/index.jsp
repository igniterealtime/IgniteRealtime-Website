<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("version", Versions.getVersion("xiff"));
    request.setAttribute("versionDate", Versions.getVersionDate("xiff"));
%>
<html>
<head>
    <title>XIFF API</title>
    <meta name="body-id" content="projects" />
    <meta name="panel-name" content="xiff" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="xiff"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <div class="ignite_project_banner_warning">
            <h1>Discontinued</h1>
            <p>
                This project uses Adobe Flash, a technology that has been discontinued and sees little to no active
                deployment nowadays. As a result, our XIFF project has also been discontinued.
            </p>
        </div>

        <ir:heroproductpanel productId="xiff" productName="XIFF"
                             version="${version}" versionDate="${versionDate}">
            <p>
                XIFF is an Open Source Flash library for instant messaging and presence clients using the XMPP protocol.
                XIFF includes an extension architecture that makes it easy to add functionality for additional protocol
                extensions, or even your own special-needs extensions. There are quite a few extensions already included
                in the library, giving it support for
                XML-RPC over XMPP (<a href="https://xmpp.org/extensions/xep-0009.html">XEP-0009</a>),
                Multi-user conferencing (<a href="https://xmpp.org/extensions/xep-0045.html">XEP-0045</a>),
                Service browsing (<a href="https://xmpp.org/extensions/xep-0030.html">XEP-0030</a>),
                and XHTML message support (<a href="https://xmpp.org/extensions/xep-0009.html">XEP-0071</a>).
            </p>
        </ir:heroproductpanel>

        <div id="ignite_home_body_leftcol">
            <ir:blogposts tag="xiff" max="5" feedManager="${feedManager}"/>
        </div>

    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="xiff"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
