<html>
<head>
    <title>Sparkplug Day</title>
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
                <h1>Sparkplug Day</h1>
            </header>

<p>Feb 7, 2006<br>
<i>by Matt Tucker</i></p>

<p>Once per quarter, the Jive Software engineering team spends a full day
on a special project. A few weeks ago, we held Sparkplug Day to build
out plugins for our <a href="../../projects/spark/">Spark</a> instant messaging client. The goals
for Sparkplug Day were to:</p>

<ul>
    <li>Provide feedback on the Sparkplug API before it's launched with Spark 1.1.
    <li>Build sample plugins for end users and other developers.
    <li>Have some fun.
</ul>

<h2>What Are Sparkplugs?</h2>

<p>Sparkplugs dynamically extend the functionality of the Spark instant messaging client.
They can be used to expose a search repository, tie into an organization's inventory system,
provide queuing and routing functionality for chats (such as our 
<a href="https://www.jivesoftware.com/products/liveassistant/?source=Website-Ignite">Live Assistant</a> product), or even
to let people play games against each other. By itself, IM is a powerful communication medium; but
it can become a much more powerful tool when it's tailored to specific business purposes.</p>

<p>Sparkplugs are easy enough for virtually any organization with Java experience 
to create.</p>

<h2>Start of the Day</h2>

<p>We gathered at 8:30 AM with bagels to brainstorm plugin ideas and plan out the day (Bruce and Gato 
attending by phone). The rules for Sparkplug day were fairly simple:</p>

<ul>
    <li>The development sprint ends at 5:00 PM sharp (beers following), so each plugin 
    has to be limited in scope.
    <li>Development teams of one to two on each plugin, with Derek (the lead Spark engineer)
    assisting everyone as needed.
    <li>Plugins that demonstrate or test the API extensively especially encouraged.
</ul>

<p>After the planning session, each person/team was ready to begin coding.</p>

<h2>The Output</h2>

<p>By the end of the day, we assembled a ton of feedback on the Sparkplug API and
a pretty cool assortment of plugins. Some of the most interesting
ones are detailed below (click on the thumbnails of each plugin for a full image):
</p>

<h3>Transfer Guard</h3>
<a href="images/splug_guard.png"><img src="images/splug_guard_small.gif" hspace="5" width="150" height="125" alt="Transfer Guard" align="right" border="0"/></a>
<p>
Pete worked on Transfer Guard, a plugin which provides security control for
file transfers. It lets users choose which file extensions they'd like to
accept, automatically blocks file transfer requests from certain senders, and
has a configurable max file size.</p>
<p>
The plugin uses the preferences API to make the plugin configurable. It
uses the file transfer API to intercept requests based on those configuration settings.
</p>

<h3>Reversi</h3>
<a href="images/splug_rev.png"><img src="images/splug_rev_small.gif" hspace="5" align="right" width="150" height="104" border="0" alt="Reversi" /></a>
<p>
Reversi (also known as Othello) is a two-player game where each player tries
to capture as many stones as possible by flipping the other player's stones.
See the <a href="https://en.wikipedia.org/wiki/Reversi">Wikipedia entry</a> for 
a complete explanation.</p>

<p>Bill and I worked on this plugin, which allows a user to invite a buddy to 
start a game. Once the opponent accepts, the game board appears and players 
take turns making moves. The game ends when no more moves are possible. The 
plugin has extensive custom graphics and uses many parts of the chat room API.</p>

<h3>Mac Integration</h3>
<a href="images/splug_mac.png"><img src="images/splug_mac_small.gif" hspace="5" align="right" width="150" height="128" alt="Mac Integration" /></a>

<p>Earlier versions of Spark had good support for the Mac, but AJ's work on
the "internal plugin" for Mac integration make Spark feel even more like a 
native application. One area of integration is the Spark dock icon, which bounces
when it needs to alert the user (much as iChat does). A new feature is an
icon in the status item area, which allows quick access to changing your presence
or starting chats with other online users.</p> 

<h3>Translator</h3>
<a href="images/splug_trans.png"><img src="images/splug_trans_small.gif" hspace="5" align="right" width="200" height="91" alt="Translator" /></a>

<p>Nick's translator plugin is a fun demo of dynamically customizing chat 
messages. It allows the user to select a language to translate the messages
they're sending into. For example, the user can type a message in English but 
have it sent as Spanish. The plugin is implemented by calling the Google translation web
service. It's not meant to be a full translation feature, but could evolve
into that over time.</p>

<h2>Wrapping Up</h2>

<p>The API and sample plugins will be released with Spark 1.1. Overall we were
very happy with Sparkplug Day's output and can't wait to see what the Spark
developer community does with the API!</p>

        </article>
    </main>
</section>

</body>
</html>
