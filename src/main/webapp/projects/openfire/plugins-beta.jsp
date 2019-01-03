 <%@ page import="java.util.zip.ZipFile,
                 java.util.jar.JarFile,
                 java.util.jar.JarEntry,
                 java.io.*,
                 org.dom4j.io.SAXReader,
                 org.dom4j.Document,
                 org.dom4j.Element,
                 java.text.DateFormat,
                 java.net.*,
                 java.text.SimpleDateFormat, java.util.*"
%>
 <%@ page import="org.slf4j.LoggerFactory" %>

 <%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
 <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
 <%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>


 <%
     String openfirePluginsPath = config.getServletContext().getInitParameter("openfire-plugins-beta-path");
     File pluginDir = new File(openfirePluginsPath);
%>



 <html>
 <head>
 <title>Openfire Beta Plugins</title>
 <meta name="body-id" content="projects" />
 <style type="text/css" media="screen">
     @import "../../styles/interior.css";
 </style>
 </head>
<body>
 <div id="ignite_subnav">
     <ul>
         <li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Openfire</a></li>
         <li id="subnav03"><a href="plugins.jsp" class="ignite_subnav_current">Plugins</a></li>
         <li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
         <li id="subnav05"><a href="http://issues.igniterealtime.org/browse/JM">Issue Tracker</a></li>
         <li id="subnav06"><a href="http://download.igniterealtime.org/openfire/docs/latest/documentation/javadoc/">JavaDocs</a></li>
         <li id="subnav07"><a href="connection_manager.jsp">Connection Manager Module</a></li>
         <li id="subnav08"><a href="http://issues.igniterealtime.org/browse/OF#selectedTab=com.atlassian.jira.plugin.system.project%3Aroadmap-panel">Roadmap</a></li>
     </ul>
 </div>

 <!-- BEGIN body area -->
 <div id="ignite_body">

     <!-- BEGIN left column (main content) -->
     <div id="ignite_body_leftcol">

         <!-- BEGIN body content area -->
         <div id="ignite_int_body">

             <!-- BEGIN body header -->
             <div id="ignite_body_header">
                 <h2>Openfire Beta Plugins</h2>
             </div>
             <!-- END body header -->


             <div class="ignite_int_body_padding">
                 <p>Plugins extend and enhance the functionality of Openfire (formerly Wildfire). Below is a list of the
                 <b>beta</b> plugins available for <a href="index.jsp">Openfire</a>. To install plugins,
                 copy the .jar file into the <tt>plugins</tt> directory of your Openfire installation.</p>

<cache:cache time="60" key="beta-plugin-list">
<% try { %>

    <!-- <div class="contentBox"> -->
        <div id="plugins">

        <a name="opensource"></a>

        <table cellpadding="3" cellspacing="0" border="0" width="100%">
            <tr class="pluginTableHeader">
                <td class="pluginType">
                    Beta Open Source Plugins
                </td>
                <td>
                    Info
                </td>
                <td>
                    File
                </td>
                <td>
                    Version
                </td>
                <td class="pluginDate">
                    Date
                </td>
            </tr>

        <%
            File[] plugins = PluginDownloadServlet.getPlugins( pluginDir );
        %>

        <%  if (plugins == null || plugins.length == 0) { %>

            <tbody>
                <tr>
                    <td colspan="5">
                        No plugins.
                    </td>
                </tr>
            </tbody>

        <%  } %>

        <tbody>

        <%  DateFormat formatter = DateFormat.getDateInstance(DateFormat.MEDIUM);
            SimpleDateFormat parser = new SimpleDateFormat("MM/dd/yyyy");
            for (int i=0; plugins!=null && i<plugins.length; i++) {
                String pluginXML = new String(getPluginFile(plugins[i], "plugin.xml"));
                if (pluginXML != null) {
                    String pname = plugins[i].getName().toLowerCase();
                    pname = pname.substring(0, pname.length() - 4);

                    // See if a README and changelog exist.
                    boolean readmeExists = pluginFileExists(plugins[i], "readme.html");
                    boolean changelogExists = pluginFileExists(plugins[i], "changelog.html");
                    boolean iconGifExists = pluginFileExists(plugins[i], "logo_small.gif");
                    boolean iconPngExists = pluginFileExists(plugins[i], "logo_small.png");

                    // Parse the XML
                    SAXReader saxReader = new SAXReader();
                    ByteArrayInputStream in = new ByteArrayInputStream(pluginXML.getBytes());
                    Document doc = saxReader.read(in);
                    Element pluginClass = (Element)doc.selectSingleNode("/plugin/class");
                    Element pluginName = (Element)doc.selectSingleNode("/plugin/name");
                    Element pluginDescription = (Element)doc.selectSingleNode("/plugin/description");
                    Element pluginAuthor = (Element)doc.selectSingleNode("/plugin/author");
                    Element pluginReqVersion = (Element)doc.selectSingleNode("/plugin/minServerVersion");
                    Element pluginVersion = (Element)doc.selectSingleNode("/plugin/version");
                    Element pluginDate = (Element)doc.selectSingleNode("/plugin/date");
                    Element pluginLicense = (Element)doc.selectSingleNode("/plugin/licenseType");
                    String licenseType = (pluginLicense == null ? "gpl" : pluginLicense.getTextTrim());
        %>

                <tr valign="middle">
                    <td class="c1">
                        <table cellpadding="1" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td width="1%">
                                <span class="plugicon">
                                <% if (iconPngExists) { %>
                                    <img src="plugins-beta/<%= URLEncoder.encode(pname, "utf-8") %>/logo_small.png" alt="" />
                                <% } else if (iconGifExists) { %>
                                    <img src="plugins-beta/<%= URLEncoder.encode(pname, "utf-8") %>/logo_small.gif" alt="" />
                                <% } else { %>
                                    <img src="../../images/icon_plugin.gif" width="16" height="16" alt="Plugin">
                                <% } %>
                                </span>
                            </td>
                            <td width="99%">
                                <span class="plugname">
                                <b><%= (pluginName != null ?
                                        geti18nText(plugins[i], pluginName.getTextTrim()) :
                                        plugins[i].getName()) %></b>
                                </span>
                            </td>
                        </tr>
                        <%  if (pluginDescription != null) { %>
                            <tr>
                                <td colspan="2">
                                    <span class="description">
                                    <%= geti18nText(plugins[i], pluginDescription.getTextTrim()) %>
                                    </span>
                                </td>
                            </tr>
                        <%  } %>
                        </table>

                    </td>
                        <td class="c2" nowrap>
                        <% if(readmeExists) { %>
                        <a href="plugins-beta/<%= URLEncoder.encode(pname, "utf-8") %>/readme.html"
                ><img src="../../images/doc-readme-16x16.gif" width="16" height="16" border="0" alt="README"></a>
                        <% } else { %>
                        &nbsp;
                        <% } if(changelogExists) { %>
                        <a href="plugins-beta/<%= URLEncoder.encode(pname, "utf-8") %>/changelog.html"
                ><img src="../../images/doc-changelog-16x16.gif" width="16" height="16" border="0" alt="Changelog"></a>
                        <% } %>
                    </td>
                    <td class="c3" nowrap>
                        <a href="plugins-beta/<%= plugins[i].getName() %>"><%= plugins[i].getName() %></a>
                    </td>
                    <td class="c4" align="center" nowrap>
                        <%= (pluginVersion != null ? pluginVersion.getTextTrim() : "&nbsp;") %>
                    </td>
                    <td class="c5" nowrap>
                        <% if (pluginDate != null) {
                            try {
                                Date date = parser.parse(pluginDate.getTextTrim()); %>
                                <%= formatter.format(date) %>
                        <%    }
                            catch (Exception e) {  %>
                            <%= formatter.format(new Date(plugins[i].lastModified())) %>
                        <%    }
                        %>
                        <% } else { %>
                           <%= formatter.format(new Date(plugins[i].lastModified())) %>
                        <% } %>
                    </td>
                </tr>

        <%      }
            }
        %>

        </tbody>
        </table>
        </div>
<% } catch (Exception e) { %>
<cache:usecached />
<% }  %>
 </cache:cache>
 
     </div>

             </div>
             <!-- END body content area -->

         </div>
         <!-- END left column (main content) -->

         <!-- BEGIN right column (sidebar) -->
         <div id="ignite_body_rightcol">

             <jsp:include page="/includes/sidebar_projectlead.jsp">
                 <jsp:param name="project" value="openfire" />
             </jsp:include>

             <jsp:include page="/includes/sidebar_snapshot.jsp">
                 <jsp:param name="project" value="openfire"/>
             </jsp:include>

             <%@ include file="/includes/sidebar_enterprise.jspf" %>

         </div>
         <!-- END right column (sidebar) -->

     </div>
     <!-- END body area -->

</body>
</html>
