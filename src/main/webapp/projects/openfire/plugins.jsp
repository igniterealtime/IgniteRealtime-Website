<%@ page import="java.nio.file.Path"%>
<%@ page import="java.nio.file.Paths"%>
<%@ page import="org.jivesoftware.site.PluginManager" %>
<%@ page import="java.util.function.Function" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://igniterealtime.org/website/tags" prefix="ir" %>
<%
    final String openfirePluginsPath = config.getServletContext().getInitParameter("openfire-plugins-path");
    final Path pluginDir = Paths.get( openfirePluginsPath );
    final Map<String, PluginManager.Metadata> plugins =
        PluginManager.sortByNameVersionAndReleaseDate(
            PluginManager.getLatestRelease( pluginDir )
        ).stream()
            .collect(Collectors.toMap(plugin -> plugin.pluginFileName.substring( 0, plugin.pluginFileName.length() - 4 ), Function.identity()));

    request.setAttribute("plugins", plugins);
%>
<html>
<head>
<title>Openfire Plugins</title>
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
        <h2>Openfire Plugins</h2>
    </header>

    <main class="ignite_int_body_padding">

        <p>
            Plugins extend and enhance the functionality of Openfire. Below is a list of plugins
            available for <a href="./">Openfire</a>. To install plugins, copy the .jar file into the <tt>plugins</tt>
            directory of your Openfire installation.
        </p>

        <div id="plugins" style="width:100%">

            <a id="opensource"></a>

            <table cellpadding="3" cellspacing="0" width="100%">
                <tr class="pluginTableHeader">
                    <td class="pluginType">Plugins</td>
                    <td style="text-align: center;">Info</td>
                    <td style="text-align: center;">File</td>
                    <td style="text-align: center;">Version</td>
                    <td style="text-align: center;">Released</td>
                    <td style="text-align: center;">Openfire Version</td>
                    <td style="text-align: center;">Archive</td>
                </tr>
                <tbody>
                    <c:choose>
                        <c:when test="${empty plugins}">
                            <tr>
                                <td colspan="7">No plugins.</td>
                            </tr>
                        </c:when>
                        <c:otherwise>
                            <c:forEach items="${plugins}" var="pluginEntry">
                                <c:set var="pluginName" value="${pluginEntry.key}"/>
                                <c:set var="plugin" value="${pluginEntry.value}"/>
                                <tr valign="middle">
                                    <td class="c1">
                                        <table cellpadding="1" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="1%">
                                                    <span class="plugicon">
                                                        <c:choose>
                                                            <c:when test="${plugin.hasIcon}">
                                                                <img style="height: 16px; width: 16px;" src="plugins/${ir:urlEncode(pluginName)}/${ir:urlEncode(plugin.iconFileName)}" alt="Plugin" />
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
                                    <td class="c2" style="white-space: nowrap; text-align: center">
                                        <c:if test="${plugin.hasReadme}">
                                            <a href="plugins/${ir:urlEncode(plugin.pluginVersion)}/${ir:urlEncode(pluginName)}/readme.html"><img src="../../images/doc-readme-16x16.gif" width="16" height="16" alt="ReadMe"></a>
                                        </c:if>
                                        <c:if test="${plugin.hasChangelog}">
                                            <a href="plugins/${ir:urlEncode(plugin.pluginVersion)}/${ir:urlEncode(pluginName)}/changelog.html"><img src="../../images/doc-changelog-16x16.gif" width="16" height="16" alt="Changelog"></a>
                                        </c:if>
                                    </td>
                                    <td class="c3" style="white-space: nowrap;">
                                        <a href="plugins/${ir:urlEncode(plugin.pluginVersion)}/${ir:urlEncode(plugin.pluginFileName)}">Download</a>
                                    </td>
                                    <td class="c4" style="white-space: nowrap; text-align: center">
                                        <c:out value="${not empty plugin.pluginVersion ? plugin.pluginVersion : ''}"/>
                                    </td>
                                    <td class="c4" style="white-space: nowrap; text-align: center">
                                        <c:if test="${not empty plugin.releaseDate}">
                                            <fmt:formatDate type="date" dateStyle="medium" value="${plugin.releaseDate}"/>
                                        </c:if>
                                    </td>
                                    <td class="c4" style="white-space: nowrap; text-align: center">
                                        <c:out value="${not empty plugin.minimumRequiredOpenfireVersion ? plugin.minimumRequiredOpenfireVersion : ''}"/>
                                        <c:out value="${not empty plugin.priorToOpenfireVersion ? '- '.concat(plugin.priorToOpenfireVersion) : '+'}"/>
                                    </td>
                                    <td class="c5" style="white-space: nowrap">
                                        <a href="plugin-archive.jsp?plugin=${ir:urlEncode(plugin.pluginName)}">Archive</a>
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
