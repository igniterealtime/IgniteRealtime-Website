<%@ page import="com.jivesoftware.community.webservices.*"%>
<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

      <% String forumRSS = "http://www.igniterealtime.org/forum/rss/rssmessages.jspa?numItems=5&forumID=" + request.getParameter("forumID"); %>
			
		<!-- BEGIN blue sidebar box 'RECENT DISCUSSIONS' -->
		<cache:cache time="60" key="<%= forumRSS %>"> 
		<div class="ignite_sidebar_whitebox">
			<div class="ignite_sidebar_top"></div>
			<div class="ignite_sidebar_hdr ignite_sidebar_hdr_forum"></div>
			<div class="ignite_sidebar_body">
				<%
				ServiceLocator locator = new ServiceLocator("http://www.igniterealtime.org/community", "webservices", "webservicesadmin");
				ForumService forumService = locator.getForumService();
		  		ResultFilter rf = ResultFilter.createDefaultMessageFilter();
				rf.setSortOrder(ResultFilter.DESCENDING);
				rf.setRecursive(true);
				rf.setNumResults(5);
				String style = "";
				int counter = 0;
				ForumMessage[] messages = forumService.getMessagesByCommunityIDAndFilter(Long.parseLong(request.getParameter("forumID")), rf);
				for (ForumMessage message : messages) {
					counter++;
					style = "ignite_sidebar_forum_" + (counter % 2);
				%>
				<div class="ignite_sidebar_forum <%= style %>">
					<img src="/community/people/<%= message.getUser().getUsername() %>/avatar/16.png" width="16" height="16" alt="" />
					<div>
						<b><%= message.getUser().getUsername() %></b> in
						"<a href='/community/message/<%= message.getID() %>'><%= message.getSubject() %></a>"
					</div>
			   </div>
				
				<% } %>
			</div>
			<div class="ignite_sidebar_btm"></div>
		</div>
		</cache:cache>
		<!-- END blue sidebar box 'RECENT DISCUSSIONS' -->