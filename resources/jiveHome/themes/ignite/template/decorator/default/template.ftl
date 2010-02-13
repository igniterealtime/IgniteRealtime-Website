<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>${jiveContext.communityManager.rootCommunity.name}<#if page.title?exists && "" != page.title?trim>:</#if> ${page.title?default("")}</title>

    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" /> <#-- THIS MUST BE FIRST NODE in HEAD after TITLE -->

    <#include "/template/decorator/default/header-clickjacking-prevent.ftl" />

    <#include "/template/decorator/default/header-meta.ftl" />

    <#include "/template/decorator/default/header-opensearch.ftl" />

    <#include "/template/decorator/default/header-favicon.ftl" />

    <#include "/template/decorator/default/header-javascript.ftl" />

    <#include "/template/decorator/default/header-css.ftl" />

    <@resource.javascript id="core" output="true" />
    <#list jiveContext.getSpringBean("javascriptURLConfigurator").pluginJavascriptSrcURLs as src >
        <script type="text/javascript" src="<@s.url value='${src}' />" ></script>
    </#list>

    <@resource.javascript id="rte" output="true" />
    <@resource.javascript output="true" />

    ${page.head}

    <link rel="stylesheet" type="text/css" href="<@resource.url value="/styles/tiny_mce3/plugins/inlinepopups/skins/clearlooks2/window.css" />" />

    <style type="text/css"><@s.action name='custom-css' executeResult='true' ignoreContextParams='true' /></style>
    <style type="text/css"><@s.action name='custom-css-container' executeResult='true' ignoreContextParams='true' /></style>
    <SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript' SRC='/elqNow/elqCfg.js'></SCRIPT>
    <SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript' SRC='/elqNow/elqImg.js'></SCRIPT>
    <script src="/scripts/groupchat_timer.js" language="JavaScript" type="text/javascript"></script>

</head>
<body id="community" class="${page.getProperty("body.class")!}" >

<!-- IGNITE WRAPPER -->
<div id="ignite-wrapper">

<#if page.getProperty("meta.nosidebar")??>
    <#assign bodyID = "jive-body-full" />
</#if>

<a href="#${bodyID?default('jive-body')}" class="jive-skip-nav"><@s.text name="global.skip_navigation" /></a>

<#assign complianceMessagingBean = statics['com.jivesoftware.community.action.ComplianceMessagingHelper'].createComplianceMessagingBean(request, response)!/>
<#if complianceMessagingBean?has_content>
    <div id="jive-compliance" class="${complianceMessagingBean.style!}"<#if !complianceMessagingBean.show>style="display:none"</#if>>
        <span class="jive-icon-med ${complianceMessagingBean.icon!}"></span>
        ${complianceMessagingBean.message!}
    </div>
</#if>

    <div id="jive-wrapper" class="clearfix">

        <#include "/template/decorator/default/page-header.ftl" />

        <#if !page.getProperty("meta.nouserbar")??>
            <#include "/template/decorator/default/page-userbar.ftl" />
        </#if>



        <div id="${bodyID?default('jive-body')}">

            <#include "/template/decorator/default/page-breadcrumb.ftl" />

            ${page.body}

        </div>

        <#if !page.getProperty("meta.nofooter")??>
            <#include "/template/decorator/default/page-footer.ftl" />
        </#if>

    </div> 

</div>
<!-- End of IGNITE WRAPPER -->

    <#include "/template/decorator/default/page-tooltips.ftl" />

    <#include "/template/decorator/default/post-footer.ftl" />

    <#include "/template/decorator/default/footer-javascript.ftl" />

<#if (JiveGlobals.getJiveBooleanProperty("license.beacon.enabled", false) && user.anonymous)>
<#assign timestamp = statics['java.lang.System'].currentTimeMillis() />
<img src="<@s.url value='/beacon' t='${timestamp?c}'/>" />
</#if>

</body>
</html>
