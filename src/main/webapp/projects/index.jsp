<%@ page import="org.jivesoftware.site.Versions"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
<title>Products</title>
<meta name="body-id" content="projects" />
<style media="screen">
    @import "../styles/interior.css";
</style>
</head>
<body>

<section id="ignite_body">
        
    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">
            
            <header id="ignite_body_header" style="float: unset;">
                    <h1>Projects</h1> <strong>Open Source Real-Time Communication</strong>
            </header>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); grid-gap:18px">

                <!-- BEGIN project - openfire -->
                <div class="ignite_project_big">
                <div class="ignite_project_type">Server</div>
                    <div class="ignite_project_content ignite_project_big_gradient">
                        <a href="openfire/" class="ignite_project_openfire">
                        <h1 class="openfire">Openfire <span><%= Versions.getVersion("openfire") %></span></h1></a>
                        <p>Openfire is a cross-platform real-time collaboration server based on the XMPP protocol.</p>
                        <p><a href="openfire/" class="ignite_link_arrow"><strong>Learn More</strong></a></p>
                    </div>
                </div>
                <!-- END project - openfire -->

                <!-- BEGIN project - spark -->
                <div class="ignite_project_big">
                <div class="ignite_project_type">Client</div>
                    <div class="ignite_project_content ignite_project_big_gradient">
                        <a href="spark/" class="ignite_project_spark">
                        <h1>Spark <span><%= Versions.getVersion("spark") %></span></h1></a>
                        <p>Cross-platform real-time collaboration client optimized for business and organizations.</p>
                        <p><a href="spark/" class="ignite_link_arrow"><strong>Learn More</strong></a></p>
                    </div>
                </div>
                <!-- END project - spark -->

                <!-- BEGIN project - smack -->
                <div class="ignite_project_big">
                <div class="ignite_project_type">Client Library</div>
                    <div class="ignite_project_content ignite_project_big_gradient">
                        <a href="smack/" class="ignite_project_smack">
                        <h1>Smack <span><%= Versions.getVersion("smack") %></span></h1></a>
                        <p>Modular, portable and easy to use XMPP client library for Android and Java.</p>
                        <p><a href="smack/" class="ignite_link_arrow"><strong>Learn More</strong></a></p>
                    </div>
                </div>
                <!-- END project - smack -->

                <!-- BEGIN project - pade -->
                <div class="ignite_project_big">
                <div class="ignite_project_type">Client</div>
                    <div class="ignite_project_content ignite_project_big_gradient">
                        <a href="pade/" class="ignite_project_pade">
                        <h1>P&agrave;d&eacute; <span><%= Versions.getVersion("pade") %></span></h1></a>
                        <p>Unified real-time collaboration client optimized for business and organizations implemented as a cross-platform browser extension.</p>
                        <p><a href="pade/" class="ignite_link_arrow"><strong>Learn More</strong></a></p>
                    </div>
                </div>
                <!-- END project - pade -->
            </div>


            <!-- BEGIN other projects -->
            <div class="ignite_project_listing">
            <div class="ignite_project_type">Other Projects</div>
            <div class="ignite_project_table">
                <table border cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr class="ignite_project_table-row-odd">
                        <td class="ignite_project_table-title" nowrap="nowrap">
                            <a href="botz/">Botz</a>
                        </td>
                        <td class="ignite_project_table-description">
                            Create bots in Openfire.
                        </td>
                        <td class="ignite_project_table-version">
                            <%= Versions.getVersion("botz") %>
                        </td>
                        <td class="ignite_project_table-link" nowrap="nowrap">
                            <a href="botz/">Learn More</a>
                        </td>
                    </tr>
                    <tr class="ignite_project_table-row-even">
                        <td class="ignite_project_table-title" nowrap="nowrap">
                            <a href="tinder/">Tinder</a>
                        </td>
                        <td class="ignite_project_table-description">
                        A Java based XMPP library, providing an implementation for XMPP stanzas and components.
                        </td>
                        <td class="ignite_project_table-version">
                            <%= Versions.getVersion("tinder") %>
                        </td>
                        <td class="ignite_project_table-link" nowrap="nowrap">
                            <a href="tinder/">Learn More</a>
                        </td>
                    </tr>
                    <tr class="ignite_project_table-row-odd">
                        <td class="ignite_project_table-title" nowrap="nowrap">
                            <a href="whack/">Whack</a>
                        </td>
                        <td class="ignite_project_table-description">
                            Easy to use Java XMPP component library.
                        </td>
                        <td class="ignite_project_table-version">
                            <%= Versions.getVersion("whack") %>
                        </td>
                        <td class="ignite_project_table-link" nowrap="nowrap">
                            <a href="whack/">Learn More</a>
                        </td>
                    </tr>
                    <tr class="ignite_project_table-row-even">
                        <td class="ignite_project_table-title" nowrap="nowrap">
                            <a href="asterisk/">Asterisk-IM</a>
                        </td>
                        <td class="ignite_project_table-description">
                            Asterisk-IM integration for Openfire.
                        </td>
                        <td class="ignite_project_table-version">
                            <%= Versions.getVersion("asterisk-im") %>
                        </td>
                        <td class="ignite_project_table-link" nowrap="nowrap">
                            <a href="asterisk/">Learn More</a>
                        </td>
                    </tr>
                </table>
            </div>
            </div>
            <!-- END other projects -->

            <!-- BEGIN discontinued projects -->
            <div class="ignite_project_listing">
            <div class="ignite_project_type">Discontinued Projects</div>
            <div class="ignite_project_table">
                <table border cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr class="ignite_project_table-row-odd">
                        <td class="ignite_project_table-title" nowrap="nowrap">
                            <a href="xiff/">XIFF</a>
                        </td>
                        <td class="ignite_project_table-description">
                            Flash XMPP client library.
                        </td>
                        <td class="ignite_project_table-version">
                            <%= Versions.getVersion("xiff") %>
                        </td>
                        <td class="ignite_project_table-link" nowrap="nowrap">
                            <a href="xiff/">Learn More</a>
                        </td>
                    </tr>
                    <tr class="ignite_project_table-row-even">
                        <td class="ignite_project_table-title" nowrap="nowrap">
                            <a href="sparkweb/">SparkWeb</a>
                        </td>
                        <td class="ignite_project_table-description">
                            Flash based real-time collaboration web client.
                        </td>
                        <td class="ignite_project_table-version">
                            <%= Versions.getVersion("sparkweb") %>
                        </td>
                        <td class="ignite_project_table-link" nowrap="nowrap">
                            <a href="sparkweb/">Learn More</a>
                        </td>
                    </tr>
                </table>
            </div>
            </div>
            <!-- END other projects -->

        </article>
    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_7daySnapshot.jspf"/>
        <jsp:include page="/includes/sidebar_whitepapers.jspf"/>
        <jsp:include page="/includes/sidebar_recent_articles.jspf"/>
        <jsp:include page="/includes/sidebar_chat.jspf"/>
        <jsp:include page="/includes/sidebar_testimonial.jspf"/>
    </section>

</section>

</body>
</html>
