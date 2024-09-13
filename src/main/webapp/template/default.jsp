<%--
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
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="en-us" />
<meta name="keywords" content="<decorator:getProperty property="meta.keywords" default="ignite, igniterealtime, jive, jive software, java, open source, openfire, wildfire, jive messenger, xmpp, chat, jabber, smack, whack, sparkweb, tinder, xiff, asterisk" />"/>
<meta property="og:title" content="Ignite Realtime: <decorator:title />" />
<meta property="og:type" content="website" />
<meta property="og:url" content="<%=request.getRequestURL()%>" />
<meta property="og:image" content="https://www.igniterealtime.org/images/screenshot-ignite-large.jpg" />
<style type="text/css" media="screen">
    @import url(https://fonts.googleapis.com/css?family=Dosis:600);
    @import "<%= request.getContextPath() %>/styles/global.css";
</style>

<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/kitchensink.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/ignite.js"></script>
    
<!--
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/cookies.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/scriptaculous.js"></script>
<script type="text/javascript" src="<%= request.getContextPath() %>/scripts/window.js"></script>
-->

<decorator:head />
                                                                           
</head>

<%
    String bodyID = mypage.getProperty("meta.body-id");
    String panelName = mypage.getProperty("meta.panel-name");
    String baseUrl = config.getServletContext().getInitParameter("csc_baseurl");
%>

<body<%= (bodyID != null) ? " id=\""+bodyID+"\"" : "" %>  onLoad="<%= (panelName != null) ? "checkPanel('"+panelName+"');" : "" %>" >
     



<!-- BEGIN header -->
<div id="ignite_header">
    <div class="clearfix" id="ignite_header_contents">
        <a href="/"><div id="ignite_logo"></div></a>
        <div class="clearfix" id="ignite_nav">
            <ol>
                <li id="nav01"><a href="<%= request.getContextPath() %>/">Home</a></li>
                <li id="nav02"><a href="<%= request.getContextPath() %>/projects/">Projects</a></li>
                <li id="nav03"><a href="<%= request.getContextPath() %>/downloads/">Downloads</a></li>
                <li id="nav04"><a href="https://discourse.igniterealtime.org/">Community</a></li>
                <li id="nav05"><a href="<%= request.getContextPath() %>/fans/">Fans</a></li>
                <li id="nav07"><a href="<%= request.getContextPath() %>/support/">Support</a></li>
                <li id="nav08"><a href="<%= request.getContextPath() %>/about/">About</a></li>
            </ol>
            <!--    <div id="ignite_nav_groupchat" class="ignite_nav_groupchat" style="display: none;">
                <span class="ignite_nav_groupchat_block" id="ignite_nav_groupchat_block"></span>
                <span id="ignite_nav_groupchat_moreinfo" style="display: none;"><a href="<%= request.getContextPath() %>/support/group_chat.jsp">More Information</a></span>
            </div> -->
        </div>
    </div>
</div>
<!-- END header -->
    <!-- <script type="text/javascript">
    // The javascript timer for the header group chat callout
    runGroupChatTimer();
    </script> -->

<!-- BEGIN page 'wrapper' -->
<div id="ignite_wrapper">


    <decorator:body />


    <!-- BEGIN footer -->
    <div id="ignite_footer">
        <div class="ignite_footer_nav"><a href="<%= request.getContextPath() %>/">Home</a> | <a href="<%= request.getContextPath() %>/projects/">Projects</a> | <a href="<%= request.getContextPath() %>/downloads/">Downloads</a> | <a href="https://discourse.igniterealtime.org/">Community</a> | <a href="<%= request.getContextPath() %>/fans/">Fans</a> | <a href="<%= request.getContextPath() %>/support/">Support</a> | <a href="<%= request.getContextPath() %>/about/">About</a> </div>
    </div>
    <!-- END footer -->


</div>
<!-- END page 'wrapper' -->

<script type="text/javascript">
  var _paq = _paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//igniterealtime.org/piwik/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', '2']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
</script>

</body>
</html>
