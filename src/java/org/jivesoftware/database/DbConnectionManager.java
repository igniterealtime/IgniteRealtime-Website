/**
 * $Revision$
 * $Date$
 *
 * Copyright (C) 1999-2005 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

package org.jivesoftware.database;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DbConnectionManager
{
    private final static Logger Log = LoggerFactory.getLogger( DbConnectionManager.class );

    private final DataSource dataSource;

    private static DbConnectionManager singleton;

    /**
     * Returns the singleton instance of <CODE>DbConnectionManager</CODE>,
     * creating it if necessary.
     * <p/>
     *
     * @return the singleton instance of <Code>DbConnectionManager</CODE>
     */
    public static synchronized DbConnectionManager getInstance() {
        if (null == singleton) {
            try
            {
                singleton = new DbConnectionManager();
            }
            catch ( NamingException ex )
            {
                Log.error( "Unable to instantiate a database connection manager!", ex );
                singleton = null;
            }
        }
        return singleton;
    }

    private DbConnectionManager() throws NamingException
    {

        Context initContext = new InitialContext();
        Context envContext  = (Context)initContext.lookup("java:/comp/env");
        dataSource = (DataSource)envContext.lookup("jdbc/stats");
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public static void close(PreparedStatement pstmt, Connection con) {
        try {
            if (pstmt != null) {
                pstmt.close();
            }
        }
        catch (Exception e) {
            Log.warn( "Unable to close prepared statement.", e );
        }
        try {
            if (con != null) {
                con.close();
            }
        }
        catch (Exception e) {
            Log.warn( "Unable to close (release it back to the pool) connection.", e );
        }
    }


}
