package org.jivesoftware.site;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.ResourceBundle;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import javax.activation.MimetypesFileTypeMap;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Servlet used for downloading and capturing of data for all Openfire and Spark plugins on Ignite.
 */
public class PluginDownloadServlet extends HttpServlet {

    private static final Logger Log = LoggerFactory.getLogger( PluginDownloadServlet.class );

    private static MimetypesFileTypeMap typeMap = new MimetypesFileTypeMap();
    private Map<String, PluginCacheEntry> pluginCache = Collections.synchronizedMap( new HashMap<>());

    private PluginManager pluginManager;
    private static String openfirePluginUri = "/projects/openfire/plugins/";
    private static String openfirePluginBetaUri = "/projects/openfire/plugins-beta/";
    private static String openfirePluginDevUri = "/projects/openfire/plugins-dev/";
    private static String sparkPluginUri = "/updater/sparkplugs/";

    @Override
    public void init(ServletConfig config) throws ServletException
    {
        super.init(config);

        pluginManager = new PluginManager();
        pluginManager.init( config );
    }

    @Override
    public void destroy()
    {
        pluginManager.destroy();
    }

    public void doGet( HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        final String requestURI = request.getRequestURI();
        if ( !validateFilename( requestURI ) )
        {
            response.sendError( HttpServletResponse.SC_NOT_FOUND );
            return;
        }

        // Expected URL format:

        // Old style, should always point to latest release.
        // for plugins:
        //   <path>/pluginname.jar
        // for files that are part of plugins:
        //   <path>/pluginname/<file>
        //
        // New style:
        // for plugins:
        //   <path>/<version>/pluginname.jar
        // for files that are part of plugins:
        //   <path>/version>/pluginname/<file>
        final ParsedRequest parsedRequest = parse( requestURI, request.getQueryString() );

        final Path plugin = pluginManager.findPluginFile( parsedRequest );

        // Check whether this plugin exists and really is a file.
        if ( plugin == null || !Files.exists( plugin ) || !Files.isRegularFile( plugin ) )
        {
            // Not a file, return 404
            Log.info( "File {} does not exist (or is not a regular file).", plugin );
            response.sendError( HttpServletResponse.SC_NOT_FOUND );
            return;
        }

        if ( Files.size( plugin ) <= 0 )
        {
            // File empty, return 500
            Log.info( "File {} had size {}.", plugin, Files.size( plugin ) );
            response.sendError( HttpServletResponse.SC_INTERNAL_SERVER_ERROR );
            return;
        }
        try
        {
            if ( parsedRequest.forFileInPlugin )
            {
                // This is a request for a file that is stored in a plugin.
                doGetPluginFile( request, response, plugin, parsedRequest );
            }
            else
            {
                // This is a request for a file itself is a plugin.
                doGetPlugin( request, response, plugin, parsedRequest );
            }
        }
        catch (IOException ioe)
        {
            // Ignore this sucker because it is caused by client disconnects most frequently
            Log.debug( "An exception occurred while processing request for '{}'. This was likely caused by a disconnecting client.", requestURI, ioe);
        }
        catch (Exception e)
        {
            Log.warn( "An exception occurred while processing request for '{}'", requestURI, e );
        }
    }

    /**
     * Processes a GET request for one of the entries in a plugin archive file.
     * This is typically used to retrieve the readme or changelog file.
     *
     * @param request The HTTP request.
     * @param response The HTTP response.
     * @param plugin The plugin archive file.
     * @param parsedRequest Metadata of the request.
     */
    protected void doGetPluginFile( HttpServletRequest request, HttpServletResponse response, Path plugin, ParsedRequest parsedRequest ) throws IOException
    {
        try ( final JarFile jarFile = new JarFile( plugin.toFile() ) )
        {
            try (final InputStream inputStream = getUncompressedEntryFromArchive( jarFile, parsedRequest.fileInPluginName) )
            {
                // Check if the plugin file contains the file that's requested.
                if ( inputStream == null )
                {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }
                else
                {
                    writeBytesToStream( parsedRequest.fileInPluginName, inputStream, response, false );
                }
            }
        }
    }

    /**
     * Processes a GET request a plugin archive file. This is typically used to
     * download a plugin.
     *
     * @param request The HTTP request.
     * @param response The HTTP response.
     * @param plugin The plugin archive file.
     * @param parsedRequest Metadata of the request.
     */
    protected void doGetPlugin( HttpServletRequest request, HttpServletResponse response, Path plugin, ParsedRequest parsedRequest ) throws IOException, DocumentException
    {
        boolean downloadComplete = false;
        try ( InputStream inputStream = Files.newInputStream( plugin ) )
        {
            String fileName = parsedRequest.pluginName;
            String assemblyFileName = plugin.getFileName().toString();
            int dot = assemblyFileName.lastIndexOf( '.' );
            if (dot != -1) {
                fileName += assemblyFileName.substring( dot );
            }
            downloadComplete = writeBytesToStream( fileName, inputStream, response, parsedRequest.product != null );
        }

        if ( downloadComplete && (parsedRequest.product != null) )
        {
            // Log to database if VALID plugin
            String ipAddress = request.getHeader( "X-FORWARDED-FOR" );
            if ( ipAddress == null || ipAddress.length() == 0 )
            {
                ipAddress = request.getRemoteAddr();
            }

            // TODO: what value for version should we use: the one in the Maven pom, or in the plugin.xml?
            String product = parsedRequest.product.getName();
            String version = getVersionNumber( parsedRequest.product, plugin );
            String fileType = getFileType( plugin.getFileName().toString() );

            // Log to Database
            DownloadStats.addUpdateToDatabase( ipAddress, product, version, fileType, plugin.getFileName().toString(), parsedRequest.product );
        }
    }

    /**
     * Writes out a file to the ServletOuputStream.
     *
     * @param fileName the name of the file to send to the client.
     * @param in The stream that provides the data to be send to the client.
     * @param response the servlet response.
     * @param isAttachment whether the file should be downloaded, instead of displayed, by the browser
     * @return true if the file was downloaded.
     */
    public static boolean writeBytesToStream(String fileName, InputStream in, HttpServletResponse response, Boolean isAttachment)
    {
        String contentType = typeMap.getContentType(fileName.toLowerCase());
        response.setContentType(contentType);
        if (isAttachment) {
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName );
        }

        try ( final OutputStream out = response.getOutputStream() )
        {
            // Copy the contents of the file to the output stream
            byte[] buf = new byte[1024];
            int totalWritten = 0;
            int count;
            while ((count = in.read(buf)) >= 0) {
                out.write(buf, 0, count);
                totalWritten += count;
            }

            response.setContentLength( totalWritten );
            return true;
        }
        catch (IOException ioe) {
            // Ignore this sucker because it is caused by client disconnects most frequently
            Log.debug( "An exception occurred while processing file '{}'. This was likely caused by a disconnecting client.", fileName, ioe);
        }
        catch (Exception e) {
            Log.warn( "An exception occurred while processing file '{}'", fileName, e);
        }

        return false;
    }

    /**
     * Return the version of the file (ex.1.0.0)
     *
     * @param pluginType the type of plugin being downloaded
     * @param file the plugin file being served
     * @return the version.
     * @throws IOException when an IO problem occurs
     * @throws DocumentException when a document exception occurs
     */
    private String getVersionNumber(DownloadServlet.DownloadInfo pluginType, Path file) throws IOException, DocumentException {
        // The key includes the plugin type and filename to avoid name collisions
        final String key = pluginType.getName() + file.getFileName().toString();
        PluginCacheEntry pluginEntry = pluginCache.get(key);

        // Return the cached result as long as long as the entry is not older than five minutes.
        if (pluginEntry != null && pluginEntry.getLastModified() < System.currentTimeMillis() - ( 5*60*1000 ) ) {
            return pluginEntry.getVersionNumber();
        }

        // No valid cached plugin data was found so collect the data from the plugin file and cache it
        // Fortunately the Spark and Openfire plugins share a very similar XML structure and both contain
        // <plugin><version> :)
        final String result = getMetadataFromPlugin( file, "/plugin/version" );
        pluginEntry = new PluginCacheEntry(result, System.currentTimeMillis());
        pluginCache.put(key, pluginEntry);

        return result;
    }

    public static String getMetadataFromPlugin( Path file, String propertyPath ) throws IOException, DocumentException
    {
        try ( final JarFile archive = new JarFile( file.toFile() ) )
        {
            return getMetadataFromPlugin( archive, propertyPath );
        }
    }

    public static String getMetadataFromPlugin( ZipFile archive, String propertyPath ) throws IOException, DocumentException
    {
        try ( final InputStream in = getUncompressedEntryFromArchive( archive, "plugin.xml" ) )
        {
            final SAXReader saxReader = new SAXReader();
            final Document doc = saxReader.read(in);
            final Element element = (Element)doc.selectSingleNode( propertyPath );

            return element == null ? null : element.getTextTrim();
        }
    }

    /**
     * Return the type of file (suffix).
     *
     * @param fileName the name of the file.
     * @return the file suffix.
     */
    private String getFileType(String fileName) {
        int indexOfPeriod = fileName.indexOf(".");
        return fileName.substring(indexOfPeriod + 1);
    }

    public static boolean archiveContainsEntry( ZipFile archive, String entryName )
    {
        final Enumeration<? extends ZipEntry> entries = archive.entries();
        while ( entries.hasMoreElements() )
        {
            final ZipEntry entry = entries.nextElement();
            if ( entryName.equalsIgnoreCase( entry.getName() ) )
            {
                return true;
            }
        }
        return false;
    }

    public static long getUncompressedSizeOfFileInArchive( ZipFile archive, String entryName )
    {
        final Enumeration<? extends ZipEntry> entries = archive.entries();
        while ( entries.hasMoreElements() )
        {
            final ZipEntry entry = entries.nextElement();
            if ( entryName.equalsIgnoreCase( entry.getName() ) )
            {
                return entry.getSize();
            }
        }
        return -1;
    }

    public static InputStream getUncompressedEntryFromArchive( ZipFile archive, String entryName ) throws IOException {
        final Enumeration<? extends ZipEntry> entries = archive.entries();
        while ( entries.hasMoreElements() )
        {
            final ZipEntry entry = entries.nextElement();
            if ( entryName.equalsIgnoreCase( entry.getName() ) )
            {
                return new BufferedInputStream( archive.getInputStream( entry ) );
            }
        }
        return null;
    }

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

    /**
     * A cache of the plugin version number is maintained for performance reasons. The cache entry contains
     * the version number of the plugin and the last modified date of the plugin file. The last modified
     * date is used to periodically update the cache.
     */
    private class PluginCacheEntry {
        private String versionNumber;
        private long lastModified;

        public PluginCacheEntry(String versionNumber, long lastModified) {
            this.versionNumber = versionNumber;
            this.lastModified = lastModified;
        }

        public String getVersionNumber() {
            return versionNumber;
        }

        public void setVersionNumber(String versionNumber) {
            this.versionNumber = versionNumber;
        }

        public long getLastModified() {
            return lastModified;
        }
    }

    private boolean validateFilename(String filename) {
        if (filename.indexOf("..") != -1)
            return false;
        
        return true;
    }

    public static String geti18nText(File jarFile, String key) {
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

    private static ResourceBundle getResourceBundle(File jarFile) {
        try {
            String pluginName = jarFile.getName().substring(0, jarFile.getName().lastIndexOf(".jar"));
            URLClassLoader classLoader = new URLClassLoader(new URL[] { jarFile.toURL() });
            return ResourceBundle.getBundle("i18n/" + pluginName + "_i18n", Locale.ENGLISH, classLoader);
        }
        catch (Exception e) {
            Log.warn( "Unable to get resource bundle for file {}", jarFile, e );
            return null;
        }
    }

    /**
     * Returns all plugin files in a directory, ordered by name.
     *
     * @param pluginDir The directory
     * @return An array of plugin files.
     */
    public static File[] getPlugins11( File pluginDir )
    {
        File[] plugins = pluginDir.listFiles( ( dir, name ) -> name.endsWith( ".jar") || name.endsWith( ".war") );

        if (plugins != null) {
            Arrays.sort( plugins, ( f1, f2 ) -> {
                try {
                    String n1 = getMetadataFromPlugin( f1.toPath(), "/plugin/name" );
                    String n2 = getMetadataFromPlugin( f2.toPath(), "/plugin/name" );
                    String name1 = (n1 == null ? f1.getName() : geti18nText(f1, n1));
                    String name2 = (n2 == null ? f2.getName() : geti18nText(f2, n2));
                    return name1.toLowerCase().compareTo(name2.toLowerCase());
                }
                catch (Exception e) {
                    return 0;
                }
            } );
        }

        return plugins;
    }

    // FIXME move to pluginmanager
    public static List<PluginManager.Metadata> getPlugins( File pluginDir ) throws IOException
    {
        return Files.walk( pluginDir.toPath() )
            .filter( Files::isRegularFile )
            .filter( path -> path.getFileName().toString().toLowerCase().endsWith( "-plugin-assembly.jar" ) )
            .map( ( Path mavenFile ) -> {
                try
                {
                    return new PluginManager.Metadata( mavenFile );
                }
                catch ( IOException | DocumentException e )
                {
                    e.printStackTrace();
                }
                return null;
            } )
            .filter( Objects::nonNull )
            .sorted( ( f1, f2 ) -> {
                try {
                    String n1 = f1.humanReadableName;
                    String n2 = f2.humanReadableName;
                    String name1 = (n1 == null ? f1.pluginFileName : geti18nText(f1.mavenFile.toFile(), n1));
                    String name2 = (n2 == null ? f2.pluginFileName : geti18nText(f2.mavenFile.toFile(), n2));
                    return name1.toLowerCase().compareTo(name2.toLowerCase());
                }
                catch (Exception e) {
                    return 0;
                }
            } )
            .collect( Collectors.toList() );
    }

    // Old style, should always point to latest release.
    // for plugins:
    //   <path>/pluginname.jar
    // for files that are part of plugins:
    //   <path>/pluginname/<file>
    //
    // New style:
    // for plugins:
    //   <path>/<version>/pluginname.jar
    // for files that are part of plugins:
    //   <path>/version>/pluginname/<file>
    protected static ParsedRequest parse(final String uri, final String queryString)
    {
        final boolean isPlugin = parseIsPlugin( uri );
        final DownloadServlet.DownloadInfo product = parseProduct( uri );
        final ReleaseTrack releaseTrack = parseReleaseTrack( uri );
        final String pluginName = parsePluginName( uri );
        final String pluginVersion = parsePluginVersion( uri );
        final String fileInPluginName = parseFileInPluginName( uri );
        final String snapshotQualifier = parseSnapshotQualifier(queryString);

        if ( isPlugin )
        {
            return new ParsedRequest(product, pluginName, pluginVersion, releaseTrack, snapshotQualifier);
        }
        else
        {
            return new ParsedRequest(product, pluginName, pluginVersion, releaseTrack, fileInPluginName, snapshotQualifier);
        }
    }

    static boolean parseIsPlugin( final String uri )
    {
        return uri.endsWith( ".jar" );
    }

    private static String parseSnapshotQualifier(final String queryString) {
        if (queryString != null) {
            final String[] parameterKeyValues = queryString.split("&");
            for (final String parameterKeyValue : parameterKeyValues) {
                if (parameterKeyValue.startsWith("snapshot=")) {
                    return parameterKeyValue.substring(parameterKeyValue.indexOf('=') + 1);
                }
            }
        }
        return "";
    }

    static DownloadServlet.DownloadInfo parseProduct( final String uri )
    {
        if ( uri.startsWith( sparkPluginUri ) )
        {
            return DownloadServlet.DownloadInfo.spark_plugin;
        }
        else if ( uri.startsWith( openfirePluginUri ) )
        {
            return DownloadServlet.DownloadInfo.openfire_plugin;
        }
        else if ( uri.startsWith( openfirePluginBetaUri ) )
        {
            return DownloadServlet.DownloadInfo.openfire_plugin;
        }
        else if ( uri.startsWith( openfirePluginDevUri ) )
        {
            return DownloadServlet.DownloadInfo.openfire_plugin;
        }
        else
        {
            throw new IllegalArgumentException( "Cannot parse product from request URI: " + uri );
        }
    }

    static ReleaseTrack parseReleaseTrack( final String uri )
    {
        if ( uri.startsWith( sparkPluginUri ) )
        {
            return ReleaseTrack.RELEASE;
        }
        else if ( uri.startsWith( openfirePluginUri ) )
        {
            return ReleaseTrack.RELEASE;
        }
        else if ( uri.startsWith( openfirePluginBetaUri ) )
        {
            return ReleaseTrack.BETA_RELEASE;
        }
        else if ( uri.startsWith( openfirePluginDevUri ) )
        {
            return ReleaseTrack.DEV_RELEASE;
        }
        else
        {
            throw new IllegalArgumentException( "Cannot parse release track from request URI: " + uri );
        }
    }

    static String parsePluginName( final String uri )
    {
        if ( parseIsPlugin( uri ) )
        {
            //  <path>/pluginname.jar or <path>/<version>/pluginname.jar
            // 'text between the last slash and the last dot'.
            final int lastSlash = uri.lastIndexOf( '/' );
            final int lastDot =  uri.lastIndexOf( '.' );
            return uri.substring( lastSlash + 1, lastDot );
        }
        else
        {
            // <path>/pluginname/<file> or <path>/version>/pluginname/<file>
            // 'text between the last two slashes'
            final int lastSlash = uri.lastIndexOf( '/' );
            final int startSlash = uri.lastIndexOf( '/', lastSlash - 1 );
            return uri.substring( startSlash + 1, lastSlash );
        }
    }

    static String parsePluginVersion( final String uri )
    {
        // Expected input is either 'old style' or 'new style':
        //
        // Old style, should always point to latest release.
        // for plugins:
        //   <path>/pluginname.jar
        // for files that are part of plugins:
        //   <path>/pluginname/<file>
        //
        // New style:
        // for plugins:
        //   <path>/<version>/pluginname.jar
        // for files that are part of plugins:
        //   <path>/version>/pluginname/<file>

        // Remove 'path'
        String result;
        if ( uri.startsWith( sparkPluginUri ) )
        {
            result = uri.substring( sparkPluginUri.length() );
        }
        else if ( uri.startsWith( openfirePluginUri ) )
        {
            result = uri.substring( openfirePluginUri.length() );
        }
        else if ( uri.startsWith( openfirePluginBetaUri ) )
        {
            result = uri.substring( openfirePluginBetaUri.length() );
        }
        else if ( uri.startsWith( openfirePluginDevUri ) )
        {
            result = uri.substring( openfirePluginDevUri.length() );
        }
        else
        {
            throw new IllegalArgumentException( "Cannot parse product from request URI: " + uri );
        }

        // Strip any leading slashes, in case the URI didn't include them.
        while ( result.startsWith( "/" ) )
        {
            result = result.substring( 1 );
        }

        // When the next text equals the plugin name, then there's no version in this URI.
        final String pluginName = parsePluginName( uri );
        if ( result.startsWith( pluginName ) )
        {
            return null;
        }

        // Otherwise, the version is from the start up until the next slash.
        final int nextSlash = result.indexOf( '/' );
        return result.substring( 0, nextSlash );
    }

    static String parseFileInPluginName( String uri )
    {
        if ( parseIsPlugin( uri ) )
        {
            return null;
        }

        // TODO: Support files that are not in the root of the plugin archive (allow slashes)

        // Everything after the last slash.
        final int lastSlash = uri.lastIndexOf( '/' );
        return uri.substring( lastSlash + 1 );
    }

    public enum ReleaseTrack
    {
        /**
         * General purpose, stable release (eg: 1.0.0).
         */
        RELEASE,

        /**
         * General purpose, unstable pre-release (eg: 1.0.0-alpha).
         */
        ALPHA_RELEASE,

        /**
         * General purpose, unstable pre-release (eg: 1.0.0-beta).
         */
        BETA_RELEASE,

        /**
         * Special-purpose release (eg: 1.0.0).
         */
        DEV_RELEASE
    }

    static class ParsedRequest
    {
        /**
         * For which product is this a request (eg: Openfire)
         */
        public final DownloadServlet.DownloadInfo product;

        /**
         * The canonical name of the plugin (eg 'bookmarks')
         *
         * Cannot be null or empty.
         */
        public final String pluginName;

        /**
         * The version of the plugin (eg: 1.0.0).
         *
         * Can include the "-SNAPSHOT" postfix, which is interpreted as a request
         * for a build that's not necessarily stable, repeatable.
         *
         * Can be null, which is interpreted as 'latest, stable/non-SNAPSHOT release'.
         */
        public final String pluginVersion;

        /**
         * Is this a request for a 'normal' release, or a Dev, Beta or Alpha release?
         */
        public final ReleaseTrack releaseTrack;

        /**
         * Is this a request for a file that itself is a plugin (eg: bookmarks.jar)?
         *
         * Note: this is always the inverse of {@link #forFileInPlugin}.
         */
        public final boolean forPlugin;

        /**
         * Is this a request for a file that is part of a plugin (eg: readme.html)?
         *
         * Note: this is always the inverse of {@link #forPlugin}.
         */
        public final boolean forFileInPlugin;

        /**
         * If this is a request for a file that's part of a plugin, then this
         * field holds the name of the file. It will be null otherwise.
         */
        public final String fileInPluginName;

        /**
         * The timestamp that distinguishes between different versions of the same SNAPSHOT (or an empty string, if none)
         */
        final String snapshotQualifier;


        public ParsedRequest(final DownloadServlet.DownloadInfo product, final String pluginName, final String pluginVersion, final ReleaseTrack releaseTrack, final String snapshotQualifier) {
            this.product = product;
            this.pluginName = pluginName;
            this.pluginVersion = pluginVersion;
            this.releaseTrack = releaseTrack;
            this.snapshotQualifier = snapshotQualifier;
            this.forPlugin = true;
            this.forFileInPlugin = !forPlugin;
            this.fileInPluginName = null;
        }

        public ParsedRequest(final DownloadServlet.DownloadInfo product, final String pluginName, final String pluginVersion, final ReleaseTrack releaseTrack, final String fileInPluginName, final String snapshotQualifier) {
            this.product = product;
            this.pluginName = pluginName;
            this.pluginVersion = pluginVersion;
            this.releaseTrack = releaseTrack;
            this.snapshotQualifier = snapshotQualifier;
            this.forPlugin = false;
            this.forFileInPlugin = !forPlugin;
            this.fileInPluginName = fileInPluginName;
        }

    }
}
