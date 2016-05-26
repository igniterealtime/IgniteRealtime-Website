package org.jivesoftware.webservices;

import net.sf.json.JSONObject;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.lang.StringUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class RestClient {


    public JSONObject get(String url) {
        JSONObject result = null;

        HttpClient client = new HttpClient();
        HttpMethod method = new GetMethod(url);

        try {
            // Execute the method.
            int statusCode = client.executeMethod(method);

            if (statusCode != HttpStatus.SC_OK) {
                System.err.println("Method failed: " + method.getStatusLine());
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
            System.err.println("Fatal protocol violation: " + e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            System.err.println("Fatal transport error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Release the connection.
            method.releaseConnection();
        }

        return result;
    }

}
