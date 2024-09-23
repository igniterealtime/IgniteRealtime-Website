package org.jivesoftware.webservices;

import org.apache.hc.client5.http.impl.cache.CacheConfig;
import org.apache.hc.client5.http.impl.cache.CachingHttpClients;
import org.apache.hc.client5.http.impl.classic.*;
import org.apache.hc.core5.http.*;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.support.ClassicRequestBuilder;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;

public class RestClient {

    private static final Logger Log = LoggerFactory.getLogger( RestClient.class );

    private static final CacheConfig cacheConfig = CacheConfig.custom()
        .setMaxObjectSize(250_000L) // The RSS feeds' JSON is easily 100k.
        .setMaxCacheEntries(250) // prevent the default amount of 1000 entries to be cached, when they _can_ be 250k each.
        .build();

    public JSONObject get(String url) {
        return get(url, null);
    }

    public JSONObject get(String url, Map<String, String> headers)
    {
        try {
            final String result = getAsString(url, headers);
            if (result == null) {
                return null;
            }
            return new JSONObject(result);
        } catch (JSONException e) {
            Log.warn("Invalid content while querying '{}' for a JSON Object", url, e);
            return null;
        }
    }

    public JSONArray getAsArray(String url, Map<String, String> headers)
    {
        try {
            final String result = getAsString(url, headers);
            if (result == null) {
                return null;
            }
            return new JSONArray(result);
        } catch (JSONException e) {
            Log.warn("Invalid content while querying '{}' for a JSON Array", url, e);
            return null;
        }
    }

    public String getAsString(String url, Map<String, String> headers) {

        try (final CloseableHttpClient httpclient = CachingHttpClients.custom().setCacheConfig(cacheConfig).build())
        {
            final ClassicRequestBuilder builder = ClassicRequestBuilder.get(url);
            if (headers != null) {
                for (Map.Entry<String, String> header : headers.entrySet()) {
                    builder.addHeader(header.getKey(), header.getValue());
                }
            }

            final ClassicHttpRequest httpGet = builder.build();
            return httpclient.execute(httpGet, response -> EntityUtils.toString(response.getEntity()));
        } catch (IOException e) {
            Log.warn("Fatal transport error while querying '{}'", url, e);
        }

        return null;
    }

    public JSONObject post(String url, Map<String, String> headers, Map<String, String> parameters)
    {
        JSONObject result = null;

        try (final CloseableHttpClient httpclient = CachingHttpClients.custom().setCacheConfig(cacheConfig).build())
        {
            final ClassicRequestBuilder builder = ClassicRequestBuilder.post(url);
            if (headers != null) {
                for (Map.Entry<String, String> header : headers.entrySet()) {
                    builder.addHeader(header.getKey(), header.getValue());
                }
            }
            if (parameters != null) {
                for (Map.Entry<String, String> entry : parameters.entrySet()) {
                    builder.addParameter(entry.getKey(), entry.getValue());
                }
            }
            final ClassicHttpRequest httpPost = builder.build();
            result = httpclient.execute(httpPost, response -> {
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
