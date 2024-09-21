package org.jivesoftware.site;

import org.jivesoftware.webservices.RestClient;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

public class GitHubAPI extends HttpServlet
{
    private static final Logger Log = LoggerFactory.getLogger(GitHubAPI.class);

    private static long CACHE_PERIOD = 30 * 60 * 1000; // 30 minutes

    private static long lastUpdate = 0;

    private static Map<String, Long> counts = new Hashtable<>();

    private static RestClient restClient;

    private static final String TOTAL = "TOTAL";

    public void init(ServletConfig servletConfig) throws ServletException
    {
        super.init(servletConfig);

        restClient = new RestClient();
    }

    public static Long getTotalCommitCountLastWeek()
    {
        collectTotals();
        if (counts.containsKey(TOTAL)) {
            return counts.get(TOTAL);
        }
        return null;
    }

    public static Long getCommitCountLastWeek(final String repoName)
    {
        collectTotals();
        if (counts.containsKey(repoName.toLowerCase())) {
            return counts.get(repoName.toLowerCase());
        }
        return null;
    }

    public static Long getCommitCountLastWeekPartialName(final String partialRepoName)
    {
        collectTotals();

        long result = 0L;
        for (final Map.Entry<String, Long> entry : counts.entrySet()) {
            if (entry.getKey().toLowerCase().contains(partialRepoName.toLowerCase()) && !entry.getKey().equals(TOTAL) ) {
                result += entry.getValue();
            }
        }
        return result;
    }

    /**
     * Retrieves last week's commit count of a repository on GitHub.
     *
     * @param repo The name of the repository without the .git extension. The name is not case sensitive.
     * @return the query result, or null if an exception occurred.
     * @see <a href="https://docs.github.com/en/rest/metrics/statistics?apiVersion=2022-11-28#get-the-weekly-commit-count">https://docs.github.com/en/rest/metrics/statistics?apiVersion=2022-11-28#get-the-weekly-commit-count</a>
     */
    private static Long getLastWeekCommitCount(final String repo) {
        final Map<String, String> headers = new HashMap<>();
        headers.put("Accept", "application/vnd.github+json");
        headers.put("X-GitHub-Api-Version", "2022-11-28");

        // TODO The current implementation may retrieve _last_ weeks activity, instead of this weeks (the last 7 days). Find a way to count commits in the last 7 days.
        try {
            final JSONArray all = restClient.get("https://api.github.com/repos/igniterealtime/" + repo + "/stats/participation", headers).getJSONArray("all");
            return all.getLong(all.length() - 1);
        } catch (Throwable t) {
            Log.warn("Unable to interact with GitHub's API.", t);
            return null;
        }
    }

    /**
     * Returns the names of all public repositories in our GitHub organisation.
     *
     * @return names for all public repositories.
     * @see <a href="https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-organization-repositories">https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-organization-repositories</a>
     */
    private static Set<String> getRepositoryNames() {
        final Map<String, String> headers = new HashMap<>();
        headers.put("Accept", "application/vnd.github+json");
        headers.put("X-GitHub-Api-Version", "2022-11-28");

        try {
            final Set<String> results = new HashSet<>();
            for (int page = 1; page <= 10; page++) {
                final JSONArray pagedData = restClient.getAsArray("https://api.github.com/orgs/igniterealtime/repos?type=public&sort=pushed&per_page=100&page=" + page, headers);
                if (pagedData == null || pagedData.isEmpty()) {
                    break;
                }
                for (int i = 0; i < pagedData.length(); i++) {
                    results.add(pagedData.getJSONObject(i).getString("name"));

                    // TODO Authenticate these requests to unlock better rate limits, allowing us to pull from _all_ repos! We'll now settle for the last few active repos, but that's not ideal.
                    if (results.size() >= 10) {
                        break;
                    }
                }
            }
            return results;
        } catch (Throwable t) {
            Log.warn("Unable to interact with GitHub's API.", t);
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
        Thread collectorThread = new Thread(new GitHubAPI.DownloadStatsRunnable(counts));
        collectorThread.start();
        if (counts.isEmpty()) {
            // Need to wait for the collectorThread to finish since the counts are not initialized yet
            try {
                collectorThread.join();
            }
            catch (Exception e) { Log.info( "An exception occurred while collecting GitHub stats.", e); }
        }
    }

    private static class DownloadStatsRunnable implements Runnable {
        private Map<String, Long> counts;

        public DownloadStatsRunnable(Map<String, Long> counts) {
            this.counts = counts;
        }

        public void run() {
            Log.debug("Retrieving GitHub statistics...");

            Instant start = Instant.now();
            final Map<String, Long> results = new HashMap<>();
            final Set<String> repoNames = getRepositoryNames();
            if (repoNames != null) {
                repoNames.forEach(repo -> results.put(repo.toLowerCase(), getLastWeekCommitCount(repo)));
            }
            final Long total = results.values().stream().filter(Objects::nonNull).mapToLong(Long::longValue).sum();
            results.put(TOTAL, total);

            Log.info("Queried all GitHub stats in {}", Duration.between(start, Instant.now()));

            // Replace all values in the object used by the website in one go.
            counts.clear();
            counts.putAll(results);

            Log.debug("Retrieved GitHub statistics:");
            results.forEach((key, value) -> Log.debug("- {} : {}", key, value));
        }
    }
}
