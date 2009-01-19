<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>${jiveContext.communityManager.rootCommunity.name}<#if page.title?exists && "" != page.title?trim>:</#if> ${page.title?default("")}</title>

    <#include "/template/decorator/default/header-meta.ftl" />

    <#include "/template/decorator/default/header-opensearch.ftl" />

    <#include "/template/decorator/default/header-favicon.ftl" />

    <#include "/template/decorator/default/header-javascript.ftl" />

    <#include "/template/decorator/default/header-css.ftl" />

    ${page.head}

    <style type="text/css"><@s.action name='custom-css' executeResult='true' ignoreContextParams='true' /></style>
    <style type="text/css"><@s.action name='custom-css-container' executeResult='true' ignoreContextParams='true' /></style>

    <@resource.javascript output="true" />
    <SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript' SRC='/elqNow/elqCfg.js'></SCRIPT>
    <SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript' SRC='/elqNow/elqImg.js'></SCRIPT>
    <script src="/scripts/groupchat_timer.js" language="JavaScript" type="text/javascript"></script>

</head>
<body id="community" class="${page.getProperty("body.class")!}" >

<!-- IGNITE WRAPPER -->
<div id="ignite-wrapper">

    <div id="jive-wrapper" class="clearfix">

        <#include "/template/decorator/default/page-header.ftl" />

        <#if !page.getProperty("meta.nouserbar")??>
            <#include "/template/decorator/default/page-userbar.ftl" />
        </#if>

        <#if page.getProperty("meta.nosidebar")??>
            <#assign bodyID = "jive-body-full" />
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

    <#include "/template/decorator/default/footer-javascript.ftl" />

</body>
</html>
