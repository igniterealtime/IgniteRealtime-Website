<#--
  - $Revision: 32834 $
  - $Date: 2006-08-02 15:56:32 -0700 (Wed, 02 Aug 2006) $
  -
  - Copyright (C) 1999-2008 Jive Software. All rights reserved.
  - This software is the proprietary information of Jive Software. Use is subject to license terms.
-->

<#assign cache=JspTaglibs["/WEB-INF/oscache.tld"]>

<html>
<head>
    <!-- BEGIN main.ftl head section -->
    <title><@s.text name='main.clearspace.title'><@s.param>${community.name?html}</@s.param></@s.text></title>

    <style type="text/css" media="screen">
        @import "<@s.url value='/styles/jive-community.css'/>";
        @import "<@s.url value='/styles/jive-widgets.css'/>";
        @import "<@s.url value='/styles/jive-home.css'/>";
    </style>

    <#if personalizationEnabled && user?exists>
        <@resource.dwr file="CommunityUtils" />
        <script type="text/javascript">
            function setUserDefaultTab(view) {
                $('jive-default-tab').hide();
                CommunityUtils.setUserDefaultTab(1, view);
            }
        </script>
    </#if>

    <#if (FeedUtils.isFeedsEnabled())>
        <link rel="alternate" type="${FeedUtils.getFeedType()}"
            title="${community.name} <@s.text name='main.all_content_feed.tooltip'/>"
            href="<@s.url value="/community/feeds/allcontent?community=${community.ID?c}"
                />" />

        <#if jive.isModuleAvailable("blogs") >
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

        <!-- BEGIN browse community tabs -->
        <div class="jive-body-tabbar">
            <#if CommunityPermHelper.isCommunityAdmin(community)>
            <span id="jive-homecustom-tab" class="jive-body-tab jive-body-tabcurrent">
                <span class="jive-link-overview"><a href="<@s.url action='index'/>?showhomepage=true" ><@s.text name="main.filterview.all"/></a></span>
                <span class="jive-home-customizable">(<a href="<@s.url action='customize-homepage' />" class="jive-link-home-customize"><@s.text name='home.tab.customize' /></a>)</span>
            </span>
            <#elseif user?exists>
            <span class="jive-body-tab jive-body-tabcurrent">
                <a href="<@s.url action='index'/>?showhomepage=true" ><@s.text name="main.filterview.all"/></a>
            </span>
            </#if>
            <#if personalizationEnabled && user?exists>
                <span class="jive-body-tab">
                    <span class="jive-link-overview">
                        <a href="<@s.url action='index'/><#if hasPersonalized>?showpersonalized=true<#else>?showpreview=true</#if>"><@s.text name="main.filterview.your"/></a>
                    </span>
                </span>
            <#if (user?exists && hasPersonalized && (!action.isDefaultViewSet(user) || action.isDefaultViewPersonalizedView(user)))>
                <span class="jive-link-overview">
                    <a href="#" id="jive-default-tab" onclick="setUserDefaultTab('homepage'); return false;"><@s.text name="main.tab.setasdefault"/></a>
                </span>
            </#if>
            </#if>
        </div>
        <!-- END browse community tabs -->

        <!-- BEGIN home page links -->
        <ul id="jive-body-tabbar-links">
            <#if jive.isModuleAvailable("forums") >
            <li class="jive-body-tabbar-links-title"><@s.text name="global.browse" /><@s.text name="global.colon" /></li>
            <li>
                <a href="<@s.url value="/threads"/>">
                    <span class="jive-link-discussion-small"></span>
                    <em style="display: none"><@s.text name="main.discussions.link" /></em>
                </a>
            </li>
            </#if>
            <#if jive.isModuleAvailable("wiki") >
            <li>
                <a href="<@s.url value="/docs"/>">
                    <span class="jive-link-document-small"></span>
                    <em style="display: none"><@s.text name="main.documents.link" /></em>
                </a>
            </li>
            </#if>
            <#if jive.isModuleAvailable("blogs") >
            <li>
                <a href="<@s.url value="/blogs"/>">
                    <span class="jive-link-blog-small"></span>
                    <em style="display: none"><@s.text name="main.blog_posts.link" /></em>
                </a>
            </li>
            </#if>
            <li>
                <a href="<@s.url value="/tags"/>">
                    <span class="jive-link-tag-small"></span>
                    <em style="display: none"><@s.text name="main.tags.link" /></em>
                </a>
            </li>
            <li>
                <a href="<@s.url value="/community"/>">
                    <span class="jive-link-community"></span>
                    <em style="display: none"><@s.text name='main.spaces.link' /></em>
                </a>
            </li>
            <#if projectsEnabled>
            <li>
                <a href="<@s.url value="/projects"/>">
                    <span class="jive-link-project-small"></span>
                    <em style="display: none"><@s.text name='main.projects.link' /></em>
                </a>
            </li>
            </#if>
            <#if socialGroupsEnabled>
            <li>
                <a href="<@s.url value="/groups"/>">
                    <span class="jive-link-socialgroup-small"></span>
                    <em style="display: none"><@s.text name='main.sgroups.link' /></em>
                </a>
            </li>
            </#if>
            <#if chatAvailable>
            <li>
                <a href="<@s.url value="/chats"/>">
                    <span class="jive-link-chat-small"></span>
                    <em style="display: none"><@s.text name="main.chats.link" /></em>
                </a>
            </li>
            </#if>
            <li class="jive-body-tabbar-links-last">
                <a href="<@s.url value="/people"/>">
                    <span class="jive-link-people-small"></span>
                    <em style="display: none"><@s.text name="main.people.link" /></em>
                </a>
            </li>
        </ul>
        <!-- END home page links -->

    </div>
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
                <a href="<@s.url action="ann-post" method="input" />?container=${community.ID?c}&containerType=${JiveConstants.COMMUNITY?c}" class="jive-link-announcement">
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

