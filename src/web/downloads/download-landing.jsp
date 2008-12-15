
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<%@ include file="/includes/ws_locator.jspf" %>

<%  String path = request.getContextPath(); %>

<%  // get parameters
    String filename = request.getParameter("file");

    if (filename == null) {
        response.sendRedirect(path + "/error.jsp");
        return;
    }
%>
<html>
<head>
<title>Download Landing</title>
<meta name="body-id" content="downloads" />
<style type="text/css" media="screen">
    @import "/styles/interior.css";
</style>
</head>
<body>

<!-- BEGIN body area -->
<div id="ignite_body">

    <!-- BEGIN left column (main content) -->
    <div id="ignite_body_leftcol">

        <!-- BEGIN body content area -->
        <div id="ignite_int_body">

            <!-- BEGIN body header -->
            <div id="ignite_body_header">
                <h1>Thanks for Downloading!</h1>
            </div>
            <!-- END body header -->

<meta http-equiv="refresh" content="1;URL=<%= "/downloadServlet?filename="+filename %>">

<p>
Your download will start right now.
If a download window does not appear,
please <a href="<%= "/downloadServlet?filename="+filename %>">click here</a>.
</p>

<br />
<%--
<div style="background-color:#efefef; padding: 3px;">

<table border="0">
<tr valign="top">
<td><img src="/images/survey.png" alt="Survey"></td>
<td><b>Tell us what to build next!</b><br><br>

Take <a href="http://www.jivesoftware.com/survey/s?s=652">a fast survey</a> 
to give us feedback. </td>
</tr>
</table>

</div>
--%>

<%--<div style="background-color:#efefef;padding:3px">--%>
<!--<b>IM Newsletter Sign-up</b><br><br>-->
<!---->
<%--<%@ include file="include/newsletter-form.jspf" %>--%>
<!---->
<!--We will not sell your email address and will only use it to send you the IM Newsletter.-->
<!--The goal of this newsletter is to share information about new IM technologies, best practices-->
<!--and upcoming events.-->
<!--</div>-->
<%----%>
<br><br>

        </div>
        <!-- END body content area -->

    </div>
    <!-- END left column (main content) -->

    <!-- BEGIN right column (sidebar) -->
    <div id="ignite_body_rightcol">


        <%@ include file="/includes/sidebar_enterprise.jspf" %>

        <%@ include file="/includes/sidebar_48hrsnapshot.jspf" %>

        <%--<%@ include file="/includes/sidebar_testimonial.jspf" %>--%>

    </div>
    <!-- END right column (sidebar) -->

</div>
<!-- END body area -->


</body>
</html>
