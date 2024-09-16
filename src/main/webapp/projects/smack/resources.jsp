<html>
<head>
    <title>Smack API</title>
    <meta name="body-id" content="projects" />
    <meta name="panel-name" content="smack" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="smack"/>
</jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">

            <header id="ignite_body_header">
                <h2>Smack - Additional Resources</h2>
            </header>

            <div class="ignite_int_body_padding">
                <p>
                    This page contains additional external resources and documents related to Smack.
                </p>

                <h3>Audits:</h3>
                <ul>
                    <li><a href="https://download.igniterealtime.org/smack/docs/smack-omemo-audit-1.0.pdf">Security Audit: smack-omemo</a></li>
                </ul>
            </div>

        </article>
    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="smack"/>
        </jsp:include>
    </section>

</section>

</body>
</html>

