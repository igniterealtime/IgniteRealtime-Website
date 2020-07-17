<?xml version="1.0" encoding="UTF-8"?>
<%@ page import="java.util.Date,
                 java.text.DateFormat,
                 java.text.SimpleDateFormat,
                 org.jivesoftware.site.DownloadStats,
                 org.jivesoftware.site.DownloadServlet, java.text.NumberFormat"
%>
<%--
An RSS feed for download statistics.
--%>
<%@ page contentType="text/xml;charset=UTF-8" language="java" %>

<rss version="2.0" xmlns:ignite="http://www.igniterealtime.org/xmlns/downloadstats/rss">

    <%!
        /**
         * The date format used for dates - this is the RFC 822 date format. Example output:
         * <tt>Wed, 02 Oct 2002 08:00:00 -0800</tt>
         */
        public static final String DATE_FORMAT = "EEE, dd MMM yyyy HH:mm:ss Z";
        public static final DateFormat DATE_FORMATTER= new SimpleDateFormat(DATE_FORMAT);

        /**
         * The number formatter in the form of 12,345.
         */
        public static final NumberFormat NUMBER_FORMATTER = NumberFormat.getNumberInstance();

        /**
         * The update frequency, in milliseconds.
         */
        public static final long UPDATE_FREQUENCY = 30 * 60 * 1000; // 30 minutes

        /**
         * The epoch time of the last update to the data.
         */
        public static long lastUpdate = 0;

        /**
         * The data for the feed.
         */
        public static long totalDownloads = 0L;
        public static long openfireDownloads = 0L;
        public static long sparkDownloads = 0L;
        public static long smackDownloads = 0L;
        public static long tinderDownloads = 0L;
        public static long xiffDownloads = 0L;
        public static long whackDownloads = 0L;
        public static long sparkwebDownloads = 0L;
        public static String dateString = DATE_FORMATTER.format(new Date());

    %>

    <%
        // Update the feed data if the data is older than the update frequency
        if ((lastUpdate + UPDATE_FREQUENCY) < System.currentTimeMillis()) {
            lastUpdate = System.currentTimeMillis();
            totalDownloads = DownloadStats.getTotalDownloads();
            openfireDownloads = DownloadStats.getDownloadsForType(DownloadServlet.DownloadInfo.openfire);
            sparkDownloads = DownloadStats.getDownloadsForType(DownloadServlet.DownloadInfo.spark);
            sparkwebDownloads = DownloadStats.getDownloadsForType(DownloadServlet.DownloadInfo.sparkweb);
            smackDownloads = DownloadStats.getDownloadsForType(DownloadServlet.DownloadInfo.smack);
            tinderDownloads = DownloadStats.getDownloadsForType(DownloadServlet.DownloadInfo.tinder);
            whackDownloads = DownloadStats.getDownloadsForType(DownloadServlet.DownloadInfo.whack);
            xiffDownloads = DownloadStats.getDownloadsForType(DownloadServlet.DownloadInfo.xiff);
            dateString = DATE_FORMATTER.format(new Date());
        }
    %>

    <channel>
        <title>Download Statistics for IgniteRealtime.org</title>
        <link>https://igniterealtime.org/rss/downloadstats.jsp</link>
        <language>en</language>
        <generator>igniterealtime.org</generator>
        <pubDate><%= dateString %></pubDate>

        <item>
            <title>Download Statistics for IgniteRealtime.org</title>
            <description><![CDATA[
                <table>
                    <thead>
                        <tr>
                        <th>Project</th>
                        <th>Downloads</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Total</td>
                        <td><%= NUMBER_FORMATTER.format(totalDownloads) %></td>
                        </tr>
                        <tr>
                        <td>Openfire</td>
                        <td><%= NUMBER_FORMATTER.format(openfireDownloads) %></td>
                        </tr>
                        <tr>
                        <td>Spark</td>
                        <td><%= NUMBER_FORMATTER.format(sparkDownloads) %></td>
                        </tr>
                        <tr>
                        <td>SparkWeb</td>
                        <td><%= NUMBER_FORMATTER.format(sparkwebDownloads) %></td>
                        </tr>
                        <tr>
                        <td>Smack</td>
                        <td><%= NUMBER_FORMATTER.format(smackDownloads) %></td>
                        </tr>
                        <tr>
                        <td>Tinder</td>
                        <td><%= NUMBER_FORMATTER.format(tinderDownloads) %></td>
                        </tr>
                        <tr>
                        <td>Whack</td>
                        <td><%= NUMBER_FORMATTER.format(whackDownloads) %></td>
                        </tr>
                        <tr>
                        <td>XIFF</td>
                        <td><%= NUMBER_FORMATTER.format(xiffDownloads) %></td>
                        </tr>
                    </tbody>
                </table>
            ]]></description>
            
            <ignite:totalDownloads><%= NUMBER_FORMATTER.format(totalDownloads) %></ignite:totalDownloads>
            <ignite:openfireDownloads><%= NUMBER_FORMATTER.format(openfireDownloads) %></ignite:openfireDownloads>
            <ignite:sparkDownloads><%= NUMBER_FORMATTER.format(sparkDownloads) %></ignite:sparkDownloads>
            <ignite:sparkwebDownloads><%= NUMBER_FORMATTER.format(sparkwebDownloads) %></ignite:sparkwebDownloads>
            <ignite:smackDownloads><%= NUMBER_FORMATTER.format(smackDownloads) %></ignite:smackDownloads>
            <ignite:tinderDownloads><%= NUMBER_FORMATTER.format(tinderDownloads) %></ignite:tinderDownloads>
            <ignite:whackDownloads><%= NUMBER_FORMATTER.format(whackDownloads) %></ignite:whackDownloads>
            <ignite:xiffDownloads><%= NUMBER_FORMATTER.format(xiffDownloads) %></ignite:xiffDownloads>
        </item>

    </channel>
</rss>
