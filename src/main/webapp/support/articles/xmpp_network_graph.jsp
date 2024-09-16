<html>
<head>
    <title>Creating the XMPP Network Graph</title>
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

            <header id="ignite_body_header">
                <h1>Creating the XMPP Network Graph</h1>
            </header>

            <p>January 24, 2024<br>
                <i>by Guus der Kinderen</i></p>

            <p>
                At the risk of sounding like an unhinged fanboy: XMPP is <em>pretty awesome</em>!
            </p>
            <p>
                I've been involved in one way or another with XMPP, the network protocol that is an open standard for
                messaging and presence, for the last two decades. Much of that revolves around development of
                <a href="https://www.igniterealtime.org/projects/openfire/">Openfire</a>, our XMPP-based real-time
                communications server.
            </p>
            <p>
                TL;DR:
            </p>
            <ul>
                <li>I built a thing: <a href="https://xmppnetwork.goodbytes.im">https://xmppnetwork.goodbytes.im</a></li>
                <li>XMPP is pretty awesome (as stated above)!</li>
                <li>Openfire is a great development platform!</li>
            </ul>
            <figure class="articles">
                <img src="images/xmpp_network_graph_1.jpeg" alt="An elaborate network graph of XMPP domain nodes.">
            </figure>

            <h2>Decentralisation with XMPP</h2>
            <p>
                There's much to say about what I like about XMPP, but let me focus on one thing in this text:
                decentralisation. Not only the protocol, but the entire XMPP ecosystem - with all its different server
                and client implementations - is based on the principle of federation. This allows anyone to set up their
                own solution for instant messaging, voice and/or video conferencing, data sharing, and much, much more.
                All of this is done without creating a dependency on any central entity or organisation. At the same
                time, you’ve created a solution that allows you to communicate with others that are not part of your own
                domain.
            </p>
            <p>
                Some of the benefits of decentralisation are obvious: you get to control your own data. When you’re not
                sharing data with one monolithic IM solution provider, then there’s a lot less to worry about with
                regards to their privacy policies, marketing strategies, cookie policies and data security.
            </p>
            <p>
                Another benefit of using a decentralised approach is diversity. I know of at least seven or eight
                different XMPP server implementations - all of which are mature projects that have a proven track-record
                of interoperability for many, many years. Each of the server implementations have their own strengths.
                Some favour raw network performance, others offer a more complete social media feature set. Some focus
                on being active in the Small and Medium-sized Enterprises segment, others try to cater to family &
                friends type of communities. Some are open source, others are commercial products. There are products
                that offer a turn-key, no-config-needed full blown instant messaging solution, while others can act as a
                development platform that is useful when you’re looking to develop your own networking application. As
                you might be able to tell from all this, diversity gives you the option to select the best software
                suite for your needs.
            </p>
            <p>
                I digress. XMPP federation is based on server-to-server connections. Whenever a user on one domain
                starts to interact with a user on another domain, servers of both domains will connect to each other in
                the background to facilitate this interaction. As you might imagine, when enough users start to interact
                with each other, this leads to interesting webs of interconnected domains.
            </p>

            <h2>Reviving an old idea: creating a network graph!</h2>
            <p>
                Over the last holiday season, I remembered an old, now defunct project by Thomas Leister, that generated
                a visual representation of interconnected servers. Its visuals were pretty amazing. I remember Tom’s
                solution to be based on an out-of-band exchange of data (through a simple webservice), and recalled his
                desire to replace this with a solution that used XMPP’s own protocol and functionality. His stated goal
                was to use <a href="https://xmpp.org/extensions/xep-0060.html">XMPP’s Publish/Subscribe functionality</a>,
                but never seemed to have been able to get around to implementing that. I had some spare time over the
                holidays and challenged myself to build this new approach. I started work on a new version of that
                project, aiming to build a web application that renders a semi-live network graph of XMPP domains with
                their connections to other XMPP domains.
            </p>
            <p>
                The path from prototype to a fully working solution was an interesting one, involving a couple of
                different aspects of development within Openfire, but also the XMPP community as a whole.
            </p>

            <h2>Using Openfire as a development platform</h2>
            <p>
                Perhaps unsurprisingly, but I love working with Openfire. It’s so incredibly versatile when it comes to
                adding new features and functionality.
            </p>
            <p>
                For this new project, I needed a couple things.
            </p>
            <ol>
                <li>
                    An API to add functionality to Openfire. Check. <a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/plugin-dev-guide.html">Openfire’s Plugin API</a>
                    gives you structured access to pretty much everything in Openfire. It’s easy to use, yet very versatile.
                </li>
                <li>
                    A web server. Check. Openfire ships with <a href="https://eclipse.dev/jetty/">Eclipse Jetty</a>, an
                    embedded web server. It’s used for Openfire’s Administration Console, but can just as easily be
                    instantiated to serve different content. Openfire’s BOSH connectivity makes use of this, but also
                    plugins like the <a href="https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=randomavatar">Random Avatar Generator</a>
                    and <a href="https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=presence">Presence Service</a>
                    that expose user-specific, as well as the <a href="https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=inverse">inVerse</a>
                    and <a href="https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=jsxc">JSXC</a>
                    plugins, that each serve a full-fledged web based XMPP client.
                </li>
                <li>
                    A Publish-Subscribe service. Check. Openfire out of the box implements XMPP’s pub-sub standard.
                </li>
                <li>
                    Database storage. Check. Openfire ships with support for most popular relational databases.
                    Crucially, it allows a plugin to define and manage its own database structures.
                </li>
                <li>
                    A javascript graphing engine. From a quick search, various applicable projects popped up. I opted to
                    go with <a href="https://visjs.org/">vis.js</a>, for no other reason than that it was the first
                    thing that popped up, looked reasonably mature and had easy-to-follow documentation. I later added
                    <a href="https://github.com/anvaka/VivaGraphJS">VivaGraph</a>, which offers WebGL support. Turns out
                    that if you render thousands of nodes in a network, CPUs tend to get busy. Who knew? WebGL helped
                    make things more efficient.
                </li>
                <li>
                    Basic HTML and CSS design skills. 😬 I am many things, a good designer is not one of them.
                </li>
            </ol>
            <p>
                My first prototype wrapped all of this into a solution that:
            </p>
            <ul>
                <li>Periodically iterated over all server-to-server connections</li>
                <li>Stored all information in a simple data structure</li>
                <li>Persisted the data structure in the database</li>
                <li>Created a web service that exposes the data as ‘nodes’ and ‘edges’ to be consumed by the graphing software</li>
                <li>Have a simple, static webpage that consumes that webservice, and renders the graph using the third-party graphing engine.</li>
            </ul>
            <p>
                In all, I was pretty proud to have been able to write all this in a single evening!
            </p>
            <p>
                The approach above gave me a nice hub-and-spoke graph, where my server was the hub, showing spokes to
                every connected remote domain.
            </p>
            <p>
                To be able to install this on more than one domain, I separated the plugin into two:
            </p>
            <ol>
                <li>One plugin that aggregates the connectivity data, to be installed on all servers on the network</li>
                <li>Another one that generates the website installed only on the server that acts as the public interface to the website.</li>
            </ol>
            <p>
                I’ve used the XMPP’s Publish-Subscribe feature to bridge the gap between the two plugins. After some
                quick modifications, the first plugin creates a pub-sub node on the local pub-sub service, to which the
                second plugin subscribes. The second plugin then aggregates all of the data in its database, and uses
                that to populate the webservice, just as before.
            </p>
            <p>
                Using this mechanism, it is pretty straight-forward to have many servers feeding one website. With a bit
                more work, I was even able to write a quick crawler, that tries to find pub-sub nodes with similar
                information on all of the XMPP domains that are reported as being remotely-linked domains, which removed
                the need to have every server sign up to the website manually.
            </p>
            <p>
                Finally, I paid a hoster a little bit of extra money to have a new server to host a new Openfire server
                that would act as the public website, going through the motions of having a domain name and
                corresponding TLS certificate. Having done this before, I automated most of that, allowing me to create
                a new Openfire server from scratch in about ten minutes. I manually installed the new plugin, installed
                a reverse proxy to serve web content on standard ports, and, presto! The
                <a href="https://xmppnetwork.goodbytes.im/">XMPP Network Graph</a> suddenly became a publicly available
                service!
            </p>
            <p>
                Some of the community members at <a href="https://igniterealtime.org">IgniteRealtime.org</a> were happy
                to install my plugin, which quickly contributed to the network graph growing.
            </p>

            <h2>Working with the XMPP community</h2>
            <p>
                To be able to grow the XMPP network graph, it is desirable to have support added to more server
                implementations than just the one for Openfire. As luck would have it, the XMPP ecosystem, as stated
                above, thrives on diversity.
            </p>
            <p>
                To allow for a great deal of extensibility and flexibility, and to optimise interoperability, the
                <a href="https://xmpp.org/about/xmpp-standards-foundation/">XMPP Standards Foundation</a> manages a
                pretty nifty process for extending the XMPP, through documents aptly named XMPP Extension Protocols
                (XEPs). The full process is documented in the very first
                <a href="https://xmpp.org/extensions/xep-0001.html">XEP-0001</a>. Have a read, if you’re interested.
            </p>
            <p>
                The standardised way to get XMPP entities to interoperate on a bit of functionality is simple:
            </p>
            <ul>
                <li>Write a XEP to document the functionality</li>
                <li>Submit the XEP to the XSF for review and publication</li>
                <li>Incentivise others the adopt the XEP</li>
            </ul>
            <p>
                <a href="https://github.com/xsf/xeps/pull/1312">I did just that</a>, and found the added value of this
                process to be unexpectedly high.
            </p>
            <p>
                A submitted XEP makes for a convenient discussion subject. My original document
                <a href="https://logs.xmpp.org/jdev/2023-12-19#2023-12-19-11bc4ec3feed5d68">quickly</a>
                <a href="https://logs.xmpp.org/jdev/2023-12-20#2023-12-20-76edfe9a940ad09c">drew</a>
                <a href="https://logs.xmpp.org/jdev/2023-12-20#2023-12-20-7b707a6b6b23adee">feedback</a>.
            </p>
            <p>
                Although I was aware of Thomas’ implementation, others apparently also toyed with creating network
                graphs of the XMPP network. Seems that I’m even further from having had an original idea than what I
                expected.
            </p>
            <p>
                The feedback from the XMPP community showed the expertise and experience that lies within that
                community. Several technical issues were discussed, which led to improvements of the protocol. Probably
                the most important bit of feedback that was given related to privacy concerns, which we discussed at
                length.
            </p>
            <p>
                The XMPP ecosystem consists of servers of all sizes. There are various XMPP service providers that each
                have many thousands of users. There are also plenty of servers that are running for family and friends,
                or even a single user. It is these servers that were the subject of the privacy concern.
            </p>
            <p>
                If a connection is visible between two of these small servers, it becomes reasonably evident that two
                specific individuals are communicating with each-other. If both individuals agree to have this
                information published, then there’s no privacy concern - but what if only one individual does so? If
                John makes public that they’re connecting to Jane, then the fact that Jane is communicating with John is
                implicitly made public too. If other friends of Jane (Jack, Jill and Johan) similarly publish all their
                connections, then determining who Jane’s friends are becomes pretty straightforward - without Jane
                having consented to any data publication.
            </p>
            <p>
                This, rightly, got flagged in early feedback from XSF members. We’ve discussed the impact of this
                problem, the need to address it, and various strategies to resolve the issue. We ended up with a
                solution that allows any server to publicise their connections, but require them to automatically verify
                that their peer opts-in to having a connection to their server be identifiable (those that do not show
                up as anonymous blips in the graph).
            </p>
            <p>
                Based on the feedback, this and other improvements were quickly made to the XEP and my Openfire
                implementation. Now that there was a stable-ish protocol definition, it became easy for compatible
                implementations to be created for other XMPP servers. To date, there are implementations for
                <a href="https://docs.tigase.net/en/latest/Tigase_Administration/Using_Tigase/_using_tigase.html#pubsub-server-information">Tigase</a>,
                <a href="https://modules.prosody.im/mod_pubsub_serverinfo.html">Prosody</a> and
                <a href="https://github.com/processone/ejabberd-contrib/tree/master/mod_pubsub_serverinfo">ejabberd</a>
                - and there’s mine for <a href="https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=pubsubserverinfo">Openfire</a>,
                of course. Not a bad score, after only a few weeks of development!
            </p>

            <h2>Wrapping up.</h2>
            <p>
                My XMPP Network Graph project has been maturing nicely in the last few weeks, as you can see from the
                screenshot above. You can have a look at and interact with the network graph at
                <a href="https://xmppnetwork.goodbytes.im/">xmppnetwork.goodbytes.im</a>. At the time of writing, it
                contains over 6,600 domains. It is pretty powerful to see how many people are interacting over XMPP, and
                that only in the small part of the network that is being mapped by the graph!
            </p>
            <p>
                You can now add your own XMPP server to the graph! The plugin that I created for Openfire
                <a href="https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=pubsubserverinfo">can be found here</a>.
                Plugins or modules are available for other XMPP servers too. Have a look at the
                <a href="https://xmppnetwork.goodbytes.im/faq.html">FAQ section of the XMPP Network Graph</a> for
                instructions on how to add your server to the network graph!
            </p>
            <p>
                I've enjoyed the process of setting all this up. Having most of the development pieces already in place,
                as mentioned above, allowed for rapid development. To me this is a testament to the power of not only
                Openfire as a development platform but also XMPP as the versatile Swiss Army knife of network protocols.
            </p>
            <p>
                I'd love to learn what you make of this! Do you have success stories of your own to share? I’d like to
                hear from you!
            </p>

            <hr/>
            <p>
                If you want to comment on this article, please do so as a reaction to the
                <a href="https://discourse.igniterealtime.org/t/creating-the-xmpp-network-graph/">blog post</a> that corresponds with the article!
            </p>
        </article>
    </main>
</section>

</body>
</html>
