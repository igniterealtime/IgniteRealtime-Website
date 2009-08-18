package org.jivesoftware.site;

import com.sun.syndication.fetcher.impl.FeedFetcherCache;
import com.sun.syndication.fetcher.impl.HashMapFeedInfoCache;
import com.sun.syndication.fetcher.impl.HttpURLFeedFetcher;
import com.sun.syndication.fetcher.FeedFetcher;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;

import java.util.List;
import java.net.URL;

/**
 * FeedManager
 * Created: Aug 18, 2009 2:03:16 PM
 *
 * @author benjamin
 */
public class FeedManager {

    private static FeedManager manager;

    private FeedFetcherCache feedInfoCache;
    private FeedFetcher feedFetcher;

    static {

        manager = new FeedManager();
    }

    private FeedManager() {
        feedInfoCache = HashMapFeedInfoCache.getInstance();
        feedFetcher = new HttpURLFeedFetcher(feedInfoCache);
    }

    public static FeedManager getInstance() {
        return manager;
    }

    public List<SyndEntry> getBlogFeedEntries(String feedUrl) {
        try {
            SyndFeed feed = feedFetcher.retrieveFeed(new URL(feedUrl));
            if (null != feed) {
                return (List<SyndEntry>)feed.getEntries();
            }
        } catch (Exception e) {
            System.out.println("Problem getting Community Blog RSS feed.");
        }
        return null;
    }

}
