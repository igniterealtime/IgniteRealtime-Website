<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
<title>Openfire Server</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="./" class="ignite_subnav_project">Openfire</a></li>
            <li id="subnav03"><a href="plugins.jsp">Plugins</a></li>
            <li id="subnav04"><a href="documentation.jsp" class="ignite_subnav_current">Documentation</a></li>
            <li id="subnav05"><a href="https://issues.igniterealtime.org/browse/JM">Issue Tracker</a></li>
            <li id="subnav06"><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/javadoc/">JavaDocs</a></li>
            <li id="subnav07"><a href="connection_manager.jsp">Connection Manager Module</a></li>
            <li id="subnav08"><a href="https://issues.igniterealtime.org/browse/OF#selectedTab=com.atlassian.jira.plugin.system.project%3Aroadmap-panel">Roadmap</a></li>
        </ul>
    </div>

    <!-- BEGIN body area -->
    <div id="ignite_body">

        <!-- BEGIN left column (main content) -->
        <div id="ignite_body_leftcol">

            <!-- BEGIN body content area -->
            <div id="ignite_int_body">

                <!-- BEGIN body header -->
                <div id="ignite_body_header">
                    <h2>Openfire <%= Versions.getVersion("openfire") %> Documentation</h2>
                </div>
                <!-- END body header -->


                <div class="ignite_int_body_padding">


                    <p>The current Openfire (formerly Wildfire) documentation can be found below. All documentation is also distributed in each release.</p>

                    <h2>Documentation:</h2>
                    <ul>
                        <li><img src="../../images/icon_txt.gif" width="16" height="16" alt="txt" border="0" /> <a href="https://download.igniterealtime.org/openfire/docs/latest/README.html">Readme &amp; License</a></li>
                        <li><img src="../../images/icon_txt.gif" width="16" height="16" alt="txt" border="0" /> <a href="https://download.igniterealtime.org/openfire/docs/latest/changelog.html">Changelog</a></li>
                    </ul>

                    <h3>Basic Server Administration</h3>
                    <p>Guides that are applicable to most administrators of an Openfire instance. These cover the basics.</p>
                    <ul>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/install-guide.html">Installation Guide</a> - How to install Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/database.html">Database Installation Guide</a> -  How to setup your database for use with Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/upgrade-guide.html">Upgrade Guide</a> - Instructions for upgrading an existing Openfire installation.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/one-time-access-token-guide.html">Recovery of an Admin Password</a> - Instructions to recover an administrative account for which the password has been lost.</li>
                    </ul>

                    <h3>Advanced Server Administration</h3>
                    <p>The following guides cover more specialized topics. These aren't necessarily applicable to every Openfire installation.</p>
                    <ul>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/ssl-guide.html">TLS Guide</a> - A guide to setting up Openfire's TLS secure socket support.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/separating-admin-users-guide.html">Separating Administrative Users Guide</a> - A guide to setting up Openfire to work with different user stores for admins and non-administrative users.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/load-balancing.html">Load Balancing Guide</a> - How to spread client and server connections over multiple instances of Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/db-clustering-guide.html">Clustered Database Guide</a> - Instructions on using Openfire with a database that consists of more than one server.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/trunking-guide.html">Trunking (Gateway) Guide</a> - A guide to set up Openfire to mediate traffic that is exchanged between other XMPP domains.</li>
                    </ul>

                    <h3>Integration with External Data Sources</h3>
                    <p>Openfire is written to facilitate integration with existing data sources, such as external user directories or custom database. The guides in this section describe how such integration can be achieved.</p>
                    <ul>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/ldap-guide.html">LDAP Guide</a> - A guide to setting up Openfire to work with LDAP user stores.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/db-integration-guide.html">Custom Database Integration Guide</a> - A guide to integrating Openfire authentication, user, and group data with a custom database.</li>
                    </ul>

                    <h2>Developer Documentation:</h2>

                    <h3>Generic Development Guides</h3>
                    <p>Guides for developers that work with the Openfire source code.</p>
                    <ul>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/source-build.html">Building the Source</a> - Instructions for downloading and compiling the Openfire source code.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/ide-vscode-setup.html">Openfire Source Code in Visual Studio Code</a> - A short tutorial on how to work with the Openfire source code in the Visual Studio Code IDE.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/plugin-dev-guide.html">Plugin Developer Guide</a> - A guide to writing and installing plugins for Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/translator-guide.html">Translator Guide</a> - Information for those interested in translating the admin console of Openfire into other languages.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/overlay.html">Customization Guide</a> - Instructions on customization support within the build process for Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/internal-networking.html">Internal Networking Guide</a> - Guide to help developers understand Openfire's internal networking.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/working-with-openfire.html">Tips & tricks for working with Openfire</a> - Some collected tools, tips and useful links.</li>
                    </ul>

                    <h3>Data Provider / IAM Implementation Guides</h3>
                    <p>Guides for implementors of custom integration of external authentication, users and other entities.</p>
                    <ul>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/implementing-authprovider-guide.html">Custom Authentication Provider Guide</a> - Describes how to integrate Openfire with an external authentication system.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/implementing-groupprovider-guide.html">Custom Group Provider Guide</a> - Describes how to integrate Openfire with an external system that provides Group definitions.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/implementing-userprovider-guide.html">Custom User Provider Guide</a> - Describes how to integrate Openfire with an external system that provides User definitions.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/pluggable-roster-support-guide.html">Pluggable Roster Support Guide</a> - A guide to integrating Openfire rosters with an alternate store.</li>
                    </ul>

                    <h3>Guides for Client Developers</h3>
                    <p>Openfire is an XMPP server. It can therefor be used by any application that implements this protocol. This section lists a number of minimal examples using various libraries (mostly third-party) that illustrate how they can be used to interact with Openfire. Note that there are <a href="https://xmpp.org/software/">many other libraries</a> available than the ones listed here!</p>
                    <ul>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/client-minimal-working-example-smack.html">Smack: A Minimal Working Example (in Java)</a> - Shows how to use a client implemented with the Smack library (Java) to connect to Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/client-minimal-working-example-mellium.html">Mellium: A Minimal Working Example (in Go)</a> - Shows how to use a client implemented with the Mellium library (Go) to connect to Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/client-minimal-working-example-moxxmpp.html">moxxmpp: A Minimal Working Example (in Dart)</a> - Shows how to use a client implemented with the moxxmpp library (Dart) to connect to Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/client-minimal-working-example-stanzajs.html">StanzaJS: A Minimal Working Example (in Javascript/Typescript)</a> - Shows how to use a client implemented with the StanzaJS library (Javascript/Typescript) to connect to Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/client-minimal-working-example-stropejs.html">Strophe.js: A Minimal Working Example (in Javascript)</a> - Shows how to use a client implemented with the Strophe.js library (Javascript) to connect to Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/client-minimal-working-example-twistedwords.html">Twisted Words: A Minimal Working Example (in Python)</a> - Shows how to use a client implemented with the Twisted Words library (Python) to connect to Openfire.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/client-minimal-working-example-xmppdotnet.html">XmppDotNet: A Minimal Working Example (in C# / .NET)</a> - Shows how to use a client implemented with the XmppDotNet library (.NET) to connect to Openfire.</li>
                    </ul>

                    <h3>Reference Documentation</h3>
                    <ul>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/javadoc/index.html">JavaDocs</a> - Openfire API documentation.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/protocol-support.html">Protocol Support</a> - Provides details on the XMPP support and JEPs that Openfire implements.</li>
                        <li><a href="https://download.igniterealtime.org/openfire/docs/latest/documentation/database-guide.html">Database Schema Guide</a> - A tour of the Openfire database schema for developers and database administrators.</li>
                    </ul>

                </div>


            </div>
            <!-- END body content area -->

        </div>
        <!-- END left column (main content) -->

        <!-- BEGIN right column (sidebar) -->
        <div id="ignite_body_rightcol">

            <jsp:include page="/includes/sidebar_projectlead.jsp">
                <jsp:param name="project" value="openfire" />
            </jsp:include>

            <jsp:include page="/includes/sidebar_snapshot.jsp">
                <jsp:param name="project" value="openfire"/>
            </jsp:include>

            <%@ include file="/includes/sidebar_enterprise.jspf" %>

        </div>
        <!-- END right column (sidebar) -->

    </div>
    <!-- END body area -->

</body>
</html>
