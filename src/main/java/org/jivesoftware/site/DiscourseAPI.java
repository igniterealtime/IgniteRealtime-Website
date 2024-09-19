package org.jivesoftware.site;

import org.jivesoftware.webservices.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

public class DiscourseAPI extends HttpServlet
{
    private static final Logger Log = LoggerFactory.getLogger(DiscourseAPI.class);

    private static long CACHE_PERIOD = 30 * 60 * 1000; // 30 minutes

    private static long lastUpdate = 0;

    private static Map<Integer, Long> counts = new Hashtable<>();

    private static String baseUrl;
    private static String apiKey;
    private static RestClient restClient;

    public void init(ServletConfig servletConfig) throws ServletException
    {
        super.init(servletConfig);

        baseUrl = servletConfig.getServletContext().getInitParameter("discourse_baseurl");
        if ( baseUrl == null || baseUrl.isEmpty() )
        {
            baseUrl = "https://discourse.igniterealtime.org/";
        }
        if (!baseUrl.endsWith("/")) {
            baseUrl = baseUrl + "/";
        }

        apiKey = servletConfig.getServletContext().getInitParameter("discourse-api-key");

        restClient = new RestClient();
    }

    public static Long getActiveMembersLast7Days()
    {
        collectTotals();
        if (counts.containsKey(3)) {
            return counts.get(3);
        }
        return null;
    }

    public static Long getNewPostsLast7Days()
    {
        collectTotals();
        if (counts.containsKey(4)) {
            return counts.get(4);
        }
        return null;
    }

    /**
     * Executes a query that's defined in Discourse's Data Explorer. The query is assumed to have a singular, numeric
     * return value.
     *
     * @param queryId Discourse Data Explorer Query identifier
     * @param lastNumberOfDays The value for the 'duration_days' parameter
     * @return the query result, or null if an exception occurred.
     */
    private static Long doSimpleQuery(final int queryId, final int lastNumberOfDays) {
        final Map<String, String> headers = new HashMap<>();
        headers.put("Api-Key", apiKey);
        headers.put("Api-Username", "system");
        final Map<String, String> parameters = new HashMap<>();
        parameters.put("params", "{\"duration_days\":\""+lastNumberOfDays+"\"}");
        parameters.put("explain", "false");
        parameters.put("download", "true");

        try {
            return restClient.post(baseUrl + "admin/plugins/explorer/queries/"+queryId+"/run", headers, parameters).getJSONArray("rows").getJSONArray(0).getLong(0);
        } catch (Throwable t) {
            Log.warn("Unable to interact with Discourse's API.", t);
            return null;
        }
    }

    /**
     * Collects all of the totals from the API. Has a rudimentary caching mechanism
     * so that the queries are only run every CACHE_PERIOD milliseconds.
     */
    private synchronized static void collectTotals() {
        // See if we need to update the totals
        if ((lastUpdate + CACHE_PERIOD) > System.currentTimeMillis()) {
            return;
        }
        lastUpdate = System.currentTimeMillis();

        // Collect the new totals on a background thread since they could take a while
        Thread collectorThread = new Thread(new DiscourseAPI.DownloadStatsRunnable(counts));
        collectorThread.start();
        if (counts.isEmpty()) {
            // Need to wait for the collectorThread to finish since the counts are not initialized yet
            try {
                collectorThread.join();
            }
            catch (Exception e) { Log.info( "An exception occurred while collecting Discourse stats.", e); }
        }
    }

    private static class DownloadStatsRunnable implements Runnable {
        private Map<Integer, Long> counts;

        public DownloadStatsRunnable(Map<Integer, Long> counts) {
            this.counts = counts;
        }

        public void run() {
            Log.info("Retrieving Discourse statistics...");

            Instant start = Instant.now();
            final Map<Integer, Long> results = new HashMap<>();
            final Long a = doSimpleQuery(3, 7);
            if (a != null) {
                results.put(3, a);
            }
            final Long b = doSimpleQuery(4, 7);
            if (b != null) {
                results.put(4, b);
            }
            Log.debug("Queried all Discourse stats in {}", Duration.between(start, Instant.now()));

            // Replace all values in the object used by the website in one go.
            counts.clear();
            counts.putAll(results);

            Log.debug("Retrieved Discourse statistics:");
            results.forEach((key, value) -> Log.debug("- {} : {}", key, value));
        }
    }
}
