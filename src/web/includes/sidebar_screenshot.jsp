<%@ page import="java.util.*" %>

<%
    String include = null;
    String project = request.getParameter("project");
    if ("openfire".equals(project)) {
        include = "../projects/openfire/screenshots.jsp";
    }
    else if ("spark".equals(project)) {
         include = "../projects/spark/screenshots.jsp";
    }
    else {
        return;
    }
%>


 <jsp:include page="<%= include %>">
    <jsp:param name="project" value="<%= project %>"/>
    <jsp:param name="include" value="true"/>
</jsp:include>