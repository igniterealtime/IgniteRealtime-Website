<%@ page import="org.jivesoftware.site.Versions"%>
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
<title>a real time collaboration community site</title>
<meta name="body-id" content="home" />
<meta name="panel-name" content="home" />
<style media="screen">
    @import "styles/home.css";
</style>
<link rel="me" href="https://toot.igniterealtime.org/@news"/>
</head>
<body>

<section id="ignite_body">
        
    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="home" productName="Open Realtime"
                             image="images/ignite_about-circlegraph.png">
            <p>
                Ignite Realtime is the community site for the users and developers of open source Real Time
                Communications projects like Openfire, Smack, Spark, and Pàdé. Your involvement is helping to change the
                open RTC landscape.
            </p>

            <div style="width: 150px;">
                <a href="about/" class="ignite_link_arrow"><strong>Learn More</strong></a><br />
            </div>

        </ir:heroproductpanel>

        <div id="ignite_home_body">

            <div id="ignite_home_body_leftcol">
                <ir:blogposts max="5" feedManager="${feedManager}"/>
            </div>
        </div>

    </main>

    <section id="ignite_body_sidebar">
            
        <div class="sidebar sidebar_dark sidebar_grad">
            <h1 class="sidebar_header">Projects</h1>
            <div><strong><a href="projects/openfire/">Openfire</a></strong> <%= Versions.getVersion("openfire") %> <a href="downloads/#openfire" class="button_download">Download</a></div>
            <div><strong><a href="projects/spark/">Spark</a></strong> <%= Versions.getVersion("spark") %> <a href="downloads/#spark" class="button_download">Download</a></div>
            <div><strong><a href="projects/pade/">P&agrave;d&eacute;</a></strong> <%= Versions.getVersion("pade") %> <a href="https://chrome.google.com/webstore/detail/pade-unified-communicatio/fohfnhgabmicpkjcpjpjongpijcffaba" class="button_download">Install</a></div>
    <!--        <div><strong><a href="projects/sparkweb/">SparkWeb</a></strong> <%= Versions.getVersion("sparkweb") %> <a href="downloads/#sparkweb" class="button_download">Download</a></div> -->
            <div><strong><a href="projects/smack/">Smack</a></strong> <%= Versions.getVersion("smack") %> <a href="downloads/#smack" class="button_download">Download</a></div>
            <div><strong><a href="projects/tinder/">Tinder</a></strong> <%= Versions.getVersion("tinder") %> <a href="downloads/#tinder" class="button_download">Download</a></div>
            <div><strong><a href="projects/whack/">Whack</a></strong> <%= Versions.getVersion("whack") %> <a href="downloads/#whack" class="button_download">Download</a></div>
    <!--        <div><strong><a href="projects/xiff/">XIFF</a></strong> <%= Versions.getVersion("xiff") %> <a href="downloads/#xiff" class="button_download">Download</a></div> -->
        </div>

        <jsp:include page="/includes/sidebar_48hrsnapshot.jspf"/>

        <div class="sidebar sidebar_light sidebar_gray">
            <h1 class="sidebar_header">In the community</h1>

            <h4>Recent Discussions</h4>
            <cache:cache time="60" key="${baseUrl.concat('/latest.rss')}">
                <c:forEach items="${feedManager.getSummaryItems( baseUrl, '/latest.rss', 5 )}" var="item">
                    <div class="discussion">
                        <img src="${feedManager.getAvatarUrl(baseUrl, item, 16)}" width="16" height="16" alt="" />
                        <b>${item.authorName}</b> in "<a href='${item.messageUrl}'>${item.subject}</a>"
                    </div>
                </c:forEach>
            </cache:cache>


    <!--        <h4>Recent Articles</h4>
                <div class="articles"><a href="support/articles/motd_plugin.jsp">Openfire Plugin Development: Message of the Day</a></div>
                <div class="articles"><a href="support/articles/pubsub.jsp">All About Pubsub</a></div>
                <div class="articles"><a href="support/articles/sparkplug_day.jsp">Sparkplug Day</a></div>
                <div class="articles"><a href="support/articles/filetransfer.jsp">IM File Transfer Made Easy</a></div>
                <div class="articles"><a href="support/articles/openfire_optimization.jsp">Behind the Scenes: Openfire Optimization</a></div>

            <h4>Whitepapers</h4>
                <div class="articles"><a href="about/jive_caseforim_wp.pdf">Why Your Business Should Use Enterprise Instant Messaging Now</a></div>
                <div class="articles"><a href="about/jive_xmpp_wp.pdf">XMPP: The Protocol for Open, Extensible Instant Messaging</a></div>
                <div class="articles"><a href="about/jive_bestpractices_wp.pdf">Building a Successful Online Community with Jive Forums</a></div>
                <div class="articles"><a href="about/OpenfireScalability.pdf">Openfire Scalability Test Results</a></div>-->
        </div>

        <jsp:include page="/includes/sidebar_testimonial.jspf"/>

            
    </section>

</section>

</body>
</html>
