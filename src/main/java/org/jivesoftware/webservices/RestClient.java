package org.jivesoftware.webservices;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class RestClient {

    private static final Logger Log = LoggerFactory.getLogger( RestClient.class );

    public JSONObject get(String url) {
        JSONObject result = null;

        HttpClient client = new HttpClient();
        HttpMethod method = new GetMethod(url);

        try
        {
            // Execute the method.
            int statusCode = client.executeMethod( method );

            if ( statusCode != HttpStatus.SC_OK )
            {
                Log.warn( "Method (for '{}') failed: {}", url, method.getStatusLine() );
            }

            // Deal with the response.
            // Use caution: ensure correct character encoding and is not binary data
            String response = method.getResponseBodyAsString();
            result = new JSONObject(response);
        } catch (JSONException e ) {
            Log.warn( "Invalid content while querying '{}'", url, e );
        } catch (HttpException e) {
            Log.warn( "Fatal protocol violation while querying '{}'", url, e );
        } catch (IOException e) {
            Log.warn( "Fatal transport error while querying '{}'", url, e );
        } finally {
            method.releaseConnection();
        }

        return result;
    }

}
