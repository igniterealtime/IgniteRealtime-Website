<%@ page import="org.jivesoftware.site.FeedManager"%>
<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    String baseUrl = config.getServletContext().getInitParameter("discourse_baseurl");
    if ( baseUrl == null || baseUrl.isEmpty() )
    {
        baseUrl = "https://discourse.igniterealtime.org/";
    }

    request.setAttribute("baseUrl", baseUrl);
    request.setAttribute("feedManager", FeedManager.getInstance());
%>
<html>
<head>
<title>A real time collaboration community site</title>
<meta name="body-id" content="home" />
<meta name="panel-name" content="home" />
<style media="screen">
    @import "styles/interior.css";
</style>
<link rel="me" href="https://toot.igniterealtime.org/@news"/>
</head>
<body>

<section id="ignite_body">
        
    <main id="ignite_body_leftcol">

        <article id="ignite_int_body">

            <header id="ignite_body_header">
                <h1>Open Realtime</h1> <strong>Open Source Real-Time Communication</strong>
            </header>

            <div class="ignite_int_body_padding">

                <h2 class="larger">Our Community</h2>

                <p>
                    Ignite Realtime is an Open Source community composed of end-users, developers and service providers
                    around the world who are interested in applying innovative, open-standards-based Real Time
                    Collaboration to their businesses. We're aimed at disrupting proprietary, non-open
                    standards-based systems and invite you to participate in what's already one of the biggest
                    and most active Open Source communities anywhere.
                </p>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); grid-gap:18px">

                    <div class="ignite_project_big ignite_project_big_gradient">
                        <div class="ignite_project_content">
                            <a href="about/im-solutions.jsp" class="ignite_project_turnkey"><h1>Turn-key IM Solutions</h1></a>
                            <p>Our client and server products allow you set up a cross-platform, real-time collaboration server optimized for business and organizations in moments!</p>
                            <p>Highly customizable through plugins and configuration, our clients and servers easily integrate in your pre-existing ICT infrastructure.</p>
                            <p><a href="about/im-solutions.jsp" class="ignite_link_arrow"><strong>Learn More</strong></a></p>
                        </div>
                    </div>

                    <div class="ignite_project_big ignite_project_big_gradient">
                        <div class="ignite_project_content">
                            <a href="about/dev-platform.jsp" class="ignite_project_dev"><h1>Development Platform</h1></a>
                            <p>Our server product and libraries are exceptionally well suited as a development platform for your custom instant messaging or data sharing solution!</p>
                            <p>The software that we produce is based on well established open standards, has extensive extension APIs and come with a great deal of pre-existing functionality - ideal to form the basis of your project!</p>
                            <p><a href="about/dev-platform.jsp" class="ignite_link_arrow"><strong>Learn More</strong></a></p>
                        </div>
                    </div>

                </div>

                <hr/>

                <img src="images/ignite_about-circlegraph.png" alt="" width="179" height="210" border="0" align="right" style="margin-left: 10px;">

                <h2 class="larger">Open Source Philosophy</h2>

                <p>
                    We create Open Source software because we know open, collaborative minds can improve the
                    software landscape. We believe in the potential of the XMPP protocol and we welcome ways
                    to increase its adoption. We put tremendous value on the involvement of Igniterealtime's
                    developer and user community--their continuous feedback, QA, and development efforts
                    help steer our development path.
                </p>

                <p>
                    We are committed to live out the values of the Open Source movement to the best of our
                    abilities, to act responsibly and in the best interests of our community and to be highly
                    responsive to the needs of the community and communicate proactively.
                </p>

                <h2 class="larger">The XMPP Protocol</h2>

                <p>
                    XMPP (formerly Jabber) is the leading open standard for presence and
                    real-time messaging. Since 2004, it's been an approved standard of the IETF
                    (the same organization that standardized email and World Wide Web protocols).
                    A rich set of <a href="https://xmpp.org/extensions/">extensions</a> to
                    the protocol are maintained by the <a href="https://xmpp.org/about/xmpp-standards-foundation.html">XMPP Standards Foundation</a>.
                    Today, XMPP is used by leading companies, millions of users worldwide and
                    is the best choice for open real-time collaboration.
                </p>
                <p>
                    Open standards are critical in order to achieve a completely federated
                    environment where real time collaboration software works seamlessly
                    together. This will drive the medium forward as a unified productivity tool
                    and provide the greatest benefit to end users. The hundreds of interoperable
                    software products that use XMPP prove the reality of this vision.
                </p>
                <p>
                    Ignite Realtime furthers XMPP through best of breed protocol implementations,
                    development of new protocol extensions, and participation to the XMPP Standards Foundation (XSF).
                </p>
                <p>
                    <a href="support/articles/whitepaper_xmpp.jsp" class="ignite_link_arrow"><strong>Learn More</strong></a>
                </p>
            </div>

        </article>

    </main>

    <section id="ignite_body_sidebar">

        <jsp:include page="/includes/sidebar_forumactivity.jsp">
            <jsp:param name="discourseCategory" value="/c/blogs/ignite-realtime-blogs"/>
            <jsp:param name="headerText" value="Latest News"/>
            <jsp:param name="hideAuthor" value="true"/>
        </jsp:include>

        <jsp:include page="/includes/sidebar_projects.jspf"/>

        <jsp:include page="/includes/sidebar_forumactivity.jsp">
            <jsp:param name="discourseCategory" value="/latest"/>
            <jsp:param name="headerText" value="In the community"/>
            <jsp:param name="subHeaderText" value="Recent Discussions"/>
            <jsp:param name="sidebarClasses" value="sidebar_light sidebar_gray"/>
        </jsp:include>



    <!--   <h4>Whitepapers</h4>
                <div class="articles"><a href="about/jive_caseforim_wp.pdf">Why Your Business Should Use Enterprise Instant Messaging Now</a></div>
                <div class="articles"><a href="about/jive_xmpp_wp.pdf">XMPP: The Protocol for Open, Extensible Instant Messaging</a></div>
                <div class="articles"><a href="about/jive_bestpractices_wp.pdf">Building a Successful Online Community with Jive Forums</a></div>
                <div class="articles"><a href="about/OpenfireScalability.pdf">Openfire Scalability Test Results</a></div>-->

        <jsp:include page="/includes/sidebar_testimonial.jspf"/>

            
    </section>

</section>

</body>
</html>
