<html>
<head><title>Openfire Plugin Development: MOTD</title></head>
<meta name="body-id" content="support"/>
<style type="text/css" media="screen">
    @import "../../styles/interior.css";
</style>
<body>

<div id="ignite_subnav">
    <ul>
        <li id="subnav01"><a href="../" class="ignite_subnav_project">Support</a></li>
        <li id="subnav02"><a href="../articles.jsp" class="ignite_subnav_current">Articles</a></li>
        <li id="subnav03"><a href="../group_chat.jsp">Group Chat</a></li>
        <li id="subnav04"><a href="https://issues.igniterealtime.org/">Issue
            Tracker</a></li>
        <li id="subnav05"><a href="../service_providers.jsp">Service providers</a></li>
    </ul>
</div>

<!-- BEGIN body area -->
<div id="ignite_body">

<h1>Openfire Plugin Development: Message of the Day</h1>

<p>Feburary 12, 2007<br>
    <i>by Ryan Graham</i></p>


<p>Plugins provide an easy and powerful way to add features to Openfire (formerly Wildfire), without having to make
    changes directly to the source. In this and future articles,

    I will go through various techniques that can be used to add features to Openfire via plugins.
    The idea for the plugin described in this article came from

    requests posted on the Ignite Realtime <a href="https://discourse.igniterealtime.org">forums</a>.
    Specifically, forum members asked for the

    ability to send a user some sort of welcome message each time they logged in. The message could
    be something serious, such as a company's instant messaging

    usage policy or something a little bit zanier, like what you find on the lower right-hand corner
    of <a href="http://slashdot.org/">Slashdot</a>. In either

    case, we can add this "Message of the Day" (MotD) feature to Openfire without writing a lot of
    code, while still covering a lot of Openfire plugin related

    API's, so we'll start there.</p>


<p>You should be familiar with how to setup a plugin development environment and plugin structure in
    general; see <a href="#resources">Resources</a> section

    details.


    <p>I've made the <a href="http://www.version2software.com/downloads/motd.zip">source</a> to this
        plugin available on the Version 2 Software website. I

        would suggest that you download the source so you can see it in full, as I only
        highlight various parts of the code below. I should mention that

        this and all future Openfire plugin articles will use Openfire 3.2.x for development.
        Generally, plugins don't need to be modified to work with newer

        versions of Openfire, but there were some changes between the 3.1 and 3.2 releases that
        require some code tweaks, so, rather than start with 3.1 and then

        move to 3.2 we'll just start off with the latest and greatest.</p>


    <p><h2>Starting from the Top</h2></p>
<p>

    Since we're writing a plugin, we're going to have to implement the Plugin interface:

<pre>

public class MotDPlugin implements Plugin

</pre>

    This requires implementation of the #intitalizePlugin and #destroyPlugin methods, as shown
    below:

<pre>

public void initializePlugin(PluginManager manager, File pluginDirectory) {
   serverAddress = new JID(XMPPServer.getInstance().getServerInfo().getName());
   router = XMPPServer.getInstance().getMessageRouter();

   SessionEventDispatcher.addListener(listener);
}

public void destroyPlugin() {
   SessionEventDispatcher.removeListener(listener);

   listener = null;
   serverAddress = null;
   router = null;
}
</pre>
    As you can probably surmise, these two methods are called when the plugin is being loaded and
    unloaded, respectively. For our plugin, we're going to use the #initializePlugin method to
    perform the following:
    <ul>
        <li>Create a JID address to use as the from address when we send out the message of the day.
        <li>Obtain a reference to the MessageRouter which we'll user to send our messages.
        <li>Add our MotDSessionEventListener to the SessionEventDispatcher (Please note that we'll look
            at this more closely in a minute).
    </ul>
</p>

<p>Conversely, in the #destroyPlugin method, we'll undo everything we did in the #initializePlugin
    method. It's critical that we properly clean up after ourselves since if we
    fail to do so, our plugin will not completely unload which can tie up resources and fill the
    error logs.

</p>


<p><h2>Where to Store Settings</h2></p>

<p>Now, while we could "hard-code" our message, it would create a bit of a maintenance issue, since
    if we ever wanted to change the message we'd have to delete the old version of the plugin from
    Openfire, make our change to the source, compile and package the
    plugin and then redeploy it. Instead of going through this whole process, we'll piggyback
    on the existing Jive property API. The property API provides
    a place to store various pieces of data that our plugin will use without having to work directly
    with a database or some other external configuration file.
    An additional benefit to using the property API is that you can easily view, edit and delete
    property data via Openfire's Admin Console. We store and
    retrieve property information programmatically through the #setProperty and #getProperty methods
    using name/value pairings. As an example, take a look at
    the #setMessage and #getMessage methods:
<pre>
public void setMessage(String message) {
   JiveGlobals.setProperty(MESSAGE, message);
}

public String getMessage() {
   return JiveGlobals.getProperty(MESSAGE, "Big Brother is watching.");
}
</pre>

    When the #setMessage method is called, the value of the String parameter will be saved in the
    property table with a name "plugin.motd.message". When the #getMessage method is called, the
    value stored with the name "plugin.motd.message" will be returned, unless there is no property
    stored with that name, in which case the default value, "Big Brother is watching." will be
    returned. At this point, you might be wondering why we must wrap the property set/get methods in
    our own set/get methods? Well, they are really just there to provide easier access to our
    property data from outside our MotDPlugin class, for instance, through a custom Admin Console
    page (which I've included with the source).

</p>


<p><h2>Where the Magic Happens</h2></p>

<p>How is our plugin going to know when a user signs in? Fortunately for us, the Openfire API
    provides a number of listener interfaces that can be used to notify us when certain events occur
    within the server. One of these listener interfaces is the <a
        href="/builds/openfire/docs/latest/documentation/javadoc/org/jivesoftware/openfire/event/SessionEventListener.html">SessionEventListener</a>
    interface which can be used to alert our plugin when a user signs in.

    Below, you'll see our MotDSessionEventListener class that implements the SessionEventListener
    interface:

<pre>
private class MotDSessionEventListener implements SessionEventListener {
   public void sessionCreated(Session session) {
      if (isEnabled()) {
         final Message message = new Message();
         message.setTo(session.getAddress());
         message.setFrom(serverAddress);
         message.setSubject(getSubject());
         message.setBody(getMessage());

         TimerTask messageTask = new TimerTask() {
            public void run() {
               router.route(message);
            }
         };

         TaskEngine.getInstance().schedule(messageTask, 5000);
      }
   }

   public void sessionDestroyed(Session session) {
      // ignore
    }

   public void anonymousSessionCreated(Session session) {
      // ignore
   }

   public void anonymousSessionDestroyed(Session session) {
      // ignore
   }
}
</pre>

    After we add our listener to the SessionEventDispatcher, each time a new session is created
    (i.e. a user logs in), our MotDSessionEventListener#sessionCreated method will be called. When
    the method is called, we'll first check to make sure the plugin is enabled and if it is, we'll
    start crafting our message by doing the following:

    <ol>

        <li>Create a new Message object.</li>

        <li>Set the "to" field on the message by getting the address of the user that just signed
            in.
        </li>

        <li>Set the "from" address, using the serverAddress we constructed in the #initializePlugin
            method.
        </li>

        <li>Set the "subject" using the value from retrieved from the #getSubject method.</li>

        <li>Set the "body" using the value from retrieved from the #getMessage method.</li>

    </ol>

    Now all we have to do is use the message router to send our message. But, wait! What's the deal
    with wrapping that method call in a TimerTask? Well, there seems to be a slight timing issue
    with Spark in that there is a short period of time between when a user signs in and when they
    can start receiving messages. So, if we send our message immediately the user might not receive
    it. In order to get around this issue we use Openfire's TaskEngine to delay sending our message
    for 5000 milliseconds (five seconds).
</p>


<p><h2>Down the Road</h2></p>

<p>Now that we have a fully functional plugin, what else could we do with it? One possibility would
    be to keep a

    history of the MotD so that when users who haven't signed in for a several days would still be
    able to retrieve all the messages they missed. Another idea

    would be to have the plugin automatically retrieve a new MotD from any number of the "message of
    the day" or "quote of the day" websites that are out there.

    In any case, I'll leave these exercises to you, the reader.</p>


<p>To sum up, I hope that everyone at this point is beginning to feel like they have a better
    understanding of what is involved in developing a plugin and

    what can be done with them. Next time we'll look at using a <a

        href="/builds/openfire/docs/latest/documentation/javadoc/org/jivesoftware/openfire/interceptor/PacketInterceptor.html">PacketInterceptor</a>

    and some of its applications.</p>


<a name="resources"></a><h2>Resources</h2>
<ul>
<li>The blog post <a
        href="https://discourse.igniterealtime.org/t/so-you-want-to-write-a-plugin/68563">So you
    want to write a plugin</a> provides basic

    instructions on setting up a Openfire development environment.
</li>

<li>
    <a href="/builds/openfire/docs/latest/documentation/plugin-dev-guide.html">Plugin
        Developer Guide</a> - A guide to writing and installing plugins for Openfire.

</ul>

    <br/><br/><br/>

</div>
<!-- END body area -->


</body>
</html>
