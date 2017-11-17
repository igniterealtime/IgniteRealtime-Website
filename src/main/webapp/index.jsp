<%@ page import="org.jivesoftware.site.Versions" %>
<%@ page import="org.jivesoftware.webservices.RestClient" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.text.DateFormat" %>
<%@ page import="org.jivesoftware.site.FeedManager" %>
<%@ page import="com.sun.syndication.feed.synd.SyndEntry" %>

<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    String baseUrl = config.getServletContext().getInitParameter("discourse_baseurl");
    if ( baseUrl == null || baseUrl.isEmpty() )
    {
        baseUrl = "https://discourse.igniterealtime.org";
    }

    request.setAttribute( "baseUrl", baseUrl );
    request.setAttribute( "feedManager", FeedManager.getInstance() );
    request.setAttribute( "restClient", new RestClient() );
%>

<html>
<head>
<title>a real time collaboration community site</title>
<meta name="body-id" content="home" />
<meta name="panel-name" content="home" />
<style type="text/css" media="screen">
	@import "styles/home.css";
</style>
</head>
<body>

	<!-- BEGIN body area -->
	<div id="ignite_body">
		
		<!-- BEGIN left column (main content) -->
		<div id="ignite_body_leftcol">
			
			<% boolean panelCookieSet = false;
			   Cookie [] cookies = request.getCookies();
				 if (cookies != null) {
			       for (Cookie cookie: request.getCookies()) {
                if (cookie.getName().equals("home")) { 
						      panelCookieSet = true;
					      }
				     }
			   }
		  %>
			<!-- BEGIN large panel -->
			<!-- 
				if there is no cookie, show this panel
				(there is an 'onload' in the decorator that runs a script from 
				/scripts/ignite.js, may want to change that).
				the cookie is defined by the meta 'panel-name' in the head, and
				set with the onclick of the links below, closePanel().
			-->
			<div id="ignite_bigpanel" 
				<% if (!panelCookieSet) { %>
				style="display:block"
        <% } %>>
				<div id="ignite_bigpanel_content">
				<h1>Open Realtime. </h1>
				<p>Ignite Realtime is the community site for the users and developers of Jive Software's open source Real Time Communications projects. Your involvement is helping to change the open RTC landscape.</p>
				
					<div style="width: 150px;">
						<a href="about/index.jsp" class="ignite_link_arrow"><strong>Learn More</strong></a><br />
					</div>

                </div>
				
				<div id="ignite_bigpanel_close">
					<a href="#" onClick="closePanel('home'); return false;"></a>
				</div>
				
				<div id="ignite_bigpanel_screenshot">
					<img src="images/ignite_about-circlegraph.png" width="177" height="208" alt="" />
				</div>
				
			</div>
			<!-- END large panel -->
			
			<!-- BEGIN small panel -->
			<!-- 
				if there is a cookie, show this panel
				(same details as above for 'large panel')
			-->
			<div id="ignite_smallpanel" 
			  <% if (panelCookieSet) { %>
				style="display:block"
        <% } %>>
				<div id="ignite_smallpanel_content">
					<h1>Open Realtime.</h1>
					<!-- Ignite Real Time is the community site for Jive Software's open source
					alternatives to enterprise instant messaging. -->
					Ignite Realtime is the community site for the users and developers of Jive Software's open source Real Time Communications projects. Your involvement is helping to change the open RTC landscape.
				</div>
				<div id="ignite_smallpanel_open">
					<a href="#" onClick="closePanel('home'); return false;"></a>
				</div>
			</div>
			<!-- END small panel -->
			
			
			<!-- BEGIN home page body content area -->
			<div id="ignite_home_body">

                <!-- BEGIN 'latest blog entries' column -->
				<div id="ignite_home_body_leftcol">
					<!-- BEGIN blog header -->
					<div id="ignite_blog_header">
						<span id="ignite_blog_header_label">
							Latest <a href="${baseUrl}/c/blogs/ignite-realtime-blogs">Blog</a> Entries
						</span>
						<div style="float: right;">
                            <span id="ignite_blog_header_rss">
							 	<a href="${baseUrl}/c/blogs/ignite-realtime-blogs.rss"><img src="images/rss.gif" width="16" height="16" border="0" alt="" /></a>
							</span>
						</div>
					</div>
					<!-- END blog header -->

                    <%-- Show blog feed --%>

                    <cache:cache time="600" key="${baseUrl.concat('/c/blogs/ignite-realtime-blogs.rss')}">
                        <c:forEach items="${feedManager.getItems( baseUrl, '/c/blogs/ignite-realtime-blogs.rss', 5 )}" var="item" varStatus="status">
                            <ir:blogpost item="${item}" isOdd="${status.count % 2 != 0}"/>
                        </c:forEach>
                    </cache:cache>

                            <%--<% try { %>--%>
                <%--<%--%>
                    <%--RestClient client = new RestClient();--%>
                    <%--String blogSearchUrl = restBaseUrl + "/search/places?filter=search(Ignite,Realtime,Blog)&filter=type(blog)";--%>
                    <%--JSONObject result = client.get(blogSearchUrl);--%>
                    <%--JSONArray results = result.getJSONArray("list");--%>
                    <%--JSONObject blog = (JSONObject)results.get(0);--%>
                    <%--String contentsUrl = blog.getJSONObject("resources").getJSONObject("contents").getString("ref");--%>

                    <%--String blogRestUrl = contentsUrl + "?count=5";--%>
                    <%--result = client.get(blogRestUrl);--%>
                    <%--JSONArray posts = result.getJSONArray("list");--%>
                    <%--request.setAttribute("posts", posts);--%>
                <%--%>--%>
                    <%--<jsp:include page="/includes/blogposts.jsp" />--%>
                <%--<% } catch (Exception e) { %>--%>
                    <%--<cache:usecached />--%>
                <%--<% } %>--%>
					<%--</cache:cache>--%>
				</div>

                <style type="text/css"></style>
                <!-- END 'latest blog entries' column -->
			</div>
			<!-- END home page body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
            <div class="sidebar sidebar_dark sidebar_grad">
                <h1 class="sidebar_header">Projects</h1>
                <div><strong><a href="projects/openfire/index.jsp">Openfire</a></strong> <%= Versions.getVersion("openfire") %> <a href="downloads/index.jsp#openfire" class="button_download">Download</a></div>
                <div><strong><a href="projects/spark/index.jsp">Spark</a></strong> <%= Versions.getVersion("spark") %> <a href="downloads/index.jsp#spark" class="button_download">Download</a></div>
        <!--        <div><strong><a href="projects/sparkweb/index.jsp">SparkWeb</a></strong> <%= Versions.getVersion("sparkweb") %> <a href="downloads/index.jsp#sparkweb" class="button_download">Download</a></div> -->
                <div><strong><a href="projects/smack/index.jsp">Smack</a></strong> <%= Versions.getVersion("smack") %> <a href="downloads/index.jsp#smack" class="button_download">Download</a></div>
                <div><strong><a href="projects/tinder/index.jsp">Tinder</a></strong> <%= Versions.getVersion("tinder") %> <a href="downloads/index.jsp#tinder" class="button_download">Download</a></div>
                <div><strong><a href="projects/whack/index.jsp">Whack</a></strong> <%= Versions.getVersion("whack") %> <a href="downloads/index.jsp#whack" class="button_download">Download</a></div>
        <!--        <div><strong><a href="projects/xiff/index.jsp">XIFF</a></strong> <%= Versions.getVersion("xiff") %> <a href="downloads/index.jsp#xiff" class="button_download">Download</a></div> -->
			</div>

            <%@ include file="/includes/sidebar_48hrsnapshot.jspf" %>

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

            <%@ include file="/includes/sidebar_testimonial.jspf" %>

            <!-- BEGIN grey gradient sidebar box 'PROJECTS' -->
			<%--<div class="ignite_sidebar_gradbox">--%>
				<%--<div class="ignite_sidebar_top-g"></div>--%>
				<%--<div class="ignite_sidebar_hdr ignite_sidebar_hdr_projects"></div>--%>
				<%--<div class="ignite_sidebar_body_projects">--%>
					<%--<div class="ignite_sidebar_body_project1">--%>
						<%--<span><strong><a href="/projects/openfire/index.jsp">Openfire</a></strong> <%= Versions.getVersion("openfire") %></span> <a href="/downloads/index.jsp#openfire"></a>--%>
					<%--</div>--%>
					<%--<div class="ignite_sidebar_body_project2">--%>
						<%--<span><strong><a href="/projects/spark/index.jsp">Spark</a></strong> <%= Versions.getVersion("spark") %></span> <a href="/downloads/index.jsp#spark"></a>--%>
					<%--</div>--%>
					<%--<div class="ignite_sidebar_body_project3">--%>
						<%--<span><strong><a href="/projects/sparkweb/index.jsp">SparkWeb</a></strong> <%= Versions.getVersion("sparkweb") %></span> <a href="/downloads/index.jsp#sparkweb"></a>--%>
					<%--</div>--%>
					<%--&lt;%&ndash;--%>
					<%--<div class="ignite_sidebar_body_project4">--%>
						<%--<span><strong><a href="/projects/asterisk/index.jsp">Asterisk</a></strong> <%= Versions.getVersion("asterisk-im") %></span> <a href="/downloads/index.jsp#asterisk"></a>--%>
					<%--</div>--%>
					<%--&ndash;%&gt;--%>
					<%--<div class="ignite_sidebar_body_project4">--%>
						<%--<span><strong><a href="/projects/smack/index.jsp">Smack API</a></strong> <%= Versions.getVersion("smack") %></span> <a href="/downloads/index.jsp#smack"></a>--%>
					<%--</div>--%>
                    <%--<div class="ignite_sidebar_body_project5">--%>
						<%--<span><strong><a href="/projects/tinder/index.jsp">Tinder API</a></strong> <%= Versions.getVersion("tinder") %></span> <a href="/downloads/index.jsp#tinder"></a>--%>
					<%--</div>--%>
					<%--<div class="ignite_sidebar_body_project6">--%>
						<%--<span><strong><a href="/projects/whack/index.jsp">Whack API</a></strong> <%= Versions.getVersion("whack") %></span> <a href="/downloads/index.jsp#whack"></a>--%>
					<%--</div>--%>
					<%--<div class="ignite_sidebar_body_project7">--%>
						<%--<span><strong><a href="/projects/xiff/index.jsp">XIFF API</a></strong> <%= Versions.getVersion("xiff") %></span> <a href="/downloads/index.jsp#xiff"></a>--%>
					<%--</div>--%>
					<%--<div class="ignite_sidebar_body_project8" style="text-align: center;">--%>
					<%--</div>--%>
				<%--</div>--%>
				<%--<div class="ignite_sidebar_btm-g"></div>--%>
			<%--</div>--%>

            <%--<%@ include file="/includes/sidebar_48hrsnapshot.jspf" %>--%>
            <!-- BEGIN 'in the community' column -->
            <%--<div id="ignite_home_body_rightcol">--%>

                <%--</div>--%>

                <%--<!-- BEGIN featured members -->--%>
                <%--&lt;%&ndash; <div id="ignite_home_body_featured">--%>
                <%--<h4>Featured Members</h4>--%>

                    <%--<!-- featured member 1 -->--%>
                    <%--<div style="float: right;">--%>
                    <%--<a href="<%= baseUrl %>/people/sixthring">--%>
                        <%--<div class="ignite_home_featured_avatar">--%>
                         <%--<img src="<%= baseUrl %>/people/sixthring/avatar/32.png" alt="avatar" width="32" height="32" />--%>
                        <%--</div>--%>
                    <%--sixthring</a>--%>
                    <%--</div>--%>

                    <%--<!-- featured member 2 -->--%>
                    <%--<div style="float: left;">--%>
                    <%--<a href="<%= baseUrl %>/people/winsrev">--%>
                        <%--<div class="ignite_home_featured_avatar">--%>
                        <%--<img src="<%= baseUrl %>/people/winsrev/avatar/32.png" alt="avatar" width="32" height="32" />--%>
                        <%--</div>--%>
                    <%--winsrev</a>--%>
                    <%--</div>--%>
                <%--</div>    &ndash;%&gt;--%>
                <%--<!-- END featured members -->--%>

                <%--<!-- BEGIN recent discussions, news, wiki docs, and articles -->--%>
                <%--<div id="ignite_home_body_recent">--%>
                <%--<h4>Recent Discussions</h4>--%>
                <%--<%--%>
                    <%--String recentMessagesUrl = restBaseUrl +"/contents/recent?filter=type(discussion)&count=5";--%>
                <%--%>--%>
                    <%--<cache:cache time="60" key="<%= recentMessagesUrl %>">--%>
                <%--<% try { %>--%>
                <%--<%--%>
                    <%--RestClient client = new RestClient();--%>
                    <%--JSONObject result = client.get(recentMessagesUrl);--%>
                    <%--JSONArray messages = result.getJSONArray("list");--%>

                    <%--for (Object messageObject : messages) {--%>
                        <%--if (! (messageObject instanceof JSONObject)) {--%>
                            <%--continue;--%>
                            <%--// skip non-JSONObject--%>
                        <%--}--%>
                        <%--JSONObject message = (JSONObject)messageObject;--%>

                        <%--JSONObject author = message.getJSONObject("author");--%>
                        <%--String authorAvatarUrl = author.getJSONObject("resources").getJSONObject("avatar").getString("ref");--%>
                        <%--String authorName = author.getString("displayName");--%>
                        <%--String messageUrl = message.getJSONObject("resources").getJSONObject("html").getString("ref");--%>
                        <%--String subject = message.getString("subject");--%>

                <%--%>--%>
                        <%--<div class="discussion">--%>
                            <%--<img src="<%= authorAvatarUrl %>" width="16" height="16" alt="" />--%>
                                <%--<b><%= authorName %></b> in--%>
                                <%--"<a href='<%= messageUrl %>'><%= subject %></a>"--%>
                        <%--</div>--%>
                    <%--<% } %>--%>
                <%--<% } catch (Exception e) { %>--%>
                    <%--<cache:usecached />--%>
                <%--<% } %>--%>
                    <%--</cache:cache>--%>

                <%--<h4>Recent Releases</h4>--%>
                <%--<%--%>
                    <%--String recentReleasesPlace = restBaseUrl+"/places?filter=entityDescriptor(14,2017)";--%>

                <%--%>--%>
                    <%--<cache:cache time="60" key="<%= recentReleasesPlace %>">--%>
                <%--<% try { %>--%>
                <%--<%--%>
                    <%--RestClient client = new RestClient();--%>
                    <%--JSONObject result = client.get(recentReleasesPlace);--%>
                    <%--JSONArray placesList = result.getJSONArray("list");--%>
                    <%--JSONObject place = placesList.getJSONObject(0);--%>
                    <%--JSONObject placeResources = place.getJSONObject("resources");--%>
                    <%--JSONObject placeContents = placeResources.getJSONObject("contents");--%>
                    <%--String recentReleasesUrl = placeContents.getString("ref")+"?count=5&abridged=true";--%>

                    <%--result = client.get(recentReleasesUrl);--%>
                    <%--JSONArray messages = result.getJSONArray("list");--%>

                    <%--for (Object messageObject : messages) {--%>
                        <%--if (! (messageObject instanceof JSONObject)) {--%>
                            <%--continue;--%>
                            <%--// skip non-JSONObject--%>
                        <%--}--%>
                        <%--JSONObject message = (JSONObject)messageObject;--%>

                        <%--String messageUrl = message.getJSONObject("resources").getJSONObject("html").getString("ref");--%>
                        <%--String subject = message.getString("subject");--%>
                        <%--String published = message.getString("published");--%>
                        <%--if (StringUtils.endsWith(published, "+0000")) {--%>
                            <%--published = StringUtils.replace(published, "+0000", "+00:00");--%>
                        <%--}--%>
                        <%--Date datePublished = new Date();--%>
                        <%--try {--%>
                            <%--datePublished = javax.xml.bind.DatatypeConverter.parseDate(published).getTime();--%>
                        <%--} catch (Exception e) {--%>
                            <%--e.printStackTrace();--%>
                        <%--}--%>
                <%--%>--%>
                        <%--<div class="news">--%>
                            <%--<font color="#888888"><%= DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(datePublished) %> - </font>--%>
                            <%--<a href='<%= messageUrl %>/'><%= subject %></a>--%>
                        <%--</div>--%>
                    <%--<% } %>--%>
                <%--<% } catch (Exception e) { %>--%>
                    <%--<cache:usecached />--%>
                <%--<% } %>--%>
                    <%--</cache:cache>--%>

                <%--<h4>Recent Articles</h4>--%>
                    <%--<div class="articles"><a href="/support/articles/motd_plugin.jsp">Openfire Plugin Development: Message of the Day</a></div>--%>
                    <%--<div class="articles"><a href="/support/articles/pubsub.jsp">All About Pubsub</a></div>--%>
                    <%--<div class="articles"><a href="/support/articles/sparkplug_day.jsp">Sparkplug Day</a></div>--%>
                    <%--<div class="articles"><a href="/support/articles/filetransfer.jsp">IM File Transfer Made Easy</a></div>--%>
                    <%--<div class="articles"><a href="/support/articles/openfire_optimization.jsp">Behind the Scenes: Openfire Optimization</a></div>--%>

                <%--<h4>Whitepapers</h4>--%>
                    <%--<div class="articles"><a href="/about/jive_caseforim_wp.pdf">Why Your Business Should Use Enterprise Instant Messaging Now</a></div>--%>
                    <%--<div class="articles"><a href="/about/jive_xmpp_wp.pdf">XMPP: The Protocol for Open, Extensible Instant Messaging</a></div>--%>
                    <%--<div class="articles"><a href="/about/jive_bestpractices_wp.pdf">Building a Successful Online Community with Jive Forums</a></div>--%>
                    <%--<div class="articles"><a href="/about/OpenfireScalability.pdf">Openfire Scalability Test Results</a></div>--%>
                <%--</div>--%>

                <%--<!-- END recent discussions, news, wiki docs, and articles -->--%>

            <%--</div>--%>
            <%--<!-- END 'in the community' column -->--%>
			<%--<!-- END grey gradient sidebar box 'PROJECTS' -->--%>

			<%--<%@ include file="/includes/sidebar_testimonial.jspf" %>--%>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>
