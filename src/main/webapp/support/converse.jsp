<%@page contentType="text/html; charset=UTF-8" %>
<%
    String xmppDomain = application.getInitParameter("xmpp-domain");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Converse.js</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Converse.js: An XMPP chat client which can be integrated into any website" />
    <meta name="author" content="JC Brand" />
    <meta name="keywords" content="xmpp chat webchat converse.js" />
    <link rel="stylesheet" type="text/css" media="screen" href="https://cdn.conversejs.org/14.0.0/dist/converse.min.css">
    <script type="module" src="https://cdn.conversejs.org/14.0.0/dist/converse.min.js"></script>

    <style>
        .converse-container {
            height: 558px;
        }

        /* <converse-root> is a custom element, so it defaults to display:inline.
           Converse only sets 'position: relative' on it in embedded mode, while its
           inner <converse-chats> uses height:100%. Without a block box and a definite
           height to resolve against, the chat collapses to zero height. */
        .converse-container converse-root {
            display: block;
            height: 100%;
        }
    </style>
</head>

<body id="page-top">
    <div class="converse-container">
        <converse-root id="conversejs"></converse-root>
    </div>

    <script type="module">
        converse.initialize({
            authentication: 'anonymous',
            auto_login: true,
            auto_join_rooms: [
                'open_chat@conference.igniterealtime.org'
            ],
            bosh_service_url: 'https://igniterealtime.org/http-bind/',
            jid: '<%= xmppDomain %>',
            muc_fetch_members: false,
            singleton: true,
            theme: 'default',
            view_mode: 'embedded'
        });
    </script>
</body>
</html>
