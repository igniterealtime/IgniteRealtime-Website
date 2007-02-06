<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
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

                <% String blogFeedRSS = "http://www.igniterealtime.org/blog/category/general/feed"; %>
                <!-- BEGIN 'latest blog entries' column -->
				<div id="ignite_home_body_leftcol">
					<!-- BEGIN blog header -->
					<div id="ignite_blog_header">
						<span id="ignite_blog_header_label">
							Latest <a href="http://www.igniterealtime.org/blog">Blog</a> Entries
						</span>
						<div style="float: right;">
                            <%--
                            <span id="ignite_blog_header_postlink">
								<a href="#">Post a blog entry</a>
							</span>
							--%>
							<span id="ignite_blog_header_rss">
							 	<a href="<%= blogFeedRSS %>"><img src="images/rss.gif" width="16" height="16" border="0" alt="" /></a>
							</span>
						</div>
					</div>
					<!-- END blog header -->

                    <%-- Show blog feed --%>
                    <cache:cache time="600" key="<%= blogFeedRSS %>">
                    <c:import url="<%= blogFeedRSS %>" var="blogFeedxml" />
                    <c:import url="/xsl/blog_feed.xsl" var="blogFeedxsl" />
                    <x:transform xml="${blogFeedxml}" xslt="${blogFeedxsl}" />
                    </cache:cache>
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
						<div style="float: left;">
						<a href="http://www.igniterealtime.org/forum/profile.jspa?userID=4739">
							<div class="ignite_home_featured_avatar">
							<img src="/images/avatars/ryang.png" alt="avatar" width="32" height="32" />
							</div>
                        ryang</a>
						</div>
						
						<!-- featured member 2 -->
						<div style="float: right;">
						<a href="http://www.igniterealtime.org/forum/profile.jspa?userID=8189">
							<div class="ignite_home_featured_avatar">
							 <img src="/images/avatars/jadestorm.png" alt="avatar" width="32" height="32" />
							</div>
                        jadestorm</a>
						</div>
					</div>
					<!-- END featured members -->
					
					<!-- BEGIN recent discussions, news, wiki docs, and articles -->
					<div id="ignite_home_body_recent">
					<h4>Recent Discussions</h4>
						<% String forumRSS = "http://www.igniterealtime.org/forum/rss/rssmessages.jspa?categoryID=1&numItems=5"; %>
						<cache:cache time="60" key="<%= forumRSS %>">
						<c:import url="<%=forumRSS%>" var="threadsxml" />
                        <c:import url="/xsl/threads_home.xsl" var="threadsxsl" />
                        <x:transform xml="${threadsxml}" xslt="${threadsxsl}" />
                        </cache:cache>
											
					<h4>Recent Releases</h4>
						<% String newsRSS = "http://www.igniterealtime.org/forum/rss/rssmessages.jspa?forumID=45&numItems=5"; %>
						<cache:cache time="60" key="<%= newsRSS %>">
						<c:import url="<%=newsRSS%>" var="newsxml" />
            <c:import url="/xsl/news.xsl" var="newsxsl" />
            <x:transform xml="${newsxml}" xslt="${newsxsl}" />
			      </cache:cache>
					

                    <h4>Recent Articles</h4>
                        <div class="articles"><a href="/support/articles/pubsub.jsp">All About Pubsub</a></div>
                        <div class="articles"><a href="/support/articles/sparkplug_day.jsp">Sparkplug Day</a></div>
                        <div class="articles"><a href="/support/articles/filetransfer.jsp">IM File Transfer Made Easy</a></div>
                        <div class="articles"><a href="/support/articles/wildfire_optimization.jsp">Behind the Scenes: Wildfire Optimization</a></div>

                    <h4>Whitepapers</h4>
                        <div class="articles"><a href="/about/jive_caseforim_wp.pdf">Why Your Business Should Use Enterprise Instant Messaging Now</a></div>
                        <div class="articles"><a href="/about/jive_xmpp_wp.pdf">XMPP: The Protocol for Open, Extensible Instant Messaging</a></div>
                        <div class="articles"><a href="/about/jive_bestpractices_wp.pdf">Building a Successful Online Community with Jive Forums</a></div>
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
						<span><strong><a href="/projects/wildfire/index.jsp">Wildfire</a></strong> <%= Versions.getVersion("wildfire") %></span> <a href="/downloads/index.jsp#wildfire"></a>
					</div>
					<div class="ignite_sidebar_body_project2">
						<span><strong><a href="/projects/spark/index.jsp">Spark</a></strong> <%= Versions.getVersion("spark") %></span> <a href="/downloads/index.jsp#spark"></a>
					</div>
					<%--
					<div class="ignite_sidebar_body_project3">
						<span><strong><a href="/projects/asterisk/index.jsp">Asterisk</a></strong> <%= Versions.getVersion("asterisk-im") %></span> <a href="/downloads/index.jsp#asterisk"></a>
					</div>
					--%>
					<div class="ignite_sidebar_body_project4">
						<span><strong><a href="/projects/smack/index.jsp">Smack API</a></strong> <%= Versions.getVersion("smack") %></span> <a href="/downloads/index.jsp#smack"></a>
					</div>
					<div class="ignite_sidebar_body_project4">
						<span><strong><a href="/projects/xiff/index.jsp">XIFF API</a></strong> <%= Versions.getVersion("xiff") %></span> <a href="/downloads/index.jsp#xiff"></a>
					</div>
					<div class="ignite_sidebar_body_project5" style="text-align: center;">
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