<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<html>
<head>
    <title>Roadmap</title>
    <meta name="body-id" content="home" />
    <meta name="panel-name" content="home" />
    <style media="screen">
        @import "styles/interior.css";
    </style>
</head>
<body>

<section id="ignite_body">

    <main id="ignite_body_leftcol">

        <article id="ignite_int_body">

            <header id="ignite_body_header_with_content">
                <h1>Roadmap</h1>

                <p>
                    Interested in what we're working at? We will periodically update this page with our plans for the future.
                </p>
                <p>
                    This page does not contain <em>promises</em>. The IgniteRealtime community is driven by volunteers.
                    Progress on any development is depending on the availability and willingness of these people to
                    invest their free time.
                </p>

            </header>

            <section class="ignite_int_body_padding">

                <h2 class="road">Openfire*</h2>
                <p>
                    <div class="road-table">
                        <table width="100%">
                            <thead>
                                <tr>
                                    <th class="nothing">&nbsp;</th>
                                    <th>Version 5.1.0, Q1 2026</th>
                                    <th>Future</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="label">Openfire</td>
                                    <td><ul>
                                        <li>Bump support for modern SASL (authentication) mechanism</li>
                                        <li>XEP-0440: SASL Channel-Binding Type Capability</li>
                                        <li>XEP-0474: SASL SCRAM Downgrade Protection</li>
                                        <li>Add support for channel binding</li>
                                        <li>XEP-0388: Extensible SASL Profile (SASL2)</li>
                                        <li>XEP-0386: Bind 2</li>
                                        <li>XEP-0484: Fast Authentication Streamlining Tokens</li>
                                        <li>Improved support for avatars</li>
                                    </ul></td>
                                    <td><ul>
                                        <li>Update implementation of XEP-0289 'Federated MUC for Constrained Environments'</li>
                                    </ul></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </p>

                <h2 class="road">Smack*</h2>
                <p>
                <div class="road-table">
                    <table width="100%">
                        <thead>
                        <tr>
                            <th class="nothing">&nbsp;</th>
                            <th>Version 4.5.0, Q1 2026</th>
                            <th>Future</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td class="label">Smack</td>
                            <td><ul>
                                <li>Requires Java 11 or newer.</li>
                                <li>Raises Android minimum API level to 26.</li>
                                <li>Renamed artifacts for Java 11 (e.g., smack-java11-full).</li>
                                <li>Improved WebSocket and XMPP-over-WebSocket support.</li>
                                <li>Updated OMEMO / Signal encryption modules.</li>
                                <li>Enhanced stream management and reconnection reliability.</li>
                                <li>Refined service discovery (XEP-0030) behavior.</li>
                                <li>Better XML parser and resolver performance.</li>
                                <li>Expanded unit tests and code coverage.</li>
                                <li>Fixed critical NIO (SmackReactor) bug improving stability.</li>
                                <li>Numerous bug fixes and stability improvements.</li>
                                <li>Modernized build system for new toolchains.</li>
                            </ul></td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                </p>

                <p>* Plan as of January 14, 2026. Subject to change; we make no promises on future releases. :-)</p>

                <h2>Can we please have ... ?</h2>

                <p>
                    If you're interested in getting a particular change or feature on the road map, there are a couple
                    of routes that you can take.
                </p>

                <p>
                    <strong>Contribute!</strong> The Ignite Realtime community is an open source community that makes
                    available <a href="support/">a lot of resources</a> that allows you to implement your changes
                    yourself. Please consider engaging with the community to help you get your changes added to the project!
                </p>

                <p>
                    Alternatively, you can seek help from one of our <a href="support/service_providers.jsp">Professional
                    Partners</a>, which can help you realize changes in our projects.
                </p>

            </section>

        </article>

    </main>

    <section id="ignite_body_sidebar">

        <jsp:include page="/includes/sidebar_forumactivity.jsp">
            <jsp:param name="discourseCategory" value="/c/blogs/ignite-realtime-blogs"/>
            <jsp:param name="headerText" value="Latest News"/>
            <jsp:param name="hideAuthor" value="true"/>
        </jsp:include>

        <jsp:include page="/includes/sidebar_projects.jspf"/>

        <jsp:include page="/includes/sidebar_forumactivity.jsp">
            <jsp:param name="discourseCategory" value="/latest"/>
            <jsp:param name="headerText" value="In the community"/>
            <jsp:param name="subHeaderText" value="Recent Discussions"/>
            <jsp:param name="sidebarClasses" value="sidebar_light sidebar_gray"/>
        </jsp:include>

        <jsp:include page="/includes/sidebar_testimonial.jspf"/>

    </section>

</section>


</body>
</html>
