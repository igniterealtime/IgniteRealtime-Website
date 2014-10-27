<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>    
	
			<% String issuesRSS = "http://issues.igniterealtime.org/secure/IssueNavigator.jspa?view=rss&pid=" +
			    request.getParameter("projectID") + "&statusIds=1&sorter/field=issuekey&sorter/order=DESC&sorter/field=created&sorter/order=DESC&tempMax=5&reset=true&decorator=none"; %>
			<!-- BEGIN blue sidebar box 'LATEST ISSUES' -->
			<cache:cache time="60" key="<%= issuesRSS %>"> 
			<div class="ignite_sidebar_whitebox">
				<div class="ignite_sidebar_top"></div>
				<div class="ignite_sidebar_hdr ignite_sidebar_hdr_issues"></div>
				<div class="ignite_sidebar_body">
				
					<c:import url="<%= issuesRSS %>" var="issuesxml" />
					<c:import url="/xsl/issues.xsl" var="issuesxsl" />
					<x:transform xml="${issuesxml}" xslt="${issuesxsl}" />
				
				</div>
				<div class="ignite_sidebar_btm"></div>
			</div>
			</cache:cache>
			<!-- END blue sidebar box 'LATEST ISSUES' -->