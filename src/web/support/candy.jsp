<%@page contentType="text/html; charset=UTF-8" %>
<%
    String xmppDomain = application.getInitParameter("xmpp-domain");
    boolean debug = false;
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Support - Group Chat</title>
    <link rel="stylesheet" type="text/css" href="candy-dev/res/default.css" />
    <% if ( debug ) { %>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js"></script>
    <script type="text/javascript" src="candy-dev/libs.bundle.js" charset="utf-8"></script>
    <script type="text/javascript" src="candy-dev/candy.bundle.js" charset="utf-8"></script>
    <% } else { %>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="candy-dev/libs.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="candy-dev/candy.min.js" charset="utf-8"></script>
    <% } %>

    <script type="text/javascript">
    $(document).ready(function() {
            Candy.init('/http-bind/', {
                    core: {
                            debug: <%= Boolean.toString( debug ) %>,
                            autojoin: ['open_chat@conference.<%= xmppDomain %>']
                    },
                    view: { resources: 'candy-2.2.0/res/' }
            });

            Candy.Core.connect('<%= xmppDomain %>');
    });
    </script>
</head>
<body>
    <div id="candy"></div>
</body>
</html>
