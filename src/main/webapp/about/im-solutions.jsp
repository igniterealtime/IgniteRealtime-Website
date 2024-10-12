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
                <h1>Open Realtime <span class="subtitle">Our Instant Messaging Solutions</span></h1>

                <p>
                    There are many reasons for someone to deploy their own instant messaging service. Many organizations, and even individuals, choose to take control of their own IM data, by managing their own instant messaging service, rather than relinquishing control to a third party.
                </p>

                <p>
                    Whatever the motivation, the client and server products offered by the Ignite Realtime community allow you to set up a cross-platform, real-time collaboration service optimized for your needs in moments!
                </p>

            </header>

            <div class="ignite_int_body_padding">

                <h2 class="larger">Meet the Family</h2>

                <img src="../images/ignite_projects_spark_ss.gif" align="right" style="margin-left: 10px;"/>

                <p>
                    Our <strong><a href="../projects/openfire/">Openfire</a></strong> server is a real time collaboration (RTC) server licensed under the open source Apache License. It uses the only widely adopted open protocol for instant messaging, XMPP. Openfire is incredibly easy to setup and administer, but offers rock-solid security and performance.
                </p>

                <p>
                    <a href="../projects/spark/">Spark</a> is an open source, cross-platform IM client optimized for businesses and organizations. It features built-in support for group chat, telephony integration, and strong security. It also offers a great end-user experience with features like in-line spell checking, group chat room bookmarks, and tabbed conversations.
                </p>

                <p>
                    <a href="../projects/pade/">Pàdé</a> (the Yoruba word for "Meet") is a unified real-time collaboration client optimized for business and organizations implemented as a cross-platform browser extension. On top of instant messaging functionality, it offers audio/video conferencing, screen share and real-time application collaboration, as well as integration with SIP based telephony.
                </p>

                <p>
                    But that is not all. Our projects make use of open standards - most notably the XMPP protocol. This allows you to mix and match our products with a wide variety of third-party products that are based on the same protocol. After more than two decades of development, most conceivable use-cases have some kind of XMPP-based implementation nowadays!
                </p>

                <h2 class="larger">Getting Started</h2>

                <p>
                    Setting up a basic Openfire instance can be done in under two minutes! The <a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/demoboot-guide.html">demoboot</a> option allows you to instantly create a pre-provisioned service, ready for testing.
                </p>

                <p>
                    Once you've got Openfire running, you can download and install Spark or Pàdé and use those to quickly explore the options that our software provides.
                </p>

                <h2 class="larger">Next Steps</h2>

                <p>
                    When you're ready to go more in-depth, consider installing and configuring an Openfire server from scratch. The Openfire installer includes an easy-to-use wizard for setting up your service.
                </p>

                <p>
                    Its <a href="../projects/openfire/documentation.jsp">elaborate documentation</a> describes how you can integrate with any pre-existing software investments, such as directory services like Active Directory or other LDAP-based solutions, as well as any of the more popular database systems.
                </p>

                <p>
                    Openfire can be further enhanced by installing some of the wide variety of <a href="../projects/openfire/plugins.jsp">plugins</a>, each offering unique bits of functionality, ranging from auditable message archiving to avatar generation, from user import/export functionality to exposing a REST API.
                </p>

                <h2 class="larger">Join the Community!</h2>

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
