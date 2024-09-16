<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <c:choose>
        <c:when test="${param.project eq 'openfire'}">
            <c:set var="discourseCategory" value="/c/openfire"/>
        </c:when>
        <c:when test="${param.project eq 'spark'}">
            <c:set var="discourseCategory" value="/c/spark"/>
        </c:when>
        <c:when test="${param.project eq 'sparkweb'}">
            <c:set var="discourseCategory" value="/c/sparkweb"/>
        </c:when>
        <c:when test="${param.project eq 'smack'}">
            <c:set var="discourseCategory" value="/c/smack"/>
        </c:when>
        <c:when test="${param.project eq 'tinder'}">
            <c:set var="discourseCategory" value="/c/tinder-dev"/>
        </c:when>
        <c:when test="${param.project eq 'whack'}">
            <c:set var="discourseCategory" value="/c/whack-dev"/>
        </c:when>
        <c:when test="${param.project eq 'xiff'}">
            <c:set var="discourseCategory" value="/c/xiff"/>
        </c:when>
        <c:when test="${param.project eq 'asterisk-im'}">
            <c:set var="discourseCategory" value="/c/openfire-plugins/asterisk-im"/>
        </c:when>
        <c:when test="${param.project eq 'pade'}">
            <c:set var="discourseCategory" value="/c/pade"/>
        </c:when>
        <c:when test="${param.project eq 'botz'}">
            <c:set var="discourseCategory" value="/c/botz"/>
        </c:when>
    </c:choose>

    <jsp:include page="/includes/sidebar_projectlead.jsp">
        <jsp:param name="project" value="${param.project}" />
    </jsp:include>

    <jsp:include page="/includes/sidebar_snapshot.jsp">
        <jsp:param name="project" value="${param.project}"/>
    </jsp:include>

    <c:if test="${not empty discourseCategory}">
        <jsp:include page="/includes/sidebar_forumactivity.jsp">
            <jsp:param name="discourseCategory" value="${discourseCategory}"/>
        </jsp:include>
    </c:if>

            <%--
            <jsp:include page="/includes/sidebar_issues.jsp">
                <jsp:param name="projectID" value="<%= jiraID %>"/>
            </jsp:include>	
            --%>

            
