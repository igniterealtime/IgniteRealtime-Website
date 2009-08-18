<%@ page import="com.jivesoftware.clearspace.webservices.*" %>
<%@ page import="org.jivesoftware.site.Versions" %>
<%@ page import="org.jivesoftware.site.FeedManager" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.text.DateFormat" %>
<%@ page import="com.sun.syndication.feed.synd.SyndEntry" %>
<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<%@ include file="/includes/ws_locator.jspf" %>
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
						<a href="/about/index.jsp" class="ignite_link_arrow"><strong>Learn More</strong></a><br />
					</div>

                </div>
				
				<div id="ignite_bigpanel_close">
					<a href="#" onClick="closePanel('home'); return false;"></a>
				</div>
				
				<div id="ignite_bigpanel_screenshot">
					<img src="images/ignite_home-circlegraph.gif" width="177" height="208" alt="" />
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

                <% String blogFeedRSS = config.getServletContext().getInitParameter("csc_baseurl")+"/blogs/ignite/feeds/posts"; %>
                <!-- BEGIN 'latest blog entries' column -->
				<div id="ignite_home_body_leftcol">
					<!-- BEGIN blog header -->
					<div id="ignite_blog_header">
						<span id="ignite_blog_header_label">
							Latest <a href="/community/blogs/ignite">Blog</a> Entries
						</span>
						<div style="float: right;">
                            <span id="ignite_blog_header_rss">
							 	<a href="<%= blogFeedRSS %>"><img src="images/rss.gif" width="16" height="16" border="0" alt="" /></a>
							</span>
						</div>
					</div>
					<!-- END blog header -->

                    <%-- Show blog feed --%>
					<%--cache:cache time="600" key="<%= blogFeedRSS %>"--%>
					<%
                    FeedManager feedManager = FeedManager.getInstance();
                    List<SyndEntry> blogFeedEntries = feedManager.getBlogFeedEntries(blogFeedRSS);
					BlogService blogService = serviceProvider.getBlogService();

					BlogPostResultFilter bprf = new BlogPostResultFilter();
					bprf.setNumResults(5);
                    bprf.setBlogID((long) NULL_INT);
                    bprf.setSortField(600); // publish date
                    bprf.setSortOrder(SORT_DESCENDING);
                    List<BlogPost> posts = blogService.getBlogPostsWithFilter(bprf);
                    if ( (null != posts) && (null != blogFeedEntries) ) {
                        for (BlogPost post: posts) {
                            for (SyndEntry entry: blogFeedEntries) {
                                if ( (null == entry.getLink()) || (null == post.getPermalink()) ) {
                                    continue;
                                } else {
                                    if (entry.getLink().equals(post.getPermalink())) {
                                        post.setBody(entry.getDescription().getValue());
                                        break;
                                    }
                                }
                            }
                        }
                    }
					%>
					<% request.setAttribute("posts", posts); %>
					<jsp:include page="/includes/blogposts.jsp" />
					<%--/cache:cache--%>
				</div>

                <style type="text/css"></style>
                <!-- END 'latest blog entries' column -->
				
				<!-- BEGIN 'in the community' column -->
				<div id="ignite_home_body_rightcol">
					<div id="ignite_incommunity_header">
						<span id="ignite_incommunity_header_label">
							In the Community
						</span>
					</div>
					
					<!-- BEGIN featured members -->
					<div id="ignite_home_body_featured">
					<h4>Featured Members</h4>
						
						<!-- featured member 1 -->
						<div style="float: right;">
						<a href="/community/people/sixthring">
							<div class="ignite_home_featured_avatar">
							 <img src="/community/people/sixthring/avatar/32.png" alt="avatar" width="32" height="32" />
							</div>
                        sixthring</a>
						</div>

                        <!-- featured member 2 -->
                        <div style="float: left;">
						<a href="/community/people/winsrev">
							<div class="ignite_home_featured_avatar">
							<img src="/community/people/winsrev/avatar/32.png" alt="avatar" width="32" height="32" />
							</div>
                        winsrev</a>
						</div>
					</div>
					<!-- END featured members -->
					
					<!-- BEGIN recent discussions, news, wiki docs, and articles -->
					<div id="ignite_home_body_recent">
					<h4>Recent Discussions</h4>
						<cache:cache time="60" key="/community/blogs/feeds/posts">

                        <%
						ForumService forumService1 = serviceProvider.getForumService();
						ResultFilter rf1 = new ResultFilter();
                        rf1.setSortField(9); // modification date
                        rf1.setSortOrder(SORT_DESCENDING);
						rf1.setRecursive(true);
						rf1.setNumResults(5);
						List<ForumMessage> messages1 = forumService1.getMessagesByCommunityIDAndFilter(1, rf1);
						for (ForumMessage message : messages1) {
						%>
							<div class="discussion">
								<img src="/community/people/<%= message.getUser().getUsername() %>/avatar/16.png" width="16" height="16" alt="" />
									<b><%= message.getUser().getUsername() %></b> in
									"<a href='/community/message/<%= message.getID() %>'><%= message.getSubject() %></a>"
							</div>
						<% } %>
                        </cache:cache>
											
					<h4>Recent Releases</h4>
						<cache:cache time="60" key="/community/community/feeds/allcontent?communityID=2017">
						<%
						ForumService forumService2 = serviceProvider.getForumService();
						ResultFilter rf2 = new ResultFilter();
                        rf2.setSortField(9); // modification date
                        rf2.setSortOrder(SORT_DESCENDING);
						rf2.setRecursive(true);
						rf2.setNumResults(5);
						List<ForumMessage> messages2 = forumService2.getMessagesByCommunityIDAndFilter(2017, rf2);
						 for (ForumMessage message : messages2) {
                        %>
							<div class="news">
								<font color="#888888"><%= DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(message.getCreationDate().toGregorianCalendar().getTime()) %> - </font>
								<a href='/community/message/<%= message.getID() %>'><%= message.getSubject() %></a>
							</div>
						<% } %>
						</cache:cache>
					

                    <h4>Recent Articles</h4>
                        <div class="articles"><a href="/support/articles/motd_plugin.jsp">Openfire Plugin Development: Message of the Day</a></div>                        
                        <div class="articles"><a href="/support/articles/pubsub.jsp">All About Pubsub</a></div>
                        <div class="articles"><a href="/support/articles/sparkplug_day.jsp">Sparkplug Day</a></div>
                        <div class="articles"><a href="/support/articles/filetransfer.jsp">IM File Transfer Made Easy</a></div>
                        <div class="articles"><a href="/support/articles/openfire_optimization.jsp">Behind the Scenes: Openfire Optimization</a></div>

                    <h4>Whitepapers</h4>
                        <div class="articles"><a href="/about/jive_caseforim_wp.pdf">Why Your Business Should Use Enterprise Instant Messaging Now</a></div>
                        <div class="articles"><a href="/about/jive_xmpp_wp.pdf">XMPP: The Protocol for Open, Extensible Instant Messaging</a></div>
                        <div class="articles"><a href="/about/jive_bestpractices_wp.pdf">Building a Successful Online Community with Jive Forums</a></div>
                        <div class="articles"><a href="/about/OpenfireScalability.pdf">Openfire Scalability Test Results</a></div>
                    </div>

					<!-- END recent discussions, news, wiki docs, and articles -->

				</div>
				<!-- END 'in the community' column -->
				
			</div>
			<!-- END home page body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
			<!-- BEGIN grey gradient sidebar box 'PROJECTS' -->
			<div class="ignite_sidebar_gradbox">
				<div class="ignite_sidebar_top-g"></div>
				<div class="ignite_sidebar_hdr ignite_sidebar_hdr_projects"></div>
				<div class="ignite_sidebar_body_projects">
					<div class="ignite_sidebar_body_project1">
						<span><strong><a href="/projects/openfire/index.jsp">Openfire</a></strong> <%= Versions.getVersion("openfire") %></span> <a href="/downloads/index.jsp#openfire"></a>
					</div>
					<div class="ignite_sidebar_body_project2">
						<span><strong><a href="/projects/spark/index.jsp">Spark</a></strong> <%= Versions.getVersion("spark") %></span> <a href="/downloads/index.jsp#spark"></a>
					</div>
					<div class="ignite_sidebar_body_project3">
						<span><strong><a href="/projects/sparkweb/index.jsp">SparkWeb</a></strong> <%= Versions.getVersion("sparkweb") %></span> <a href="/downloads/index.jsp#sparkweb"></a>
					</div>
					<%--
					<div class="ignite_sidebar_body_project4">
						<span><strong><a href="/projects/asterisk/index.jsp">Asterisk</a></strong> <%= Versions.getVersion("asterisk-im") %></span> <a href="/downloads/index.jsp#asterisk"></a>
					</div>
					--%>
					<div class="ignite_sidebar_body_project4">
						<span><strong><a href="/projects/smack/index.jsp">Smack API</a></strong> <%= Versions.getVersion("smack") %></span> <a href="/downloads/index.jsp#smack"></a>
					</div>
                    <div class="ignite_sidebar_body_project5">
						<span><strong><a href="/projects/tinder/index.jsp">Tinder API</a></strong> <%= Versions.getVersion("tinder") %></span> <a href="/downloads/index.jsp#tinder"></a>
					</div>
					<div class="ignite_sidebar_body_project6">
						<span><strong><a href="/projects/whack/index.jsp">Whack API</a></strong> <%= Versions.getVersion("whack") %></span> <a href="/downloads/index.jsp#whack"></a>
					</div>
					<div class="ignite_sidebar_body_project7">
						<span><strong><a href="/projects/xiff/index.jsp">XIFF API</a></strong> <%= Versions.getVersion("xiff") %></span> <a href="/downloads/index.jsp#xiff"></a>
					</div>
					<div class="ignite_sidebar_body_project8" style="text-align: center;">
						<strong><a href="/roadmap.jsp">Roadmap</a></strong>
					</div>
				</div>
				<div class="ignite_sidebar_btm-g"></div>
			</div>
			<!-- END grey gradient sidebar box 'PROJECTS' -->
			<%@ include file="/includes/sidebar_48hrsnapshot.jspf" %>
			
            <%@ include file="/includes/sidebar_newsletter.jspf" %>
			
            <jsp:include page="/includes/sidebar_screenshot.jsp" />
			
			<%@ include file="/includes/sidebar_testimonial.jspf" %>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>
