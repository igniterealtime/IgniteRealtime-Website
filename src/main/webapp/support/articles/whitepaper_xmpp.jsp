<html>
<head>
    <title>Whitepaper - XMPP: The Protocol for Open, Extensible Instant Messaging</title>
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
                <h1>Whitepaper - XMPP: The Protocol for Open, Extensible Instant Messaging</h1>
            </header>

            <h2>Introduction to XMPP</h2>
            <p>
                XMPP, the Extensible Messaging and Presence Protocol, is an Instant Messaging (IM) standard of the Internet Engineering Task Force (IETF) - the same organization that standardized email (POP/IMAP/SMTP) and the World Wide Web (HTTP) protocols. XMPP evolved out of the early XML streaming technology developed by the XMPP Open Source community and is now the leading protocol for exchanging real-time structured data. XMPP can be used to stream virtually any XML data between individuals or applications, making it a perfect choice for applications such as IM.
            </p>

            <h2>A Brief History</h2>
            <p>
                IM has a long history, existing in various forms on computers as soon as they were attached to networks. Most IM systems were designed in isolation using closed networks and/or proprietary protocols, meaning each system can only exchange messages with users on the same IM network. Users on different IM networks often can’t send or receive messages, or do so with drastically reduced features because the messages must be transported through “gateways” that use a least common denominator approach to message translation.
            </p>
            <p>
                The problem of isolated, proprietary networks in IM systems today is similar to email systems in the early days of computer networks. Fortunately for email, the IETF created early standards defining the protocols and data formats that should be used to exchange email. Email software vendors rapidly switched to the IETF standards to provide universal exchange of email among all email users on the Internet.
            </p>
            <p>
                In 2004 the IETF published RFC 3920 and 3921 (the “Core” and “Instant Messaging and Presence” specifications for instant messaging) officially adding XMPP, mostly known as Jabber at the time, to the list of Internet standards. A year later, Google introduced Google Talk, a service that uses XMPP as its underlying protocol.
            </p>
            <p>
                Google’s endorsement of the XMPP protocol greatly increased the visibility and popularity of XMPP and helped pave the way for XMPP to become the Internet IM standard. Over the years, more and more XMPP-based solutions followed: from Whatsapp, Jitsi, Zoom and Grindr in the IM-sphere, Google Cloud Print, Firebase Cloud Messaging and Logitec's Harmony Hub in the IoT-realm, to Nintendo Switch, Fortnite and League of Legends in the world of gaming.
            </p>

            <h2>XMPP: Open, Extensible, XML Instant Messaging</h2>
            <p>
                The XMPP protocol benefits from three primary features that appeal to administrators, developers and end users: an IETF open standard, XML data format, and simple extensions to the core protocol. These benefits combine to position XMPP as the most compelling IM protocol available for businesses, consumers, and organizations of any size.
            </p>

            <h2>Open Standard Benefits</h2>
            <p>
                The fact that XMPP is an open standard has led to its adoption by numerous software projects that cover a broad range of environments and users. This has helped improve the overall design of the protocol, as well as ensured a “best of breed” market of client applications and libraries that work with all XMPP servers. The vibrant XMPP software marketplace contains more than 90 compatible clients that operate on all standard desktop and mobile operating systems.
            </p>
            <p>
                Wide adoption has provided real-world proof that XMPP-based software from different vendors, deployed by both large and small organizations, can work together seamlessly. For example, XMPP users logged into their personal home server and an employee logged into a corporate IM server can chat, see each other’s presence on their contact lists, and participate in chat rooms hosted on an Openfire XMPP server running at a university.
            </p>

            <h2>XML Data</h2>
            <p>
                XML is one of the most popular and robust data exchange formats in use today and has become a standard part of most software systems. As a well matured protocol, XMPP uses a deliberately constrained subset of XML to transport data over standard TCP IP sockets and WebSockets. By design and long standing tradition, XMPP avoids complex XML constructs such as DTDs and elaborate schemas, favoring simple and well defined element structures instead. This approach makes the protocol and its data easy to use and understand while reducing implementation complexity.
            </p>
            <p>
                Any developer familiar with XML can immediately work with XMPP since no special data format or proprietary knowledge is required. Existing tools for creating, reading, editing, and validating XML data can be used with XMPP with little or no modification even though full schema validation is typically unnecessary. The XML foundation of XMPP combined with its intentional simplicity greatly simplifies integration with existing environments and eases the movement of data to and from the XMPP network.
            </p>

            <h2>Extending XMPP</h2>
            <p>
                The extensible nature of XML provides much of the extension support built into XMPP. Through the use of XML namespaces, the XMPP protocol can easily transport custom data in addition to standard instant messaging messages and presence information. Software developers and organizations interested in real time data exchange use XMPP as an alternative to custom data transport systems.
            </p>
            <p>
                The XMPP community publishes standard extensions known as XMPP Enhancement Proposals or XEPs through the XMPP Software Foundation. This volunteer driven process allows companies and developers creating new extensions to collaborate on shared solutions that benefit the wider ecosystem. To reduce fragmentation and prevent interoperability issues caused by divergent feature support, the community also defines Compliance XEPs, which describe an evolving baseline of minimal required features for specific classes of implementations. With well over 500 XEPs covering areas such as security, user experience, and audio and video communication, XMPP continues to evolve in an open and standards based manner.
            </p>

            <h2>XMPP Networks Explained</h2>
            <p>
                An XMPP network is composed of all the XMPP clients and servers that can reach each other on a single computer network. The biggest XMPP network is available on the Internet and connects public XMPP servers. However, people are free to create private XMPP networks within a single company’s internal LAN, on secure corporate virtual private networks, or even within a private network running in a person’s home. Within each XMPP network, each user is assigned a unique XMPP address.
            </p>

            <h2>Addresses - Just Like Email</h2>
            <p>
                XMPP addresses use the same user at domain format as email addresses. For example, sales@acme.com is a valid XMPP address for a user account named sales in the acme.com domain. Organizations often issue the same identifier for both email and XMPP, and user authentication is commonly integrated with existing account systems.
            </p>
            <p>
                XMPP addresses are managed by the owner of the domain, in the same way as email addresses. The XMPP server for a domain is responsible for creating, editing, and deleting user accounts and enforcing local policies. Domains may be operated directly by an organization or hosted by a service provider, which typically offers web based account management tools. This model gives organizations direct control over identity and policy, unlike proprietary messaging systems such as Whatsapp, Telegram, and Signal where all user accounts are hosted by a third party.
            </p>

            <h2>Server Federation</h2>
            <p>
                XMPP uses a federated client-server architecture in which each domain operates its own server and cooperates with other domains as an equal peer. Clients connect to the server responsible for their domain, which handles authentication, message delivery, and presence information.
            </p>
            <p>
                When users communicate across domains, the sending server forwards messages and presence updates to the server that manages the recipient domain, which then delivers them locally. This server-to-server model applies to all cross-domain communication.
            </p>
            <p>
                XMPP federation is modeled after Internet email and has proven to scale across the global Internet. It allows each domain to define its own security, quality of service, and management policies while remaining interoperable with other domains.
            </p>

            <h2>Conclusion</h2>
            <p>
                XMPP is open, flexible and extensible, making it the protocol of choice for real-time communications over the Internet. It enables the reliable transport of any structured XML data between individuals or applications. Numerous mission-critical business applications use XMPP, including chat and IM, network management and financial trading. With inherent security features and support for cross-domain server federation, XMPP is more than able to meet the needs of the most demanding environments.
            </p>

            <hr/>
            <p>
                If you want to comment on this, please do so as a reaction to the
                <a href="https://discourse.igniterealtime.org/t/xmpp-the-protocol-for-open-extensible-instant-messaging/">blog post</a> that corresponds to this whitepaper!
            </p>

        </article>
    </main>
</section>

</body>
</html>
