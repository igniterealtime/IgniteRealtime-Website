package org.jivesoftware.webservices;

import org.apache.hc.client5.http.impl.cache.CacheConfig;
import org.apache.hc.client5.http.impl.cache.CachingHttpClients;
import org.apache.hc.client5.http.impl.classic.*;
import org.apache.hc.core5.http.*;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.support.ClassicRequestBuilder;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class RestClient {

    private static final Logger Log = LoggerFactory.getLogger( RestClient.class );

    private static final CacheConfig cacheConfig = CacheConfig.custom()
        .setMaxObjectSize(250_000L) // The RSS feeds' JSON is easily 100k.
        .setMaxCacheEntries(250) // prevent the default amount of 1000 entries to be cached, when they _can_ be 250k each.
        .build();

    public JSONObject get(String url) {
        JSONObject result = null;

        try (final CloseableHttpClient httpclient = CachingHttpClients.custom().setCacheConfig(cacheConfig).build())
        {
            final ClassicHttpRequest httpGet = ClassicRequestBuilder.get(url).build();
            result = httpclient.execute(httpGet, response -> {
                try {
                    return new JSONObject(EntityUtils.toString(response.getEntity()));
                } catch (JSONException e) {
                    Log.warn("Invalid content while querying '{}'", url, e);
                    return null;
                }
            });
        } catch (IOException e) {
            Log.warn("Fatal transport error while querying '{}'", url, e);
        }

        return result;
    }
}
