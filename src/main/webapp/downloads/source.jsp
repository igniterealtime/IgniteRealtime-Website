<%@ page import="org.jivesoftware.site.Versions, java.io.File, java.text.SimpleDateFormat, java.util.Date, java.text.DecimalFormat"%>
<%@ page import="java.nio.file.Paths" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

<html>
<head>
<title>Source Code</title>
<meta name="body-id" content="downloads" />
<style type="text/css" media="screen">
    @import "../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="index.jsp">Releases</a></li>
            <li id="subnav02"><a href="source.jsp" class="ignite_subnav_current">Source</a></li>
            <li id="subnav03"><a href="beta.jsp">Beta Releases</a></li>
            <li id="subnav04"><a href="../projects/openfire/plugins.jsp">Openfire Plugins</a></li>
        </ul>
    </div>

    <!-- BEGIN body area -->
    <div id="ignite_body">
        
        <!-- BEGIN left column (main content) -->
        <div id="ignite_body_leftcol">
            
            <!-- BEGIN body content area -->
            <div id="ignite_int_body">
            
                <!-- BEGIN body header -->
                <div id="ignite_body_header">
                    <h1>Downloads</h1> <strong>Source Code</strong>
                </div>
                <!-- END body header -->

                <div class="ignite_int_body_padding">

                    <p>
                        The source code for all of our products is made available on the
                        <a href="https://github.com/igniterealtime">Ignite Realtime GitHub</a> pages.
                    </p>

                    <p>
                        We welcome your contribution! If you'd like to contribute, please create a pull request with
                        your changes for the relevant project.
                    </p>

                    <p>
                        For your convenience, several source code archives have been made available in the table below.
                        Note that these files could lag behind a little. For the most up-to-date sources, please visit
                        our GitHub pages.
                    </p>
                </div>

                <div class="ignite_download_panel ignite_download_source_panel">
                    <%
                    String path = request.getContextPath();
                    String buildsPath = application.getInitParameter("builds-path");
                    DecimalFormat formatter = new DecimalFormat("0.00");
                    SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM d, yyyy");

                    for ( final Versions.Product product : Versions.getProducts().values() )
                    {
                        final String ver = product.version.replace('.', '_');
                        final File srcZip = Paths.get( buildsPath, product.name, product.name + "_src_" + ver + ".zip" ).toFile();
                        final File srcTar = Paths.get( buildsPath, product.name, product.name + "_src_" + ver + ".tar.gz" ).toFile();
                        if ( !srcZip.exists() || !srcTar.exists() ) {
                            continue;
                        }
                    %>

                        <div class="ignite_download_panel_label">
                            <h4 style="text-transform: capitalize"><%=product.name%> Source</h4>
                        </div>

                        <div class="ignite_download_item_odd">
                            <span class="ignite_download_item_details">
                                <img src="../images/icon_zip.gif" alt="" width="17" height="16" border="0">
                                <a href="<%= path %>/downloads/download-landing.jsp?file=<%=product.name%>/<%= srcZip.getName() %>"><%= srcZip.getName() %></a>
                            </span>
                            <span class="ignite_download_item_date"><%= dateFormat.format( new Date( srcZip.lastModified() ) ) %></span>
                            <span class="ignite_download_item_size"><%= formatter.format( srcZip.length()/1024.0/1024.0) %> MB</span>
                        </div>

                        <div class="ignite_download_item_even">
                            <span class="ignite_download_item_details">
                                <img src="../images/icon_zip.gif" alt="" width="17" height="18" border="0">
                                <a href="<%= path %>/downloads/download-landing.jsp?file=<%=product.name%>/<%= srcTar.getName() %>"><%= srcTar.getName() %></a>
                            </span>
                            <span class="ignite_download_item_date"><%= dateFormat.format( new Date( srcTar.lastModified() ) ) %></span>
                            <span class="ignite_download_item_size"><%= formatter.format(srcTar.length()/1024.0/1024.0) %> MB</span>
                        </div>
                <% } %>
                </div>

            </div>
            <!-- END body content area -->

        </div>
        <!-- END left column (main content) -->

        <!-- BEGIN right column (sidebar) -->
        <div id="ignite_body_rightcol">

            <%@ include file="/includes/sidebar_enterprise.jspf" %>
            <%@ include file="/includes/sidebar_48hrsnapshot.jspf" %>
            <%@ include file="/includes/sidebar_testimonial.jspf" %>
            
        </div>
        <!-- END right column (sidebar) -->
    
    </div>
    <!-- END body area -->

</body>
</html>
