/**
 * Copyright (C) 1999-2006 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

package org.jivesoftware.site;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Collection;
import java.util.Enumeration;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.StringTokenizer;
import java.util.concurrent.ConcurrentHashMap;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.zip.ZipFile;

import org.dom4j.Document;
import org.dom4j.DocumentFactory;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.jivesoftware.util.Version;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * OpenfireVersionChecker provides two services 1) check for updates and 2) get list of
 * available plugins. The "check for updates" service checks if the installed version of
 * a Openfire server or any of its plugins are old. The "Get list of available plugins"
 * service offers to Openfire servers the list of plugins that have not been installed.
 *
 * @author Gaston Dombiak
 */
public class OpenfireVersionChecker {

    private static final Logger Log = LoggerFactory.getLogger( OpenfireVersionChecker.class );

    protected static DocumentFactory docFactory = DocumentFactory.getInstance();
    //private static String OPENFIRE_PATH = "http://www.igniterealtime.org/downloads/download-landing.jsp?file=builds/openfire/";
    private static String OPENFIRE_PATH = "https://www.igniterealtime.org/downloads/index.jsp";
    private static String OPENFIRE_LOG = "https://download.igniterealtime.org/openfire/docs/latest/changelog.html";
    private static String PLUGINS_PATH = "https://www.igniterealtime.org/projects/openfire/plugins/";
    /**
     * Map that keeps the information specified in plugin.xml for each available plugin.
     * Key = filename, value = content of plugin.xml
     */
    private static Map<String, Document> pluginsInfo;
    /**
     * Keep track of the date of the last updated plugin.
     */
    private static long lastPluginDate;

    /**
     * Keeps track of the last time the pluginsInfo data was refreshed.
     */
    private static long lastRefresh;


    /**
     * Verifies if there is a newer version of the Openfire server. The request is specified
     * in XML format and contains the installed server version information.  The answer is
     * also specified in XML format. If a new server version is available then the answer
     * will include information about the available update. Otherwise, an empty "version"
     * element is returned.
     *
     * @param request the XML sent by the remote openfire installation that contains
     *        current installed server version.
     * @return an answer in XML format containing the items for which a new version is available.
     */
    public static String checkVersions(String request) {
        if (request == null || request.isEmpty() ) {
            Log.debug( "Unable to check for updates when no version was supplied. Returning dummy result that says that everything is up to date." );
            return "<version/>";
        }
        try {
            Element xmlRequest = new SAXReader().read(new StringReader(request)).getRootElement();
            Element xmlReply = docFactory.createDocument().addElement("version");
            // Check if there is a newer version of the openfire server
            compareOpenfireVersion(xmlRequest, xmlReply);
            return xmlReply.asXML();
        } catch (Exception e) {
            Log.warn( "Unable to check version for '{}'. Returning dummy result that says that everything is up to date.", request, e);
            return "<version/>";
        }
    }

    /**
     * Returns the list of available (i.e. not installed) plugins. The answer will
     * include free and commercial plugins.
     *
     * @param pluginsPath the path where the .jar files of the plugins are located.
     * @param request the XML sent by the remote openfire installation that contains
     *        current installed versions.
     * @return  the list of available (i.e. not installed) plugins.
     */
    public static String getAvailablePlugins(String pluginsPath, String request) {
        if (request == null || request.isEmpty() ) {
            Log.debug( "Unable to check for updates when no version was supplied. Returning dummy result that says that no more plugins are available." );
            return "<available/>";
        }
        try {
            Element xmlRequest = null;
            if (request != null) {
                xmlRequest = new SAXReader().read(new StringReader(request)).getRootElement();
            }
            Element xmlReply = docFactory.createDocument().addElement("available");
            // Check if new plugins are available
            availablePlugins(pluginsPath, xmlRequest, xmlReply);
            return xmlReply.asXML();
        } catch (Exception e) {
            Log.warn( "Unable to check version for '{}'. Returning dummy result that says that no more plugins are available.", request, e);
            return "<available/>";
        }
    }

    /**
     * Compares installed openfire version against the latest release. If the installed version
     * is older than the latest release then include the url from where the latest release
     * can be downloaded and the version of the latest release.
     *
     * @param xmlRequest original XML request sent by the remote openfire server.
     * @param xmlReply XML reply that may contain information about the latest openfire release.
     */
    private static void compareOpenfireVersion(Element xmlRequest, Element xmlReply) {

        Element currentOpenfire = xmlRequest.element("openfire");
        if (currentOpenfire != null) {
            // Compare latest version with installed one
            Version latest = new Version(Versions.getVersion("openfire"));
            Version installed = new Version(currentOpenfire.attributeValue("current"));
            if (latest.isNewerThan(installed)) {
                Element latestOpenfire = xmlReply.addElement("openfire");
                latestOpenfire.addAttribute("latest", latest.getVersionString());
                latestOpenfire.addAttribute("changelog", OPENFIRE_LOG);
                latestOpenfire.addAttribute("url", OPENFIRE_PATH);
            }
        }
        else
        {
            // WEB-54: Handle update checks for very old versions (still named 'Wildfire').
            Element currentWildfire = xmlRequest.element("wildfire");
            if (currentWildfire != null) {
                Version latest = new Version(Versions.getVersion("openfire"));
                Element latestOpenfire = xmlReply.addElement("wildfire"); // Wildfire's UpdateManager checks for this!
                latestOpenfire.addAttribute("latest", latest.getVersionString());
                latestOpenfire.addAttribute("changelog", OPENFIRE_LOG);
                latestOpenfire.addAttribute("url", OPENFIRE_PATH);
            }
        }
    }

    /**
     * Returns the list of available plugins that are not installed in the Openfire server.
     * The request contains the plugins that are installed.
     *
     * @param pluginsPath the path where the .jar files of the plugins are located.
     * @param xmlRequest original XML request sent by the remote openfire server.
     * @param xmlReply XML reply that contains information about available plugins.
     */
    private static void availablePlugins(String pluginsPath, Element xmlRequest, Element xmlReply)
            throws Exception {
        // Get the locale of the requester
        Locale requesterLocale = Locale.ENGLISH;
            if (xmlRequest != null) {
            Element localElement = xmlRequest.element("locale");
            if (localElement != null) {
                // Set the locale of the requester
                requesterLocale = localeCodeToLocale(localElement.getTextTrim());
            }
        }
        // Get jar files of plugins
        File pluginDir = new File(pluginsPath);
        File[] plugins = pluginDir.listFiles(new FilenameFilter() {
            public boolean accept(File dir, String name) {
                return name.endsWith(".jar") || name.endsWith(".war");
            }
        });
        // Refresh (if required) information about available plugins
        Collection<String> availablePlugins = getPluginsInfo(plugins).keySet();
        // Build answer based on available plugins
        for (String pluginFilename : availablePlugins) {
            // Get the jar file of the plugin
            File pluginFile = null;
            for (File file : plugins) {
                if (pluginFilename.equals(file.getName())) {
                    pluginFile = file;
                    break;
                }
            }
            if (pluginFile == null) {
                // Should never happen but if jar file is no longer available then skip this plugin
                continue;
            }
            // Create answer
            Element latestPlugin = xmlReply.addElement("plugin");
            // Get the information specified in plugin.xml
            Document doc = pluginsInfo.get(pluginFilename);

            // Get i18n'ed version of the plugin name and description
            Element n1 = (Element)doc.selectSingleNode("/plugin/name");
            String name = (n1 == null ? pluginFilename : geti18nText(pluginFile, n1.getTextTrim(), requesterLocale));
            latestPlugin.addAttribute("name", name);
            n1 = (Element) doc.selectSingleNode("/plugin/description");
            String desc = (n1 == null ? "" : geti18nText(pluginFile, n1.getTextTrim(), requesterLocale));
            latestPlugin.addAttribute("description", desc);

            latestPlugin.addAttribute("url", PLUGINS_PATH + pluginFilename);
            latestPlugin.addAttribute("icon", getIconURL(pluginsPath, pluginFilename));
            latestPlugin.addAttribute("readme", getReadmeURL(pluginsPath, pluginFilename));
            latestPlugin.addAttribute("changelog", getChangelogURL(pluginsPath, pluginFilename));

            Element version = (Element) doc.selectSingleNode("/plugin/version");
            Element licenseType = (Element) doc.selectSingleNode("/plugin/licenseType");
            Element author = (Element) doc.selectSingleNode("/plugin/author");
            Element minVersion = (Element) doc.selectSingleNode("/plugin/minServerVersion");

            latestPlugin.addAttribute("latest", version != null ? version.getTextTrim() : null);
            latestPlugin.addAttribute("licenseType",
                    licenseType != null ? licenseType.getTextTrim() : null);
            latestPlugin.addAttribute("author", author != null ? author.getTextTrim() : null);
            latestPlugin.addAttribute("minServerVersion",
                    minVersion != null ? minVersion.getTextTrim() : null);
            // Include size of plugin
            latestPlugin.addAttribute("fileSize", Long.toString(pluginFile.length()));
        }
    }

    private static String getChangelogURL(String pluginsPath, String pluginFilename) {
        // Remove .jar or .war extension
        String folder = pluginFilename.replaceFirst(".jar", "").toLowerCase();
        folder = folder.replaceFirst(".war", "").toLowerCase();
        String realPath = pluginsPath + File.separator + folder + File.separator + "changelog.html";
        if (new File(realPath).exists()) {
            return PLUGINS_PATH + folder + "/changelog.html";
        }
        else {
            return null;
        }
    }

    private static String getReadmeURL(String pluginsPath, String pluginFilename) {
        // Remove .jar or .war extension
        String folder = pluginFilename.replaceFirst(".jar", "").toLowerCase();
        folder = folder.replaceFirst(".war", "").toLowerCase();
        String realPath = pluginsPath + File.separator + folder + File.separator + "readme.html";
        if (new File(realPath).exists()) {
            return PLUGINS_PATH + folder + "/readme.html";
        }
        else {
            return null;
        }
    }

    private static String getIconURL(String pluginsPath, String pluginFilename) {
        // Replacing .jar or .war extension with .gif
        String file = pluginFilename.replaceFirst(".jar", ".gif").toLowerCase();
        file = file.replaceFirst(".war", ".gif").toLowerCase();
        String realPath = pluginsPath + File.separator + "cache" + File.separator + file;
        if (new File(realPath).exists()) {
            return PLUGINS_PATH + "cache/" + file;
        }
        else {
            return null;
        }
    }

    private static Map<String, Document> getPluginsInfo(File[] plugins) throws Exception {
        long latestPlugin = 0;
        // Get the date of the latest update plugin
        for (File file : plugins) {
            latestPlugin = latestPlugin < file.lastModified() ? file.lastModified() : latestPlugin;
        }
        // Update cache of plugins versions (if first time or a plugin has been updated, or cache contains old data)
        if (pluginsInfo == null || latestPlugin > lastPluginDate || lastRefresh + (1000*60*60*24) < System.currentTimeMillis()) {
            pluginsInfo = new ConcurrentHashMap<String, Document>();
            lastPluginDate = latestPlugin;
            lastRefresh = System.currentTimeMillis();
            for (File file : plugins) {
                String x1 = new String(getPluginFile(file, "plugin.xml"));
                Document doc1 = (new SAXReader()).read(new ByteArrayInputStream(x1.getBytes()));
                Element name = (Element)doc1.selectSingleNode("/plugin/name");
                if (name != null) {
                    pluginsInfo.put(file.getName(), doc1);
                }
            }
        }
        return pluginsInfo;
    }

    private static byte[] getPluginFile(File jarFile, String name) throws IOException {
        ZipFile zipFile = new JarFile(jarFile);
        for (Enumeration e=zipFile.entries(); e.hasMoreElements(); ) {
            JarEntry entry = (JarEntry)e.nextElement();
            if (name.equals(entry.getName().toLowerCase())) {
                InputStream in = new BufferedInputStream(zipFile.getInputStream(entry));
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] b = new byte[512];
                int len;
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

    private static String geti18nText(File jarFile, String key, Locale locale) {
        if (key == null) {
            return null;
        }
        // Look for the key symbol:
        if (key.indexOf("${") == 0 && key.indexOf("}") == key.length()-1) {
            ResourceBundle bundle = getResourceBundle(jarFile, locale);
            if (bundle != null) {
                return bundle.getString(key.substring(2, key.length()-1));
            }
        }
        return key;
    }

    private static ResourceBundle getResourceBundle(File jarFile, Locale locale) {
        try {
            // Search for the index if the extension
            int extensionIndex = jarFile.getName().lastIndexOf(".jar");
            if (extensionIndex == -1) {
                extensionIndex = jarFile.getName().lastIndexOf(".war");
            }
            String pluginName = jarFile.getName().substring(0, extensionIndex);
            URLClassLoader classLoader = new URLClassLoader(new URL[] { jarFile.toURI().toURL() });
            return ResourceBundle.getBundle("i18n/" + pluginName + "_i18n", locale, classLoader);
        }
        catch (Exception e) {
            Log.warn( "Unable to get resource bundle for file '{}' (locale: '{}').", jarFile, locale, e );
            return null;
        }
    }

    /**
     * Converts a locale string like "en", "en_US" or "en_US_win" to a Java
     * locale object. If the conversion fails, null is returned.
     *
     * @param localeCode the locale code for a Java locale. See the {@link java.util.Locale}
     *                   class for more details.
     */
    private static Locale localeCodeToLocale(String localeCode) {
        Locale locale = null;
        if (localeCode != null) {
            String language = null;
            String country = null;
            String variant = null;
            StringTokenizer tokenizer = new StringTokenizer(localeCode, "_");
            if (tokenizer.hasMoreTokens()) {
                language = tokenizer.nextToken();
                if (tokenizer.hasMoreTokens()) {
                    country = tokenizer.nextToken();
                    if (tokenizer.hasMoreTokens()) {
                        variant = tokenizer.nextToken();
                    }
                }
            }
            locale = new Locale(language,
                    ((country != null) ? country : ""),
                    ((variant != null) ? variant : ""));
        }
        return locale;
    }
}
