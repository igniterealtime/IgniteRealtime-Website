/**
 * $Revision$
 * $Date$
 *
 * Copyright (C) 1999-2005 Jive Software. All rights reserved.
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

package org.jivesoftware.database;

import org.apache.commons.dbcp.ConnectionFactory;
import org.apache.commons.dbcp.DriverManagerConnectionFactory;
import org.apache.commons.dbcp.PoolableConnectionFactory;
import org.apache.commons.dbcp.PoolingDataSource;
import org.apache.commons.pool.ObjectPool;
import org.apache.commons.pool.impl.GenericObjectPool;

import javax.sql.DataSource;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * 
 */
public class DbConnectionManager {
    private DataSource dataSource;
    private ObjectPool connectionPool;

    private static DbConnectionManager singleton;
    private static final Object LOCK = new Object();


    /**
     * Returns the singleton instance of <CODE>DbConnectionManager</CODE>,
     * creating it if necessary.
     * <p/>
     *
     * @return the singleton instance of <Code>DbConnectionManager</CODE>
     */
    public static DbConnectionManager getInstance() {
        // Synchronize on LOCK to ensure that we don't end up creating
        // two singletons.
        synchronized (LOCK) {
            if (null == singleton) {
                DbConnectionManager controller = new DbConnectionManager();
                singleton = controller;
                return controller;
            }
        }
        return singleton;
    }

    public DbConnectionManager() {
    }

    public void setupDataSource(String dbString, String username, String password) {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        }
        catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        String connectURI = dbString + "?user=" + username + "&password=" + password;


        connectionPool = new GenericObjectPool(null);

        ConnectionFactory connectionFactory = new DriverManagerConnectionFactory(connectURI, null);

        new PoolableConnectionFactory(connectionFactory, connectionPool, null, null, false, true);

        dataSource = new PoolingDataSource(connectionPool);
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public void returnConnection(Connection conn) throws Exception {
        connectionPool.returnObject(conn);
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
