package org.jivesoftware.site;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.jar.JarFile;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.ServletConfig;

import org.apache.maven.artifact.versioning.DefaultArtifactVersion;
import org.dom4j.DocumentException;
import org.jivesoftware.util.PluginVersionComparator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PluginManager
{
    private static final Logger Log = LoggerFactory.getLogger( PluginManager.class );

    private static String PLUGINS_PATH = "https://igniterealtime.org/projects/openfire/plugins/";

    private String sparkPluginsPath;
    private String openfirePluginsPath;
    private String openfirePluginsBetaPath;
    private String openfirePluginsDevPath;

    private static Map<Path, Instant> refreshing = new ConcurrentHashMap<>();
    private static Map<Path, Long> lastRefreshed = new ConcurrentHashMap<>();
    private static Map<Path, Set<Metadata>> cache = new ConcurrentHashMap<>();

    public void init( final ServletConfig config )
    {
        sparkPluginsPath = config.getServletContext().getInitParameter( "spark-plugins-path" );
        openfirePluginsPath = config.getServletContext().getInitParameter( "openfire-plugins-path" );
        openfirePluginsBetaPath = config.getServletContext().getInitParameter( "openfire-plugins-beta-path" );
        openfirePluginsDevPath = config.getServletContext().getInitParameter( "openfire-plugins-dev-path" );
    }

    public void destroy()
    {
    }

    public Path findPluginFile( final PluginDownloadServlet.ParsedRequest parsedRequest ) throws IOException
    {
        final String repoPath;
        switch ( parsedRequest.product )
        {
            case openfire_plugin:
                switch ( parsedRequest.releaseTrack )
                {
                    case BETA_RELEASE:
                        repoPath = openfirePluginsBetaPath;
                        break;

                    case DEV_RELEASE:
                        repoPath = openfirePluginsDevPath;
                        break;

                    case RELEASE:
                    default:
                        repoPath = openfirePluginsPath;
                        break;
                }
                break;

            case spark_plugin:
                repoPath = sparkPluginsPath;
                break;

            default:
                return null;
        }

        final Collection<Metadata> plugins = getPlugins( Paths.get( repoPath ) );

        Stream<Metadata> stream = plugins.stream();
        if (parsedRequest.pluginVersion != null && parsedRequest.pluginVersion.toUpperCase().endsWith("-SNAPSHOT") || parsedRequest.snapshotQualifier != null)
        {
            stream = stream.filter( metadata -> metadata.isSnapshot );
        }
        else
        {
            stream = stream.filter( metadata -> metadata.isRelease );
        }

        stream = stream.filter( metadata -> (parsedRequest.pluginName + ".jar").equalsIgnoreCase( metadata.pluginFileName ) );

        if ( parsedRequest.pluginVersion != null )
        {
            stream = stream.filter( metadata -> metadata.mavenVersion.equalsIgnoreCase( parsedRequest.pluginVersion ) );
            stream = stream.sorted( Comparator.comparing( metadata -> metadata.mavenFile.toFile().lastModified() ) );
        }
        else
        {
            stream = stream.sorted( Comparator.comparing( Metadata::getPluginVersion, new PluginVersionComparator() ).reversed() );
        }

        if (parsedRequest.snapshotQualifier != null) {
            stream = stream.filter(metadata -> parsedRequest.snapshotQualifier.equals(metadata.snapshotQualifier));
        }

        final Optional<Metadata> first = stream.findFirst();

        return first.map( metadata -> metadata.mavenFile ).orElse( null );
    }

    /**
     * Retrieves all metadata for every plugin found in the path.
     *
     * This method caches results. This cache is used to answer subsequent requests to this method.
     * When a cache entry is stale, a refresh is computed. During the computation, the stale result
     * is returned.
     *
     * @param path The path to index.
     * @return All metadata on the path.
     */
    private static Set<Metadata> getPlugins( Path path ) throws IOException
    {
        synchronized ( cache )
        {
            final Set<Metadata> cachedResult = cache.get( path );
            final Instant startedRefreshing = refreshing.get( path );
            final long refreshed = lastRefreshed.getOrDefault( path, 0L );
            final boolean isStale = System.currentTimeMillis() - refreshed > Duration.ofMinutes( 10 ).toMillis();

            // Don't allow refreshes to take longer than two hours.
            if ( startedRefreshing != null && Duration.between( startedRefreshing, Instant.now() ).abs().toHours() < 2 )
            {
                // Always return something immediately, even if it's empty, if we're already refreshing.
                // This prevents re-indexing the same path more than once at the same time.
                Log.debug( "Returning stale result (another thread is refreshing the cache)." );
                return (cachedResult != null ? cachedResult : Collections.emptySet());
            }

            if ( !isStale && cachedResult != null )
            {
                Log.debug( "Returning cached result." );
                return cachedResult;
            }

            Log.debug( "Refreshing stale result..." );
            refreshing.put( path, Instant.now() );
        }

        try
        {
            final long start = System.currentTimeMillis();
            final Set<Metadata> result = Files.walk( path )
                .filter( Files::isRegularFile )
                .filter( p -> p.getFileName().toString().toLowerCase().endsWith( "-openfire-plugin-assembly.jar" ) )
                .map( ( Path mavenFile ) -> {
                    try
                    {
                        return new Metadata( mavenFile );
                    }
                    catch ( IOException | DocumentException e )
                    {
                        Log.warn("Unable to read metadata from '{}'", mavenFile, e);
                    }
                    return null;
                } )
                .filter( Objects::nonNull )
                .collect( Collectors.toSet() );
            final long executionTime = System.currentTimeMillis() - start;
            Log.error( "Indexed {} in {} ", path, Duration.of( executionTime, ChronoUnit.MILLIS ).toString() );

            Log.debug( "Refreshed stale result!" );
            synchronized ( cache )
            {
                cache.put( path, result );
                refreshing.remove( path );
                lastRefreshed.put( path, System.currentTimeMillis() );
            }
            return result;
        }
        finally
        {
            synchronized ( cache )
            {
                refreshing.remove( path );
            }
        }
    }

    /**
     * Returns metadata for the last release of every plugin.
     *
     * @param pluginDir Directory with plugins (cannot be null).
     * @return Metadata of all plugins.
     */
    public static Collection<PluginManager.Metadata> getLatestRelease( final Path pluginDir ) throws IOException
    {
        final Collection<Metadata> plugins = getPlugins( pluginDir );

        return plugins.stream()
            .filter( metadata -> metadata.isRelease )
            .collect(
                Collectors.toMap(
                    Metadata::getPluginFileNameLowerCase,
                    Function.identity(),
                    BinaryOperator.maxBy( Comparator.comparing( Metadata::getPluginVersion, new PluginVersionComparator()) )
                )
            ).values();
    }

    /**
     * Returns metadata for every release of the specified plugin.
     *
     * The result excludes snapshot-releases.
     *
     * @param pluginDir Directory with plugins (cannot be null).
     * @param pluginName Name of the plugin (cannot be null)
     * @return Metadata of all plugins.
     */
    public static Set<Metadata> getReleases( final Path pluginDir, final String pluginName ) throws IOException
    {
        final Collection<Metadata> plugins = getPlugins( pluginDir );

        return plugins.stream()
            .filter( metadata -> metadata.isRelease )
            .filter( metadata -> (pluginName + ".jar").equalsIgnoreCase( metadata.pluginFileName ) )
            .collect( Collectors.toSet() );
    }

    /**
     * Returns metadata for every snapshot-release of the specified plugin.
     *
     * The result excludes normal releases.
     *
     * @param pluginDir Directory with plugins (cannot be null).
     * @param pluginName Name of the plugin (cannot be null)
     * @return Metadata of all plugins.
     */
    public static Set<Metadata> getSnapshots( final Path pluginDir, final String pluginName ) throws IOException
    {
        final Collection<Metadata> plugins = getPlugins( pluginDir );

        return plugins.stream()
            .filter( metadata -> metadata.isSnapshot )
            .filter( metadata -> (pluginName + ".jar").equalsIgnoreCase( metadata.pluginFileName ) )
            .collect( Collectors.toSet() );
    }

    /**
     * Sort a collection of metadata by <ol><li>Name, </li><li>Version, </li>Release Date</ol> (in that order).
     *
     * @param unordered A collection that needs ordering.
     * @return The ordered collection.
     */
    public static List<Metadata> sortByNameVersionAndReleaseDate( Collection<Metadata> unordered )
    {
        return unordered.stream()
            .sorted(
                Comparator.comparing( (PluginManager.Metadata o) -> o.humanReadableName.toLowerCase() )
                .thenComparing( Comparator.comparing( (PluginManager.Metadata o) -> o.pluginVersion, new PluginVersionComparator()).reversed() )
                .thenComparing( Comparator.comparing( (PluginManager.Metadata o) -> o.isRelease ? o.releaseDate : o.snapshotCreationDate ).reversed()  )
            )
            .collect( Collectors.toList() );
    }

    /**
     * Sort a collection of metadata by <ol><li>Name, </li><li>Version, </li>Release Date</ol> (in that order)
     * and returns the first few results from the ordered result.
     *
     * @param unordered A collection that needs ordering.
     * @param max The maximum number of results of the ordered collection to return.
     * @return The ordered collection.
     */
    public static List<Metadata> sortByNameVersionAndReleaseDate( Collection<Metadata> unordered, final int max )
    {
        return sortByNameVersionAndReleaseDate( unordered ).stream()
                .limit( max )
                .collect( Collectors.toList());
    }

    /**
     * Sort a collection of metadata by <ol><li>Version, </li>Release Date</ol> (in that order).
     *
     * Note that the name of the plugin is not used. This works around issues that have multiple names
     * (such as 'XML Debugger plugin' and 'Debugger plugin'). The argument provided to this method should
     * therefor only include instances of Metadata for the same plugin.
     *
     * @param unordered A collection that needs ordering.
     * @return The ordered collection.
     */
    public static List<Metadata> sortByVersionAndReleaseDate( Collection<Metadata> unordered )
    {
        return unordered.stream()
            .sorted((plugin1, plugin2) -> {
                final DefaultArtifactVersion version1 = new DefaultArtifactVersion(plugin1.mavenVersion);
                final DefaultArtifactVersion version2 = new DefaultArtifactVersion(plugin2.mavenVersion);
                final int versionCompare = version2.compareTo(version1);
                if (versionCompare == 0) {
                    // The versions are the same, so use the dates instead
                    if (plugin1.isSnapshot && plugin2.isSnapshot) {
                        return plugin2.snapshotCreationDate.compareTo(plugin1.snapshotCreationDate);
                    } else {
                        return plugin2.releaseDate.compareTo(plugin1.releaseDate);
                    }
                } else {
                    return versionCompare;
                }
            })
            .collect( Collectors.toList() );
    }

    /**
     * Sort a collection of metadata by <ol><li>Version, </li>Release Date</ol> (in that order)
     * and returns the first few results from the ordered result.
     *
     * Note that the name of the plugin is not used. This works around issues that have multiple names
     * (such as 'XML Debugger plugin' and 'Debugger plugin'). The argument provided to this method should
     * therefor only include instances of Metadata for the same plugin.
     *
     * @param unordered A collection that needs ordering.
     * @param max The maximum number of results of the ordered collection to return.
     * @return The ordered collection.
     */
    public static List<Metadata> sortByVersionAndReleaseDate( Collection<Metadata> unordered, final int max )
    {
        return sortByVersionAndReleaseDate( unordered ).stream()
            .limit( max )
            .collect( Collectors.toList());
    }

    public static class Metadata
    {
        // The archive as stored in the Maven repository.
        public final Path mavenFile;

        // The filename as expected by Openfire.
        public final String pluginFileName;
        public final boolean hasReadme;
        public final boolean hasChangelog;
        public final boolean hasIcon;
        public final String iconFileName;

        // The 'canonical' name of the plugin (which is the filename without the file extension)
        public final String pluginName;
        // The lower case of the plugin, to allow for case changes (certificatemanager.jar / certificateManager.jar)
        public final String pluginNameLowerCase;
        public final String humanReadableName;
        public final String humanReadableDescription;
        public final String author;
        public final String licenseType;
        public final String minimumRequiredOpenfireVersion;
        public final String priorToOpenfireVersion;
        // In an ideal world, the plugin version (from the plugin.xml) would match the maven version (from the pom.xml)
        // However, that's not the case, particularly for older plugins, so distinguish between the two.
        public final String pluginVersion;
        public final String mavenVersion;
        public final Date releaseDate;
        public final boolean isRelease;
        public final boolean isSnapshot;
        public final Date snapshotCreationDate;
        public final String snapshotQualifier;

        public Metadata( Path mavenFile ) throws IOException, DocumentException
        {
            this.mavenFile = mavenFile;
            try ( final JarFile archive = new JarFile( mavenFile.toFile() ) )
            {
                this.hasReadme = PluginDownloadServlet.archiveContainsEntry( archive, "readme.html");
                this.hasChangelog = PluginDownloadServlet.archiveContainsEntry( archive, "changelog.html");

                final boolean iconGifExists = PluginDownloadServlet.archiveContainsEntry( archive, "logo_small.gif");
                final boolean iconPngExists = PluginDownloadServlet.archiveContainsEntry( archive, "logo_small.png");
                this.hasIcon = iconGifExists || iconPngExists;
                if ( iconGifExists ) {
                    iconFileName = "logo_small.gif";
                } else if ( iconPngExists ) {
                    iconFileName = "logo_small.png";
                } else {
                    iconFileName = null;
                }

                humanReadableName = PluginDownloadServlet.getMetadataFromPlugin( archive, "/plugin/name" );
                humanReadableDescription = PluginDownloadServlet.getMetadataFromPlugin( archive, "/plugin/description" );
                minimumRequiredOpenfireVersion = PluginDownloadServlet.getMetadataFromPlugin( archive, "/plugin/minServerVersion" );
                priorToOpenfireVersion = PluginDownloadServlet.getMetadataFromPlugin( archive, "/plugin/priorToServerVersion" );
                final String versionText = PluginDownloadServlet.getMetadataFromPlugin( archive, "/plugin/version" );
                if ( versionText != null ) {
                    pluginVersion = versionText.replace( ' ', '-' );
                } else {
                    pluginVersion = null;
                }
                final String dateText = PluginDownloadServlet.getMetadataFromPlugin( archive, "/plugin/date" );

                author = PluginDownloadServlet.getMetadataFromPlugin( archive, "/plugin/author" );
                licenseType = PluginDownloadServlet.getMetadataFromPlugin( archive, "/plugin/licenseType" );

                SimpleDateFormat parser = null;
                String dateStringFormat = null;
                Date result = null;
                if ( dateText != null ) {
                    try
                    {
                        // GH199 - default to ISO if a dash is found in the right spot
                        dateStringFormat = dateText.substring(4, 5).equals('-') ? "yyyy-MM-dd" : "MM/dd/yyyy";
                        parser = new SimpleDateFormat( dateStringFormat );
                        result = parser.parse( dateText );
                    } catch ( Exception e ) {
                        result = null;
                    }
                }
                if (result == null)
                {
                    result = new Date( mavenFile.toFile().lastModified() );
                }
                releaseDate = result;
            }

            // this matches the plugin name (and is easier than parsing the file name itself)
            pluginName = mavenFile.getParent().getParent().getFileName().toString();
            pluginNameLowerCase = pluginName.toLowerCase();
            pluginFileName = pluginName + mavenFile.toString().substring( mavenFile.toString().lastIndexOf('.') );
            mavenVersion = mavenFile.getParent().getFileName().toString();
            isSnapshot = mavenVersion.toUpperCase().endsWith( "-SNAPSHOT" );
            isRelease = !isSnapshot;

            if ( isSnapshot )
            {
                // file format: bookmarks-1.0.1-20181223.093556-1-openfire-plugin-assembly.jar
                final String fileName = mavenFile.getFileName().toString();
                final Matcher snapshotQualifierMatcher = Pattern.compile(".*-(\\d{8}\\.\\d{6}-\\d*).*").matcher(fileName);
                if (snapshotQualifierMatcher.matches()) {
                    snapshotQualifier = snapshotQualifierMatcher.group(1);
                } else {
                    snapshotQualifier = null;
                }
                final Matcher m = Pattern.compile( "[0-9]{8}\\.[0-9]{6}" ).matcher( fileName );
                Date result = null;
                if ( m.find() )
                {
                    final String timestamp = m.group();
                    final SimpleDateFormat parser = new SimpleDateFormat( "yyyyMMdd.hhmmss" );
                    try
                    {
                        result = parser.parse( timestamp );
                    }
                    catch ( ParseException e )
                    {
                        result = null;
                    }
                }
                snapshotCreationDate = result;
            }
            else
            {
                snapshotCreationDate = null;
                snapshotQualifier = "";
            }
        }

        public Path getMavenFile()
        {
            return mavenFile;
        }

        public String getPluginNameLowerCase()
        {
            return pluginNameLowerCase;
        }

        public String getLicenseType()
        {
            return licenseType;
        }

        public String getMavenVersion()
        {
            return mavenVersion;
        }

        public String getPluginName()
        {
            return pluginName;
        }

        public String getPluginFileName()
        {
            return pluginFileName;
        }

        private String getPluginFileNameLowerCase()
        {
            return pluginNameLowerCase;
        }

        public boolean isHasReadme()
        {
            return hasReadme;
        }

        public boolean isHasChangelog()
        {
            return hasChangelog;
        }

        public boolean isHasIcon()
        {
            return hasIcon;
        }

        public String getIconFileName()
        {
            return iconFileName;
        }

        public String getHumanReadableName()
        {
            return humanReadableName;
        }

        public String getHumanReadableDescription()
        {
            return humanReadableDescription;
        }

        public String getMinimumRequiredOpenfireVersion()
        {
            return minimumRequiredOpenfireVersion;
        }

        public String getPriorToOpenfireVersion()
        {
            return priorToOpenfireVersion;
        }

        public String getPluginVersion()
        {
            return pluginVersion;
        }

        public Date getReleaseDate()
        {
            return releaseDate;
        }

        public boolean isRelease()
        {
            return isRelease;
        }

        public boolean isSnapshot()
        {
            return isSnapshot;
        }

        public String getSnapshotQualifier()
        {
            return snapshotQualifier;
        }

        public Date getSnapshotCreationDate()
        {
            return snapshotCreationDate;
        }

        public String getDownloadURL()
        {
            return PLUGINS_PATH + getPluginVersion() + '/' + pluginFileName;
        }

        public String getIconURL()
        {
            if ( !hasIcon ) {
                return null;
            }
            return PLUGINS_PATH + getPluginVersion() + '/' + pluginName + '/' + iconFileName;
        }

        public String getReadmeURL()
        {
            if ( !hasReadme ) {
                return null;
            }
            return PLUGINS_PATH + getPluginVersion() + '/' + pluginName + '/' + "readme.html";
        }

        public String getChangelogURL()
        {
            if ( !hasChangelog ) {
                return null;
            }
            return PLUGINS_PATH + getPluginVersion() + '/' + pluginName + '/' + "changelog.html";
        }

        public String getLicenceType()
        {
            return licenseType;
        }

        public String getAuthor()
        {
            return author;
        }

        public long getFileSize()
        {
            try
            {
                return Files.size( mavenFile );
            }
            catch ( IOException e )
            {
                Log.warn( "Unable to determine file size of {}", mavenFile, e );
                return 0;
            }
        }
    }
}
