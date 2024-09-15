package org.jivesoftware.site;

import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.fetcher.FeedFetcher;
import com.sun.syndication.fetcher.impl.HashMapFeedInfoCache;
import com.sun.syndication.fetcher.impl.HttpURLFeedFetcher;
import org.jivesoftware.webservices.RestClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URL;
import java.net.URLEncoder;
import java.util.*;
import java.util.stream.Collectors;

/**
 * FeedManager
 * Created: Aug 18, 2009 2:03:16 PM
 *
 * @author benjamin, Guus
 */
public class FeedManager {

    private static final Logger Log = LoggerFactory.getLogger( FeedManager.class );
    private static FeedManager manager;
    private RestClient restClient = new RestClient();

    private FeedFetcher feedFetcher;

    static {
        manager = new FeedManager();
    }

    private FeedManager() {
        feedFetcher = new HttpURLFeedFetcher(HashMapFeedInfoCache.getInstance());
    }

    public static FeedManager getInstance() {
        return manager;
    }

    public List<SyndEntry> getBlogFeedEntries(String baseUrl, String feedUrl) {
        try {
            SyndFeed feed = feedFetcher.retrieveFeed(new URL(baseUrl + "/" + feedUrl ));
            if (null != feed) {
                return (List<SyndEntry>)feed.getEntries().stream().filter(Objects::nonNull).collect(Collectors.toList());
            }
        } catch (Exception e) {
            Log.warn("Problem getting Community Blog RSS feed '{}'.", baseUrl + "/" + feedUrl, e);
        }
        return Collections.emptyList();
    }

    public List<SummaryFeedItem> getItems( String baseUrl, String feedUrl, int max )
    {
        return getTaggedItems(baseUrl, feedUrl, null, max);
    }

    public List<SummaryFeedItem> getTaggedItems( String baseUrl, String feedUrl, String tag, int max )
    {
        final List<SummaryFeedItem> result = new ArrayList<>( max );

        final List<SyndEntry> entries = getBlogFeedEntries( baseUrl, feedUrl );
        for (final SyndEntry entry : entries) {
            if (entry == null) {
                continue;
            }
            final JSONObject json = getJSON(entry.getLink());
            if (json == null) {
                continue;
            }
            final FeedItem item = new FeedItem(json);
            if (tag != null && !tag.isBlank()) {
                if (Arrays.stream(item.getTags()).anyMatch(t -> t.equalsIgnoreCase(tag))) {
                    result.add(item);
                }
            } else {
                result.add(item);
            }
            if (result.size() >= max) {
                break;
            }
        }
        return result;
    }

    public List<SummaryFeedItem> getSummaryItems( String baseUrl, String feedUrl, int max )
    {
        final List<SummaryFeedItem> result = new ArrayList<>( max );

        final List<SyndEntry> entries = getBlogFeedEntries( baseUrl, feedUrl );
        for ( int i=0; i < entries.size() && i < max; i++ )
        {
            result.add( new SummaryFeedItem( getJSON( entries.get( i ).getLink() ) ) );
        }

        return result;
    }

    public JSONObject getJSON( String link )
    {
        if ( !link.toLowerCase().endsWith( ".json" ) )
        {
            link += ".json";
        }

        return restClient.get( link );
    }

    public String getAvatarUrl( String baseUrl, SummaryFeedItem item, String size )
    {
        try
        {
            final String userEndpoint = String.format( "%s/users/%s.json", baseUrl, URLEncoder.encode( item.authorUsername, "UTF8" ));
            final JSONObject userJson = restClient.get( userEndpoint );
            if ( userJson != null && userJson.has( "user" ) )
            {
                String template = userJson.getJSONObject( "user" ).getString( "avatar_template" );
                if ( template != null && !template.isEmpty() )
                {
                    return baseUrl + template.replace( "{size}", size );
                }
            }
        }
        catch ( Exception e )
        {
            Log.warn("Problem getting avatar.", e);
        }
        return "";
    }
}
