<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>${jiveContext.communityManager.rootCommunity.name}<#if page.title?exists && "" != page.title?trim>:</#if> ${page.title?default("")}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=${JiveGlobals.getCharacterEncoding()?default('iso-8859-1')}" />
    <meta http-equiv="Content-Language" content="en-us" />
    <meta name="keywords" content=""/>
    <SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript' SRC='/elqNow/elqCfg.js'></SCRIPT>
    <SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript' SRC='/elqNow/elqImg.js'></SCRIPT>

    <link rel="search"
        href="<@ww.url value='/opensearch.jspa' includeParams='none' />"
        title="${jiveContext.communityManager.rootCommunity.name?html}"
        type="application/opensearchdescription+xml"/>
    <link rel="shortcut icon" href="/favicon.ico"/>  

    <style type="text/css" media="screen">
        @import "<@ww.url value='/styles/jive-global.css' includeParams='none'/>";
        @import "<@ww.url value='/styles/jive-userbar.css' includeParams='none'/>";
        @import "<@ww.url value='/styles/jive-sidebar.css' includeParams='none'/>";
    </style>

    <#--
        The page.head call ******MUST***** come before the scripts otherwise the gui editor
        will not load properly.
     -->

    ${page.head}

    <!-- styles for editions here -->
    <style type="text/css">
        <#if jiveContext.licenseManager.external>
            @import "<@ww.url value='/styles/jive-external.css' includeParams='none'/>";
        <#else>
            @import "<@ww.url value='/styles/jive-internal.css' includeParams='none'/>";
        </#if>
    </style>

    <style type="text/css"><@ww.action name='custom-css' executeResult='true'/></style>
    <script src="/scripts/groupchat_timer.js" language="JavaScript" type="text/javascript">
    <script type="text/javascript">if (!_jive_base_url) { var _jive_base_url = "${defaultBaseURL}";}</script>
    <#if ("false" != (page.getProperty("meta.includeHeaderScripts")?default("true")))>
        <@jive.importJavascript scripts=['global'] />
    </#if>

    <#list jiveContext.pluginManager.pluginJavascriptSrcURLs as src >
        <script type="text/javascript" src="<@ww.url value='${src}' />" ></script>
    </#list>

    <#list jiveContext.pluginManager.pluginCSSSrcURLs as src >
        <style type="text/css" media="screen">
            @import "<@ww.url value='${src}' />";
        </style>
    </#list>

</head>
<body id="community">


<!-- IGNITE WRAPPER -->
<div id="ignite-wrapper">

<!-- BEGIN page 'wrapper' -->
<div id="jive-wrapper">


    <!-- BEGIN header -->
    <#assign header = JiveGlobals.getJiveProperty("skin.default.headerHTML")!>
    <#if header != ''>
        ${header}
    <#else>
        <div id="jive-global-header">
        <a href="http://www.igniterealtime.org" id="jive-global-header-logo"></a>
		<a href="http://www.jivesoftware.com?source=Website-Ignite"><div id="ignite_jive"></div></a>
		<div id="ignite_nav">
			<ol>
				<li id="nav01"><a href="/index.jsp">Home</a></li>
				<li id="nav02"><a href="/projects/index.jsp">Products</a></li>
				<li id="nav03"><a href="/downloads/index.jsp">Downloads</a></li>
				<li id="nav04"><a href="/community/">Community</a></li>
				<li id="nav05"><a href="/fans/index.jsp">Fans</a></li>
				<li id="nav06"><a href="http://www.cafepress.com/igniterealtime">Store</a></li>
				<li id="nav07"><a href="/support/index.jsp">Support</a></li>
				<li id="nav08"><a href="/about/index.jsp">About</a></li>
			</ol>
<div id="ignite_nav_groupchat" class="ignite_nav_groupchat">
                <span class="ignite_nav_groupchat-block" id="ignite_nav_groupchat-block"></span>
                <span id="ignite_nav_groupchat_moreinfo"><a href="http://www.igniterealtime.org/support/group_chat.jsp">More Information</a></span>
            </div>
		</div>
	</div>
        </div>
    </#if>
    <!-- END header -->
    <script type="text/javascript">
    // The javascript timer for the header group chat callout
    runGroupChatTimer();
    </script>


    <!-- BEGIN user bar -->
        <#-- wrapped so that it can be updated via Ajax -->
        <div id="user-bar-wrapper"><@ww.action name="user-bar" executeResult="true"/></div>
	<!-- END user bar -->


    <#if (page.getProperty("page.intro")?exists)>
        <div id="jive-body-intro-container">
            ${page.getProperty("page.intro")}
        </div>
    </#if>


    <!-- BEGIN body area -->
    <#-- To remove the sidebar from a page, do the following to the page
            1) add the meta tag 'nosidebar' to the head
            2) in the page, change 
    -->
    <#-- Add the meta tag 'nosidebar' to any page that should not contain a sidebar column -->
    <#if !page.getProperty("meta.nosidebar")?exists>
        <div id="jive-body">
    <#else>
        <div id="jive-body-full">
	</#if>


	    <!-- BEGIN body wrapper (for additional background elements) -->
        <div id="jive-body-wrapper">


            <#if (page.getProperty("page.breadcrumb")?exists)>
            <!-- BEGIN breadcrumb -->
            <div id="jive-breadcrumb">
                <#assign bcSep = JiveGlobals.getJiveProperty("skin.default.separator")?default(" &gt; ")>
                <#assign crumb = page.getProperty("page.breadcrumb")?replace("</a>", "</a>" + bcSep)>
                <#assign lastSep = crumb?last_index_of(bcSep)>
                <#if (lastSep > -1)>
                    <#assign crumb = crumb?substring(0,lastSep)>
                </#if>

                <#if (crumb?index_of("<a ") > -1)>
                    <#assign lastLink = crumb?last_index_of("<a ")>
                    <#assign crumb = crumb?substring(0, lastLink) + "<a class='jive-breadcrumb-last' " + crumb?substring(lastLink + 3)>
                </#if>
                
                <span>${crumb}</span>
            </div>
            <!-- END breadcrumb -->
            </#if>


            ${page.body}


        </div>
        <!-- END body wrapper -->


    </div>
    <!-- END body area -->


    <!-- BEGIN footer -->
    <#assign footer = JiveGlobals.getJiveProperty("skin.default.footerHTML")!>
    <#if (footer != '' && JiveGlobals.getJiveBooleanProperty("skin.default.useDefaultFooterHTML", false))>
        ${footer}
    <#else>
    <div id="jive-footer">
        <#if (!JiveGlobals.isWhiteLabel())>
            <div class="jive-footer-nav">
                <#assign license = jiveContext.getLicenseManager().getLicense()/>
		            <a href="http://www.jivesoftware.com/poweredby/" target="_blank">
	    		<@ww.text name='dectr.pwrdByJiveLicense.link'>
				<@ww.param>${jiveContext.communityManager.rootCommunity.name}</@ww.param>
				<@ww.param>${license.name?string}</@ww.param>
				<@ww.param>${license.version.versionString?string}</@ww.param>
			</@ww.text>
		</a>
            </div>
            <div class="jive-footer-copyright"><a href="http://www.jivesoftware.com?source=Website-Ignite"><@ww.text name="dectr.copyrightJiveFooter.text" /></a></div>
        </#if>
    </div>
    </#if>
    <!-- END footer -->


</div>
<!-- END page 'wrapper' -->

</div>
<!-- End of IGNITE WRAPPER -->


<#if JiveGlobals.getJiveBooleanProperty('reporting.thirdParty.enabled')>
    ${JiveGlobals.getJiveProperty('reporting.thirdParty.code')}        
</#if>


</body>
</html>