<%@ page import="com.jivesoftware.community.webservices.WSBlogPost" %>
<%@ page import="java.util.List" %><%
WSBlogPost[] posts = (WSBlogPost[])request.getAttribute("posts");
String style = "";
int counter = 0;
if (posts != null) {

for (WSBlogPost post : posts) {
    counter++;
    style = counter % 2 == 0 ? "ignite_blog_entry ignite_blog_entry_odd" : "ignite_blog_entry";
	%>
	<div class="<%= style %>">
        <div class="ignite_blog_entry_header">
			<img src="http://community.igniterealtime.org/people/<%= post.getUser().getUsername() %>/avatar/32.png" 
				alt="<%= post.getUser().getUsername() %>"
				width="32" height="32" />
				
			<div class="ignite_blog_entry_comments">
				<a href="<%= post.getPermalink() %>#comments"><%= post.getCommentCount() %></a>
			</div>

			<h2><a href="<%= post.getPermalink() %>" title="<%= post.getSubject() %>"><%= post.getSubject() %></a></h2>

            <!-- BEGIN blog entry author and datestamp -->
            <span class="ignite_blog_entry_author">
                Posted by <a href="http://community.igniterealtime.org/people/<%= post.getUser().getUsername() %>/"><%= post.getUser().getUsername() %></a>
            </span>
            <span class="ignite_blog_entry_date">

		<%= org.jivesoftware.util.StringUtils.displayFriendly(post.getPublishDate()) %>
            </span>
            <!-- END blog entry author and datestamp -->
        </div>
	
        <!-- END blog entry header area -->

        <!-- BEGIN blog entry body area -->
        <div class="ignite_blog_entry_body">
			<%= post.getBody() %>
        </div>
        <!-- END blog entry body area -->

        <!-- BEGIN blog entry details -->
        <div class="ignite_blog_entry_details">
            <span class="ignite_blog_entry_details_tags">Tags:
				<% String[] tags = post.getTags(); %>
				<% if (null != tags) { %>
				<% 	for (int i=0; i<tags.length; i++) { %>
					<% if (i > 0) { %>,<% } %> 
					<a href="http://community.igniterealtime.org/blogs/ignite/tags/<%= tags[i] %>"><%= tags[i] %></a>
				<% 	} %>
				<% } %>
            </span>
            <span class="ignite_blog_entry_details_comments">
                <a href="<%= post.getPermalink() %>"><%= post.getCommentCount() %></a>
            </span>
        </div>
        <!-- END blog entry details-->
    </div>
<% } 

}%>
