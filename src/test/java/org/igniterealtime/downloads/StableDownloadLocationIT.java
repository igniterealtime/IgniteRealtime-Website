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

import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.junit.Test;

import static org.junit.Assert.*;

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
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/bookmarks.jar" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_OK, response.getStatusLine().getStatusCode() );
        assertTrue( response.getFirstHeader( "content-type" ).getValue().startsWith( "application/java-archive" ) );
        assertTrue( response.getFirstHeader( "Content-Disposition" ).getValue().startsWith( "attachment; filename=bookmarks.jar" ) );
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
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/bookmarks/readme.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_OK, response.getStatusLine().getStatusCode() );
        assertTrue( response.getFirstHeader( "content-type" ).getValue().startsWith( "text/html" ) );
        assertNotNull( response.getEntity() );
        assertTrue( EntityUtils.toString( response.getEntity() ).contains( "Bookmarks Plugin Readme" ) );
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
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/bookmarks/changelog.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_OK, response.getStatusLine().getStatusCode() );
        assertTrue( response.getFirstHeader( "content-type" ).getValue().startsWith( "text/html" ) );
        assertNotNull( response.getEntity() );
        assertTrue( EntityUtils.toString( response.getEntity() ).contains( "Bookmarks Plugin Changelog" ) );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/PLUGINNAME.jar,
     * used for the 'latest' version of a particular plugin, properly responds
     * with 404 if the requested plugin does not exist
     */
    @Test
    public void testDownloadOpenfireLatestNonExistingPluginJarIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/this-does-not-exist.jar" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_NOT_FOUND, response.getStatusLine().getStatusCode() );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/PLUGINNAME/readme.html,
     * used for the 'latest' version of a particular plugin, properly responds
     * with 404 if the requested plugin does not exist
     */
    @Test
    public void testDownloadOpenfireLatestNonExistingPluginReadmeIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins//this-does-not-exist/readme.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_NOT_FOUND, response.getStatusLine().getStatusCode() );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/PLUGINNAME/readme.html,
     * used for the 'latest' version of a particular plugin, properly responds
     * with 404 if the requested file (in the plugin) does not exist
     */
    @Test
    public void testDownloadOpenfireLatestPluginNonExistingFileIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/bookmarks/this-does-not-exist.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_NOT_FOUND, response.getStatusLine().getStatusCode() );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/VERSION/PLUGINNAME.jar,
     * used for a specific version of a particular plugin, exposes the plugin
     * JAR file.
     */
    @Test
    public void testDownloadOpenfireSpecificVersionPluginJarIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/1.0.2-SNAPSHOT/bookmarks.jar" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_OK, response.getStatusLine().getStatusCode() );
        assertTrue( response.getFirstHeader( "content-type" ).getValue().startsWith( "application/java-archive" ) );
        assertTrue( response.getFirstHeader( "Content-Disposition" ).getValue().startsWith( "attachment; filename=bookmarks.jar" ) );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/VERSION/PLUGINNAME/readme.html,
     * used for a specific version of a particular plugin, exposes the plugin
     * 'readme' file.
     */
    @Test
    public void testDownloadOpenfireSpecificVersionPluginReadmeIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/1.0.2-SNAPSHOT/bookmarks/readme.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_OK, response.getStatusLine().getStatusCode() );
        assertTrue( response.getFirstHeader( "content-type" ).getValue().startsWith( "text/html" ) );
        assertNotNull( response.getEntity() );
        assertTrue( EntityUtils.toString( response.getEntity() ).contains( "Bookmarks Plugin Readme" ) );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/VERSION/PLUGINNAME/changelog.html,
     * used for a specific version of a particular plugin, exposes the plugin
     * 'changelog' file.
     */
    @Test
    public void testDownloadOpenfireSpecificVersionPluginChangelogIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/1.0.2-SNAPSHOT/bookmarks/changelog.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_OK, response.getStatusLine().getStatusCode() );
        assertTrue( response.getFirstHeader( "content-type" ).getValue().startsWith( "text/html" ) );
        assertNotNull( response.getEntity() );
        assertTrue( EntityUtils.toString( response.getEntity() ).contains( "Bookmarks Plugin Changelog" ) );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/PLUGINNAME.jar,
     * used for the 'latest' version of a particular plugin, properly responds
     * with 404 if the requested plugin does not exist
     */
    @Test
    public void testDownloadOpenfireSpecificVersionNonExistingPluginJarIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/1.0.2-SNAPSHOT/this-does-not-exist.jar" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_NOT_FOUND, response.getStatusLine().getStatusCode() );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/VERSION/PLUGINNAME/readme.html,
     * used for a specific version of a particular plugin, properly responds
     * with 404 if the requested plugin does not exist
     */
    @Test
    public void testDownloadOpenfireSpecificVersionNonExistingPluginReadmeIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/1.0.2-SNAPSHOT/this-does-not-exist/readme.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_NOT_FOUND, response.getStatusLine().getStatusCode() );
    }

    /**
     * Verifies that the location /projects/openfire/plugins/VERSION/PLUGINNAME/readme.html,
     * used for a specific version of a particular plugin, properly responds
     * with 404 if the requested file (in the plugin) does not exist
     */
    @Test
    public void testDownloadOpenfireSpecificVersionPluginNonExistingFileIT() throws Exception
    {
        // Setup test fixture.
        final HttpGet request = new HttpGet( URL_BASE + "projects/openfire/plugins/1.0.2-SNAPSHOT/bookmarks/this-does-not-exist.html" );

        // Execute system under test.
        final CloseableHttpResponse response = HttpClients.createDefault().execute( request );

        // Verify result.
        assertEquals( HttpStatus.SC_NOT_FOUND, response.getStatusLine().getStatusCode() );
    }
}
