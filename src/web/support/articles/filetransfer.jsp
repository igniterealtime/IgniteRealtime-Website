<html>
<head><title>IM File Transfer Made Easy</title></head>
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
        <li id="subnav04"><a href="http://www.igniterealtime.org/issues/secure/Dashboard.jspa">Issue Tracker</a></li>
        <li id="subnav05"><a href="../service_providers.jsp">Service providers</a></li>
    </ul>
</div>

<!-- BEGIN body area -->
<div id="ignite_body">

<h1>IM File Transfer Made Easy</h1>
<p>Feb 7, 2006<br>
<i>by Matt Tucker</i></p>

<p>Why do most instant messaging systems get file transfer so wrong? 
Typically, file transfers don't work reliably (especially when firewalls are 
involved) and the file transfer UI is non-intuitive with problems like
pop-up dialogs and the tiresome hunt to find where a downloaded
file disappeared to. For the 1.1 release of the <a href="/projects/spark/">Spark</a>
instant messaging client, we set out to end all the frustration.</p>

<p>We began our quest for better file transfer with two major goals:</p>
<ol>
    <li><b>File transfer has to "just work", every time.</b> Users should never
		have to worry about how their network is setup or firewall configurations.</li><br>
	<li><b>Put the "user" into file transfer usability.</b> File transfer is integral to the 
		IM experience, so why throw up pop-up dialogs for sending and receiving files? 
		Drag and drop should work. Overall, the feature should be a pleasure to use.</li> 
</ol>



<h2>A Better User Experience</h2>

<p>We focused heavily on the file transfer user interface for the Spark 1.1 release. 
Some of the major areas of improvement over version 1.0 are:</p>

<ul>
	<li>All file transfer requests and progress dialogs are embedded into the chat window. After a file is downloaded, you can double click to open it, or browse to the download folder.</li>
	<li>Dragging files into the chat window now automatically initiates a file transfer.</li>
	<li>If the file is an image, a thumbnail of that image will be displayed. Otherwise the proper file icon is displayed.</li>
	<li>Pasting an image into a chat now works (Windows users, try the  [Print Screen] button on your keyboard and then [Ctrl-v] in a chat window).</li>
</ul>		 		


<p>The screen shots below demonstrate sending and receiving files.</p>

<center>
<a href="images/filetransfer_1.png"><img src="images/filetransfer_1_small.png" width="150" height="132" border="0" alt="Waiting to send a file" /></a>
&nbsp;
<a href="images/filetransfer_2.png"><img src="images/filetransfer_2_small.png" width="150" height="132" border="0" alt="File sent" /></a>
&nbsp;
<a href="images/filetransfer_3.png"><img src="images/filetransfer_3_small.png" width="150" height="132" border="0" alt="Receiving a file" /></a>
&nbsp;
<a href="images/filetransfer_4.png"><img src="images/filetransfer_4_small.png" width="150" height="132" border="0" alt="Receiving a file" /></a>
</center>

<br clear="right">

<h2>Making File Transfer Just Work</h2>

<p>All too often (with other IM clients), we've had to give up on a file transfer 
that fails to connect and resort to sending the file by email. The usual 
culprit is a firewall or other network setting problems.</p>

<p>The combination of Spark 1.1 and the <a href="projects/openfire/">Openfire</a> (formerly Wildfire) IM
server works around file transfer connection issues with a three part file 
transfer approach. Each approach offers a different
balance of speed and reliability -- but the key point is that the transfer
method is always negotiated automatically. If one fails, the next approach is 
tried until the file transfer can proceed.</p>

<p>Each file transfer method is detailed below:</p>

<img src="images/filetransfer_modes.png" width="313" height="425" align="right" hspace="8" alt="File Transfer Modes" />

<p><b>Peer to Peer</b></p>

<p>Spark will always attempt to establish a peer to peer (p2p) file transfer first.
Peer to peer connections are the fastest option and work great when both
users are on the same network (such as when they're in the same office location).
However, p2p transfers almost always fail when one user is behind a 
firewall or using NAT (network address translation). Peer to peer file transfers 
are shown in the top diagram on the right.</p>

<p><b>Proxy Server</b></p>

<p>If a peer to peer connection fails, Spark looks for a proxy server
to complete the file transfer (the middle diagram on the right). A proxy
server is efficient at transferring files, although not as fast as a peer to
peer connection. The file transfer will work unless one of the users
is behind a strict firewall. Proxy server support is available as an external
component now, and will be built into the upcoming Openfire 2.5 release.
</p> 

<p><b>In-Band File Transfers</b></p>

<p>If one of the other two file transfer mechanisms fails, Spark will
default to sending the file "in-band" through the IM server by breaking
the file into chunks of data and sending them as encoded messages (bottom
diagram on the right). This method will work regardless of either user's 
network configuration but is slower than the other two alternatives.

<br clear="right">

<h2>Feedback?</h2>

We've been using the new Spark 1.1 release (which includes support for 
<a href="sparkplug_day.jsp">Sparkplugs</a>) for several weeks at Jive
Software and I'm happy to report that it's solved all of our file transfer
grumbling. Let us know how the new feature is working for you in 
<a href="/community/main-threads.jspa">the forums</a>.

<br/><br/><br/>

</div>
<!-- END body area -->


</body>
</html>