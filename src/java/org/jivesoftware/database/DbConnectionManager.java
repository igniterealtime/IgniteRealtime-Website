/**
 * $Revision$
 * $Date$
 *
 * Copyright (C) 1999-2005 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

package org.jivesoftware.database;


import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DbConnectionManager
{
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
                System.err.println( "Unable to instantiate a database connection manager!" );
                ex.printStackTrace();
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
            e.printStackTrace();
        }
        try {
            if (con != null) {
                con.close();
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }


}
