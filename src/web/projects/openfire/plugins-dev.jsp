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
     String openfirePluginsPath = config.getServletContext().getInitParameter("openfire-plugins-dev-path");
     File pluginDir = new File(openfirePluginsPath);



    String pName = request.getParameter("plugin");
    File plugin = null;
    if (pName != null) {
        plugin = new File(pluginDir, pName);
    }
    if (plugin != null) {
        String imageDownload = request.getParameter("img");
		if (imageDownload != null && Boolean.valueOf(imageDownload).booleanValue()) {
            response.setContentType("image/gif");
            OutputStream resOut = response.getOutputStream();
            byte [] image = getPluginFile(plugin, "logo_small.gif");
            resOut.write(image);
            resOut.close();
            return;
        }
    }

%>



 <html>
 <head>
 <title>Openfire Developer Plugins</title>
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
         <li id="subnav06"><a href="../../builds/openfire/docs/latest/documentation/javadoc/">JavaDocs</a></li>
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
                 <h2>Openfire Developer Plugins</h2>
             </div>
             <!-- END body header -->


             <div class="ignite_int_body_padding">
                 <p>Plugins extend and enhance the functionality of Openfire (formerly Wildfire). Below is a list of the
                 <b>developer</b> plugins available for <a href="index.jsp">Openfire</a>. To install plugins,
                 copy the .jar file into the <tt>plugins</tt> directory of your Openfire installation.
                 </p>
                 <p>These plugins are generally meant either for developers only, or for special debugging functionality.
                 You should not install these plugins in a production environment unless you were asked
                 to do so by an Openfire developer.</p>

<cache:cache time="60" key="dev-plugin-list">
<% try { %>

	<!-- <div class="contentBox"> -->
		<div id="plugins">

		<a name="opensource"></a>

        <table cellpadding="3" cellspacing="0" border="0" width="100%">
            <tr class="pluginTableHeader">
                <td class="pluginType">
                    Developer Open Source Plugins
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
            File[] plugins = pluginDir.listFiles(new FilenameFilter() {
                public boolean accept(File dir, String name) {
                    return name.endsWith(".jar") || name.endsWith(".war");
                }
            });
            if (plugins != null) {
                Arrays.sort(plugins, new Comparator() {
                    public int compare(Object o1, Object o2) {
                        File f1 = (File)o1;
                        File f2 = (File)o2;
                        try {
                            String x1 = new String(getPluginFile(f1, "plugin.xml"));
                            String x2 = new String(getPluginFile(f2, "plugin.xml"));
                            Document doc1 = (new SAXReader()).read(new ByteArrayInputStream(x1.getBytes()));
                            Document doc2 = (new SAXReader()).read(new ByteArrayInputStream(x2.getBytes()));
                            Element n1 = (Element)doc1.selectSingleNode("/plugin/name");
                            Element n2 = (Element)doc2.selectSingleNode("/plugin/name");
                            String name1 = (n1 == null ? f1.getName() : geti18nText(f1, n1.getTextTrim()));
                            String name2 = (n2 == null ? f2.getName() : geti18nText(f2, n2.getTextTrim()));
                            Element lic1 = (Element)doc1.selectSingleNode("/plugin/licenseType");
                            Element lic2 = (Element)doc2.selectSingleNode("/plugin/licenseType");
                            String license1 = (lic1 == null ? "gpl" : lic1.getTextTrim());
                            String license2 = (lic2 == null ? "gpl" : lic2.getTextTrim());
                            // Sort by license first.
                            if (license1.equals(license2)) {
                                return name1.toLowerCase().compareTo(name2.toLowerCase());
                            }
                            else {
                                if (license1.equals("commercial")) {
                                    return 1;
                                }
                                else if (license2.equals("commercial")) {
                                    return -1;
                                }
                                else {
                                    return 0;
                                }
                            }
                        }
                        catch (Exception e) {
                            return 0;
                        }
                    }
                });
            }
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
            boolean commercialShown = false;
            for (int i=0; plugins!=null && i<plugins.length; i++) {
                String pluginXML = new String(getPluginFile(plugins[i], "plugin.xml"));
                if (pluginXML != null) {
                    String pname = plugins[i].getName().toLowerCase();
                    pname = pname.substring(0, pname.length() - 4);

                    // See if a README and changelog exist.
                    boolean readmeExists = pluginFileExists(plugins[i], "readme.html");
                    boolean changelogExists = pluginFileExists(plugins[i], "changelog.html");
                    boolean iconExists = pluginFileExists(plugins[i], "logo_small.gif");
										boolean licenseExists = pluginFileExists(plugins[i], "license.html");

                    // If the icon exists, make sure it's extracted. We can't serve up images
                    // directly from JSP so we just put them on the file system.
                    if (iconExists) {
                        File cache = new File(pluginDir, "cache");
                        if (!cache.exists()) {
                            cache.mkdir();
                        }
                        File pluginIcon = new File(pluginDir, "cache" + File.separator +
                                pname + ".gif");
                        if (!pluginIcon.exists()) {
                            writePluginFile(plugins[i], cache, "logo_small.gif", pname + ".gif");
                        }
                        else {
                            if (pluginIcon.lastModified() < plugins[i].lastModified()) {
                                pluginIcon.delete();
                                writePluginFile(plugins[i], cache, "logo_small.gif", pname + ".gif");
                            }
                        }
                    }
                    if (readmeExists) {
                        File extractDir = new File(pluginDir, pname);
                        if (!extractDir.exists()) {
                            extractDir.mkdir();
                        }
                        File readme = new File(extractDir, "readme.html");
                        if (!readme.exists()) {
                            writePluginFile(plugins[i], extractDir, "readme.html", "readme.html");
                        }
                        else if (plugins[i].lastModified() > readme.lastModified()) {
                            readme.delete();
                            writePluginFile(plugins[i], extractDir, "readme.html", "readme.html");
                        }
                    }
                    if (changelogExists) {
                        File extractDir = new File(pluginDir, pname);
                        if (!extractDir.exists()) {
                            extractDir.mkdir();
                        }
                        File changelog = new File(extractDir, "changelog.html");
                        if (!changelog.exists()) {
                            writePluginFile(plugins[i], extractDir, "changelog.html", "changelog.html");
                        }
                        else if (plugins[i].lastModified() > changelog.lastModified()) {
                            changelog.delete();
                            writePluginFile(plugins[i], extractDir, "changelog.html", "changelog.html");
                        }
                    }
										if (licenseExists) {
                        File extractDir = new File(pluginDir, pname);
                        if (!extractDir.exists()) {
                            extractDir.mkdir();
                        }
                        File license = new File(extractDir, "LICENSE.html");
                        if (!license.exists()) {
                            writePluginFile(plugins[i], extractDir, "license.html", "LICENSE.html");
                        }
                        else if (plugins[i].lastModified() > license.lastModified()) {
                            license.delete();
                            writePluginFile(plugins[i], extractDir, "license.html", "LICENSE.html");
                        }
                    }

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
                    if (licenseType.equals("commercial") && !commercialShown) {
                        commercialShown = true;
        %>

					<tr>
					<td colspan="5">
					<br/>
					<a name="commercial"></a>
					<br/></td>
					</tr>
                    <tr class="pluginTableHeader">
                        <td class="pluginType">
                            Developer Commercial Plugins
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

        <%          } %>

                <tr valign="middle">
                    <td class="c1">
                        <table cellpadding="1" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td width="1%">
								<span class="plugicon">
                                <img src="plugins-dev/cache/<%= URLEncoder.encode(pname, "utf-8") %>.gif" alt="" />
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
                        <a href="plugins-dev/<%= URLEncoder.encode(pname, "utf-8") %>/readme.html"
                ><img src="../../images/doc-readme-16x16.gif" width="16" height="16" border="0" alt="README"></a>
                        <% } else { %>
                        &nbsp;
                        <% } if(changelogExists) { %>
                        <a href="plugins-dev/<%= URLEncoder.encode(pname, "utf-8") %>/changelog.html"
                ><img src="../../images/doc-changelog-16x16.gif" width="16" height="16" border="0" alt="Changelog"></a>
                        <% } %>
                    </td>
                    <td class="c3" nowrap>
                        <a href="plugins-dev/<%= plugins[i].getName() %>"><%= plugins[i].getName() %></a>
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
<% } %>
 </cache:cache>

	 </div>



<%!
    private byte[] getPluginFile(File jarFile, String name) throws IOException {
        ZipFile zipFile = new JarFile(jarFile);
        for (Enumeration e=zipFile.entries(); e.hasMoreElements(); ) {
            JarEntry entry = (JarEntry)e.nextElement();
            if (name.equals(entry.getName().toLowerCase())) {
                InputStream in = new BufferedInputStream(zipFile.getInputStream(entry));
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] b = new byte[512];
                int len = 0;
                while ((len=in.read(b)) != -1) {
                    out.write(b,0,len);
                }
                out.flush();
                out.close();
                return out.toByteArray();
            }
        }
        return null;
    }
%>
<%!
    public String geti18nText(File jarFile, String key) {
        if (key == null) {
            return null;
        }
        // Look for the key symbol:
        if (key.indexOf("${") == 0 && key.indexOf("}") == key.length()-1) {
            ResourceBundle bundle = getResourceBundle(jarFile);
            if (bundle != null) {
                return bundle.getString(key.substring(2, key.length()-1));
            }
        }
        return key;
    }
%>
<%!
    private ResourceBundle getResourceBundle(File jarFile) {
        try {
            String pluginName = jarFile.getName().substring(0, jarFile.getName().lastIndexOf(".jar"));
            URLClassLoader classLoader = new URLClassLoader(new URL[] { jarFile.toURL() });
            return ResourceBundle.getBundle("i18n/" + pluginName + "_i18n", Locale.ENGLISH, classLoader);
        }
        catch (Exception e) {
            LoggerFactory.getLogger( this.getClass() ).warn( "Unable to get resource bundle for file {}", jarFile, e );
            return null;
        }
    }
%>
<%!
    private boolean pluginFileExists(File jarFile, String name) throws IOException {
        ZipFile zipFile = new JarFile(jarFile);
        for (Enumeration e=zipFile.entries(); e.hasMoreElements(); ) {
            JarEntry entry = (JarEntry)e.nextElement();
            if (name.equals(entry.getName().toLowerCase())) {
                return true;
            }
        }
        return false;
    }
%>
<%!
    private void writePluginFile(File jarFile, File destination, String fileName, String destinationName) throws IOException {
        byte [] fileBytes = getPluginFile(jarFile, fileName);
        File file = new File(destination, destinationName);
        FileOutputStream out = new FileOutputStream(file);
        out.write(fileBytes);
        out.close();
    }
%>

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
