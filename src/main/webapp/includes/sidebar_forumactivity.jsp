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
    String headerText = request.getParameter("headerText");
    String subHeaderText = request.getParameter("subHeaderText");
    String sidebarClasses = request.getParameter("sidebarClasses");
    boolean hideAuthor = Boolean.parseBoolean(request.getParameter("hideAuthor"));

    request.setAttribute("baseUrl", baseUrl);
    request.setAttribute("feedUrl", discourseCategory + ".rss");
    request.setAttribute("feedManager", FeedManager.getInstance());
    request.setAttribute("headerText", headerText);
    request.setAttribute("sidebarClasses", sidebarClasses);
    request.setAttribute("subHeaderText", subHeaderText);
    request.setAttribute("hideAuthor", hideAuthor);
%>
<div class="sidebar ${not empty sidebarClasses ? sidebarClasses : 'sidebar_light'}">
    <h1 class="sidebar_header"><c:out value="${not empty headerText ? headerText : 'Latest Discussions'}"/></h1>
    <c:if test="${not empty subHeaderText}">
        <h4><c:out value="${subHeaderText}"/></h4>
    </c:if>
    <cache:cache time="60" key="${baseUrl.concat(feedUrl).concat(hideAuthor)}">
        <c:forEach items="${feedManager.getSummaryItems( baseUrl, feedUrl, 5 )}" var="item">
            <div class="discussion">
                <c:choose>
                    <c:when test="${hideAuthor}">
                        <a href='${item.messageUrl}'><c:out value="${item.subject}"/></a>
                    </c:when>
                    <c:otherwise>
                        <img src="${feedManager.getAvatarUrl(baseUrl, item, 16)}" width="16" height="16" alt="" />
                        <b>${item.authorName}</b> in "<a href='${item.messageUrl}'><c:out value="${item.subject}"/></a>"
                    </c:otherwise>
                </c:choose>
            </div>
        </c:forEach>
    </cache:cache>
</div>
