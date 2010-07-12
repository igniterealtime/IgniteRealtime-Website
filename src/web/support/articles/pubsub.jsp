
<html>
<head><title>All About Pubsub</title></head>
<meta name="body-id" content="support" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
<body>

<div id="ignite_subnav">
    <ul>
        <li id="subnav01"><a href="../index.jsp" class="ignite_subnav_project">Support</a></li>
        <li id="subnav02"><a href="../articles.jsp" class="ignite_subnav_current">Articles</a></li>
        <li id="subnav03"><a href="../group_chat.jsp">Group Chat</a></li>
        <li id="subnav04"><a href="http://issues.igniterealtime.org/secure/Dashboard.jspa">Issue Tracker</a></li>
        <li id="subnav05"><a href="../service_providers.jsp">Service providers</a></li>
    </ul>
</div>

<!-- BEGIN body area -->
<div id="ignite_body">

<h1>All About Pubsub</h1>
<p>April 17, 2006<br>
<i>by Gaston Dombiak and Matt Tucker</i></p>

<p>Publish-subscribe (pubsub) is a powerful protocol extension to XMPP. It's 
like RSS for instant messaging: users subscribe to an item and get notifications 
when it's updated. The general notification pattern that underlies
the protocol can be found throughout the web. A couple of examples:

<ul>
<p><b>Google Alerts:</b> enter a query or choose a topic, then the 
<a href="http://www.google.com/alerts">Google Alerts</a> 
service will send you email updates of the latest relevant 
Google results (web, news, etc.).</p>

<p><b>Forums watches:</b> Community members at igniterealtime.org are
familiar with the watches feature, which notifies them by email when new posts
are made in a category, forum, or thread.
</p>
</ul> 
</p>

<p>In this article, we'll cover the pubsub protocol in detail then discuss
possible ways it can be applied.</p>
 
<h2>Protocol Details</h2>
<img src="images/pubsub_1.png" width="311" height="301" alt="Collection and Root Nodes" align="right" hspace="5" vspace="5" />
<p>The pubsub specification is defined by 
<a href="http://www.jabber.org/jeps/jep-0060.html">JEP-0060</a> and is fully 
implemented in <a href="/projects/openfire/">Openfire</a> (formerly Wildfire) 2.6 and later. The primary
objects in the pubsub service are called "nodes", which users subscribe and 
publish to. Nodes are hierarchical (tree structure) and come in two types:
<ul>
		<li>Leaf node: a node that contains published items.
		<li>Collection node: a node that contains other nodes.
</ul>
</p>

<p>So, when a user subscribes to a node, that node is either: <ul>
			<li>A leaf node, and notifications are sent when new items are published 
						to the node.
			<li>A collection node, and notifications are made on addition/removal of 
						child nodes or when new items are published to child nodes.
</ul></p>

<p>The diagram at right shows both collection and leaf nodes. There is always
a root collection node. In this case, we have child collection nodes "music" 
and "movies". The music node contains the bands "cure" and "depeche mode".</p> 

<h3>Access and Publisher Models</h3>

<p>Pubsub provides a rich permissions framework. Nodes can have 
different access and publishers models. An access model defines who is 
allowed to subscribe and retrieve items while a publisher model defines who 
is allowed to publish items to the node.</p>

<p>Access models options are:<ul>
    <li><b>Open</b>: anyone may subscribe and retrieve items.
		<li><b>Authorize</b>: subscription requests must be approved by an owner 
		and only subscribers may retrieve items.
    <li><b>Whitelist</b>: only those on a whitelist may subscribe and retrieve items.
    <li><b>Presence</b>: entities that are subscribed to the node owner's presence 
		may subscribe to the node and retrieve items from the node.
    <li><b>Roster</b>: entities that are subscribed to the node owner's presence and in 
		the specified roster group(s) may subscribe to the node and retrieve items 
		from the node.
</ul>
</p>

<p>Publisher model options are:<ul>
    <li><b>Open</b>: anyone may publish items to the node.
    <li><b>Publishers</b>: owners and publishers are allowed to publish items to the node.
		<li><b>Subscribers</b>: owners, publishers and subscribers are allowed to publish items to the node.
</ul></p>
 
<h3>Subscribing to Nodes</h3>

<p>When a user subscribes to a node, they specify the subscription's configuration.
Configuration information can include an expiration date, keywords that will
be used to filter notifications, or preferences on when notifications should 
be delivered. Using the example pubsub model above, a user could subscribe to
all events for "depeche mode" for one month, with a keyword filter of "shows".</p> 

<p>Users may subscribe multiple times to the same node. Each 
node subscription may have different configuration information such as
specific keywords for filtering and notification preferences. When subscribed 
multiple times, then the pubsub service will send a single notification to the 
user if several subscriptions were affected by the same published item. 
This optimization avoids overwhelming subscribers with many notifications for 
the same published item.</p>

<p>Once a user has requested a subscription to a node, the new subscription is 
subject to the access model mentioned above. If the node is using the 
"authorize" permission model, then node owners will receive a message asking to 
approve the new subscription request. Node owners can also retrieve the full
list of pending subscriptions at any time. Until the subscription is approved,
users will not get notifications from the node. Once approval is given, the
subscription becomes "active" and the user will receive the most recently
published item as well as all future published items.</p>

<div align="center">
<img src="images/pubsub_2.png" width="474" height="332" vspace="5" alt="Owner and Subscriber" />
</div>

<p>The diagram above shows the previous pubsub service example, but with
an owner and subscriber. The user Joe owns all the music nodes. Sally has a 
subscription to Depeche Mode, and is waiting for her subscription
to the movie node to be approved.</p> 

<h3>Publishing Events</h3>
<img src="images/pubsub_3.png" width="321" height="208" alt="Publishing" align="right" hspace="5" vspace="5" />
<p>Each time an event is published, it can contain zero, one or many items. Each
item can optionally contain a payload (data). Continuing our example, Joe wants to 
publish the upcoming concert schedule for Depeche Mode. Each performance might be 
represented as an individual item, with details about the venue included as the 
payload of each item.</p> 

<p>Subscribers also have the ability to query the service for the list of published
items at any time. In other words, pubsub supports both <b>push</b> and <b>pull</b>
for event notification.</p>

<br clear="right"/>
<h2>Conclusion</h2>

<p>We've covered the basics of the pubsub protocol and how it can be used as
an event publishing and notification service. But pubsub isn't just about event
notification; the framework is powerful enough to support a number of 
interesting collaboration use cases such as:

<ul>
		<li>File storage and sharing: users could share files to common spaces and
        be notified when files are added, deleted, or updated. Pubsub permissions
				could be used for rich control over who's allowed to create and read files. 
		<li>Whiteboards: a whiteboard could be represented as a node. Users could 
		    collaboratively modify the whiteboard and see changes reflected in 
				real-time.
		<li>Auction and trading systems: pubsub could be used to distribute the 
		    changing prices of equities to interested parties. 
</ul>

Have your own ideas about how pubsub can be used? We're looking forward to
seeing them!</p>

<br/><br/><br/>

</div>
<!-- END body area -->


</body>
</html>