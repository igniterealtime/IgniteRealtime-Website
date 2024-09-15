<html>
<head>
    <title>Support - Articles</title>
    <meta name="body-id" content="support" />
    <style media="screen">
        @import "../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="support"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">
            
            <header id="ignite_body_header">
                <h2>Articles</h2>
            </header>

            <div class="ignite_int_body_support">
                    
                <div class="ignite_article_excerpt">
                    <h3><a href="articles/pubsub.jsp">All About Pubsub</a></h3>
                    <span class="ignite_support_author">April 17, 2006, by Gaston Dombiak and Matt Tucker</span>
                    <p>Publish-subscribe (pubsub) is a powerful protocol extension to XMPP. It's like RSS for
                    instant messaging: users subscribe to an item and get notifications when it's updated. The
                    general notification pattern that underlies the protocol...
                    <a href="articles/pubsub.jsp">Read More ></a></p>
                </div>

                <div class="ignite_article_excerpt">
                    <h3><a href="articles/sparkplug_day.jsp">Sparkplug Day</a></h3>
                    <span class="ignite_support_author">February 7 2006, by Matt Tucker</span>
                    <p>Once per quarter, the Jive Software engineering team spends a full day on a special
                    project. A few weeks ago, we held Sparkplug Day to build out plugins for our Spark instant
                    messaging client. The goals for Sparkplug Day... <a href="articles/sparkplug_day.jsp">Read More ></a></p>
                </div>

                <div class="ignite_article_excerpt">
                    <h3><a href="articles/filetransfer.jsp">IM File Transfer Made Easy</a></h3>
                    <span class="ignite_support_author">February 7, 2006, by Matt Tucker</span>
                    <p>Why do most instant messaging systems get file transfer so wrong? Typically, file
                    transfers don't work reliably (especially when firewalls are involved) and the file transfer
                    UI is non-intuitive with problems like... <a href="articles/filetransfer.jsp">Read More ></a></p>
                </div>

                <div class="ignite_article_excerpt">
                    <h3><a href="articles/openfire_optimization.jsp">Behind the Scenes: Openfire Optimization</a></h3>
                    <span class="ignite_support_author">December 19, 2005, by Matt Tucker</span>
                    <p>A major priority for Openfire is to provide the fastest and most scalable XMPP server
                    implementation available. The Pampero project will be the major effort over the next several
                    months to help us achieve that goal. However... <a href="articles/openfire_optimization.jsp">Read More ></a></p>
                </div>

            </div>

        </article>
    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_48hrsnapshot.jspf"/>
        <jsp:include page="/includes/sidebar_createaccount.jspf"/>
    </section>

</section>

</body>
</html>
