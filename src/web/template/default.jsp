<%--
 - $RCSfile$
 - $Revision: 32003 $
 - $Date: 2006-07-10 17:00:51 -0700 (Mon, 10 Jul 2006) $
 -
 - Copyright Jive Software, all rights reserved.
--%>

<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator" prefix="decorator" %>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/page" prefix="page" %>

<decorator:usePage id="mypage" />

<%  String path = request.getContextPath(); %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!--<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">-->
<html>

<head>
<title>Ignite Realtime: <decorator:title /></title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta http-equiv="Content-Language" content="en-us" />
<meta name="keywords" content="<decorator:getProperty property="meta.keywords" default="jive, jive software, java, open source, jive messenger, xmpp, chat, jabber, smack, whack, sparkweb, tinder, xiff, asterisk" />"/>

<style type="text/css" media="screen">
	@import url(https://fonts.googleapis.com/css?family=Dosis:600);
	@import "<%= request.getContextPath() %>/styles/global.css";
</style>

<script type="text/javascript" language="JavaScript" src="<%= request.getContextPath() %>/scripts/kitchensink.js"></script>
<script type="text/javascript" language="JavaScript" src="<%= request.getContextPath() %>/scripts/ignite.js"></script>
    
<!--
<script type="text/javascript" language="JavaScript" src="<%= request.getContextPath() %>/scripts/cookies.js"></script>
<script type="text/javascript" language="JavaScript" src="<%= request.getContextPath() %>/scripts/scriptaculous.js"></script>
<script type="text/javascript" language="JavaScript" src="<%= request.getContextPath() %>/scripts/window.js"></script>
-->

<decorator:head />
                                                                           
</head>

<%
	String bodyID = mypage.getProperty("meta.body-id");
	String panelName = mypage.getProperty("meta.panel-name");
    String baseUrl = config.getServletContext().getInitParameter("csc_baseurl");
%>

<body<%= (bodyID != null) ? " id=\""+bodyID+"\"" : "" %>  onLoad="<%= (panelName != null) ? "checkPanel('"+panelName+"');" : "" %>" >
	 



<!-- BEGIN page 'wrapper' -->
<div id="ignite_wrapper">
                                                              

	<!-- BEGIN header -->
	<div id="ignite_header">
		<a href="./"><div id="ignite_logo"></div></a>
		<div id="ignite_nav">
			<ol>
				<li id="nav01"><a href="<%= request.getContextPath() %>/index.jsp">Home</a></li>
				<li id="nav02"><a href="<%= request.getContextPath() %>/projects/index.jsp">Projects</a></li>
				<li id="nav03"><a href="<%= request.getContextPath() %>/downloads/index.jsp">Downloads</a></li>
				<li id="nav04"><a href="<%= baseUrl+"/welcome" %>">Community</a></li>
				<li id="nav05"><a href="<%= request.getContextPath() %>/fans/index.jsp">Fans</a></li>
				<li id="nav07"><a href="<%= request.getContextPath() %>/support/group_chat.jsp">Group Chat</a></li>
				<li id="nav08"><a href="<%= request.getContextPath() %>/about/index.jsp">About</a></li>
			</ol>
        <!--    <div id="ignite_nav_groupchat" class="ignite_nav_groupchat" style="display: none;">
				<span class="ignite_nav_groupchat_block" id="ignite_nav_groupchat_block"></span>
				<span id="ignite_nav_groupchat_moreinfo" style="display: none;"><a href="<%= request.getContextPath() %>/support/group_chat.jsp">More Information</a></span>
			</div> -->
		</div>
	</div>
	<!-- END header -->
    <!-- <script type="text/javascript">
    // The javascript timer for the header group chat callout
    runGroupChatTimer();
    </script> -->



	<decorator:body />

	
	<!-- BEGIN footer -->
	<div id="ignite_footer">
		<div class="ignite_footer_nav"><a href="<%= request.getContextPath() %>/index.jsp">Home</a> | <a href="<%= request.getContextPath() %>/projects/index.jsp">Projects</a> | <a href="<%= request.getContextPath() %>/downloads/index.jsp">Downloads</a> | <a href="<%= baseUrl %>">Community</a> | <a href="<%= request.getContextPath() %>/fans/index.jsp">Fans</a> | <a href="<%= request.getContextPath() %>/support/group_chat.jsp">Group Chat</a> | <a href="<%= request.getContextPath() %>/about/index.jsp">About</a> </div>
	</div>
	<!-- END footer -->


</div>
<!-- END page 'wrapper' -->

<script src="https://www.google-analytics.com/urchin.js" type="text/javascript">
</script>

<script type="text/javascript">
_uacct = "UA-73301-3";
urchinTracker();
</script>

</body>
</html>
