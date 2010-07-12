<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="java.util.*, java.io.File, java.awt.image.BufferedImage, javax.imageio.ImageIO, java.awt.*, java.util.List, javax.swing.*"%>


<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

<%

    // Define all screenshots below. Each screenshot has a file name, name, and description, and
    // true or false to indicate if the screenshot is a commercial feature or not.
    List<Screenshot> screenshots = new ArrayList<Screenshot>();

    screenshots.add(new Screenshot("wf_serversettings.png", "Server Settings", "Complete control over server settings: ports, SSL, and server name can all be edited from the server settings page."));
    screenshots.add(new Screenshot("wf_langtime.png", "Language and Time Settings", "Openfire has full i18n support - language and time zone settings are controlled through the admin console."));
    screenshots.add(new Screenshot("wf_security.png", "Security", "Security settings allow you to control who your users can and can't talk to .&nbsp; Client control allows you to determine which features are enabled in users' IM clients such as enabling file transfer, message broadcasting, or group chat."));
    screenshots.add(new Screenshot("wf_audit.png", "Audit Policy", "Openfire can audit XMPP traffic on the server and save the data to XML files.&nbsp; Audit policy settings allow control over how auditing occurs."));
    screenshots.add(new Screenshot("wf_sessions.png", "Sessions", "Monitor and control all active client and server sessions."));
    screenshots.add(new Screenshot("wf_sharedgroups.png", "Shared Groups", "Groups can be shared to easily pre-populate new users' rosters with the right people."));
    screenshots.add(new Screenshot("wf_roomadmin.png", "Room Administration", "Create and manage chat rooms. Options allow control over room moderation, maximum occupancy, prescence information, and more."));
    screenshots.add(new Screenshot("wf_connectionmgr.png", "Connection Manager", "Connection managers can be enabled to allow for great scalability.&nbsp; They aggregate client connections and then open a few connections to the server to transmit traffic."));
    screenshots.add(new Screenshot("wf_contentfilter.png", "Content Filter", "Content filter settings allow you to configure the server to accept, reject or mask content that you specify with the admin console.&nbsp; Optionally, rejection and content match notifications can also be enabled."));
    screenshots.add(new Screenshot("wf_offlinemsgs.png", "Offline Messages", "Messages sent to a user that if offline can be stored for later, dropped silently without notification, or bounced back to the sender.&nbsp; You can&nbsp; also specify a storage limit to allow a certain amount of information to be stored before a bounce or drop occurs."));
    screenshots.add(new Screenshot("wf_plugins.png", "Plugins", "A host of plugins are available for functionality such as importing and exporting data and exposing presence data as a web service.Plugins can be fully administered from inside the Openfire administration console.  Installing plugins is as easy as dropping them into the plugins directory of your Openfire installation."));
    screenshots.add(new Screenshot("wf_groupchatsummary.png", "Group Chat Room Summary", "The group chat room summary page allows you to view and edit current chat rooms and create new ones. "));
    screenshots.add(new Screenshot("wf_manageupdates2.png", "Manage Updates", "Openfire can be configured to automatically check for server or plugin updates.&nbsp; Automatic administrator notifications can also be enabled."));
    screenshots.add(new Screenshot("wf_servertoserver.png", "Server to Server", "Server to Server settings allow you to configure "));
    screenshots.add(new Screenshot("wf_gateway.png", "Gateway Settings", "Gateway settings allow you to authorize individual client applications so that only clients that have been audited for proper security are allowed on your network."));

    // Commercial screenshots.
    List<Screenshot> commercialScreenshots = new ArrayList<Screenshot>();

   
    commercialScreenshots.add(new Screenshot("wf_entdash.png", "Monitoring Dashboard", "The monitoring plugin Dashboard provides a quick overview of community activity and aggregates real time stats into one central location."));
    commercialScreenshots.add(new Screenshot("wf_searcharchive.png", "Search Archive", "Openfire's monitoring plugin has comprehensive support for archiving messages to a database, and includes a compliance tool to find message content by users, date range, and keywords.  The plugin also includes a lightweight archiving mode that records information about conversations (participants, date, and number of messages) without recording the actual message content. This is useful in understanding IM usage patterns, while not being as invasive to users."));
	commercialScreenshots.add(new Screenshot("wf_reportpackets.png", "Reporting: Extensive Options", "Advanced reporting tools, which include statistics on active users, conversations, group chat rooms, packet counts and more."));
    commercialScreenshots.add(new Screenshot("wf_report_convos.png", "Reporting: Fine-Tuned Results", "Generate reports for preset time frames or enter specific dates to narrow results. Openfire reports can also be exported as a PDF."));
    commercialScreenshots.add(new Screenshot("wf_clientcontrol.png", "Client Control", "Openfire client control lets you control the features that are enabled in users' IM clients (for Spark and other clients), such as enabling file transfer, message broadcasting, or group chat. You can also control the version of Spark deployed by users from inside the administration console."));

    // Directory that contains all screenshots.
    final String screenshotPath = "/images/screenshots";
    final File screenshotDir = new File(request.getRealPath(screenshotPath));
    final File thumbnailDir = new File(screenshotDir, "thumbnails");
    // Ensure the directory exists.
    thumbnailDir.mkdir();
%>

<%
    // -- START INCLUDE CODE -- //
    // First, see if this is an include request. If so, show a random image.
    String include = request.getParameter("include");
    if (include != null && include.equals("true")) {
        List<Screenshot> combined = new ArrayList<Screenshot>();
        combined.addAll(screenshots);
        combined.addAll(commercialScreenshots);
        int index = random.nextInt(combined.size()-1);
        Screenshot screenshot = combined.get(index);
        String filename = screenshot.getFilename();
        File file = new File(screenshotDir, filename);
        if (!file.exists()) {
            throw new IllegalArgumentException("Screenshot doesn't exist: " + filename);
        }
        File thumbnail = new File(thumbnailDir, filename.substring(0, filename.length()-4) + "_mini_thumb.png");
        if (!thumbnail.exists() || thumbnail.lastModified() != file.lastModified()) {
            thumbnail.delete();
            createThumbnail(file, thumbnail, 80, 80);
        }
%>
        <!-- BEGIN green sidebar box 'FEATURED SCREENSHOT' -->
        <div class="ignite_sidebar_greenbox">
            <div class="ignite_sidebar_top"></div>
            <div class="ignite_sidebar_hdr ignite_sidebar_hdr_scrnshot"></div>
            <div class="ignite_sidebar_body">
            <div class="ignite_sidebar_feature">
				<div class="ignite_sidebar_feature_top"></div>
				<div class="ignite_sidebar_feature_hdr"></div>
				<div class="ignite_sidebar_feature_body">
                    <p>
                    <a href="<%= screenshotPath %>/<%= filename %>" rel="lightbox" title="<%= screenshot.getTitle() %>" description="<%= screenshot.getDescription() %>">
                    <img src="<%= screenshotPath %>/thumbnails/<%= thumbnail.getName() %> " alt="<%= screenshot.getTitle() %>" align="right" border="0">
                    </a>
                    <strong><%= screenshot.getTitle() %></strong>
                    <br /><br /><a href="/projects/spark/screenshots.jsp">See more...</a>
                    </p>
				</div>
				<div class="ignite_sidebar_feature_btm"></div>
			</div>
            </div>
            <div class="ignite_sidebar_btm"></div>
        </div>
        <!-- END green sidebar box 'FEATURED SCREENSHOT' -->
<%
    return;
    }
    // -- END INCLUDE CODE -- //
%>

<html>
<head>
<title>Openfire Server</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Openfire</a></li>
			<li id="subnav02"><a href="screenshots.jsp" class="ignite_subnav_current">Screenshots</a></li>
			<li id="subnav03"><a href="plugins.jsp">Plugins</a></li>
			<li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
			<li id="subnav05"><a href="http://issues.igniterealtime.org/browse/JM">Issue Tracker</a></li>
			<li id="subnav06"><a href="/builds/openfire/docs/latest/documentation/javadoc/">JavaDocs</a></li>
			<li id="subnav07"><a href="connection_manager.jsp">Connection Manager Module</a></li>
            <li id="subnav08"><a href="../../roadmap.jsp">Roadmap</a></li>
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
					<h2>Openfire Screenshots</h2>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_padding">
					<p>View screenshots of Openfire and
                        some of it's more popular plugins below.
				</div>

                <div class="ignite_body_screenshots">
				<h3>Open Source</h3>
					<table cellspacing="0" cellpadding="0">
                <%
                    // Loop through all screenshots.
                    for (int i=0; i<screenshots.size(); i++) {
                        Screenshot screenshot = screenshots.get(i);
                        // Make sure the file exists.
                        String filename = screenshot.getFilename();
                        File file = new File(screenshotDir, filename);
                        if (!file.exists()) {
                            throw new IllegalArgumentException("Screenshot doesn't exist: " + filename);
                        }
                        // See if a thumbnail exists. Also check to see if the thumbnail is
                        // out of date compared to the main image.
                        File thumbnail = new File(thumbnailDir, filename.substring(0, filename.length()-4) + "_thumb.png");
                        if (!thumbnail.exists() || thumbnail.lastModified() != file.lastModified()) {
                            thumbnail.delete();
                            createThumbnail(file, thumbnail, 150, 150);
                        }
                        if (i % 2 == 0) {
                 %>
                        <%= i==0? "</tr>": "" %>
                        <tr>

                <%
                        }
                 %>

                    <td><a href="<%= screenshotPath %>/<%= filename %>" rel="lightbox" title="<%= screenshot.getTitle() %>" description="<%= screenshot.getDescription() %>">
                    <img src="<%= screenshotPath %>/thumbnails/<%= thumbnail.getName() %> " alt="<%= screenshot.getTitle() %>" border="0">
					</a><br>
					<a href="<%= screenshotPath %>/<%= filename %>" rel="lightbox" title="<%= screenshot.getTitle() %>">
                        <%= screenshot.getTitle() %>
					</a></td>
                <%
                    }
                %>
                    </tr></table>
                </div>

                 <div class="ignite_body_screenshots ignite_body_screenshots_enterprise">
				 <h3>Plug-ins</h3>
					<table cellspacing="0" cellpadding="0">
                <%
                    // Loop through all screenshots.
                    for (int i=0; i<commercialScreenshots.size(); i++) {
                        Screenshot screenshot = commercialScreenshots.get(i);
                        // Make sure the file exists.
                        String filename = screenshot.getFilename();
                        File file = new File(screenshotDir, filename);
                        if (!file.exists()) {
                            throw new IllegalArgumentException("Screenshot doesn't exist: " + filename);
                        }
                        // See if a thumbnail exists. Also check to see if the thumbnail is
                        // out of date compared to the main image.
                        File thumbnail = new File(thumbnailDir, filename.substring(0, filename.length()-4) + "_thumb.png");
                        if (!thumbnail.exists() || thumbnail.lastModified() != file.lastModified()) {
                            thumbnail.delete();
                            createThumbnail(file, thumbnail, 150, 150);
                        }
                 %>
                    <tr>
                    <td><a href="<%= screenshotPath %>/<%= filename %>" rel="lightbox" title="<%= screenshot.getTitle() %>" description="<%= screenshot.getDescription() %>">
                    <img src="<%= screenshotPath %>/thumbnails/<%= thumbnail.getName() %> " alt="<%= screenshot.getTitle() %>" border="0">
					</a><br>
					<a href="<%= screenshotPath %>/<%= filename %>" rel="lightbox" title="<%= screenshot.getTitle() %>">
                        <%= screenshot.getTitle() %>
					</a></td>
                    </tr>
                <%
                    }
                %>
                    </table>
                </div>

                <br/><br/>
				
			</div>
			<!-- END body content area -->
			
		</div>
		<!-- END left column (main content) -->
		
		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">
			
            <jsp:include page="/includes/sidebar_projectlead.jsp">
                <jsp:param name="project" value="openfire" />
            </jsp:include>
			
			<jsp:include page="/includes/sidebar_snapshot.jsp">
			    <jsp:param name="project" value="openfire"/>
			</jsp:include>
			
			<%@ include file="/includes/sidebar_enterprise.jspf" %>
			
		</div>
		<!-- END right column (sidebar) -->
	
	</div>
	<!-- END body area -->



</body>
</html>

<%!
    Random random = new Random();

    /**
     * Creates a thumbnail image.
     */
    public void createThumbnail(File file, File thumbnail, int maxHeight, int maxWidth) {
        try {
            BufferedImage img = ImageIO.read(file);
            float height = img.getHeight();
            float width = img.getWidth();

            float hScale = (float) maxHeight / height;
            float wScale = (float) maxWidth / width;

            // Pick the larger scale.
            float scale = Math.min(wScale, hScale);

            // Convert image.
            img = toBufferedImage(img.getScaledInstance(
                    (int)(width * scale), (int)(height * scale), Image.SCALE_SMOOTH));

            ImageIO.write(img, "png", thumbnail);
            // Set the last modified date of the thumbnail to match the file last
            // modified date so we can check for changes.
            thumbnail.setLastModified(file.lastModified());
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    private BufferedImage toBufferedImage(Image image) {
        image = new ImageIcon(image).getImage();
        BufferedImage bufferedImage = new BufferedImage(image.getWidth(null)
                , image.getHeight(null), BufferedImage.TYPE_INT_RGB);
        Graphics g = bufferedImage.createGraphics();
        g.setColor(Color.white);
        g.fillRect(0, 0, image.getWidth(null), image.getHeight(null));
        g.drawImage(image, 0, 0, null);
        g.dispose();

        return bufferedImage;
    }

    /**
     * Simple Javabean to hold screenshot data.
     */
    class Screenshot {

        private String filename;
        private String title;
        private String description;

        public Screenshot(String filename, String title, String description) {
            this.filename = filename;
            this.title = title;
            this.description = description;
        }

        public String getFilename() {
            return filename;
        }

        public String getTitle() {
            return title;
        }

        public String getDescription() {
            return description;
        }
    }
%>
