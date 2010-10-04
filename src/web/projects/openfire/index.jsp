<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="com.jivesoftware.community.webservices.*" %>
<%@ page import="java.util.List" %>
<%@ page import="org.jivesoftware.site.FeedManager" %>
<%@ page import="com.sun.syndication.feed.synd.SyndEntry" %>

<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="i" %>

<%@ include file="/includes/ws_locator.jspf" %>

<html>
<head>
<title>Openfire Server</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="openfire" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Openfire</a></li>
			<li id="subnav02"><a href="screenshots.jsp">Screenshots</a></li>
			<li id="subnav03"><a href="plugins.jsp">Plugins</a></li>
			<li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
			<li id="subnav05"><a href="http://issues.igniterealtime.org/browse/OF">Issue Tracker</a></li>
			<li id="subnav06"><a href="/builds/openfire/docs/latest/documentation/javadoc/">JavaDocs</a></li>
			<li id="subnav07"><a href="connection_manager.jsp">Connection Manager Module</a></li>
            <li id="subnav08"><a href="../../roadmap.jsp">Roadmap</a></li>
        </ul>
	</div>

	<!-- BEGIN body area -->
	<div id="ignite_body">
		
		<!-- BEGIN left column (main content) -->
		<div id="ignite_body_leftcol">
			
			<!-- BEGIN large panel -->
			<!-- 
				if there is no cookie, show this panel
				(there is an 'onload' in the decorator that runs a script from 
				/scripts/ignite.js, may want to change that).
				the cookie is defined by the meta 'panel-name' in the head, and
				set with the onclick of the links below, closePanel().
			-->
			<% boolean panelCookieSet = false;
			   Cookie [] cookies = request.getCookies();
				 if (cookies != null) {
			       for (Cookie cookie: request.getCookies()) {
                if (cookie.getName().equals("openfire")) {
						      panelCookieSet = true;
					      }
				     }
			   }
			%>
			<div id="ignite_bigpanel" <% if (!panelCookieSet) { %> style="display:block" <% } %>>
				<div id="ignite_bigpanel_content">
					<h1 class="openfire">Openfire <span><%= Versions.getVersion("openfire") %></span></h1>
					<p>Openfire is a real time collaboration (RTC) server licensed under
					the Open Source GPL.
                    It uses the only widely adopted open protocol for instant messaging, XMPP
                    (also called Jabber). Openfire is incredibly easy to setup and administer, but offers
                    rock-solid security and performance.</p>
				</div>
				
				<div id="ignite_bigpanel_close">
					<a href="#" onClick="closePanel('openfire'); return false;"></a>
				</div>
				
				<div id="ignite_bigpanel_screenshot">
					<img src="/images/ignite_screenshot_openfire3.gif" width="210" height="210" alt="" />
					<a href="screenshots.jsp">More screens</a>
				</div>
				
				<div id="ignite_bigpanel_download">
					<a href="/downloads/index.jsp#openfire">Download</a>
					<span>
						<strong>Openfire <%= Versions.getVersion("openfire") %></strong> Latest release: <%= Versions.getVersionDate("openfire") %>
					</span>
				</div>
				
			</div>
			<!-- END large panel -->
			
			<!-- BEGIN small panel -->
			<!-- 
				if there is a cookie, show this panel
				(same details as above for 'large panel')
			-->
			<div id="ignite_smallpanel" <% if (panelCookieSet) { %> style="display:block" <% } %>>
				<h1 class="openfire">Openfire <span><%= Versions.getVersion("openfire") %></span></h1>
				<div id="ignite_smallpanel_open">
					<a href="#" onClick="closePanel('openfire'); return false;"></a>
				</div>
			</div>
			<!-- END small panel -->
			
			
			<!-- BEGIN home page body content area -->
			<div id="ignite_int_body">

                <% String blogFeedRSS = "http://community.igniterealtime.org/blogs/ignite/feeds/tags/openfire"; %>
                <!-- BEGIN 'latest blog entries' column -->
				<div id="ignite_int_body_widecol">
					<!-- BEGIN blog header -->
					<div id="ignite_blog_header">
						<span id="ignite_blog_header_label">
							Latest Blog Entries
						</span>
						<div style="float: right;">
                            <span id="ignite_blog_header_rss">
							 	<a href="<%= blogFeedRSS %>"><img src="/images/rss.gif" width="16" height="16" border="0" alt="" /></a>
							</span>
						</div>
					</div>
					<!-- END blog header -->
					
                    <%-- Show blog feed --%>
					<cache:cache time="600" key="<%= blogFeedRSS %>">
					<%
                    FeedManager feedManager = FeedManager.getInstance();
                    List<SyndEntry> blogFeedEntries = feedManager.getBlogFeedEntries(blogFeedRSS);
					BlogService blogService = serviceProvider.getBlogService();

					WSBlogPostResultFilter bprf = new WSBlogPostResultFilter();
					bprf.setNumResults(5);
                    bprf.setBlogID((long) NULL_INT);
                    bprf.setSortField(600); // publish date
                    bprf.setSortOrder(SORT_DESCENDING);
        			String[] tags = {"openfire", "wildfire"};
                    bprf.setTags(tags);            
                    WSBlogPost[] posts = blogService.getBlogPosts(bprf);
                    if ( (null != posts) && (null != blogFeedEntries) ) {
                        for (WSBlogPost post: posts) {
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
					<i:blogposts posts="${posts}"/>
                    </cache:cache>
				</div>
				<!-- END 'latest blog entries' column -->
				
			</div>
			<!-- END home page body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
            <jsp:include page="/includes/sidebar_projectlead.jsp">
                <jsp:param name="project" value="openfire" />
            </jsp:include>
			
			<jsp:include page="/includes/sidebar_snapshot.jsp">
			    <jsp:param name="project" value="openfire"/>
			</jsp:include>
			
			<%@ include file="/includes/sidebar_enterprise.jspf" %>
			
		</div>
		<!-- END right column (sidebar) -->	
	</div>
	<!-- END body area -->



</body>
</html>
