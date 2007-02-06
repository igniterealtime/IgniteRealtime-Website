<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

      <% String forumRSS = "http://www.igniterealtime.org/forum/rss/rssmessages.jspa?numItems=5&forumID=" +
			    request.getParameter("forumID"); %>
			
			<!-- BEGIN blue sidebar box 'RECENT DISCUSSIONS' -->
			<cache:cache time="60" key="<%= forumRSS %>"> 
			<div class="ignite_sidebar_whitebox">
				<div class="ignite_sidebar_top"></div>
				<div class="ignite_sidebar_hdr ignite_sidebar_hdr_forum"></div>
				<div class="ignite_sidebar_body">
					<c:import url="<%= forumRSS %>" var="threadsxml" />
            <c:import url="/xsl/threads.xsl" var="threadsxsl" />
            <x:transform xml="${threadsxml}" xslt="${threadsxsl}" />
				</div>
				<div class="ignite_sidebar_btm"></div>
			</div>
			</cache:cache>
			<!-- END blue sidebar box 'RECENT DISCUSSIONS' -->