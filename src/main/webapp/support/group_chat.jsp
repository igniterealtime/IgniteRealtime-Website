<html>
<head>
    <title>Group Chat</title>
    <meta name="body-id" content="support" />
    <style media="screen">
        @import "../styles/interior.css";
    </style>
    <style>
        ul.changelogentry li {
            margin-left: 2.5em;
            list-style-type: disc;
        }
        
        ul.changelogentry li.changelogheader {
            list-style-type:none; 
            margin-left: 0em;
        }
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="support"/>
</jsp:include>

<section id="ignite_body">

    <main class="ignite_int_body_groupchat">

        <p>Chat live with the community about Ignite Realtime projects. The chat
        service is available at all times. Feel free to ask any question you like, but please note
        that you're talking to volunteers, not people that are paid to be readily available and answer
        your questions. It might take some time for anyone to read your message.</p>

        <iframe src="converse.jsp" style="width:100%;height:574px;"></iframe>

        <!-- <p>Alternatively, you may use any <a href="https://xmpp.org/software/clients.html">XMPP client</a>
        to connect to the group chat service at conference.igniterealtime.org. The chat name is
        &quot;Open Chat&quot; and its address is open_chat@conference.igniterealtime.org.</p> -->

        <p>The web-based group chat client used is <a href="https://conversejs.org/">ConverseJS</a>.</p>

    </main>

</section>

</body>
</html>
