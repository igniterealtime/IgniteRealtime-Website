<%@ page import="org.jivesoftware.site.Versions"%>
<%@ page import="java.util.*, java.io.File, java.awt.image.BufferedImage, javax.imageio.ImageIO, java.awt.*, java.util.List, javax.swing.*"%>


<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>

<%
    // Define all screenshots below. Each screenshot has a file name, name, and description.
    List<Screenshot> screenshots = new ArrayList<Screenshot>();
    screenshots.add(new Screenshot("spark_file_transfer_receiving.png", "File Transfer Status Notification", "Both parties can view the status bar as the transfer progresses.  The recipient can open the file directly from their chat window or from their transferred files folder."));
	screenshots.add(new Screenshot("spark_file_transfer_drag.png", "Drag and Drop File Transfer", "Drag a file into the chat window or directly onto a contact in your roster to initiate a transfer."));
    screenshots.add(new Screenshot("spark_muc_start_chat.png", "Mutli-User Chat", "Spark makes it easy to have an impromptu group chat when a discussion needs to involve more than one person. Simply select the appropriate contacts from your contact roster, right mouse-click, and choose 'Start a Conference'."));
    screenshots.add(new Screenshot("spark_previous_big.png", "View Previous Chats", "Description"));
    screenshots.add(new Screenshot("spark_ui_typing_notification_1.png", "Typing Notifications", "Visual cues let you know when a user is typing - these cues appear in the chat window as well as the roster list."));
    screenshots.add(new Screenshot("spark_profile.png", "Profile Settings", "Customize your profile as much or as little as you like."));
    screenshots.add(new Screenshot("spark_presence.png", "Presence", "Use extended presence settings to prevent inconvenient interruptions during busy times.  Use standard pre-popoulated presence settings or customize your own."));
  	screenshots.add(new Screenshot("spark_telephony_on_phone.png", "Telephony", "See when contacts are on the phone with explicit &quot;on the phone&quot; updated presence status."));
	screenshots.add(new Screenshot("spark_gateway_roster.png", "Gateways"," Use gateways to chat with users on external networks such as AOL, ICQ, Yahoo and MSN."));
	screenshots.add(new Screenshot("spark_ui_plugins_menu.png", "Plugins", "Use the plugin management window to view, install and manage plugins directly from the client."));
	screenshots.add(new Screenshot("spark_ui_recent_history.png", "Recent History", "Spark displays the last few lines of your most recent conversations to provide context if a conversation is interrupted or delayed."));
	screenshots.add(new Screenshot("spark_ui_screen_capture.png", "Screen Capture", "Instantly capture and send an image from your desktop to quickly share what you are looking at and make conversations easier."));
	screenshots.add(new Screenshot("spark_ui_spellcheck.png", "Spell Check", "Inline spell checking works just like word processor applications."));
	screenshots.add(new Screenshot("spark_ui_stale_chat.png", "Stale Chat Management", "Inactive chat sessions (stale chats) appear as grey tabs and can be closed individually or as a group by right-clicking any tab and selecting the appropriate action from the menu. "));

    // Commercial screenshots.
    List<Screenshot> commercialScreenshots = new ArrayList<Screenshot>();
    commercialScreenshots.add(new Screenshot("fastpath_invite_big.gif", "Fastpath Customer Chat: Invite Other Experts", "Easily invite other agents to join the chat session."));
    commercialScreenshots.add(new Screenshot("fastpath_message_big.gif", "Fastpath Customer Chat: Incoming Request", "Fastpath enables Spark for powerful customer chat, including intelligent queueing and routing.  Agents get incoming requests and have a specified amount of time to accept the chat request.  If the chat is not accepted, Fastpath will follow predetermined routing rules to send it to the next most appropriate agent.  Administrators can easily set up and maintain the rules in the web-based console."));
    commercialScreenshots.add(new Screenshot("fastpath_transfer_big.gif", "Fastpath Customer Chat: Transfer to Another Agent", "Transfer chats to another agent when different expertise is required."));
    commercialScreenshots.add(new Screenshot("spark_customization_fastpath_web.png", "Fastpath Customer Chat: Web Chat", "A web-based client is included to help you manage IM with your website visitors.  			Their questions can be immediately routed to the most appropriate workgroup members  			based on their knowledge and presence status."));
	commercialScreenshots.add(new Screenshot("spark_customization_fastpath.png", "Fastpath Tab in Spark Client", "Users never have to leave the Spark interface when an incoming Spark Fastpath message arrives. Notifications are completely intuitive and clearly marked as a Spark Fastpath incoming message."));
    
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
<title>Spark IM Client</title>
<meta name="body-id" content="projects" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>

	<div id="ignite_subnav">
		<ul>
			<li id="subnav01"><a href="index.jsp" class="ignite_subnav_project">Spark</a></li>
			<li id="subnav02"><a href="screenshots.jsp">Screenshots</a></li>
			<li id="subnav03"><a href="sparkplug-kit.jsp">Sparkplug Kit</a></li>
			<li id="subnav04"><a href="documentation.jsp">Documentation</a></li>
			<li id="subnav05"><a href="http://www.igniterealtime.org/issues/browse/SPARK">Issue Tracker</a></li>
            <li id="subnav06"><a href="../../roadmap.jsp">Roadmap</a></li>
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
					<h2>Spark Screenshots</h2>
				</div>
				<!-- END body header -->
				
				
				<div class="ignite_int_body_padding">
					<p>View screenshots of Spark and commercial extensions below.
                        Looking for more comprehensive feature information? Visit the
                        <a href="http://www.jivesoftware.com/products/spark/features.jsp?source=Website-Ignite">feature tour</a>
                        on jivesoftware.com.</p>
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
                        // See if a thumbnail exists.
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
					<a href="<%= screenshotPath %>/<%= filename %>" rel="lightbox" title="<%= screenshot.getTitle() %>" description="<%= screenshot.getDescription() %>">
                        <%= screenshot.getTitle() %>
					</a></td>
                <%
                    }
                %>
                    </tr></table>
                </div>
                

                <div class="ignite_body_screenshots ignite_body_screenshots_enterprise">
				 <h3>Commercial</h3>
					<table cellspacing="0" cellpadding="0">
                <%
                    // Loop through all commercial screenshots.
                    for (int i=0; i<commercialScreenshots.size(); i++) {
                        Screenshot screenshot = commercialScreenshots.get(i);
                        // Make sure the file exists.
                        String filename = screenshot.getFilename();
                        File file = new File(screenshotDir, filename);
                        if (!file.exists()) {
                            throw new IllegalArgumentException("Screenshot doesn't exist: " + filename);
                        }
                        // See if a thumbnail exists.
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
					<a href="<%= screenshotPath %>/<%= filename %>" rel="lightbox" title="<%= screenshot.getTitle() %>" description="<%= screenshot.getDescription() %>">
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
                <jsp:param name="project" value="spark" />
            </jsp:include>

			<jsp:include page="/includes/sidebar_snapshot.jsp">
			    <jsp:param name="project" value="spark"/>
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