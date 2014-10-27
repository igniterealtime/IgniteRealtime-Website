package org.jivesoftware.webservices;

import net.sf.json.JSON;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.lang.StringUtils;

import java.io.IOException;

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
            String response = new String(method.getResponseBody());
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
