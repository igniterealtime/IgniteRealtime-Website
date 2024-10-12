<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<html>
<head>
    <title>a real time collaboration community site</title>
    <meta name="body-id" content="home" />
    <meta name="panel-name" content="home" />
    <style media="screen">
        @import "../styles/interior.css";
    </style>
</head>
<body>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <article id="ignite_int_body">

            <header id="ignite_body_header_with_content">
                <h1>Open Realtime <span class="subtitle">Our Projects as Development platforms</span></h1>

                <p>
                    Discover how you can use our products as a platform to launch your idea!
                </p>

            </header>

            <div class="ignite_int_body_padding">

                <h2 class="larger">XMPP</h2>

                <img src="../images/XMPP_logo.svg" alt="XMPP logo" align="right" style="margin-left: 10px; width: 200px; height: 200px"/>

                <p>
                    At the core of most of our projects lies XMPP. XMPP is open, mature, flexible and extensible, making it the protocol of choice for real-time communications over the Internet. It enables the reliable transport of structured data between individuals or applications. The <a href="https://xmpp.org">XMPP Standards Foundation</a> manages the development of the XMPP protocols.
                </p>

                <p>
                    Numerous mission-critical business applications use XMPP, including chat and IM, network management and financial trading - and so could yours. With inherent security features and support for cross-domain server federation, XMPP is more than able to meet the needs of the most demanding environments.
                </p>

                <p>
                    You can find more information on XMPP in our whitepaper called <a href="../support/articles/whitepaper_xmpp.jsp">"XMPP: The Protocol for Open, Extensible Instant Messaging"</a> or at the website of the <a href="https://xmpp.org">XMPP Standards Foundation</a>.
                </p>

                <h2 class="larger">Client-oriented Development</h2>

                <p>
                    <strong><a href="./projects/smack/">Smack</a></strong> is an Open Source XMPP client library for instant messaging and presence. A library for Android and Java, it can be embedded into your applications to create anything from a full XMPP client to simple XMPP integrations such as sending notification messages and presence-enabling devices.
                </p>

                <p>
                    Smack is modular by design, allowing developers to pick and choose what functionality they want to include in their application. Through this mechanism, alternative implementations are made available for some functionality, allowing for the best possible fit in your environment. Furthermore, many Smack modules can be replaced by custom implementations: the modular design allows you to tailor Smack to your needs.
                </p>

                <h2 class="larger">Server-oriented Development</h2>

                <p>
                    Our <strong><a href="../projects/openfire/">Openfire</a></strong> server is a real time collaboration (RTC) server licensed under the open source Apache License. Not only can it act as a Turn-key IM solution, it also forms a quite capable development platform.
                </p>

                <p>
                    Many organisations have launched their proprietary instant messaging solution based on the Openfire platform. This often starts with using Openfire as an off-the-shelf component, that is used by purpose-built clients. Openfire's exceptional extensibility, with <a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/index.html#dataprovider-development">fully customizable authentication, group, user and roster providers</a>, a powerful <a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/plugin-dev-guide.html">plugin architecture</a> and excellent <a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/protocol-support.html">protocol support</a> allow for quick and easy server-sided implementations of new features and functionality. Its <a href="../projects/openfire/plugin-archive.jsp?plugin=restAPI">REST API</a> is another common source of focus for integration.
                </p>

                <p>
                    With its embedded webserver, flexible plugin infrastructure, rich database support and support for features like Publish/Subscribe, Openfire is capable of moving beyond the traditional instant messaging space. If your product depends on reliable exchange of structured data (which could range from chat messages to IOT-like use-cases), Openfire may offer be good fit to your needs. Read, for example, <a href="../support/articles/xmpp_network_graph.jsp">this article on creating a live network graphing solution</a>, using XMPP and Openfire.
                </p>

                <h2 class="larger">Mature & Reliable</h2>

                <p>
                    Most of our client and server-sided platforms have a history that go back two decades. It is software that stood the test of time. It has been proven in the field to be secure and reliable, and actively maintained by an enthusiastic community of professional software developers.
                </p>

                <h2 class="larger">Professional Support</h2>

                <p>
                    Do you seek help with your project? Find professional assistance for Openfire, Smack, Spark or any of our other projects in our <a href="../support/service_providers.jsp">directory of service providers</a>!
                </p>

                <h2 class="larger">Join the Community!</h2>

                <p>
                    The above only scratches the surface of what our projects can offer. We'd love to engage with you on your ideas.
                </p>

                <p>
                    You can post in our public <a href="https://discourse.igniterealtime.org/">forum</a> or join our <a href="../support/group_chat.jsp">live chat room</a> to ask questions or provide feedback, or just to say hi! We are excited to meet you!
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

        <jsp:include page="/includes/sidebar_testimonial.jspf"/>

    </section>

</section>

</body>
</html>
