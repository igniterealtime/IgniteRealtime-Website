<%@page contentType="text/html; charset=UTF-8" %>
<%
    String xmppDomain = application.getInitParameter("xmpp-domain");
    boolean debug = false;
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Converse.js</title>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Converse.js: An XMPP chat client which can be integrated into any website" />
    <meta name="author" content="JC Brand" />
    <meta name="keywords" content="xmpp chat webchat converse.js" />
    <link rel="stylesheet" type="text/css" media="screen" href="https://cdn.conversejs.org/5.0.0/dist/converse.min.css">
    <script src="https://cdn.conversejs.org/5.0.0/dist/converse.min.js" charset="utf-8"></script>

    <style>
        .converse-container {
            height: 558px;
        }
    </style>
</head>

<body id="page-top" data-spy="scroll">

                        <div class="converse-container">
                            <div id="conversejs"></div>
                        </div>

</body>

<script>
    converse.initialize({
        authentication: 'anonymous',
        auto_login: true,
        auto_join_rooms: [
            'open_chat@conference.igniterealtime.org',
        ],
        bosh_service_url: 'https://igniterealtime.org/http-bind/',
        jid: 'igniterealtime.org',
        muc_fetch_members: false,
        singleton: 'true',
        view_mode: 'embedded',
    });
</script>
</html>
