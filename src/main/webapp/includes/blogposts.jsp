<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="java.util.Date" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.slf4j.LoggerFactory" %><%
String baseUrl = config.getServletContext().getInitParameter("csc_baseurl");
JSONArray posts = (JSONArray)request.getAttribute("posts");
String style = "";
int counter = 0;
if (posts != null) {

for (Object postObject : posts) {
    if (! (postObject instanceof JSONObject)) {
        continue;
        // skip non-JSONObject
    }
    JSONObject post = (JSONObject)postObject;
    counter++;
    style = counter % 2 == 0 ? "ignite_blog_entry ignite_blog_entry_odd" : "ignite_blog_entry";

    JSONObject author = post.getJSONObject("author");
    String authorAvatarUrl = author.getJSONObject("resources").getJSONObject("avatar").getString("ref");
    String authorUrl = author.getJSONObject("resources").getJSONObject("html").getString("ref");
    String authorName = author.getString("displayName");
    String permalink = post.getString("permalink");
    String replyCount = post.getString("replyCount");
    String subject = post.getString("subject");
    String published = post.getString("published");
    if (StringUtils.endsWith(published, "+0000")) {
        published = StringUtils.replace(published, "+0000", "+00:00");
    }
    String publishDate = post.getString("publishDate");
    if (StringUtils.endsWith(publishDate, "+0000")) {
        publishDate = StringUtils.replace(publishDate, "+0000", "+00:00");
        }
    Date datePublished = new Date();
    try {
        if (null == publishDate) {
            datePublished = javax.xml.bind.DatatypeConverter.parseDate(published).getTime();
        } else {
            datePublished = javax.xml.bind.DatatypeConverter.parseDate(publishDate).getTime();
        }
    } catch (Exception e) {
        LoggerFactory.getLogger( this.getClass() ).warn( "Unable to parse publication date.", e );
    }
    String body = StringUtils.removeEnd(StringUtils.removeStart(post.getJSONObject("content").getString("text"), "<body>"), "</body>");
    body = body.replaceAll( "href=\"/external-link.jspa", "href=\""+baseUrl+"/external-link.jspa" );
    String parentUrl = post.getJSONObject("parentPlace").getString("html");
    String[] tags = new String[post.getJSONArray("tags").size()];
    int tagsi = 0;
    for (Object o: post.getJSONArray("tags")) {
        if (o instanceof String) {
            tags[tagsi] = (String)o;
            tagsi++;
        }
    }

	%>
	<div class="<%= style %>">
        <div class="ignite_blog_entry_header">
            <img src="<%= authorAvatarUrl %>"
				alt="<%= authorName %>"
				width="32" height="32" />
				
			<div class="ignite_blog_entry_comments">
				<a href="<%= permalink %>#comments"><%= replyCount %></a>
			</div>

			<h2><a href="<%= permalink %>" title="<%= subject %>"><%= subject %></a></h2>

            <!-- BEGIN blog entry author and datestamp -->
            <span class="ignite_blog_entry_author">
                Posted by <a href="<%= authorUrl %>/"><%= authorName %></a>
            </span>
            <span class="ignite_blog_entry_date">

		<%= org.jivesoftware.util.StringUtils.displayFriendly(datePublished) %>
            </span>
            <!-- END blog entry author and datestamp -->
        </div>
	
        <!-- END blog entry header area -->

        <!-- BEGIN blog entry body area -->
        <div class="ignite_blog_entry_body">
			<%= body %>
        </div>
        <!-- END blog entry body area -->

        <!-- BEGIN blog entry details -->
        <div class="ignite_blog_entry_details">
            <span class="ignite_blog_entry_details_tags">Tags:
				<% if (null != tags) { %>
				<% 	for (int i=0; i<tags.length; i++) { %>
					<% if (i > 0) { %>,<% } %> 
					<a href="<%= parentUrl %>/tags/<%= tags[i] %>"><%= tags[i] %></a>
				<% 	} %>
				<% } %>
            </span>
            <span class="ignite_blog_entry_details_comments">
                <a href="<%= permalink %>"><%= replyCount %></a>
            </span>
        </div>
        <!-- END blog entry details-->
    </div>
<% } 

}%>
