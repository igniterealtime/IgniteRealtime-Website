<html>
<head>
    <title>Tinder API</title>
    <meta name="body-id" content="projects" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="tinder"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">

            <header id="ignite_body_header">
                <h2>Tinder API Documentation</h2>
            </header>

            <div class="ignite_int_body_padding">
                <p>
                    The current Tinder API documentation can be found below. All documentation is also distributed in each release.
                </p>

                <h3>Documentation:</h3>
                <ul>
                    <li>
                        <img src="../../images/icon_txt.gif" width="16" height="16" alt="txt" />
                        <a href="https://discourse.igniterealtime.org/t/introducing-tinder-an-xmpp-object-implementation-library/63975">Readme</a>
                        <!--<a href="https://download.igniterealtime.org/tinder/docs/latest/README.html">Readme &amp; License</a>-->
                    </li>
                    <li>
                        <img src="../../images/icon_txt.gif" width="16" height="16" alt="txt" />
                        <!-- <a href="https://download.igniterealtime.org/tinder/docs/latest/changelog.html">Changelog</a> -->Initial Release - no Changelog
                    </li>
                    <li>
                        <!--<a href="https://download.igniterealtime.org/tinder/docs/latest/documentation/">Tinder documentation</a>-->
                        <a href="https://discourse.igniterealtime.org/c/tinder-dev">Tinder documentation</a>
                    </li>
                </ul>
            </div>

        </article>
    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="tinder"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
