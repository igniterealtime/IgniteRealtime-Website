/**
 * $Revision$
 * $Date$
 *
 * Copyright (C) 1999-2006 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

package org.jivesoftware.site;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.XPP3Reader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Iterator;
import java.io.InputStream;

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
    private static Document doc = null;

    /**
     * Returns the current version of a product given its name or <tt>null</tt>
     * if no version information is available. Note that this method call uses
     * cached data for 60 seconds.
     *
     * @param name the product name.
     * @return the version number, or <tt>null</tt> if no version information is available.
     */
    public static synchronized String getVersion(String name) {
        try {
            Document doc = getDocument();
            Element root = doc.getRootElement();
            Iterator iter = root.elementIterator("product");
            while (iter.hasNext()) {
                Element product = (Element)iter.next();
                if (product.attributeValue("name").equals(name)) {
                    return product.attributeValue("version");
                }
            }
        }
        catch (Exception e) {
            Log.warn( "Unable to get version for '{}'.", name, e );
        }
        return null;
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
    public static synchronized String getVersionDate(String name) {
        try {
            Document doc = getDocument();
            Element root = doc.getRootElement();
            Iterator iter = root.elementIterator("product");
            while (iter.hasNext()) {
                Element product = (Element)iter.next();
                if (product.attributeValue("name").equals(name)) {
                    return product.attributeValue("date");
                }
            }
        }
        catch (Exception e) {
            Log.warn( "Unable to get version date for '{}'.", name, e );
        }
        return null;
    }

    private static Document getDocument() throws Exception {
        if (doc == null || cacheDate + 60000 < System.currentTimeMillis()) {
            InputStream in = null;
            try {
                in = Versions.class.getClassLoader().getResourceAsStream("/versions.xml");
                doc = new XPP3Reader().read(in);
                cacheDate = System.currentTimeMillis();
            }
            finally {
                if (in != null) {
                    try {
                        in.close();
                    }
                    catch (Exception e) {
                        Log.warn( "Unable to close stream used to read versions.xml.", e );
                    }
                }
            }
        }
        return doc;
    }

    private Versions() {
        // Not publically instantiable.
    }

}