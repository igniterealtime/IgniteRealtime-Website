package org.jivesoftware.webservices;

import net.sf.json.JSONObject;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class RestClient {

    private static final Logger Log = LoggerFactory.getLogger( RestClient.class );

    public JSONObject get(String url) {
        JSONObject result = null;

        HttpClient client = new HttpClient();
        HttpMethod method = new GetMethod(url);

        try {
            // Execute the method.
            int statusCode = client.executeMethod(method);

            if (statusCode != HttpStatus.SC_OK) {
                Log.warn( "Method (for '{}') failed: {}", url, method.getStatusLine() );
            }

            // Deal with the response.
            // Use caution: ensure correct character encoding and is not binary data
            String response = "";
            final InputStream is = method.getResponseBodyAsStream();
            if ( is != null )
            {
                final ByteArrayOutputStream os = new ByteArrayOutputStream();
                final byte[] buffer = new byte[ 4096 ];

                int len;
                while ( ( len = is.read( buffer ) ) > 0 )
                {
                    os.write( buffer, 0, len );
                }
                response = new String( os.toByteArray() );
            }
            response = StringUtils.removeStart(response, "throw 'allowIllegalResourceCall is false.';");
            response = StringUtils.trim(response);

            result = JSONObject.fromObject(response);

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
