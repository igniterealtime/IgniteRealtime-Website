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
<meta name="body-id" content="news" />
<meta name="panel-name" content="news" />
<style media="screen">
    @import "../styles/home.css";
</style>
<link rel="me" href="https://toot.igniterealtime.org/@news"/>
</head>
<body>

<section id="ignite_body">
        
    <main id="ignite_body_leftcol">

        <ir:heroproductpanel productId="home" productName="Open Realtime"
                             image="../images/ignite_about-circlegraph.png">
            <p>
                Ignite Realtime is the community site for the users and developers of open source Real Time
                Communications projects like Openfire, Smack, Spark, and Pàdé. Your involvement is helping to change the
                open RTC landscape.
            </p>

            <div style="width: 150px;">
                <a href="../index.jsp" class="ignite_link_arrow"><strong>Learn More</strong></a><br />
            </div>

        </ir:heroproductpanel>

        <div id="ignite_home_body">

            <div id="ignite_home_body_leftcol">
                <ir:blogposts max="5" feedManager="${feedManager}"/>
            </div>
        </div>

    </main>

    <section id="ignite_body_sidebar">

        <jsp:include page="/includes/sidebar_forumactivity.jsp">
            <jsp:param name="discourseCategory" value="/latest"/>
            <jsp:param name="headerText" value="In the community"/>
            <jsp:param name="subHeaderText" value="Recent Discussions"/>
            <jsp:param name="sidebarClasses" value="sidebar_light sidebar_gray"/>
        </jsp:include>

        <jsp:include page="/includes/sidebar_recent_articles.jspf"/>

    <!--
            <h4>Whitepapers</h4>
                <div class="articles"><a href="../about/jive_caseforim_wp.pdf">Why Your Business Should Use Enterprise Instant Messaging Now</a></div>
                <div class="articles"><a href="../about/jive_xmpp_wp.pdf">XMPP: The Protocol for Open, Extensible Instant Messaging</a></div>
                <div class="articles"><a href="../about/jive_bestpractices_wp.pdf">Building a Successful Online Community with Jive Forums</a></div>
                <div class="articles"><a href="../about/OpenfireScalability.pdf">Openfire Scalability Test Results</a></div>-->

        <jsp:include page="/includes/sidebar_testimonial.jspf"/>

            
    </section>

</section>

</body>
</html>
