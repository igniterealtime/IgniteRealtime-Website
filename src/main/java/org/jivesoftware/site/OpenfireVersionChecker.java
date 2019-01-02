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
import java.nio.file.Paths;
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
    private static String OPENFIRE_PATH = "http://www.igniterealtime.org/downloads/index.jsp";
    private static String OPENFIRE_LOG = "http://www.igniterealtime.org/builds/openfire/docs/latest/changelog.html";
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
     * Returns the list of available (i.e. not installed) plugins.
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
     * Returns the list of available plugins.
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
        final Collection<PluginManager.Metadata> plugins = PluginManager.getLatestRelease( Paths.get( pluginsPath ) );

        // Build answer based on available plugins
        for (PluginManager.Metadata plugin : plugins)
        {
            // Create answer
            Element latestPlugin = xmlReply.addElement("plugin");

            // TODO Get i18n'ed version of the plugin name and description
            latestPlugin.addAttribute("name", plugin.humanReadableName);
            latestPlugin.addAttribute("description", plugin.humanReadableName);

            latestPlugin.addAttribute("url", plugin.getDownloadURL() );
            latestPlugin.addAttribute("icon", plugin.getIconURL() );
            latestPlugin.addAttribute("readme", plugin.getReadmeURL() );
            latestPlugin.addAttribute("changelog", plugin.getChangelogURL() );
            latestPlugin.addAttribute("latest", plugin.getVersion() );
            latestPlugin.addAttribute("licenseType", plugin.getLicenceType() );
            latestPlugin.addAttribute("author", plugin.getAuthor() );
            latestPlugin.addAttribute("minServerVersion", plugin.getMinimumRequiredOpenfireVersion() );

            // Include size of plugin
            latestPlugin.addAttribute("fileSize", Long.toString( plugin.getFileSize() ));
        }
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
