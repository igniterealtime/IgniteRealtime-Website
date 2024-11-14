<%
    final String pluginName = request.getParameter( "plugin" );
    if ( pluginName == null || pluginName.isEmpty() )
    {
        response.sendRedirect( "plugins.jsp" );
        return;
    }
%>
<%@ page import="java.nio.file.Path"%>
<%@ page import="java.nio.file.Paths"%>
<%@ page import="java.util.List"%>
<%@ page import="org.jivesoftware.site.PluginManager" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="org.jivesoftware.site.PluginDownloadServlet" %>
<%@ page import="java.util.jar.JarFile" %>
<%@ page import="org.jsoup.Jsoup" %>
<%@ page import="org.jsoup.safety.Safelist" %>
<%@ page import="org.slf4j.LoggerFactory" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    String openfirePluginsPath = config.getServletContext().getInitParameter("openfire-plugins-path");
    Path pluginDir = Paths.get( openfirePluginsPath );

    final List<PluginManager.Metadata> plugins =
        PluginManager.sortByVersionAndReleaseDate(
            PluginManager.getReleases( pluginDir, pluginName )
        );
    request.setAttribute("plugins", plugins);

    if (plugins != null && !plugins.isEmpty()) {
        final PluginManager.Metadata latestPluginMetadata = plugins.get(0);
        if (latestPluginMetadata.hasReadme) {
            try (final InputStream input = PluginDownloadServlet.getUncompressedEntryFromArchive(new JarFile( latestPluginMetadata.getMavenFile().toFile() ), "readme.html")) {
                final InputStreamReader isr = new InputStreamReader(input);
                final BufferedReader reader = new BufferedReader(isr);
                final StringBuilder sb = new StringBuilder();
                String line;
                boolean doOutput = false;
                while ((line = reader.readLine()) != null) {
                    if (line.contains("</body>")) {
                        doOutput = false;
                    }
                    if (doOutput) {
                        sb.append(line);
                    }
                    if (line.contains("<body>")) {
                        doOutput = true;
                    }
                }
                final String cleanHtml = Jsoup.clean(sb.toString(), Safelist.relaxed());
                request.setAttribute("cleanHtml", cleanHtml);
            } catch (Exception e) {
                // This should not prevent the rest of the page from displaying.
                LoggerFactory.getLogger("plugin-archive.jsp").warn("Unexpected exception while processing readme of {}", latestPluginMetadata.mavenFile, e);
            }
        }
    }
    final List<PluginManager.Metadata> snapshots =
        PluginManager.sortByVersionAndReleaseDate(
            PluginManager.getSnapshots( pluginDir, pluginName ), 20
        );
    request.setAttribute("snapshots", snapshots);
%>
<html>
<head>
    <title>Openfire <c:out value="${param.plugin}"/> Plugin Archive</title>
    <meta name="body-id" content="projects" />
    <style media="screen">
        @import "../../styles/interior.css";
    </style>
</head>
<body>

<jsp:include page="/includes/navigation.jspf">
    <jsp:param name="project" value="openfire"/>
</jsp:include>

<section id="ignite_body">

    <header id="ignite_body_header">
        <h2><c:out value="${param.plugin}"/> Plugin Archive</h2>
    </header>

    <main class="ignite_int_body_padding">

        <p>
            Below is a list of versions that are available for the <em><c:out value="${param.plugin}"/> plugin</em>.
            To find other plugins, please review <a href="plugins.jsp">this listing of most recent releases of all plugins</a>.
        </p>
        <p>
            Plugins extend and enhance the functionality of <a href="./">Openfire</a>. To install plugins, copy the .jar
            file into the <tt>plugins</tt> directory of your Openfire installation.
        </p>

        <c:out escapeXml="false" value="${cleanHtml}"/>

        <div id="plugins" style="width:100%">
            <a id="opensource"></a>

            <table cellpadding="3" cellspacing="0" border="0" width="100%">
                <thead>
                    <tr class="pluginTableHeader">
                        <td class="pluginType">Releases</td>
                        <td style="text-align: center;">Info</td>
                        <td style="text-align: center;">File</td>
                        <td style="text-align: center;">Version</td>
                        <td style="text-align: center;">Released</td>
                        <td style="text-align: center;">Openfire Version</td>
                    </tr>
                </thead>
                <tbody>
                    <c:choose>
                        <c:when test="${empty plugins}">
                            <tr>
                                <td colspan="6">No plugins.</td>
                            </tr>
                        </c:when>
                        <c:otherwise>
                            <c:forEach var="plugin" items="${plugins}">
                                <c:set var="version" value="${plugin.pluginVersion.replace(' ', '-')}"/>
                                <tr valign="middle">
                                    <td class="c1">
                                        <table cellpadding="1" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td width="1%">
                                                    <span class="plugicon">
                                                        <c:choose>
                                                            <c:when test="${plugin.hasIcon}">
                                                                <img style="height: 16px; width: 16px;" src="plugins/${ir:urlEncode(version)}/${ir:urlEncode(param.plugin)}/${ir:urlEncode(plugin.iconFileName)}" alt="Plugin" />
                                                            </c:when>
                                                            <c:otherwise>
                                                                <img style="height: 16px; width: 16px;" src="../../images/icon_plugin.gif" alt="Plugin">
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </span>
                                                </td>
                                                <td width="99%">
                                                    <span class="plugname">
                                                        <b><c:out value="${plugin.humanReadableName}"/></b>
                                                    </span>
                                                </td>
                                            </tr>
                                            <c:if test="${not empty plugin.humanReadableDescription}">
                                                <tr>
                                                    <td colspan="2">
                                                        <span class="description">
                                                            <c:out value="${plugin.humanReadableDescription}"/>
                                                        </span>
                                                    </td>
                                                </tr>
                                            </c:if>
                                        </table>
                                    </td>
                                    <td class="c2" style="white-space: nowrap;">
                                        <c:if test="${plugin.hasReadme}">
                                            <a href="plugins/${ir:urlEncode(version)}/${ir:urlEncode(pluginName)}/readme.html"><img src="../../images/doc-readme-16x16.gif" width="16" height="16" alt="ReadMe"></a>
                                        </c:if>
                                        <c:if test="${plugin.hasChangelog}">
                                            <a href="plugins/${ir:urlEncode(version)}/${ir:urlEncode(pluginName)}/changelog.html"><img src="../../images/doc-changelog-16x16.gif" width="16" height="16" alt="Changelog"></a>
                                        </c:if>
                                    </td>
                                    <td class="c3" style="white-space: nowrap;">
                                        <a href="plugins/${ir:urlEncode(version)}/${ir:urlEncode(plugin.pluginFileName)}">Download</a>
                                    </td>
                                    <td class="c4" style="white-space: nowrap; text-align: center">
                                        <c:out value="${not empty plugin.pluginVersion ? plugin.pluginVersion : ''}"/>
                                    </td>
                                    <td class="c5" style="white-space: nowrap;">
                                        <c:if test="${not empty plugin.releaseDate}">
                                            <fmt:formatDate type="date" dateStyle="medium" value="${plugin.releaseDate}"/>
                                        </c:if>
                                    </td>
                                    <td class="c4" style="white-space: nowrap; text-align: center">
                                        <c:out value="${not empty plugin.minimumRequiredOpenfireVersion ? plugin.minimumRequiredOpenfireVersion : ''}"/>
                                        <c:out value="${not empty plugin.priorToOpenfireVersion ? '- '.concat(plugin.priorToOpenfireVersion) : '+'}"/>
                                    </td>
                                </tr>
                            </c:forEach>
                        </c:otherwise>
                    </c:choose>
                </tbody>
            </table>

            <p style="margin-top: 3em;">
                The plugins below, so-called SNAPSHOTS, are build automatically by the continuous integration
                system. They represent the latest development, but are untested.
            </p>

            <table cellpadding="3" cellspacing="0" border="0" width="100%">
                <thead>
                    <tr class="pluginTableHeader">
                        <td class="pluginType">Snapshots</td>
                        <td style="text-align: center;">Info</td>
                        <td>File</td>
                        <td style="text-align: center;">Version</td>
                        <td>Built&nbsp;at</td>
                        <td style="text-align: center;">Openfire Version</td>
                    </tr>
                </thead>
                <tbody>
                    <c:choose>
                        <c:when test="${empty snapshots}">
                            <tr>
                                <td colspan="6">No snapshots.</td>
                            </tr>
                        </c:when>
                        <c:otherwise>
                            <c:forEach var="plugin" items="${snapshots}">
                                <c:choose>
                                    <c:when test="${not empty plugin.snapshotQualifier}">
                                        <c:set var="snapshotParam">?snapshot=${ir:urlEncode(plugin.snapshotQualifier)}</c:set>
                                    </c:when>
                                    <c:otherwise>
                                        <c:set var="snapshotParam" value=""/>
                                    </c:otherwise>
                                </c:choose>
                                <tr valign="middle">
                                    <td class="c1" style="width: unset">
                                        <table cellpadding="1" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td width="1%">
                                                    <span class="plugicon">
                                                        <c:choose>
                                                            <c:when test="${plugin.hasIcon}">
                                                                <img style="height: 16px; width: 16px;" src="plugins/${ir:urlEncode(plugin.mavenVersion)}/${ir:urlEncode(param.plugin)}/${ir:urlEncode(plugin.iconFileName)}${snapshotParam}" alt="Plugin" />
                                                            </c:when>
                                                            <c:otherwise>
                                                                <img style="height: 16px; width: 16px;" src="../../images/icon_plugin.gif" alt="Plugin">
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </span>
                                                </td>
                                                <td width="99%">
                                                    <span class="plugname">
                                                        <b><c:out value="${plugin.humanReadableName}"/></b>
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td class="c2" style="white-space: nowrap;">
                                        <c:if test="${plugin.hasReadme}">
                                            <a href="plugins/${ir:urlEncode(plugin.mavenVersion)}/${ir:urlEncode(pluginName)}/readme.html${snapshotParam}"><img src="../../images/doc-readme-16x16.gif" width="16" height="16" alt="ReadMe"></a>
                                        </c:if>
                                        <c:if test="${plugin.hasChangelog}">
                                            <a href="plugins/${ir:urlEncode(plugin.mavenVersion)}/${ir:urlEncode(pluginName)}/changelog.html${snapshotParam}"><img src="../../images/doc-changelog-16x16.gif" width="16" height="16" alt="Changelog"></a>
                                        </c:if>
                                    </td>
                                    <td class="c3" style="white-space: nowrap;">
                                        <a href="plugins/${ir:urlEncode(plugin.mavenVersion)}/${ir:urlEncode(plugin.pluginFileName)}${snapshotParam}">Download</a>
                                    </td>
                                    <td class="c4" style="white-space: nowrap; text-align: center">
                                        <c:out value="${not empty plugin.pluginVersion ? plugin.pluginVersion : ''}"/>
                                    </td>
                                    <td class="c5" style="white-space: nowrap;">
                                        <c:if test="${not empty plugin.snapshotCreationDate}">
                                            <fmt:formatDate type="date" dateStyle="medium" value="${plugin.snapshotCreationDate}"/>
                                        </c:if>
                                    </td>
                                    <td class="c4" style="white-space: nowrap; text-align: center">
                                        <c:out value="${not empty plugin.minimumRequiredOpenfireVersion ? plugin.minimumRequiredOpenfireVersion : ''}"/>
                                        <c:out value="${not empty plugin.priorToOpenfireVersion ? '- '.concat(plugin.priorToOpenfireVersion) : '+'}"/>
                                    </td>
                                </tr>

                            </c:forEach>
                        </c:otherwise>
                    </c:choose>
                </tbody>
            </table>
        </div>
    </main>

</section>

</body>
</html>
