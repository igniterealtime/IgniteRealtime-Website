<html>
<head>
<title>Spark IM Client</title>
<meta name="body-id" content="projects" />
<style media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="spark"/>
</jsp:include>

<section id="ignite_body">
        
    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">

            <header id="ignite_body_header">
                <h2>Spark Documentation</h2>
            </header>

            <div class="ignite_int_body_padding">
                <p>
                    The current Spark documentation can be found below. All documentation is also distributed in each
                    release (except for the user guide, which is an online wiki page).
                </p>

                <h3>Documentation:</h3>
                <ul>
                    <li>
                        <img src="../../images/icon_txt.gif" width="16" height="16" alt="txt" />
                        <a href="https://download.igniterealtime.org/spark/docs/latest/README.html">Readme &amp; License</a>
                    </li>
                    <li>
                        <img src="../../images/icon_txt.gif" width="16" height="16" alt="txt" />
                        <a href="https://download.igniterealtime.org/spark/docs/latest/changelog.html">Changelog</a>
                    </li>
                    <li><a href="https://discourse.igniterealtime.org/t/spark-user-guide-revised/41731">User Guide (wiki)</a></li>
                    <li><a href="https://discourse.igniterealtime.org/t/developer-and-administrator-guide">Developer and Administrator Guide</a></li>
                </ul>

                <h3>Developer Documentation:</h3>
                <ul>
                    <li><a href="https://download.igniterealtime.org/spark/docs/latest/documentation/ide-eclipse-setup.html">Setup Eclipse IDE with the source</a></li>
                    <li><a href="https://download.igniterealtime.org/spark/docs/latest/documentation/ide-intellij-setup.html">Setup IntelliJ IDE with the source</a></li>
                </ul>
            </div>

        </article>
    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="spark"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
