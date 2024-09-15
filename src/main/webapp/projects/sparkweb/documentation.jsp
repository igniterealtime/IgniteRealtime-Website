<html>
<head>
    <title>SparkWeb IM Client</title>
    <meta name="body-id" content="projects" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="sparkweb"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">

            <div class="ignite_project_banner_warning">
                <h1>Discontinued</h1>
                <p>
                    This project uses Adobe Flash, a technology that has been discontinued and sees little to no active
                    deployment nowadays. As a result, our SparkWeb project has also been discontinued.
                </p>
            </div>

            <header id="ignite_body_header">
                <h2>SparkWeb Documentation</h2>
            </header>

            <div class="ignite_int_body_padding">
                <p>
                    The current SparkWeb documentation can be found below. All documentation is also distributed in each release.
                </p>

                <h3>Documentation:</h3>
                <ul>
                    <li>
                        <img src="../../images/icon_txt.gif" width="16" height="16" alt="txt" />
                        <a href="https://igniterealtime.org/builds/sparkweb/docs/latest/README.html">Readme &amp; License</a>
                    </li>
                    <li>
                        <img src="../../images/icon_txt.gif" width="16" height="16" alt="txt" />
                        <a href="https://igniterealtime.org/builds/sparkweb/docs/latest/changelog.html">Changelog</a>
                    </li>
                </ul>

                <!--
                <h3>Other:</h3>
                <ul>
                    <li><a href="../../articles/">Articles</a></li>
                </ul>
                 -->
            </div>

        </article>
    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="sparkweb"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
