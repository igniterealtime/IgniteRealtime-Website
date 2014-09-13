<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.webservices.RestClient" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="net.sf.json.JSONArray" %>

<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Asterisk-IM</title>
<meta name="body-id" content="projects" />
<meta name="panel-name" content="asterisk" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Asterisk-IM</a></li>
			<li id="subnav02"><a href="screenshots.jsp">Screenshots</a></li>
			<!-- <li id="subnav03"><a href="plugins.jsp">Plugins</a></li> -->
			<li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
			<li id="subnav05"><a href="http://issues.igniterealtime.org/browse/PHONE">Issue Tracker</a></li>
			<!-- <li id="subnav06"><a href="/builds/asterisk-im/docs/latest/javadoc/">JavaDocs</a></li> -->
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
                if (cookie.getName().equals("asterisk")) { 
						      panelCookieSet = true;
					      }
				     }
			   }
			%>
			<div id="ignite_bigpanel" <% if (!panelCookieSet) { %> style="display:block" <% } %>>
				<div id="ignite_bigpanel_content">
					<h1 class="asterisk">Asterisk-IM <span><%= Versions.getVersion("asterisk-im") %></span></h1>
					<p>The Asterisk-IM project integrates the <a href="http://www.asterisk.org/" target="_blank">Asterisk
<acronym title="Private Branch eXchange -- A Phone System">PBX</acronym></a> and Openfire XMPP
(Jabber) server to create a unified communication platform for telephony and instant messaging.</p>
					<p>Asterisk-IM is easily deployed as a plugin for <a href="../openfire/index.jsp">Openfire</a> and is
fully supported in the <a href="../spark/index.jsp">Spark</a> IM client. Read more about Asterisk-IM's <a href="arch.jsp">architecture</a> or find out more about <a href="clients.jsp">client compatability</a>.</p>
				</div>
				
				<div id="ignite_bigpanel_close">
					<a href="#" onClick="closePanel('asterisk'); return false;"></a>
				</div>
				
				<div id="ignite_bigpanel_screenshot">
					<img src="/images/ignite_screenshot_asterisk.gif" width="210" height="210" alt="" />
					<a href="screenshots.jsp">More screens</a>
				</div>
				
				<div id="ignite_bigpanel_download">
					<a href="/openfire/plugins.jsp">Download</a> 
					<span>
						<strong>Asterisk-IM <%= Versions.getVersion("asterisk-im") %></strong> Latest build: <%= Versions.getVersionDate("asterisk-im") %>
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
				<h1 class="asterisk">Asterisk-IM <span><%= Versions.getVersion("asterisk-im") %></span></h1>
				<div id="ignite_smallpanel_open">
					<a href="#" onClick="closePanel('asterisk'); return false;"></a>
				</div>
			</div>
			<!-- END small panel -->
			
			
			<!-- BEGIN home page body content area -->
			<div id="ignite_int_body">
            <%
                String baseUrl = config.getServletContext().getInitParameter("csc_baseurl");
                String restBaseUrl = baseUrl+"/api/core/v3";
                String chosenTag = "asterisk";
                String blogFeedRSS = baseUrl+"/blogs/ignite/feeds/tags/"+chosenTag;
                String blogRestUrl = restBaseUrl +"/contents?count=5&includeBlogs=true&filter=type(post)&filter=tag("+chosenTag+")";
            %>
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
                <% try { %>
                <%
                    RestClient client = new RestClient();
                    JSONObject result = client.get(blogRestUrl);
                    JSONArray posts = result.getJSONArray("list");
                    request.setAttribute("posts", posts);
                %>
					<jsp:include page="/includes/blogposts.jsp" />
                <% } catch (Exception e) { %>
                    <cache:usecached />
                <% } %>
                    </cache:cache>
				</div>
				<!-- END 'latest blog entries' column -->
				
			</div>
			<!-- END home page body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
            <jsp:include page="/includes/sidebar_projectside.jsp">
                <jsp:param name="project" value="asterisk-im"/>
            </jsp:include>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>
