/*
 * Copyright (C) 2018 Ignite Realtime Foundation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.igniterealtime.downloads;

import org.apache.http.HttpRequest;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

/**
 * The website offers various download locations. To ensure we're not breaking
 * them unintentionally, this integration test verifies the functionality of
 * several of them.
 *
 * @author Guus der Kinderen, guus.der.kinderen@gmail.com
 */
public class StableDownloadLocationIT
{
    private static final String URL_BASE = "http://localhost:8080/";

    /**
     * Verifies that the location /projects/openfire/plugins/PLUGINNAME.jar,
     * used for the 'latest' version of a particular plugin, exposes the plugin
     * JAR file.
     */
    @Test
    public void testDownloadOpenfireLatestPluginJarIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/integrationtesting.jar" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_OK, response.getStatusLine().getStatusCode() );
        assertTrue( response.getFirstHeader( "content-type" ).getValue().startsWith( "application/java-archive" ) );
        assertTrue( response.getFirstHeader( "Content-Disposition" ).getValue().startsWith( "attachment; filename=integrationtesting.jar" ) );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/PLUGINNAME/readme.html,
     * used for the 'latest' version of a particular plugin, exposes the plugin
     * 'readme' file.
     */
    @Test
    public void testDownloadOpenfireLatestPluginReadmeIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/integrationtesting/readme.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_OK, response.getStatusLine().getStatusCode() );
        assertTrue( response.getFirstHeader( "content-type" ).getValue().startsWith( "text/html" ) );
        assertNotNull( response.getEntity() );
        assertTrue( EntityUtils.toString( response.getEntity() ).contains( "Plugin readme" ) );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/PLUGINNAME/changelog.html,
     * used for the 'latest' version of a particular plugin, exposes the plugin
     * 'changelog' file.
     */
    @Test
    public void testDownloadOpenfireLatestPluginChangelogIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/integrationtesting/changelog.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_OK, response.getStatusLine().getStatusCode() );
        assertTrue( response.getFirstHeader( "content-type" ).getValue().startsWith( "text/html" ) );
        assertNotNull( response.getEntity() );
        assertTrue( EntityUtils.toString( response.getEntity() ).contains( "Plugin changelog" ) );
    }
}
