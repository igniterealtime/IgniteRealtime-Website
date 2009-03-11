<!-- BEGIN footer -->
<#assign footer = JiveGlobals.getJiveProperty("skin.default.footerHTML")!>
<#if (footer != '' && JiveGlobals.getJiveBooleanProperty("skin.default.useDefaultFooterHTML", false))>
    ${footer}
<#else>
<div id="jive-footer" class="clearfix">
    <#if (!JiveGlobals.isWhiteLabel())>
        <div class="jive-footer-nav">
            <#assign license = jiveContext.getLicenseManager().getLicense()/>
            <a href="http://www.jivesoftware.com/poweredby/" target="_blank">
                <@s.text name='dectr.pwrdByJiveLicense.link'>
                    <@s.param>${jiveContext.communityManager.rootCommunity.name}</@s.param>
                    <@s.param>${license.name?string}</@s.param> 
                    <@s.param>${license.version.versionString?string}</@s.param>
                </@s.text>
            </a>

            <div class="jiveVersion" style="display: none;">
                <@s.text name='dectr.jiveVersion.link'>
                    <@s.param>@@REVISION@@</@s.param>
                </@s.text>
            </div>

    - <a href="http://www.jivesoftware.com/community/community/features" target="_blank"><@s.text name="dectr.submit_prdct_fdback.link" /></a>
        </div>
        <div class="jive-footer-copyright"><@s.text name="dectr.copyrightJiveFooter.text" /></div>
    </#if>
</div>
</#if>
<!-- END footer -->
