<%@ page import="java.util.Map" %>
<%@ page import="java.text.NumberFormat" %>
<%@ page import="java.util.Currency" %>
<%@ page import="java.util.HashMap" %>

<html>
<head>
<title>Support These Projects</title>
<meta name="body-id" content="store" />
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
					<h1>Support Open RTC</h1>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_padding">



    <div style="padding-left: 40px;">


<img src="/images/enterprise.png" alt="Wildfire Enterprise" hspace="10" vspace="10" width="200" height="197" border="0" align="right" />

<p>
    Interested in supporting the Open Source projects on this site? Buy a license for the Wildfire Enterprise Plug-in
    and you'll be doing just that without so much as a server restart.
</p>

<style type="text/css">
#pricing {
    font-size: 2em;
    font-weight: bold;
}
#pricing .name {
    padding-top: 20px;
}
#pricing .price {
    float: right;
    padding-top: 20px;
}
#action_buttons {
    padding-top: 20px;
}
</style>
        <div id="pricing">
            <div class="price">$0</div>
            <div class="name">Wildfire</div>
            <div class="price">$15/user/year</div>
            <div class="name">Enterprise Plug-in</div>
        </div>

        <div id="action_buttons">
            [these should be orange graphic buttons]<br>
            <input type="button" name="tour" value="Feature Tour">
            <input type="button" name="info" value="More Information">
            <input type="button" name="buy" value="Buy Now">
        </div>

        <div id="tshirts">
            <h3>Other Stuff</h3>
            <p>You can also buy themed t-shirts, mouse pads, mugs and more through the Caf&#233; Press
            </p>
        </div>
    </div>

                    <br />

				</div>
				
				
				
				
				
				
			</div>
			<!-- END body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">


			<%--<%@ include file="/includes/sidebar_enterprise.jspf" %>--%>

			<%@ include file="/includes/sidebar_48hrsnapshot.jspf" %>

			<%@ include file="/includes/sidebar_testimonial.jspf" %>

		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>