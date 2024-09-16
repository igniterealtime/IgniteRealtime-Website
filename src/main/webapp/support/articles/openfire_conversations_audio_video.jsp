<html>
<head>
    <title>Preparing Openfire for Audio/Video calls with Conversations</title>
    <meta name="body-id" content="support" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="support"/>
</jsp:include>

<section id="ignite_body">

    <main class="ignite_int_body_padding">
        <article id="ignite_int_body">

            <div class="ignite_project_banner_warning">
                <h1>Outdated</h1>
                <p>
                    This article was written a <em>long</em> time ago!<br/>Be aware that parts, or all of it may be outdated!
                </p>
            </div>

            <header id="ignite_body_header">
                <h1>Preparing Openfire for Audio/Video calls with Conversations</h1>
            </header>

            <p>April 26, 2020<br>
                <i>by Guus der Kinderen</i></p>

            <p>
                Later this week (editor's note: this was originally written in April 2020), the popular Android client
                <a href="https://conversations.im">Conversations</a> will have an exciting new release that will allow
                you to make voice and video calls.
            </p>
            <p>
                For this to work well with your instance of Openfire, it is recommended to make use of a STUN and TURN
                service. I've personally experimented with [coturn](https://github.com/coturn/coturn), which I've found
                easy to use.
            </p>
            <p>
                After you've set up the STUN and TURN service, you'll need to configure Openfire to expose the
                availability of this new service to your users. You can do this easily with the
                <a href="https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=externalservicediscovery">External Service Discovery</a>
                plugin for Openfire.
            </p>
            <p>
                After you install the plugin, you can add your TURN and STUN services to its configuration, as shown
                below. This will allow clients to discover the availability of these services!
            </p>
            <figure>
                <img src="images/conversations_audio_video_1.jpeg" alt="Screenshot of the Openfire admin console, showing External Service Discovery configuration.">
            </figure>
            <p>
                Take care to read up on the authentication mechanisms that are available in your TURN server, to prevent
                unrelated third parties from making use of your bandwidth.
            </p>
            <p>
                That's all to it!
            </p>

            <hr/>

            <p>
                If you want to comment on this article, please do so as a reaction to the
                <a href="https://discourse.igniterealtime.org/t/preparing-openfire-for-audio-video-calls-with-conversations/">blog post</a> that corresponds with the article!
            </p>
        </article>
    </main>
</section>

</body>
</html>
