<%@ page import="org.jivesoftware.webservices.RestClient" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="net.sf.json.JSONArray" %>

<%@ taglib uri="oscache" prefix="cache" %>
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
        <%
            RestClient client = new RestClient();
            JSONObject result = client.get(recentReleasesPlace);
            JSONArray placesList = result.getJSONArray("list");
            JSONObject place = placesList.getJSONObject(0);
            JSONObject placeResources = place.getJSONObject("resources");
            JSONObject placeContents = placeResources.getJSONObject("contents");
            String recentMessagesUrl = placeContents.getString("ref")+"?filter=type(discussion)&count=5";

            result = client.get(recentMessagesUrl);
            JSONArray messages = result.getJSONArray("list");
            int counter = 0;
            String style = "";

            for (Object messageObject : messages) {
                if (! (messageObject instanceof JSONObject)) {
                    continue;
                    // skip non-JSONObject
                }
                JSONObject message = (JSONObject)messageObject;

                JSONObject author = message.getJSONObject("author");
                String authorAvatarUrl = author.getJSONObject("resources").getJSONObject("avatar").getString("ref");
                String authorName = author.getString("displayName");
                String messageUrl = message.getJSONObject("resources").getJSONObject("html").getString("ref");
                String subject = message.getString("subject");

                counter++;
                style = "ignite_sidebar_forum_" + (counter % 2);
        %>
                <div class="ignite_sidebar_forum <%= style %>">
                    <img src="<%= authorAvatarUrl %>" width="16" height="16" alt="" />
                    <div>
                        <b><%= authorName %></b> in
                        "<a href='<%= messageUrl %>'><%= subject %></a>"
                    </div>
                </div>
        <%
            }
        %>
			</div>
			<div class="ignite_sidebar_btm"></div>
		</div>
		</cache:cache>
		<!-- END blue sidebar box 'RECENT DISCUSSIONS' -->