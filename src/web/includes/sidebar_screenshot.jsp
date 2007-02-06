<%@ page import="java.util.*" %>

<%
    String include = null;
    String project = request.getParameter("project");
    if ("wildfire".equals(project)) {
        include = "/projects/wildfire/screenshots.jsp";
    }
    else if ("spark".equals(project)) {
         include = "/projects/spark/screenshots.jsp";
    }
    else {
        return;
    }
%>


 <jsp:include page="<%= include %>">
    <jsp:param name="project" value="<%= project %>"/>
    <jsp:param name="include" value="true"/>
</jsp:include>