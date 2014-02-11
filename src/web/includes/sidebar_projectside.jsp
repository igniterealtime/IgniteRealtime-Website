            <%
                String project = request.getParameter("project");
                String jiraID = "";
                String forumID = "";
                if ("openfire".equals(project)) {
                    jiraID = "10010";
                    forumID = "2008";
                }
                else if ("spark".equals(project)) {
                    jiraID = "10060";
                    forumID = "2010";
                }
                else if ("sparkweb".equals(project)) {
                    jiraID = "10130";
                    forumID = "2027";
                }
                else if ("smack".equals(project)) {
                    jiraID = "10011";
                    forumID = "2001";
                }
                else if ("tinder".equals(project)) {
                    jiraID = "10141";
                    forumID = "2030";
                }
                else if ("whack".equals(project)) {
                    jiraID = "10040";
                    forumID = "2002";
                }
                else if ("xiff".equals(project)) {
                    jiraID = "10020";
                    forumID = "2004";
                }
                else if ("asterisk-im".equals(project)) {
                    jiraID = "10030";
                    forumID = "2009";
                }
                
            %>

            <jsp:include page="/includes/sidebar_projectlead.jsp">
                <jsp:param name="project" value="<%= project %>" />
            </jsp:include>

			<jsp:include page="/includes/sidebar_snapshot.jsp">
			    <jsp:param name="project" value="<%= project %>"/>
			</jsp:include>

            <jsp:include page="/includes/sidebar_screenshot.jsp">
                <jsp:param name="project" value="<%= project %>"/>
            </jsp:include>
			
			<jsp:include page="/includes/sidebar_forumactivity.jsp">
			    <jsp:param name="forumID" value="<%= forumID %>"/>
			</jsp:include>
			
			<%--
            <jsp:include page="/includes/sidebar_issues.jsp">
			    <jsp:param name="projectID" value="<%= jiraID %>"/>
			</jsp:include>	
			--%>
			
			<%--<%@ include file="/includes/sidebar_enterprise.jspf" %> --%>
			
