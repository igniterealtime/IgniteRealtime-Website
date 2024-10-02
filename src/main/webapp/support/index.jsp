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
    request.setAttribute("versionOpenfire", Versions.getVersion("openfire"));
    request.setAttribute("versionSpark", Versions.getVersion("spark"));
    request.setAttribute("versionSmack", Versions.getVersion("smack"));
    request.setAttribute("versionPade", Versions.getVersion("pade"));
    request.setAttribute("versionBotz", Versions.getVersion("botz"));
    request.setAttribute("versionTinder", Versions.getVersion("tinder"));
    request.setAttribute("versionWhack", Versions.getVersion("whack"));
    request.setAttribute("versionAsterisk", Versions.getVersion("asterisk-im"));
    request.setAttribute("versionXIFF", Versions.getVersion("xiff"));
    request.setAttribute("versionSparkWeb", Versions.getVersion("sparkweb"));
%>
<html>
<head>
    <title>Support</title>
    <meta name="body-id" content="support" />
    <style media="screen">
        @import "../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="support"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">

            <header id="ignite_body_header">
                <h1>Support</h1>
            </header>

            <div id="ignite_support_findprovider">
                <img src="../images/ignite_support_profsupport.gif" alt="" width="203" height="27" border="0">
                <p>
                    If you need professional support or services see our
                    <a href="service_providers.jsp">directory of professional partners</a>.
                </p>
            </div>

            <div id="ignite_support_search">
                <c:set var="baseUrl" value="${not empty initParam.discourse_baseurl ? initParam.discourse_baseurl : 'https://discourse.igniterealtime.org/'}"/>

                <strong>Search the community:</strong>
                <form method="get" action="${baseUrl}/search">
                    <input type="text" name="q" size="40" maxlength="100"/>
                    <input type="image" src="../images/ignite_support_searchbtn.gif" name="Submit" class="ignite_support_search"/>
                </form>
            </div>

            <div id="ignite_support_main">

                <div id="ignite_support_activity">

                    <div id="ignite_support_activity_forums">
                        <h4>Recent Support Discussions</h4>
                        <cache:cache time="60" key="${baseUrl.concat('/latest.rss')}">
                            <c:forEach items="${feedManager.getSummaryItems( baseUrl, '/latest.rss', 10 )}" var="item">
                                <div class="discussion">
                                    <img src="${feedManager.getAvatarUrl(baseUrl, item, 16)}" width="16" height="16" alt="" />
                                    <b>${item.authorName}</b> in "<a href='${item.messageUrl}'>${item.subject}</a>"
                                </div>
                            </c:forEach>
                        </cache:cache>

                        <strong><a href="https://discourse.igniterealtime.org/" class="ignite_link_arrow">See all support discussions</a></strong>
                    </div>

                    <div id="ignite_support_activity_articles">
                        <h4>Whitepapers</h4>
                        <div class="articles"><a href="articles/whitepaper_xmpp.jsp">XMPP: The Protocol for Open, Extensible Instant Messaging</a></div>

                        <hr style="margin: 1em 0;">

                        <h4>Recent Articles</h4>
                        <div class="articles"><a href="articles/xmpp_network_graph.jsp">Creating the XMPP Network Graph</a></div>
                        <div class="articles"><a href="articles/openfire_conversations_audio_video.jsp">Preparing Openfire for Audio/Video calls with Conversations</a></div>
                        <div class="articles"><a href="articles/ofmeetings_alternative_zoom.jsp">Openfire Meetings as an alternative to Zoom</a></div>
                        <div class="articles"><a href="articles/motd_plugin.jsp">Openfire Plugin Development: Message of the Day</a></div>
                        <div class="articles"><a href="articles/pubsub.jsp">All About Pubsub</a></div>
                        <div class="articles"><a href="articles/sparkplug_day.jsp">Sparkplug Day</a></div>
                        <div class="articles"><a href="articles/filetransfer.jsp">IM File Transfer Made Easy</a></div>
                        <div class="articles"><a href="articles/openfire_optimization.jsp">Behind the Scenes: Openfire Optimization</a></div>
                        <strong><a href="articles.jsp" class="ignite_link_arrow">See all support documents</a></strong>
                    </div>

                    <div id="ignite_support_activity_documentation">
                        <h4>Documentation</h4>
                        <p>Documentation such as installation guides, change logs and other product documents can
                        be found in each project page's Documentation section. The links below will take you to
                        the documentation section inside each project.</p>
                        <ul>
                            <li class="ignite_support_projlink"><a href="../projects/openfire/documentation.jsp">Openfire <c:out value="${versionOpenfire}"/></a></li>
                            <li class="ignite_support_projlink"><a href="../projects/spark/documentation.jsp">Spark <c:out value="${versionSpark}"/></a></li>
                            <li class="ignite_support_projlink"><a href="../projects/smack/readme">Smack API <c:out value="${versionSmack}"/></a></li>
                            <li class="ignite_support_projlink"><a href="https://igniterealtime.github.io/pade/help/">Pàdé <c:out value="${versionPade}"/></a></li>
                            <li class="ignite_support_projlink"><a href="../projects/botz/documentation.jsp">Botz <c:out value="${versionBotz}"/></a></li>
                            <li class="ignite_support_projlink"><a href="../projects/tinder/documentation.jsp">Tinder API <c:out value="${versionTinder}"/></a></li>
                            <li class="ignite_support_projlink"><a href="../projects/whack/documentation.jsp">Whack API <c:out value="${versionWhack}"/></a></li>
                            <li class="ignite_support_projlink"><a href="../projects/asterisk/documentation.jsp">Asterisk-IM <c:out value="${versionAsterisk}"/></a></li>
                            <li class="ignite_support_projlink"><a href="../projects/xiff/documentation.jsp">XIFF API <c:out value="${versionXIFF}"/></a></li>
                            <li class="ignite_support_projlink"><a href="../projects/sparkweb/documentation.jsp">SparkWeb <c:out value="${versionSparkWeb}"/></a></li>
                        </ul>
                    </div>

                    <div id="ignite_support_activity_issuetracker">
                        <h4>Issue tracker</h4>
                        <p>
                            Use the official Ignite Realtime Issue Tracker to browse projects and find issues. You may also
                            vote for issues, see which issues are popular, and view the road map. Note: to report new
                            issues, please post them in the <a href="https://discourse.igniterealtime.org/">forums</a>.
                        </p>
                        <p>
                            <strong><a href="https://issues.igniterealtime.org/" class="ignite_link_arrow">View the Issue Tracker</a></strong>
                        </p>
                   </div>
                </div>
            </div>
        </article>
    </main>

    <jsp:include page="/includes/sidebar_support.jspf"/>

</section>

</body>
</html>
