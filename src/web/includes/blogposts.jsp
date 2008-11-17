<%@ page import="com.jivesoftware.clearspace.webservices.BlogPost" %>
<%@ page import="java.util.List" %><%
List<BlogPost> posts = (List<BlogPost>)request.getAttribute("posts"); 
String style = "";
int counter = 0;
if (posts != null) {
	System.out.println("Num posts="+posts.size());
for (BlogPost post : posts) {
    System.out.println("post counter="+counter);
	System.out.println("post link="+post.getPermalink());
	counter++;
    style = counter % 2 == 0 ? "ignite_blog_entry ignite_blog_entry_odd" : "ignite_blog_entry";
	%>
	<div class="<%= style %>">
        <div class="ignite_blog_entry_header">
			<img src="/community/people/<%= post.getUser().getUsername() %>/avatar/32.png" 
				alt="<%= post.getUser().getUsername() %>"
				width="32" height="32" />
				
			<div class="ignite_blog_entry_comments">
				<a href="<%= post.getPermalink() %>#comments"><%= post.getCommentCount() %></a>
			</div>

			<% System.out.println("post subject="+post.getSubject()); %>
			<h2><a href="<%= post.getPermalink() %>" title="<%= post.getSubject() %>"><%= post.getSubject() %></a></h2>

            <!-- BEGIN blog entry author and datestamp -->
            <span class="ignite_blog_entry_author">
                Posted by <a href="/community/people/<%= post.getUser().getUsername() %>/"><%= post.getUser().getUsername() %></a>
            </span>
            <span class="ignite_blog_entry_date">

		<% System.out.println("post publishdate="+org.jivesoftware.util.StringUtils.displayFriendly(post.getPublishDate().toGregorianCalendar().getTime())); %>

		<%= org.jivesoftware.util.StringUtils.displayFriendly(post.getPublishDate().toGregorianCalendar().getTime()) %>
            </span>
            <!-- END blog entry author and datestamp -->
        </div>
	
        <!-- END blog entry header area -->

        <!-- BEGIN blog entry body area -->
        <div class="ignite_blog_entry_body">
			<% System.out.println("post body="+post.getBody()); %>
			<%= post.getBody().replaceAll("<body>","").replaceAll("</body>", "").replaceAll("pre __jive_macro_name=\"quote\"", "pre class=\"jive_quote\"") %>
        </div>
        <!-- END blog entry body area -->

        <!-- BEGIN blog entry details -->
        <div class="ignite_blog_entry_details">
            <span class="ignite_blog_entry_details_tags">Tags:
				<% List<String> tags = post.getTags(); %>
				<% for (int i=0; i<tags.size(); i++) { %>
					<% if (i > 0) { %>,<% } %> 
					<a href="/community/blogs/ignite/tags/<%= tags.get(i) %>"><%= tags.get(i) %></a>
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
