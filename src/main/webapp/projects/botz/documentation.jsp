<%@ page import="org.jivesoftware.site.Versions"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
    <title>Botz Documentation</title>
    <meta name="body-id" content="projects" />
    <style type="text/css" media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<div id="ignite_subnav">
    <ul>
        <li id="subnav01"><a href="./" class="ignite_subnav_project">Botz</a></li>
        <li id="subnav02"><a href="documentation.jsp" class="ignite_subnav_current">Documentation</a></li>
        <li id="subnav03"><a href="https://github.com/igniterealtime/Botz/releases">Releases</a></li>
        <li id="subnav04"><a href="https://github.com/igniterealtime/Botz">Source Code</a></li>
        <li id="subnav05"><a href="https://github.com/igniterealtime/Botz/issues">Issue Tracker</a></li>
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
                <h2>Botz <%= Versions.getVersion("botz") %> Documentation</h2>
            </div>
            <!-- END body header -->


            <div class="ignite_int_body_padding">

                <p>
                    A common way of creating a new XMPP service is to develop a plugin that will serve the service as a subdomain. That said, if Openfire's domain is <code>example.com</code> programmers
                    would develop the new service as an internal or external component and deploy it as <code>myservice.example.com</code>.
                </p>

                <p>
                    Botz library is strictly internal for Openfire. The notion of a user connection doesn't involve any TCP/IP or socket; hence virtual. There isn't even a C2S implementation.
                </p>

                <h3>Botz Classes:</h3>

                <p>
                    Botz library contains <code>BotzConnection</code> class that allows a user bot to login as a registered or anonymous user. The class optionally automates the creation and registration
                    of the user bot if it has not existed in the database. To make the user bot useful, programmers would implement <code>BotzPacketReceiver</code> interface to respond to received packets.
                    <code>BotzPacketReceiver.processIncomingPacket(Packet)</code> will be called for every packet received by the user bot. To send packets to other XMPP entities, programmers in turn call
                    <code>BotzConnection.sendPacket(Packet)</code>.
                </p>

                <p>
                    Botz classes may be used in situations where an internal user bot is needed. Botz most likely proves itself useful in the development of Openfire extensions through plugins.
                </p>

                <h3>Key Features</h3>

                <ul>
                    <li>Login anonymously</li>
                    <li>Login as an existing Openfire user</li>
                    <li>Optionally create a new user as a registered user (bot) if it does not exist. The newly created user account will be stored in the database. Because user creation is done using SQL statements internal to Openfire, this should work for all Openfire-supported databases.</li>
                    <li>The above features hide programmers from handling the connection establishment and allow programmers to focus on packet exchanges.</li>
                    <li>Change BotPacketReceiver on the fly, thus switch behaviors and create multiple personalities of a bot.</li>
                </ul>

                <h3>Using Botz in A Plugin</h3>

                <p>The following is the code snippet that shows a way to use Botz classes in a plugin. The sample plugin is a parrot bot service that simply echoes packets back to the sender.</p>

                <pre><code>
import org.igniterealtime.openfire.botz.BotzConnection;
import org.igniterealtime.openfire.botz.BotzPacketReceiver;

public class ParrotBot implements Plugin
{
    @Override
    public void destroyPlugin() {}

    @Override
    public void initializePlugin(PluginManager manager, File pluginDirectory)
    {
        BotzPacketReceiver packetReceiver = new BotzPacketReceiver() {
            BotzConnection bot;

            public void initialize(BotzConnection bot) {
                this.bot = bot;
            }

            public void processIncoming(Packet packet) {
                if (packet instanceof Message) {
                    // Echo back to sender
                    packet.setTo(packet.getFrom());
                    bot.sendPacket(packet);
                }
            }
            public void processIncomingRaw(String rawText) { };

            public void terminate() { };
        };

        BotzConnection bot = new BotzConnection(packetReceiver);
        try {
            // Create user and login
            bot.login("parrot");
            Presence presence = new Presence();
            presence.setStatus("Online");
            bot.sendPacket(presence);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
</code></pre>

                <h3>Installation</h3>

                <p>The Botz library is not a plugin in itself, and does not contain any plugin-related class. It is meant for use in an application development.</p>

                <p>To use the library in an Openfire plugin, it needs to be defined as a dependency of your plugin project. The dependency can be obtained from Ignite's Maven repository, as shown in this snippet of a <code>pom.xml</code> file:</p>

<pre><code>
&lt;dependencies&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;org.igniterealtime.openfire.botz&lt;/groupId&gt;
        &lt;artifactId&gt;botz&lt;/artifactId&gt;
        &lt;version&gt;1.1.0&lt;/version&gt;
    &lt;/dependency&gt;
&lt;/dependencies&gt;

&lt;repositories&gt;
    &lt;repository&gt;
        &lt;id&gt;igniterealtime&lt;/id&gt;
        &lt;name&gt;Ignite Realtime Repository&lt;/name&gt;
        &lt;url&gt;https://igniterealtime.org/archiva/repository/maven/&lt;/url&gt;
    &lt;/repository&gt;
&lt;/repositories&gt;
</code></pre>
            </div>


        </div>
        <!-- END body content area -->

    </div>
    <!-- END left column (main content) -->

    <!-- BEGIN right column (sidebar) -->
    <div id="ignite_body_rightcol">

        <jsp:include page="/includes/sidebar_projectlead.jsp">
            <jsp:param name="project" value="botz" />
        </jsp:include>

        <jsp:include page="/includes/sidebar_snapshot.jsp">
            <jsp:param name="project" value="botz"/>
        </jsp:include>

    </div>
    <!-- END right column (sidebar) -->

</div>
<!-- END body area -->



</body>
</html>
