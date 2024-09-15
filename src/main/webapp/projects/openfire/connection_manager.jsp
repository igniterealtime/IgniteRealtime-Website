<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="java.text.DecimalFormat" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<%
    String buildsPath = application.getInitParameter("builds-path");

    String version = Versions.getVersion("connection_manager");
    if (version == null) {
        version = "0.0";
    }

    DecimalFormat formatter = new DecimalFormat("0.00");
    String basedir = buildsPath + "/connectionmanager";
    String ver = version.replace('.', '_');
    File zip = new File(basedir, "connection_manager_" + ver + ".zip");
    File binTarGz = new File(basedir, "connection_manager_" + ver + ".tar.gz");
    File srcZip = new File(basedir, "connection_manager_src_" + ver + ".zip");
    File srcTarGz = new File(basedir, "connection_manager_src_" + ver + ".tar.gz");

    String buildDate = "UNKNOWN";
    if (zip.exists()) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM d, yyyy");
        buildDate = dateFormat.format(new Date(zip.lastModified()));
    }
    request.setAttribute("version", version);
    request.setAttribute("buildDate", buildDate);
    request.setAttribute("zip", zip);
    request.setAttribute("binTarGz", binTarGz);
    request.setAttribute("srcZip", srcZip);
    request.setAttribute("srcTarGz", srcTarGz);

%>
<html>
<head>
<title>Openfire Server</title>
<meta name="body-id" content="projects" />
<style media="screen">
    @import "../../styles/interior.css";
</style>
</head>
<body>

        <jsp:param name="project" value="openfire"/>
    <jsp:include page="/includes/navigation.jspf">
    </jsp:include>

<section id="ignite_body">

    <main id="ignite_body_leftcol">
        <article id="ignite_int_body">

            <header id="ignite_body_header">
                <h2>Openfire Connection Manager Module</h2><br>
            </header>

            <div class="ignite_int_body_padding" style="padding-top: 5px;">

                <!-- <h2>Openfire Connection Manager Module</h2> -->
                <!-- <p>Provides greatly improved scalability to Openfire.</p> -->

                <h5>What is it?</h5><img src="../../images/connection-managers.gif" width="294" height="250" alt="Connection Manager Module" class="ignite_body_image_right" />
                <p>Each Openfire Connection Manager module you deploy improves the scalability of  your Openfire server by handling a portion of the client connections. It's suitable for very large installations of Openfire (many thousand concurrent users). Download the connection manager module implementation below.</p>

                <h5>How many users can each connection manager handle?</h5>
                <p>Each connection manager should handle at least five thousand concurrent  users. Experimental support for non-blocking connections is under development, which will greatly increase the number of connections that each connection manager module can support.</p>

                <h5>Can connection managers be used with other servers?</h5>
                <p>Yes (in theory). The connection manager protocol is being developed through the open <a href="https://xmpp.org/extensions/">XEP</a> process. We hope to work with other server vendors so that the entire XMPP community supports the protocol. We also expect there will be other implementations of connection managers that will be compatible with Openfire. For example, a connection manager written with native code may be able to achieve very high scalability on a specific platform.</p>

                <h5>Does Openfire Connection Manager Module use the same license as Openfire?</h5>
                <p>Yes, the module is dual-licensed under the Open Source <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache License</a>.</p>

                <h5>How do I get support?</h5>
                <p>Support is available from the user community in the <a href="https://discourse.igniterealtime.org/">discussion forums</a>. Enterprise-grade email and phone support is also <a href="https://www.igniterealtime.org/support/service_providers.jsp">available</a>.</p>

                <h5>Download</h5>
                <p>Download the  release of the Openfire connection manager module (requires Openfire 3.0). Full setup and usage instructions are included in the release.</p>

                <div class="ignite_download_panel ignite_download_source_panel">
                    <div class="ignite_download_panel_label">
                        <h4>Connection Manager Module <c:out value="${version}"/> -- <c:out value="${buildDate}"/></h4>
                    </div>
                    <div class="ignite_download_item">
                        <span class="ignite_download_item_details">
                            <img src="../../images/icon_zip.gif" alt="" width="17" height="16">
                            <a href="/downloadServlet?filename=connectionmanager/<c:out value="${zip.name}"/>"><c:out value="${zip.name}"/></a> - Windows archive file
                        </span>
                        <span class="ignite_download_item_date">
                            <c:out value="${buildDate}"/>
                        </span>
                        <span class="ignite_download_item_size">
                            <fmt:formatNumber type="number" pattern="#0.00" value="${zip.length()/(1024.0*1024.0)}" /> MB
                        </span>
                    </div>
                    <div class="ignite_download_item">
                        <span class="ignite_download_item_details">
                            <img src="../../images/icon_zip.gif" alt="" width="17" height="16">
                            <a href="/downloadServlet?filename=connectionmanager/<c:out value="${binTarGz.name}"/>"><c:out value="${binTarGz.name}"/></a> - Unix/Linux archive file
                        </span>
                        <span class="ignite_download_item_date">
                            <c:out value="${buildDate}"/>
                        </span>
                        <span class="ignite_download_item_size">
                            <fmt:formatNumber type="number" pattern="#0.00" value="${binTarGz.length()/(1024.0*1024.0)}" /> MB
                        </span>
                    </div>
                </div>

                <div class="ignite_download_panel ignite_download_source_panel">
                    <div class="ignite_download_panel_label">
                        <h4>Source Code - <c:out value="${version}"/></h4>
                    </div>
                    <div class="ignite_download_item">
                        <span class="ignite_download_item_details">
                            <img src="../../images/icon_zip.gif" alt="" width="17" height="16">
                            <a href="/downloadServlet?filename=connectionmanager/<c:out value="${srcZip.name}"/>"><c:out value="${srcZip.name}"/></a> - Windows archive file
                        </span>
                        <span class="ignite_download_item_date">
                            <c:out value="${buildDate}"/>
                        </span>
                        <span class="ignite_download_item_size">
                            <fmt:formatNumber type="number" pattern="#0.00" value="${srcZip.length()/(1024.0*1024.0)}" /> MB
                        </span>
                    </div>
                    <div class="ignite_download_item">
                        <span class="ignite_download_item_details">
                            <img src="../../images/icon_zip.gif" alt="" width="17" height="16">
                            <a href="/downloadServlet?filename=connectionmanager/<c:out value="${srcTarGz.name}"/>"><c:out value="${srcTarGz.name}"/></a> - Unix/Linux archive file
                        </span>
                        <span class="ignite_download_item_date">
                            <c:out value="${buildDate}"/>
                        </span>
                        <span class="ignite_download_item_size">
                            <fmt:formatNumber type="number" pattern="#0.00" value="${srcTarGz.length()/(1024.0*1024.0)}" /> MB
                        </span>
                    </div>
                </div>
            </div>

        </article>
    </main>

    <section id="ignite_body_sidebar">
        <jsp:include page="/includes/sidebar_projectside.jsp">
            <jsp:param name="project" value="openfire"/>
        </jsp:include>
    </section>

</section>

</body>
</html>
