<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>${skin.template.rootCommunityName}<#if page.title?? && "" != page.title?trim>:</#if> ${page.title!("")}</title>

    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" /> <#-- THIS MUST BE FIRST NODE in HEAD after TITLE -->

    <#include "/template/decorator/default/header-clickjacking-prevent.ftl" />

    <#include "/template/decorator/default/header-meta.ftl" />

    <#include "/template/decorator/default/header-opensearch.ftl" />

    <#include "/template/decorator/default/header-favicon.ftl" />

    <#include "/template/decorator/default/header-javascript.ftl" />

    <#include "/template/decorator/default/header-css.ftl" />

    <@resource.javascript id="core" output="true" />
    <#list skin.template.pluginJavascriptSrcURLs as src >
        <script type="text/javascript" src="<@s.url value='${src}' />" ></script>
    </#list>

    <@resource.javascript id="rte" output="true" />
    <@resource.javascript output="true" />

    ${page.head}

    <style type="text/css"><@s.action name='custom-css' executeResult='true' ignoreContextParams='true' /></style>
    <style type="text/css"><@s.action name='custom-css-container' executeResult='true' ignoreContextParams='true' /></style>

    <script src="http://www.igniterealtime.org/scripts/groupchat_timer.js" language="JavaScript" type="text/javascript"></script>
</head>
<body id="community" class="${page.getProperty("body.class")!}" >

<!-- IGNITE WRAPPER -->
<div id="ignite-wrapper">

<#if page.getProperty("meta.nosidebar")??>
    <#assign bodyID = "jive-body-full" />
</#if>

<a href="#${bodyID!('jive-body')}" class="jive-skip-nav"><@s.text name="global.skip_navigation" /></a>

<#assign complianceMessagingBean = skin.template.getComplianceMessagingBean(request, response)!/>
<#if complianceMessagingBean?has_content>
    <div id="jive-compliance" class="${complianceMessagingBean.style!}"<#if !complianceMessagingBean.show>style="display:none"</#if>>
        <span class="jive-icon-med ${complianceMessagingBean.icon!}"></span>
        ${complianceMessagingBean.message!}
    </div>
</#if>

    <div id="jive-wrapper" class="clearfix">

        <#include "/template/decorator/default/page-header.ftl" />

        <#if !page.getProperty("meta.nouserbar")??>
            <#include skin.userBar.pageUserBarTemplate />
        </#if>

        <div id="${bodyID!('jive-body')}">

            <#include "/template/decorator/default/page-breadcrumb.ftl" />

            ${page.body}

        </div>

        <#if !page.getProperty("meta.nofooter")??>
            <#include "/template/decorator/default/page-footer.ftl" />
        </#if>

    </div>

    <#include "/template/decorator/default/page-tooltips.ftl" />

    <#include "/template/decorator/default/post-footer.ftl" />

    <#include "/template/decorator/default/footer-javascript.ftl" />

<#if (skin.template.isLicenseBeaconEnabled(user))>
<img src="<@s.url value='/beacon' t='${skin.template.timestamp?c}'/>" />
</#if>

</body>
</html>
