<%
    final String pluginName = request.getParameter( "plugin" );
    if ( pluginName == null || pluginName.isEmpty() )
    {
        response.sendRedirect( "plugins.jsp" );
        return;
    }
%>
<%@ page import="java.net.URLEncoder"%>
<%@ page import="java.nio.charset.StandardCharsets"%>
<%@ page import="java.nio.file.Path"%>
<%@ page import="java.nio.file.Paths"%>
<%@ page import="java.text.DateFormat"%>
<%@ page import="java.util.List"%>
<%@ page import="org.jivesoftware.site.PluginManager" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<html>
<head>
    <title>Openfire Plugins</title>
    <meta name="body-id" content="projects" />
    <style type="text/css" media="screen">
        @import "../../styles/interior.css";
    </style>
    <%
        String openfirePluginsPath = config.getServletContext().getInitParameter("openfire-plugins-path");
        Path pluginDir = Paths.get( openfirePluginsPath );
    %>

</head>
<body>

<div id="ignite_subnav">
    <ul>
        <li id="subnav01"><a href="./" class="ignite_subnav_project">Openfire</a></li>
        <li id="subnav03"><a href="plugins.jsp" class="ignite_subnav_current">Plugins</a></li>
        <li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
        <li id="subnav05"><a href="https://issues.igniterealtime.org/browse/JM">Issue Tracker</a></li>
        <li id="subnav06"><a href="http://download.igniterealtime.org/openfire/docs/latest/documentation/javadoc/">JavaDocs</a></li>
        <li id="subnav07"><a href="connection_manager.jsp">Connection Manager Module</a></li>
        <!--<li id="subnav08"><a href="../../roadmap.jsp">https://issues.igniterealtime.org/browse/OF#selectedTab=com.atlassian.jira.plugin.system.project%3Aroadmap-panel</a></li>-->
    </ul>
</div>

<!-- BEGIN body area -->
<div id="ignite_body">

            <!-- BEGIN body header -->
            <div id="ignite_body_header">
                <h2><%= URLEncoder.encode(pluginName, "utf-8") %> Plugin Archive</h2>
            </div>
            <!-- END body header -->


            <div class="ignite_int_body_padding">
                <p>
                    Below is a list of versions that are available for the
                    <em><%= URLEncoder.encode(pluginName, "utf-8") %> plugin</em>.
                    To find other plugins, please review <a href="plugins.jsp">this
                    listing of most recent releases of all plugins</a>.
                </p>
                <p>
                    Plugins extend and enhance the functionality of <a href="./">Openfire</a>.
                    To install plugins, copy the .jar file into the <tt>plugins</tt> directory of
                    your Openfire installation.
                </p>

                <!-- BEGIN plugins -->
                <div id="plugins" style="width:100%">
                    <a name="opensource"></a>

                    <table cellpadding="3" cellspacing="0" border="0" width="100%">
                        <tr class="pluginTableHeader">
                            <td class="pluginType">Releases</td>
                            <td style="text-align: center;">Info</td>
                            <td>File</td>
                            <td style="text-align: center;">Version</td>
                            <td style="text-align: center;">Released</td>
                            <td style="text-align: center;">Openfire Version</td>
                        </tr>
                        <%
                            {
                            final List<PluginManager.Metadata> plugins =
                                PluginManager.sortByVersionAndReleaseDate(
                                    PluginManager.getReleases( pluginDir, pluginName )
                                );
                        %>
                        <%  if (plugins == null || plugins.isEmpty()) { %>
                        <tbody>
                        <tr>
                            <td colspan="6">No plugins.</td>
                        </tr>
                        </tbody>
                        <%  } %>
                        <tbody>
                        <%  DateFormat formatter = DateFormat.getDateInstance(DateFormat.MEDIUM);

                            for ( PluginManager.Metadata plugin : plugins )
                            {
                                final String version = plugin.getPluginVersion().replace( ' ', '-' );
                                try {
                        %>
                        <tr valign="middle">
                            <td class="c1">
                                <table cellpadding="1" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td width="1%">
                                            <span class="plugicon">
                                            <% if (plugin.hasIcon) { %>
                                                <img style="height: 16px; width: 16px;" src="plugins/<%= URLEncoder.encode(version, "utf-8") %>/<%= URLEncoder.encode(pluginName, "utf-8") %>/<%= URLEncoder.encode(plugin.iconFileName, "utf-8") %>" alt="Plugin" />
                                            <% } else { %>
                                                <img style="height: 16px; width: 16px;" src="../../images/icon_plugin.gif" alt="Plugin">
                                            <% } %>
                                            </span>
                                        </td>
                                        <td width="99%">
                                            <span class="plugname">
                                            <b><%= plugin.humanReadableName %></b>
                                            </span>
                                        </td>
                                    </tr>
                                    <%  if (plugin.humanReadableDescription != null) { %>
                                    <tr>
                                        <td colspan="2">
                                            <span class="description">
                                            <%= plugin.humanReadableDescription %>
                                            </span>
                                        </td>
                                    </tr>
                                    <%  } %>
                                </table>
                            </td>
                            <td class="c2" style="white-space: nowrap;">
                                <% if( plugin.hasReadme) { %>
                                <a href="plugins/<%= URLEncoder.encode(version, "utf-8") %>/<%= URLEncoder.encode(pluginName, "utf-8") %>/readme.html"><img src="../../images/doc-readme-16x16.gif" width="16" height="16" border="0" alt="README"></a>
                                <% } else { %>
                                &nbsp;
                                <% } if(plugin.hasChangelog) { %>
                                <a href="plugins/<%= URLEncoder.encode(version, "utf-8") %>/<%= URLEncoder.encode(pluginName, "utf-8") %>/changelog.html"><img src="../../images/doc-changelog-16x16.gif" width="16" height="16" border="0" alt="Changelog"></a>
                                <% } %>
                            </td>
                            <td class="c3" style="white-space: nowrap;">
                                <a href="plugins/<%= URLEncoder.encode(version, "utf-8") %>/<%= URLEncoder.encode(plugin.pluginFileName, "utf-8") %>">Download</a>
                            </td>
                            <td class="c4" style="white-space: nowrap; text-align: center">
                                <%= (plugin.pluginVersion != null ? plugin.pluginVersion : "&nbsp;") %>
                            </td>
                            <td class="c5" style="white-space: nowrap;">
                                <% if (plugin.releaseDate != null) { %>
                                <%= formatter.format(plugin.releaseDate) %>
                                <% } %>
                            </td>
                            <td class="c4" style="white-space: nowrap; text-align: center">
                                <%= (plugin.minimumRequiredOpenfireVersion != null ? plugin.minimumRequiredOpenfireVersion : "&nbsp;") %>
                                <%= (plugin.priorToOpenfireVersion == null ? "+" : "<br>- " + plugin.priorToOpenfireVersion) %>
                            </td>
                        </tr>
                        <%  }
                        catch ( Exception e )
                        {
                            // Ignore one plugin, iterate to the next plugin.
                            e.printStackTrace();
                        }
                        }
                        }
                        %>
                        </tbody>
                    </table>

                    <p style="margin-top: 3em;">
                        The plugins below, so-called SNAPSHOTS, are build automatically by the continuous integration
                        system. They represent the latest development, but are untested.
                    </p>

                    <table cellpadding="3" cellspacing="0" border="0" width="100%">
                        <tr class="pluginTableHeader">
                            <td class="pluginType">Snapshots</td>
                            <td style="text-align: center;">Info</td>
                            <td>File</td>
                            <td style="text-align: center;">Version</td>
                            <td>Built at</td>
                            <td style="text-align: center;">Openfire Version</td>
                        </tr>
                        <%
                            {
                            final List<PluginManager.Metadata> plugins =
                                PluginManager.sortByVersionAndReleaseDate(
                                    PluginManager.getSnapshots( pluginDir, pluginName ), 20
                                );

                        %>
                        <% if (plugins.isEmpty()) { %>
                        <tbody>
                        <tr>
                            <td colspan="6">No snapshots.</td>
                        </tr>
                        </tbody>
                        <%  } %>
                        <tbody>
                        <%  DateFormat formatter = DateFormat.getDateTimeInstance( DateFormat.DEFAULT, DateFormat.DEFAULT );

                            for ( PluginManager.Metadata plugin : plugins )
                            {
                                final String snapshotParam = plugin.snapshotQualifier == null ? "" : "?snapshot=" + URLEncoder.encode(plugin.snapshotQualifier, StandardCharsets.UTF_8.name());
                                try {
                        %>
                        <tr valign="middle">
                            <td class="c1" style="width: unset">
                                <table cellpadding="1" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td width="1%">
                                            <span class="plugicon">
                                            <% if (plugin.hasIcon) { %>
                                                <img style="height: 16px; width: 16px;" src="plugins/<%= URLEncoder.encode(plugin.mavenVersion, "utf-8") %>/<%= URLEncoder.encode(pluginName, "utf-8") %>/<%= URLEncoder.encode(plugin.iconFileName, "utf-8") %><%=snapshotParam%>" alt="Plugin" />
                                            <% } else { %>
                                                <img style="height: 16px; width: 16px;" src="../../images/icon_plugin.gif" alt="Plugin">
                                            <% } %>
                                            </span>
                                        </td>
                                        <td width="99%">
                                            <span class="plugname">
                                            <b><%= plugin.humanReadableName %></b>
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td class="c2" style="white-space: nowrap; text-align: center">
                                <% if( plugin.hasReadme) { %>
                                <a href="plugins/<%= URLEncoder.encode(plugin.mavenVersion, "utf-8") %>/<%= URLEncoder.encode(pluginName, "utf-8") %>/readme.html<%=snapshotParam%>"><img src="../../images/doc-readme-16x16.gif" width="16" height="16" border="0" alt="README"></a>
                                <% } else { %>
                                &nbsp;
                                <% } if(plugin.hasChangelog) { %>
                                <a href="plugins/<%= URLEncoder.encode(plugin.mavenVersion, "utf-8") %>/<%= URLEncoder.encode(pluginName, "utf-8") %>/changelog.html<%=snapshotParam%>"><img src="../../images/doc-changelog-16x16.gif" width="16" height="16" border="0" alt="Changelog"></a>
                                <% } %>
                            </td>
                            <td class="c3" style="white-space: nowrap;">
                                <a href="plugins/<%= URLEncoder.encode(plugin.mavenVersion, "utf-8") %>/<%= URLEncoder.encode(plugin.pluginFileName, "utf-8") %><%=snapshotParam%>">Download</a>
                            </td>
                            <td class="c4" style="white-space: nowrap; text-align: center">
                                <%= (plugin.pluginVersion != null ? plugin.pluginVersion : "&nbsp;") %>
                            </td>
                            <td class="c5" style="white-space: nowrap;">
                                <% if (plugin.snapshotCreationDate != null) { %>
                                <%= formatter.format(plugin.snapshotCreationDate) %>
                                <% } %>
                            </td>
                            <td class="c4" style="white-space: nowrap; text-align: center">
                                <%= (plugin.minimumRequiredOpenfireVersion != null ? plugin.minimumRequiredOpenfireVersion : "&nbsp;") %>
                                <%= (plugin.priorToOpenfireVersion == null ? "+" : "<br>- " + plugin.priorToOpenfireVersion) %>
                            </td>
                        </tr>
                        <%  }
                        catch ( Exception e )
                        {
                            // Ignore one plugin, iterate to the next plugin.
                            e.printStackTrace();
                        }
                        }
                        }
                        %>
                        </tbody>
                    </table>
                </div>
                <!-- END plugins -->
            </div>

</div>
<!-- END body area -->



</body>
</html>
