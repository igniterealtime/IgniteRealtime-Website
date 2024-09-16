<html>
<head>
    <title>Openfire Meetings as an alternative to Zoom</title>
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
                <h1>Openfire Meetings as an alternative to Zoom</h1>
            </header>

<p>April 7, 2020<br>
<i>by Dele Olajide</i></p>

<p>
    If you are a small and medium business and already have Openfire setup and running for chat and groupchat using
    <a href="http://www.igniterealtime.org/projects/spark/index.jsp">Spark</a>, 
    <a href="http://www.igniterealtime.org/projects/openfire/plugins/6.0.1.1/inverse/readme.html">inVerse</a> or 
    <a href="http://www.igniterealtime.org/projects/pade/index.jsp">Pàdé</a> and you want to provide secure video or
    audio conferencing with authentication for your users from password-protected chat rooms using permissions and 
    configurations already made to Openfire, then you should be looking at 
    <a href="https://github.com/igniterealtime/openfire-ofmeet-plugin).">Openfire Meetings</a>
</p>
<p>
    Also consider Openfire Meetings as an alternative to Zoom if the audio and/or video from your meetings needs to be
    recorded by participants and later played back from their desktops and mobile devices, without downloading any
    external software or installing any app on their mobile devices.    
</p>
<p>
    First, there are few things you need to know. These include:    
</p>
<ol>
    <li>
        Openfire meetings does not work properly with Firefox. It works best with Chromium based apps like Chrome, Edge,
        Electron and Opera. If this is a dealbreaker for you, please move on and download Zoom.
    </li>
    <li>
        There a two versions available at Ignite. The 
        <a href="https://github.com/igniterealtime/openfire-ofmeet-plugin">official version (0.9.5)</a> combines both
        the offocus and ofmeet plugin into a single package. It is lagging behind the current versions of the Jitsi 
        dependencies. Expect an upgrade soon to the new Jitsi videobridge2 implementation.
    </li>
    <li>
        The <a href="https://github.com/igniterealtime/openfire-pade-plugin">second version (0.9.8)</a> is a fork of 
        the first at (0.9.4) and customized for Pade. It has the latest versions of all Jitsi dependency code and the
        extra feature to record a conference from the browser.        
    </li>
    <li>
        Openfire Meetings <a href="https://discourse.igniterealtime.org/t/openfire-meetings-focus-user-and-ofmeet-focus-host/78956/18">will 
        not work out of the box if your Openfire server is configured to use LDAP</a>. You would need to create the
        Jitsi focus bot user and give it owner/admin permissions to the MUC service manually.     
    </li>
    <li>
        Openfire Meetings has minimal network requirements and works out of the box internally on a local area network 
        (LAN) or with a hosted Openfire server on the internet. If your Openfire server is placed behind a NAT and 
        firewall and you want to allow external internet access, then you require some network expertise to configure
        it. You would need to open a few UDP/TCP ports and provide both the public and private IP addresses of your 
        Openfire server.     
    </li>
</ol>
<p>
    To use Openfire Meetings version 0.9.8, <a href="https://github.com/igniterealtime/openfire-pade-plugin/releases">download
    from here</a> and upload the ofmeet.jar and offocus.jar plugin files in any order from the admin web console of 
    Openfire. Wait for both to appear in the plugins listing and then complete the following three steps to confirm it
    is working.    
</p>
<ol>
    <li>
        Confirm the focus bot user has logged in ok like this. If not, check log files and get help from the
        IgniteRealtime community.<br/>
        <figure>
            <img src="images/ofmeet_zoom_1.png" alt="Screenshot of the Openfire admin console, showing an online session of a user named 'focus'.">
        </figure>
    </li>
    <li>
        If you have an active focus user, then you can do a quick peer-to-peer test with two browser tabs on your
        desktop. Open both of them to the same <tt>https://your_server:7443/ofmeet/testconf</tt> and confirm that it is
        showing in the conference summary like this:<br/>
        <figure>
            <img src="images/ofmeet_zoom_2.png" alt="Screenshot of the Openfire admin console, showing an active conference on the Meetings Summary page.">
        </figure>
    </li>
    <li>
        If you get audio and video, then focus bot user is working ok and XMPP messages are passing around ok. If not,
        it is back to the log files and help from the community.
    </li>
    <li>
        To confirm the video-bridge is working, you need to run step 3 again with 3 users. If audio and video stops with
        third participant, then double check on the network configuration, making sure TCP port 7443 and UDP port 10000
        are opened for listening from the openfire server. Otherwise, check the log files and ask for help from the
        IgniteRealtime community.
    </li>
</ol>
<p>
    Stay safe and best of luck :-)
</p>

<hr/>
<p>
    If you want to comment on this article, please do so as a reaction to the
    <a href="https://discourse.igniterealtime.org/t/openfire-meetings-as-an-alternative-to-zoom/">blog post</a> that corresponds with the article!
</p>
        </article>
    </main>
</section>

</body>
</html>
