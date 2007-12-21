<html>
<head>
    <title><@ww.text name="account.createNewAccount.title" /></title>

    <meta name="nosidebar" content="true" />
    <SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript' SRC='/elqNow/elqCfg.js'></SCRIPT>
    <SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript' SRC='/elqNow/elqImg.js'></SCRIPT>
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">

    <content tag="breadcrumb">
        <@ww.action name="community-breadcrumb" executeResult="true" ignoreContextParams="true" />

        <a href="<@ww.url value="/people" includeParams="none" />"><@ww.text name="profile.people.brdcrmb.link" /></a>
    </content>

</head>
<body>


<!-- BEGIN header & intro  -->
<div id="jive-body-intro">
    <div id="jive-body-intro-content">
        <h1><@ww.text name="account.createNewAccount.title" /></h1>
        <p><@ww.text name="account.createNewAccount.text" /></p>
    </div>
</div>
<!-- END header & intro -->


<!-- BEGIN main body -->
<div id="jive-body-main">


    <!-- BEGIN main body column -->
    <div id="jive-body-maincol-container">
        <div id="jive-body-maincol">


        <#include "/template/global/include/form-message.ftl" />

        <form action="<@ww.url action='account' includeParams='none'/>" method="post" name="accountform">
<input type="hidden" name="elqFormName" value="Ignite-Registration">
<input type="hidden" name="elqSiteID" value="764">
<input type="hidden" name="elqDefaultTargetURL" value="">
<input type="hidden" name="elqPost" value="">
<input type="hidden" name="elqCustomerGUID" value="">
<input type="hidden" name="elqCookieWrite" value="0">

            <div class="jive-table jive-table-registration">

                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="jive-table-cell-label jive-label-required">
                            <#-- Desired Username: -->
                            <label for="username01">
                                <@ww.text name="account.username.label" /><@ww.text name="global.colon" />
                                <span><@ww.text name="global.asterix"/></span>
                            </label>
                        </td>
                        <td>
                            <input type="text" name="username" size="30" maxlength="30" value="${username?default('')?html}"
                                    onfocus="this.select();" id="username01">

                             <@macroFieldErrors name="username"/>

                        </td>
                    </tr>
                    <tr>
                        <td class="jive-table-cell-label jive-label-required">
                            <#-- Name: -->
                            <label for="name01">
                                <@ww.text name="global.name" /><@ww.text name="global.colon" />
                                <span><@ww.text name="global.asterix"/></span>
                            </label>
                        </td>
                        <td>
                            <input type="text" name="name" size="40" maxlength="80" value="${name?default('')?html}"
                             onfocus="this.select();" id="name01">

                            <@macroFieldErrors name="name"/>

                            <div>
                                <input type="radio" name="showName" value="true" id="nv01" <#if (showName)>checked="checked"</#if>>
                                <#-- Show -->
                                <label for="nv01"><@ww.text name="global.show" /></label>
                                <input type="radio" name="showName" value="false" id="nv02" <#if (!showName)>checked="checked"</#if>>
                                <#-- Hide -->
                                <label for="nv02"><@ww.text name="global.hide" /></label>
                            </div>
                        </td>
                    </tr>
                    <#if userUpdateSupported>
                    <tr>
                        <td class="jive-table-cell-label jive-label-required">
                            <#-- Email Address: -->
                            <label for="email01">
                                <@ww.text name="global.email" /><@ww.text name="global.colon" />
                                <span><@ww.text name="global.asterix"/></span>
                            </label>
                        </td>
                        <td>
                            <input type="text" name="email" size="40" maxlength="80" value="${email?default('')?html}"
                             onfocus="this.select();" id="email01">

                            <@macroFieldErrors name="email"/>

                            <div>
                                <input type="radio" name="showEmail" value="true" id="ev01" <#if (showEmail)>checked="checked"</#if>>
                                <label for="ev01"><@ww.text name="global.show" /></label>
                                <input type="radio" name="showEmail" value="false" id="ev02" <#if (!showEmail)>checked="checked"</#if>>
                                <label for="ev02"><@ww.text name="global.hide" /></label>
                            </div>

                        </td>
                    </tr>
                    </#if>
                    <tr>
                        <td class="jive-table-cell-label jive-label-required">
                            <#-- Password: -->
                            <label for="password01">
                                <@ww.text name="global.password" /><@ww.text name="global.colon" />
                                <span><@ww.text name="global.asterix"/></span>
                            </label>
                        </td>
                        <td>
                            <input type="password" name="password" size="15" maxlength="30" value="${password?default('')?html}"
                             onfocus="this.select();" id="password01">

                             <@macroFieldErrors name="password"/>

                        </td>
                    </tr>
                    <#if userUpdateSupported>
                    <tr>
                        <td class="jive-table-cell-label jive-label-required">
                            <#-- Confirm Password: -->
                            <label for="confirmpass01">
                                <@ww.text name="global.confirm_password" /><@ww.text name="global.colon" />
                                <span><@ww.text name="global.asterix"/></span>
                            </label>
                        </td>
                        <td>
                            <input type="password" name="passwordConfirm" size="15" maxlength="30" value="${passwordConfirm?default('')?html}"
                             onfocus="this.select();" id="confirmpass01">

                             <@macroFieldErrors name="passwordConfirm"/>
                             <@macroFieldErrors name="passwordMatch"/>

                        </td>
                    </tr>
                    </#if>

                    <#include "/template/global/include/edit-profile-rows.ftl" />

                    <tr>
                        <td class="jive-table-cell-label">
                            <#-- Auto-Login: -->
                            <@ww.text name="global.auto_login" /><@ww.text name="global.colon" />
                        </td>
                        <td>
                            <input type="checkbox" name="autoLogin" id="cb01" <@ww.if test="autoLogin == true">checked="checked"</@ww.if>>
                            <#-- Remember Me -->
                            <label for="cb01"><@ww.text name="global.remember_me" /></label>
                        </td>
                    </tr>

                <#if (jiveContext.registrationManager.humanValidationEnabled)>
                    <tr class="jive-table-row-capthca">
                        <td class="jive-table-cell-label jive-label-required">
                            <label for="val01">
                                <@ww.text name="reg.enter_the_code.label" />
                                <span><@ww.text name="global.asterix"/></span>
                            </label>
                        </td>
                        <td>
                            <div>
                                <img src="<@ww.url value="/confirmation/imageconfirmationservlet?rand=${StringUtils.randomString(16)}&file=conf.jpg" includeParams="none"/>"
                                    id="jive-captcha" alt="<@ww.text name="reg.preventsAutoRegistr.tooltip" />" title="<@ww.text name="reg.preventsAutoRegistr.tooltip" />" />
                            </div>

                            <input type="text" name="validation" size="10" maxlength="6" onfocus="this.select();" id="val01">
                            <@ww.text name="reg.preventsAutoRegistr.text" />

                            <@macroFieldErrors name="validation"/>

                        </td>
                    </tr>
                </#if>

                <#if (jiveContext.registrationManager.termsEnabled)>

                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <div>
                                <IFRAME src="${jiveContext.registrationManager.termsURL}"
                                    frameborder="0" marginwidth="0" marginheight="0" width="600" height="200"
                                    onfocus="this.select();" id="val02">
                                    <A HREF="${jiveContext.registrationManager.termsURL}">
                                        <@ww.text name="reg.terms_and_conditions.text" />
                                    </A>
                                </IFRAME>
                            </div>

                            <input type="checkbox" name="agree" value="true" id="cb02" <@ww.if test="agree == true">checked="checked"</@ww.if>>
                            <#-- Agree -->
                            <label for="cb02"><@ww.text name="reg.i_agree_to_t_n_c.checkbox" /></label>

                            <@macroFieldErrors name="agree"/>

                        </td>
                    </tr>

                </#if>

                <tr>
                    <td>&nbsp;</td>
                    <td>

                        <input type="submit" name="createButton" class="jive-form-button jive-form-button-submit" value="<@ww.text name="global.create_account" />" >
                        <input type="submit" name="method:cancel" class="jive-form-button jive-form-button-cancel" value="<@ww.text name="global.cancel" />" >

                    </td>
                </tr>
                </table>

            </div>

        </form>

        <script language="JavaScript" type="text/javascript">
            document.accountform.username.focus();
        </script>

<!-- Eloqua tracking scripts -->
<script type='text/javascript' language='JavaScript' src='/elqNow/elqCfg.js'></script>
<script type='text/javascript' language='JavaScript' src='/elqNow/elqImg.js'></script>

<SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript'><!--//

var elqPPS = '70';

//--></SCRIPT>

<SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript' SRC='/elqNow/elqScr.js'></SCRIPT>

<SCRIPT TYPE='text/javascript' LANGUAGE='JavaScript'><!--//

window.onload = initPage;

function initPage(){ if (this.GetElqCustomerGUID) document.forms["IgniteCreateAccount"].elements["elqCustomerGUID"].value = GetElqCustomerGUID(); }

//--></SCRIPT>


        </div>
    </div>
    <!-- END main body column -->


</div>
<!-- END main body -->


</body>
</html>