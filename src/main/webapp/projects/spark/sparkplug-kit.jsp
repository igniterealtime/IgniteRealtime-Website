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
                <h2>SparkPlug Kit</h2>
            </header>

            <div class="ignite_int_body_padding">
                <p>
                    Sparkplug was designed to help developers extend Spark capabilities, add various new features by
                    using plugin API. <b>Note:</b> Sparkplug Kit hasn't been updated for more than 10 years, so it may
                    not work well with the current Spark source code.
                </p>

                <table>
                    <tr>
                        <td><img src="../../images/icon_zip.gif"></td>
                        <td><a href="https://download.igniterealtime.org/sparkplug_kit/sparkplug_kit_2_0_7.zip">sparkplug_kit_2_0_7.zip</a></td>
                        <td>11.5 MB</td>
                    </tr>
                </table>

                <br/>

                <h4>
                    Included
                </h4>

                <ul>
                    <li><a href="https://download.igniterealtime.org/sparkplug_kit/docs/latest/sparkplug_dev_guide.html">Development Guide</a></li>
                    <li><a href="https://download.igniterealtime.org/sparkplug_kit/docs/latest/api/index.html">Javadocs</a></li>
                    <li><a href="https://download.igniterealtime.org/sparkplug_kit/docs/latest/examples.jar">Source Code Examples</a></li>
                </ul>

                <h4>Resources</h4>
                <ul>
                    <li><a href="https://discourse.igniterealtime.org/c/spark/spark-dev">Spark Development Forum</a></li>
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
