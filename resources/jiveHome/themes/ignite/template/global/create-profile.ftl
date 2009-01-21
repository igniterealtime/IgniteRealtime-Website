<html>
<head>
    <title><@s.text name="account.createNewAccount.title" /></title>

    <meta name="nosidebar" content="true" />

  <style type="text/css" media="all">
      @import "<@s.url value='/styles/jive-profile.css'/>";
      #jive-userbar-user {
          display: none;
      }
      #jive-userbar-droplink {
          display: none;
      }
  </style>

    <content tag="breadcrumb">
        <@s.action name="community-breadcrumb" executeResult="true" ignoreContextParams="true" />

        <a href="<@s.url value="/people" />"><@s.text name="profile.people.brdcrmb.link" /></a>
    </content>
</head>
<body class="jive-body-formpage jive-body-formpage-register">

<!-- BEGIN header & intro  -->
<div id="jive-body-intro">
    <div id="jive-body-intro-content">
        <h1><@s.text name="account.createNewAccount.title" /></h1>
        <p><@s.text name="account.createNewAccount.text" /></p>
    </div>
</div>
<!-- END header & intro -->


<!-- BEGIN main body -->
<div id="jive-body-main">


    <!-- BEGIN main body column -->
    <div id="jive-body-maincol-container">
        <div id="jive-body-maincol">


        <#include "/template/global/include/form-message.ftl" />
        <#include "/template/global/include/profile-macros.ftl"  />

        <#if !preview?exists || !preview>
        <form action="<@s.url action='create-account'/>" method="post" name="accountform">
        <#else>
        <form action="#" method="post" name="accountform" autocomplete="off">
        </#if>

            <input type="hidden" name="elqCustomerGUID" value="">
            <input type="hidden" name="elqCookieWrite" value="0">
            <input type="hidden" name="elqSiteID" value="764">
            <input type="hidden" name="elqDefaultTargetURL" value="">
            <input type="hidden" name="elqPost" value="">
            <input type="hidden" name="elqFormName" value="Ignite-Registration"/>

            <div class="jive-table jive-table-registration">

                <table cellpadding="0" cellspacing="0">
                    <#list registrationFields as field>
                        <#if (field.id > 0)>
                            <@displayProfileFieldInput field=action.getProfileFieldById(field.id) />
                            <#elseif -1 == field.id>
                                <td class="jive-table-cell-label jive-label-required">
                                    <#-- Desired Username: -->
                                        <label for="username01">
                                            <@s.text name="account.username.label" /><@s.text name="global.colon" />
                                            <span><@s.text name="global.asterix"/></span>
                                        </label>
                                </td>
                                <td>
                                    <input type="text" name="username" size="30" maxlength="30"
                                           value="${username?default('')?html}"
                                           onfocus="this.select();" id="username01">

                                    <@macroFieldErrors name="username"/>

                                </td>
                                </tr>
                                <#elseif -2 == field.id>
                                <tr>
                                    <td class="jive-table-cell-label jive-label-required">
                                        <#-- Password: -->
                                            <label for="password01">
                                                <@s.text name="global.password" /><@s.text name="global.colon" />
                                                <span><@s.text name="global.asterix"/></span>
                                            </label>
                                    </td>
                                    <td>
                                        <input type="password" name="password" size="15" maxlength="30"
                                               value="${password!?html}"  onfocus="this.select();" id="password01" />
                                            <@macroFieldErrors name="password"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="jive-table-cell-label jive-label-required">
                                            <#-- Confirm Password: -->
                                                <label for="confirmpass01">
                                                    <@s.text name="global.confirm_password" />
                                                    <@s.text name="global.colon" />
                                                    <span><@s.text name="global.asterix"/></span>
                                                </label>
                                        </td>
                                        <td>
                                            <input type="password" name="passwordConfirm" size="15" maxlength="30"
                                                   value="${passwordConfirm!?html}"
                                                   onfocus="this.select();" id="confirmpass01" />
                                            <@macroFieldErrors name="passwordConfirm"/>
                                            <@macroFieldErrors name="passwordMatch"/>
                                        </td>
                                    </tr>
                                    <#elseif -3 == field.id>
                                    <tr>
                                        <td class="jive-table-cell-label jive-label-required">
                                            <#-- Email Address: -->
                                            <label for="email01">
                                                <@s.text name="global.email" /><@s.text name="global.colon" />
                                                <span><@s.text name="global.asterix"/></span>
                                            </label>
                                        </td>
                                        <td>
                                            <input type="text" name="email" size="40" maxlength="80"
                                                   value="${email!?html}"
                                                   onfocus="this.select();" id="email01" />
                                            <#if allowEmailVisibilityToggle>
                                            <div>
                                                <input type="radio" name="showEmail" value="true" id="ev01"
                                                <#if (showEmail)>checked="checked"</#if>>
                                                <label for="ev01"><@s.text name="global.show" /></label>
                                                <input type="radio" name="showEmail" value="false" id="ev02"
                                                <#if (!showEmail)>checked="checked"</#if>>
                                                <label for="ev02"><@s.text name="global.hide" /></label>
                                            </div>
                                            </#if>
                                            <@macroFieldErrors name="email"/>
                                        </td>
                                    </tr>
                                    <#elseif -4 == field.id>
                                    <#if lastNameFirstNameEnabled>
                                        <tr>
                                            <td class="jive-table-cell-label jive-label-required">
                                                <#-- First Name: -->
                                                <label for="fname01">
                                                    <@s.text name="global.first.name" /><@s.text name="global.colon"/>
                                                    <span><@s.text name="global.asterix"/></span>
                                                </label>
                                            </td>
                                            <td>
                                                <input type="text" name="firstName" size="40" maxlength="80"
                                                       value="${firstName!?html}"
                                                       onfocus="this.select();" id="fname01" />
                                                <@macroFieldErrors name="firstName"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="jive-table-cell-label jive-label-required">
                                                <#-- Last Name: -->
                                                <label for="lname01">
                                                    <@s.text name="global.last.name" /><@s.text name="global.colon"/>
                                                    <span><@s.text name="global.asterix"/></span>
                                                </label>
                                            </td>
                                            <td>
                                                <input type="text" name="lastName" size="40" maxlength="80"
                                                       value="${lastName!?html}"
                                                       onfocus="this.select();" id="lname01" />
                                                <#if allowNameVisibilityToggle>
                                                <div>
                                                    <input type="radio" name="showName" value="true" id="nv01"
                                                    <#if (showName)>checked="checked"</#if> />
                                                    <#-- Show -->
                                                        <label for="nv01"><@s.text name="global.show" /></label>
                                                        <input type="radio" name="showName" value="false" id="nv02"
                                                            <#if (!showName)>checked="checked"</#if> />
                                                        <#-- Hide -->
                                                        <label for="nv02"><@s.text name="global.hide" /></label>
                                                </div>
                                                </#if>
                                                <@macroFieldErrors name="lastName"/>
                                            </td>
                                        </tr>
                                    <#else>
                                        <tr>
                                            <td class="jive-table-cell-label jive-label-required">
                                                <#-- Name: -->
                                                <label for="name01">
                                                    <@s.text name="global.name" /><@s.text name="global.colon"/>
                                                    <span><@s.text name="global.asterix"/></span>
                                                </label>
                                            </td>
                                            <td>
                                                <input type="text" name="name" size="40" maxlength="80"
                                                       value="${name!?html}"
                                                       onfocus="this.select();" id="name01" />

                                                <#if allowNameVisibilityToggle>
                                                <div>
                                                    <input type="radio" name="showName" value="true" id="nv01"
                                                    <#if (showName)>checked="checked"</#if> />
                                                    <#-- Show -->
                                                        <label for="nv01"><@s.text name="global.show" /></label>
                                                        <input type="radio" name="showName" value="false" id="nv02"
                                                            <#if (!showName)>checked="checked"</#if> />
                                                        <#-- Hide -->
                                                        <label for="nv02"><@s.text name="global.hide" /></label>
                                                </div>
                                                </#if>
                                                <@macroFieldErrors name="name"/>
                                            </td>
                                        </tr>
                                    </#if>
                        </#if>
                    </#list>
                    <tr>
                        <td class="jive-table-cell-label">
                            <#-- Auto-Login: -->
                            <@s.text name="global.auto_login" /><@s.text name="global.colon" />
                        </td>
                        <td>
                            <input type="checkbox" name="autoLogin" id="cb01" <@s.if test="autoLogin == true">checked="checked"</@s.if>>
                            <#-- Remember Me -->
                            <label for="cb01"><@s.text name="global.remember_me" /></label>
                        </td>
                    </tr>

                <#if humanValidationEnabled>
                    <tr class="jive-table-row-capthca">
                        <td class="jive-table-cell-label jive-label-required">
                            <label for="val01">
                                <@s.text name="reg.enter_the_code.label" />
                                <span><@s.text name="global.asterix"/></span>
                            </label>
                        </td>
                        <td>
                            <div>
                                <img src="<@s.url value='/confirmation/imageconfirmationservlet?rand=${StringUtils.randomString(16)}&file=conf.jpg'/>"
                                    id="jive-captcha" alt="<@s.text name="reg.preventsAutoRegistr.tooltip" />" title="<@s.text name="reg.preventsAutoRegistr.tooltip" />" />
                            </div>

                            <input type="text" name="validation" size="10" maxlength="6" onfocus="this.select();"
                                   id="val01" />
                            <@s.text name="reg.preventsAutoRegistr.text" />
                            <@macroFieldErrors name="validation"/>
                        </td>
                    </tr>
                </#if>

                <#if termsEnabled>
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <div>
                                <iframe src="${termsUrl}"
                                    frameborder="0" marginwidth="0" marginheight="0" width="600" height="200"
                                    id="val02">
                                    <a href="${termsUrl}">
                                        <@s.text name="reg.terms_and_conditions.text" />
                                    </a>
                                </iframe>
                            </div>
                            <input type="checkbox" name="agree" value="true" id="cb02" <@s.if test="agree == true">checked="checked"</@s.if>>
                            <#-- Agree -->
                            <label for="cb02"><@s.text name="reg.i_agree_to_t_n_c.checkbox" /></label>
                            <@macroFieldErrors name="agree"/>
                        </td>
                    </tr>
                </#if>

                <tr>
                    <td>&nbsp;</td>
                    <td>

                        <input type="submit" name="method:execute" class="jive-form-button-submit"
                               value="<@s.text name="global.create_account" />"/>
                        <input type="submit" name="method:cancel" class="jive-form-button-cancel"
                               value="<@s.text name="global.cancel" />"/>
                    </td>
                </tr>
                </table>
            </div>
        </form>
        <@resource.javascript>
            document.observe("dom:loaded", function() {
                $(document.accountform).focusFirstElement();
            });
        </@resource.javascript>
        </div>
    </div>
    <!-- END main body column -->
</div>
<!-- END main body -->
</body>
</html>
