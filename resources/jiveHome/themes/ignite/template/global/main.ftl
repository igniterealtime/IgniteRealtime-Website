<#--
  - $Revision: 32834 $
  - $Date: 2006-08-02 15:56:32 -0700 (Wed, 02 Aug 2006) $
  -
  - Copyright (C) 1999-2008 Jive Software. All rights reserved.
  - This software is the proprietary information of Jive Software. Use is subject to license terms.
-->

<#assign cache=JspTaglibs["/WEB-INF/oscache.tld"]>
<#assign component = UIComponents.getUIComponent('tab-bar') />

<html>
<head>
    <!-- BEGIN main.ftl head section -->
    <title><@s.text name='main.clearspace.title'><@s.param>${community.name?html}</@s.param></@s.text></title>

    <style type="text/css" media="all">
        @import "<@s.url value='/styles/jive-community.css'/>";
        @import "<@s.url value='/styles/jive-widgets.css'/>";
        @import "<@s.url value='/styles/jive-home.css'/>";
    </style>

    <#if personalizationEnabled && !user.anonymous>
        <@resource.dwr file="CommunityUtils" />
        <script type="text/javascript">
            function setUserDefaultTab(view) {
                $('jive-set-default-tab').hide();
                CommunityUtils.setUserDefaultTab(1, view);
            }
        </script>
    </#if>

    <#if (FeedUtils.isFeedsEnabled())>
        <link rel="alternate" type="${FeedUtils.getFeedType()}"
            title="${community.name} <@s.text name='main.all_content_feed.tooltip'/>"
            href="<@s.url value="/community/feeds/allcontent?community=${community.ID?c}"
                />" />

        <#if BlogPermHelper.getCanViewBlogs() >
            <link rel="alternate" type="${FeedUtils.getFeedType()}"
                title="${community.name} <@s.text name='main.blog_posts_feed.tooltip'/>"
                href="<@s.url value="/community/feeds/blogs?community=${community.ID?c}"
                    />" />
        </#if>

        <#if jive.isModuleAvailable("wiki") >
            <link rel="alternate" type="${FeedUtils.getFeedType()}"
                title="${community.name} <@s.text name='main.documents_feed.tooltip'/>"
                href="<@s.url value="/community/feeds/documents?community=${community.ID?c}"
                    />" />
        </#if>


        <#if jive.isModuleAvailable("forums") >
            <link rel="alternate" type="${FeedUtils.getFeedType()}"
                title="${community.name} <@s.text name='main.popDiscussionFeed.tooltip'/>"
                href="<@s.url value="/community/feeds/popularthreads?community=${community.ID?c}"
                    />" />

            <link rel="alternate" type="${FeedUtils.getFeedType()}"
                title="${community.name} <@s.text name='main.disc_threads_feed.tooltip'/>"
                href="<@s.url value="/community/feeds/threads?community=${community.ID?c}"
                    />" />
        </#if>

        <link rel="alternate" type="${FeedUtils.getFeedType()}"
            title="${community.name} <@s.text name='main.polls_feed.tooltip'/>"
            href="<@s.url value="/community/feeds/polls?community=${community.ID?c}"
                />" />
    </#if>

    <!-- END main.ftl head section -->
</head>
<body class="jive-body-home">
<!-- BEGIN main.ftl body section -->


<!-- BEGIN intro -->
<div id="jive-body-intro" class="jive-body-intro-home">
    <div id="jive-body-intro-content">
        <h1>${community.name?html}</h1>

        <#if community.description?has_content>
        <p class="jive-body-home-description">${community.description}</p>
        </#if>
    </div>

    <!-- BEGIN browse community tabs -->
    <div class="jive-body-tabbar">
        <#if CommunityPermHelper.isCommunityAdmin(community)>
        <span id="jive-homecustom-tab" class="jive-body-tab jive-body-tabcurrent">
            <span class="jive-body-tab-customizable">
                <a href="<@s.url value='/index.jspa'/>?showhomepage=true" ><@s.text name="main.filterview.all"/></a>
                <em>(<a href="<@s.url action='customize-homepage' />" class="jive-link-home-customize"><@s.text name='home.tab.customize' /></a>)</em>
            </span>
        </span>
        <#elseif !user.anonymous>
        <span class="jive-body-tab jive-body-tabcurrent">
            <a href="<@s.url value='/index.jspa'/>?showhomepage=true" ><@s.text name="main.filterview.all"/></a>
        </span>
        </#if>
        <#if personalizationEnabled && !user.anonymous>
            <span class="jive-body-tab">
                <a href="<@s.url value='/index.jspa'/><#if hasPersonalized>?showpersonalized=true<#else>?showpreview=true</#if>"><@s.text name="main.filterview.your"/></a>
            </span>
        <#if (!user.anonymous && hasPersonalized && (!action.isDefaultViewSet(user) || action.isDefaultViewPersonalizedView(user)))>
                <a href="#" id="jive-set-default-tab" onclick="setUserDefaultTab('homepage'); return false;"><@s.text name="main.tab.setasdefault"/></a>
        </#if>
        </#if>
    </div>
    <!-- END browse community tabs -->

    <!-- BEGIN home page links -->
    <#list component.tabs as tab >
    <ul id="${tab.id}">
        <li class="${processAsTemplate(tab.CSSClass!)}">${processAsTemplate(action.getText(tab.name))}<@s.text name="global.colon" /></li>
        <@renderBrowseTabs tab />
    </ul>
    </#list>
    <!-- END home page links -->

</div>
<!-- END intro -->

<!-- BEGIN main body -->
<div id="jive-body-main">

    <div id="jive-widget-content">
        <#assign hasAnnouncements = (announcements?exists && announcements.hasNext())/>
        <@jive.announcementList announcements=announcements />

        <#include "${widgetLayout.freemarkerTemplate}" />

        <#if AnnouncementPermHelper.getCanCreateAnnounce(community)>
            <div <#if !hasAnnouncements>id="jive-new-announcement"<#else>id="jive-another-announcement"</#if>>
                <a href="<@s.url action="ann-post" method="input" />?container=${community.ID?c}&containerType=${JiveConstants.COMMUNITY?c}" ><span class="jive-icon-med jive-icon-announcement"></span>
                    <#if !hasAnnouncements>
                        <@s.text name="main.create_announcement.link" />
                    <#else>
                        <@s.text name="main.create_another_announcement.link" />
                    </#if>
                </a>
            </div>
        </#if>
    </div>

</div>
<!-- END main body -->

</body>
</html>


<#macro renderBrowseTabs tab>
    <#if tab.items?has_content>
    <#list tab.items as item>
        <#if item.when?default('true')?eval>
            <#if item.url?has_content>
                <li class="<#if !item_has_next >jive-body-tabbar-links-last</#if>">
                    <a href="${processAsTemplate(item.url!)}">
                        <span class="${processAsTemplate(item.CSSClass!)}"></span>
                        <em>${processAsTemplate(action.getText(item.name))}</em>
                    </a>
                </li>
            </#if>
        </#if>
    </#list>
    </#if>
</#macro>

