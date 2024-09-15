<html>
<head>
    <title>Botz Documentation</title>
    <meta name="body-id" content="projects" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="botz"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">

            <header id="ignite_body_header">
                <h2>Botz Documentation</h2>
            </header>

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

                <pre><code class="language-java">import org.igniterealtime.openfire.botz.BotzConnection;
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

<pre><code class="language-xml">&lt;dependencies&gt;
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


        </article>
    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="botz"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
