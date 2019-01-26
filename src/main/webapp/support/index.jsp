<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="org.jivesoftware.webservices.RestClient" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ taglib uri="http://www.opensymphony.com/oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

<html>
<head>
<title>Support</title>
<meta name="body-id" content="support" />
<style type="text/css" media="screen">
    @import "../styles/interior.css";
</style>
</head>
<body>

    <div id="ignite_subnav">
        <ul>
            <li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Support</a></li>
            <%--<li id="subnav02"><a href="articles.jsp">Articles</a></li>--%>
            <li id="subnav03"><a href="group_chat.jsp">Group Chat</a></li>
            <li id="subnav04"><a href="http://issues.igniterealtime.org/secure/Dashboard.jspa">Issue Tracker</a></li>
            <li id="subnav05"><a href="service_providers.jsp">Professional Partners</a></li>
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
                    <h1>Support</h1>
                </div>
                <!-- END body header -->
                
                <div id="ignite_support_findprovider">
                    <img src="../images/ignite_support_profsupport.gif" alt="" width="203" height="27" border="0">
                    <p>If you need professional support or services see our <a href="service_providers.jsp">directory of professional partners</a>.</p>
                </div>
                    
                <!--<div id="ignite_support_main">
                <%
                    String baseUrl = config.getServletContext().getInitParameter("csc_baseurl");
                    String restBaseUrl = baseUrl+"/api/core/v3";
                    String recentMessagesUrl = restBaseUrl +"/contents/recent?filter=type(discussion)&count=4";
                    String allThreadsUrl = baseUrl+"/content?filterID=all~objecttype~objecttype[thread]";
                %>
                    <!-- BEGIN search -->
                    <div id="ignite_support_search">
                        <strong>Search the community:</strong>
                        <form action="<%= baseUrl %>/search.jspa">
                        <input type="text" name="q" size="40" maxlength="100">
                        <input type="image" src="../images/ignite_support_searchbtn.gif" name="Submit" class="ignite_support_search">
                        </form>
                    </div>
                    <!-- END support -->
                    
                    <!-- BEGIN recent support activity block -->
                    <div id="ignite_support_activity">
                    
                        <div>
                            <div id="ignite_support_activity_forums">
                                <h4>Recent Support Discussions</h4>
                                <cache:cache time="60" key="<%= recentMessagesUrl %>">
                            <% try { %>
                            <%
                                RestClient client = new RestClient();
                                JSONObject result = client.get(recentMessagesUrl);
                                JSONArray messages = result.getJSONArray("list");

                                for (Object messageObject : messages) {
                                    if (! (messageObject instanceof JSONObject)) {
                                        continue;
                                        // skip non-JSONObject
                                    }
                                    JSONObject message = (JSONObject)messageObject;

                                    JSONObject author = message.getJSONObject("author");
                                    String authorAvatarUrl = author.getJSONObject("resources").getJSONObject("avatar").getString("ref");
                                    String authorName = author.getString("displayName");
                                    String messageUrl = message.getJSONObject("resources").getJSONObject("html").getString("ref");
                                    String subject = message.getString("subject");

                                %>
                                    <div class="discussion">
                                        <img src="<%= authorAvatarUrl %>" width="16" height="16" alt="" />
                                            <b><%= authorName %></b> in
                                            "<a href='<%= messageUrl %>'><%= subject %></a>"
                                    </div>
                                <% } %>
                            <% } catch (Exception e) { %>
                                <cache:usecached />
                            <% } %>
                                </cache:cache>
                                <strong><a href="<%= allThreadsUrl %>" class="ignite_link_arrow">See all support discussions</a></strong>
                            </div>	
                            <div id="ignite_support_activity_articles">
                                <h4>Recent Articles</h4>
                                <div class="articles"><a href="articles/motd_plugin.jsp">Openfire Plugin Development: Message of the Day</a></div>
                                <div class="articles"><a href="articles/pubsub.jsp">All About Pubsub</a></div>
                                <div class="articles"><a href="articles/sparkplug_day.jsp">Sparkplug Day</a></div>
                                <div class="articles"><a href="articles/filetransfer.jsp">IM File Transfer Made Easy</a></div>
                                <div class="articles"><a href="articles/openfire_optimization.jsp">Behind the Scenes: Openfire Optimization</a></div>
                                        <strong><a href="articles.jsp" class="ignite_link_arrow">See all support documents</a></strong>
                            </div>
                            <div id="ignite_support_activity_documentation">
                                <h4>Documentation</h4>
                                <p>Documentation such as installation guides, change logs and other product documents can 
                                be found in each project page's Documentation section. The links below will take you to 
                                the documentation section inside of each project.</p>
                                <ul>
                                    <li class="ignite_support_projlink"><a href="../projects/openfire/documentation.jsp">Openfire <%= Versions.getVersion("openfire") %></a></li>
                                    <li class="ignite_support_projlink"><a href="../projects/spark/documentation.jsp">Spark <%= Versions.getVersion("spark") %></a></li>
                                    <li class="ignite_support_projlink"><a href="../projects/smack/documentation.jsp">Smack API <%= Versions.getVersion("smack") %></a></li>
                                    <li class="ignite_support_projlink"><a href="../projects/tinder/documentation.jsp">Tinder API <%= Versions.getVersion("tinder") %></a></li>
                                    <!--<li class="ignite_support_projlink"><a href="../projects/xiff/documentation.jsp">XIFF API <%= Versions.getVersion("xiff") %></a></li>-->
                                </ul>
                            </div>
                        </div>-->
                    
                    
                        <div id="ignite_support_issuetracker">
                            <h4>Issue tracker</h4>
                            <p>Use the official Ignite Realtime Issue Tracker to browse projects
                                and find issues. You may also vote for issues, see which issues are
                                popular, and view the road map. Note: to report new issues, please
                                post them in the <a href="https://discourse.igniterealtime.org">forums</a>.</p>
                            <strong><a href="https://issues.igniterealtime.org" class="ignite_link_arrow">View the Issue Tracker</a></strong>
                        </div>
            
                    <!-- END recent support activity block -->
                    </div>
                    
                <!-- END body support area -->
                </div>
            </div>
        <!-- END left column (main content) -->
        </div>
        <!-- BEGIN right column (sidebar) -->
        <div id="ignite_body_rightcol">
            
            
            <%@ include file="/includes/sidebar_enterprise.jspf" %>
            
            <%@ include file="/includes/sidebar_chat.jspf" %>		
        </div>
        <!-- END right column (sidebar) -->
    
    </div>
    <!-- END body area -->



</body>
</html>
