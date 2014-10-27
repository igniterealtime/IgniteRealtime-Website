<%@ page import="com.jivesoftware.community.webservices.ForumService" %>
<%@ page import="com.jivesoftware.community.webservices.WSResultFilter" %>
<%@ page import="com.jivesoftware.community.webservices.WSForumMessage" %>
<%@ page import="java.util.List" %>
<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
    <%
        String baseUrl = config.getServletContext().getInitParameter("csc_baseurl");
        String restBaseUrl = baseUrl+"/api/core/v3";
        String forumId = request.getParameter("forumID");
        String recentReleasesPlace = restBaseUrl+"/places?filter=entityDescriptor(14,"+forumId+")";
    %>
		<!-- BEGIN blue sidebar box 'RECENT DISCUSSIONS' -->
    <cache:cache time="60" key="<%= recentReleasesPlace %>">
    <div class="ignite_sidebar_whitebox">
        <div class="ignite_sidebar_top"></div>
        <div class="ignite_sidebar_hdr ignite_sidebar_hdr_forum"></div>
        <div class="ignite_sidebar_body">
    <% try { %>
        <%
            RestClient client = new RestClient();
            JSONObject result = client.get(recentReleasesPlace);
            JSONArray placesList = result.getJSONArray("list");
            JSONObject place = placesList.getJSONObject(0);
            JSONObject placeResources = place.getJSONObject("resources");
            JSONObject placeContents = placeResources.getJSONObject("contents");
            String recentMessagesUrl = placeContents.getString("ref")+"?filter=type(discussion)&count=5";

      <% String forumRSS = "/forum/rss/rssmessages.jspa?numItems=5&forumID=" + request.getParameter("forumID"); %>
			
		<!-- BEGIN blue sidebar box 'RECENT DISCUSSIONS' -->
		<cache:cache time="60" key="<%= forumRSS %>">
		<div class="ignite_sidebar_whitebox">
			<div class="ignite_sidebar_top"></div>
			<div class="ignite_sidebar_hdr ignite_sidebar_hdr_forum"></div>
			<div class="ignite_sidebar_body">
				<%
				ForumService forumServiceFA = serviceProvider.getForumService();
                WSResultFilter rfFA = new WSResultFilter();
                rfFA.setSortField(9); // modification date
                rfFA.setSortOrder(SORT_DESCENDING);
				rfFA.setRecursive(true);
				rfFA.setNumResults(5);
                String style = "";
				int counter = 0;
				WSForumMessage[] messagesFA = forumServiceFA.getMessagesByCommunityIDAndFilter(Long.parseLong(request.getParameter("forumID")), rfFA);
                if (null != messagesFA) {
				for (WSForumMessage message : messagesFA) {
					counter++;
					style = "ignite_sidebar_forum_" + (counter % 2);
				%>
				<div class="ignite_sidebar_forum <%= style %>">
					<img src="http://community.igniterealtime.org/people/<%= message.getUser().getUsername() %>/avatar/16.png" width="16" height="16" alt="" />
					<div>
						<b><%= message.getUser().getUsername() %></b> in
						"<a href='http://community.igniterealtime.org/message/<%= message.getID() %>'><%= message.getSubject() %></a>"
					</div>
			   </div>
				
				<% }
                } %>
    <% } catch (Exception e) { %>
        <cache:usecached />
    <% } %>
			</div>
			<div class="ignite_sidebar_btm"></div>
		</div>
		</cache:cache>
		<!-- END blue sidebar box 'RECENT DISCUSSIONS' -->