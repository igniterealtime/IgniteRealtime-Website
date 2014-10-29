<%@page contentType="text/html; charset=UTF-8" %>
<%
String xmppDomain = application.getInitParameter("xmpp-domain");
%>
<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="utf-8">
	<title>Support - Group Chat</title>
        <link rel="stylesheet" type="text/css" href="candy-1.7.1/res/default.css" />
        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script type="text/javascript" src="candy-1.7.1/libs/libs.min.js" charset="utf-8"></script>
        <script type="text/javascript" src="candy-1.7.1/candy.min.js" charset="utf-8"></script>
	<script type="text/javascript">
                $(document).ready(function() {
                        Candy.init('/http-bind/', {
                                core: {
                                        debug: false,
                                        autojoin: ['open_chat@conference.<%= xmppDomain %>']
                                },
                                view: { resources: 'candy-1.7.1/res/' }
                        });

                        Candy.Core.connect('<%= xmppDomain %>');

                });

	</script>
</head>
<body>
<div id="candy"></div>
</body>
</html>
