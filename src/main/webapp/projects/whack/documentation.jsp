<html>
<head>
    <title>Whack API</title>
    <meta name="body-id" content="projects" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="whack"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">

            <header id="ignite_body_header">
                <h2>Whack API Documentation</h2>
            </header>

            <div class="ignite_int_body_padding">
                <p>
                    The current Whack API documentation can be found below. All documentation is also distributed in each release.
                </p>

                <h3>Documentation:</h3>
                <ul>
                    <!--<li><img src="/images/icon_txt.gif" width="16" height="16" alt="txt" />
                        <a href="https://igniterealtime.org/builds/whack/docs/latest/README.html">Readme & License</a></li>
                    <li><img src="/images/icon_txt.gif" width="16" height="16" alt="txt" />
                        <a href="https://igniterealtime.org/builds/whack/docs/latest/changelog.html">Changelog</a>
                    </li>-->
                    <li>
                        <a href="https://igniterealtime.org/builds/whack/docs/latest/documentation/">Whack documentation</a>
                    </li>
                </ul>

            </div>

        </article>
    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="whack"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
