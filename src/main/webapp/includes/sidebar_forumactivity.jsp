<%@ page import="org.jivesoftware.site.FeedManager" %>
<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    String baseUrl = config.getServletContext().getInitParameter("discourse_baseurl");
    if ( baseUrl == null || baseUrl.isEmpty() )
    {
        baseUrl = "https://discourse.igniterealtime.org/";
    }
    String discourseCategory = request.getParameter("discourseCategory");

    request.setAttribute("baseUrl", baseUrl);
    request.setAttribute("feedUrl", "/c/" + discourseCategory + ".rss");
    request.setAttribute("feedManager", FeedManager.getInstance());
%>
<cache:cache time="60" key="${baseUrl.concat(feedUrl)}">
    <div class="sidebar sidebar_light">
        <h1 class="sidebar_header">Latest Discussions</h1>
        <c:forEach items="${feedManager.getSummaryItems( baseUrl, feedUrl, 5 )}" var="item">
            <div class="discussion">
                <img src="${feedManager.getAvatarUrl(baseUrl, item, 16)}" width="16" height="16" alt="" />
                <b>${item.authorName}</b> in "<a href='${item.messageUrl}'>${item.subject}</a>"
            </div>
        </c:forEach>
    </div>
</cache:cache>
