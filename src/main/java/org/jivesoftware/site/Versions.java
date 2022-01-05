/**
 * Copyright (C) 1999-2006 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

package org.jivesoftware.site;

import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.XPP3Reader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xmlpull.v1.XmlPullParserException;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Returns product version information. All version info is stored in WEB-INF/classes/versions.xml in the
 * following format:
 *
 * <pre>
 * &lt;?xml version="1.0"?&gt;
 * &lt;versions&gt;
 *    &lt;product name="openfire" version="2.5.1" date="7/13/2006" /&gt;
 *    &lt;product name="spark" version="1.1.3" date="4/22/2005" /&gt;
* &lt;/versions&gt;
 * </pre>
 *
 * @author Matt Tucker
 */
public class Versions {

    private final static Logger Log = LoggerFactory.getLogger( Versions.class );
    private static long cacheDate;
    private static Map<String, Product> products = new HashMap<>();

    /**
     * Returns the product information for all products defined in <tt>versions.xml</tt>. Note that this method call
     * uses cached data.
     *
     * @return A list of product names (never null).
     */
    public static synchronized Map<String, Product> getProducts()
    {
        if (products.isEmpty() || cacheDate + 60000 < System.currentTimeMillis())
        {
            try ( InputStream in = Versions.class.getResourceAsStream("/versions.xml") )
            {
                final Iterator<Element> iter = new XPP3Reader().read(in).getRootElement().elementIterator("product");

                final Map<String, Product> update = new HashMap<>();
                while (iter.hasNext())
                {
                    final Element element = iter.next();

                    final String name    = element.attributeValue("name");
                    final String version = element.attributeValue("version");
                    final String date    = element.attributeValue("date");

                    final Product product = new Product( name, version, date );

                    update.put( name, product );
                }

                products = update; // Replace old values with new ones.
                cacheDate = System.currentTimeMillis();
            }
            catch ( XmlPullParserException | DocumentException | IOException e )
            {
                Log.warn( "Unable to load version information from versions.xml.", e );
            }
        }
        return products;
    }

    /**
     * Returns the current version of a product given its name or <tt>null</tt> if no version information is available.
     * Note that this method call uses cached data.
     *
     * @param name the product name.
     * @return the version number, or <tt>null</tt> if no version information is available.
     */
    public static synchronized String getVersion(String name)
    {
        final Product product = getProducts().get( name );
        if ( product == null )
        {
            Log.warn( "Unable to get version for '{}'.", name );
            return null;
        }

        return product.version;
    }

    /**
     * Returns the date the current version of a product was released given its
     * name, or <tt>null</tt> if no date information is available. Note that
     * this method call uses cached data for 60 seconds.
     *
     * @param name the product name.
     * @return the date the product was last released, or <tt>null</tt> if no
     *     release date information is available.
     */
    public static synchronized String getVersionDate(String name)
    {
        final Product product = getProducts().get( name );
        if ( product == null )
        {
            Log.warn( "Unable to get version date for '{}'.", name );
            return null;
        }

        return product.date;
    }

    public static class Product
    {
        public final String name;
        public final String version;
        public final String date;

        public Product( String name, String version, String date )
        {
            this.name = name;
            this.version = version;
            this.date = date;
        }
    }
}
