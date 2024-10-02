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
                XMPP, the Extensible Messaging and Presence Protocol, is an Instant Messaging (IM) standard of the Internet Engineering Task Force (IETF) - the same organization that standardized Email (POP/IMAP/SMTP) and the World Wide Web (HTTP) protocols. XMPP evolved out of the early XML streaming technology developed by the XMPP Open Source community and is now the leading protocol for exchanging real-time structured data. XMPP can be used to stream virtually any XML data between individuals or applications, making it a perfect choice for applications such as IM.
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
                Google’s endorsement of the XMPP protocol greatly increased the visibility and popularity of XMPP and helped pave the way for XMPP to become the Internet IM standard. Over the years, more and more XMPP-based solutions followed: from Whatsapp, Jitsi, Zoom and Grinder in the IM-sphere, Google Cloud Print, Firebase Cloud Messaging and Logitec's Harmony Hub in the IoT-realm, to Nintendo Switch, Fortnite and League of Legends in the world of gaming.
            </p>

            <h2>XMPP: Open, Extensible, XML Instant Messaging</h2>
            <p>
                The XMPP protocol benefits from three primary features that appeal to administrators, end users and developers: an IETF open standard, XML data format, and simple extensions to the core protocol. These benefits combine to position XMPP as the most compelling IM protocol available for businesses, consumers, and organizations of any size.
            </p>

            <h2>Open Standard Benefits</h2>
            <p>
                The fact that XMPP is an open standard has led to its adoption by numerous software projects that cover a broad range of environments and users. This has helped improve the overall design of the protocol, as well as ensured a “best of breed” market of client applications and libraries that work with all XMPP servers. The vibrant XMPP software marketplace contains 90+ compatible clients that operate on all standard desktop systems and mobile devices, from mobile phones to tablets.
            </p>
            <p>
                Wide adoption has provided real-world proof that XMPP-based software from different vendors, deployed by both large and small organizations, can work together seamlessly. For example, XMPP users logged into their personal home server and an employee logged into a corporate IM server can chat, see each other’s presence on their contact lists, and participate in chat rooms hosted on an Openfire XMPP server running at a university.
            </p>

            <h2>XML Data</h2>
            <p>
                XML is one of the most popular, robust data exchange formats in use today and has become a standard part of most software systems. As a well-matured protocol, XMPP uses the XML data format to transport data over standard TCP/IP sockets and websockets, making the protocol and its data easy to use and understand. Any developer familiar with XML can immediately work with XMPP as no special data format or other proprietary knowledge is needed. Existing tools for creating, reading, editing, and validating XML data can all be used with XMPP without significant modification. The XML foundation of XMPP greatly simplifies integration with existing environments and eases the movement of data to and from the XMPP network.
            </p>

            <h2>Extending XMPP</h2>
            <p>
                The extensible nature of XML provides much of the extension support built into XMPP. Through the use of XML namespaces, the XMPP protocol can be easily used to transport custom data in addition to standard IM messages and presence information. Software developers and companies interested in the real-time exchange of data are using XMPP as an alternative to custom data transport systems.
            </p>
            <p>
                The XMPP community publishes standard extensions called XMPP Enhancement Proposals (XEPs) through the XMPP Software Foundation (XSF). The XSF’s volunteer-driven process provides a way for companies creating innovative extensions and enhancements to the XMPP protocol to work together to create standard improvements that all XMPP users benefit from. There are well over 400 XEPs today covering a wide range of functionality, including security enhancements, user experience improvements and VoIP and video conferencing. XEPs allow the XMPP protocol to rapidly evolve and improve in an open, standards-based way.
            </p>

            <h2>XMPP Networks Explained</h2>
            <p>
                An XMPP network is composed of all the XMPP clients and servers that can reach each other on a single computer network. The biggest XMPP network is available on the Internet and connects public XMPP servers. However, people are free to create private XMPP networks within a single company’s internal LAN, on secure corporate virtual private networks, or even within a private network running in a person’s home. Within each XMPP network, each user is assigned a unique XMPP address.
            </p>

            <h2>Addresses - Just Like Email</h2>
            <p>
                XMPP addresses look exactly the same as email addresses, containing a user name and a domain name. For example, sales@acme.com is a valid XMPP address for a user account named “sales” in the “acme.com” domain. It is common for an organization to issue the same XMPP address and email address to a user. Within the XMPP server, user accounts are frequently authenticated against the same common user account system used by the email system.
            </p>
            <p>
                XMPP addresses are generated and issued in the same way that email addresses are. Each XMPP domain is managed by the domain owner, and the XMPP server for that domain is used to create, edit, and delete user accounts. For example, the acme.com server is used to manage user accounts that end with “@acme.com”. If a company runs the acme.com server, the company sets its own policies and uses its own software to manage user accounts. If the domain is a hosted account on an Internet Service Provider (ISP) the ISP usually provides a web control panel to easily manage XMPP user accounts in the same way that email accounts are managed. The flexibility and control that the XMPP network provides is a major benefit of XMPP IM systems over proprietary public IM systems like Whatsapp, Telegram and Signal, where all user accounts are hosted by a third party.
            </p>

            <h2>Server Federation</h2>
            <p>
                XMPP is designed using a federated, client-server architecture. Server federation is a common means of spreading resource usage and control between Internet services. In a federated architecture, each server is responsible for controlling all activities within its own domain and works cooperatively with servers in other domains as equal peers.
            </p>
            <p>
                In XMPP, each client connects to the server that controls its XMPP domain. This server is responsible for authentication, message delivery and maintaining presence information for all users within the domain. If a user needs to send an instant message to a user outside of their own domain, their server contacts the external server that controls the “foreign” XMPP domain and forwards the message to that XMPP server. The foreign XMPP server takes care of delivering the message to the intended recipient within its domain. This same server-to-server model applies to all cross-domain data exchanges, including presence information.
            </p>
            <p>
                XMPP server federation is modeled after the design of Internet email, which has shown that the design scales to include the entire Internet and provides the necessary flexibility and control to meet the needs of individual domains. Each XMPP domain can define the level of security, quality of service, and manageability that make sense for their organization.
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
