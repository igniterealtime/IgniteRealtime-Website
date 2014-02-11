<%@ page import="org.jivesoftware.site.*, java.text.NumberFormat" %>

			<%
                String project = request.getParameter("project");

                long downloads = 0;

                try {
                    downloads = DownloadStats.getDownloadsForType(DownloadServlet.DownloadInfo.valueOf(project));
                }
                catch (Exception ignored) { /* ignored */ }

                // Grab the right license info
                String license = null;
                if (project.equals("openfire")) {
                    license = "Open Source Apache";
                }
                else if (project.equals("spark")) {
                    license = "Open Source Apache";
                }
                else if (project.equals("sparkweb")) {
                    license = "Open Source LGPL";
                }
                else if (project.equals("smack")) {
                    license = "Open Source Apache";
                }
                else if (project.equals("tinder")) {
                    license = "Open Source GPL";
                }
                else if (project.equals("whack")) {
                    license = "Open Source Apache";
                }
                else if (project.equals("xiff")) {
                    license = "Open Source LGPL";
                }

                // Grab the right platform info
                String platform = null;
                if (project.equals("openfire")) {
                    platform = "Windows, Linux,<br />Unix, Mac OS X";
                }
                else if (project.equals("spark")) {
                    platform = "Windows, Linux,<br />Unix, Mac OS X";
                }
                else if (project.equals("sparkweb")) {
                    platform = "Cross-Platform";
                }
                else if (project.equals("smack")) {
                    platform = "Cross-Platform";
                }
                else if (project.equals("tinder")) {
                    platform = "Cross-Platform";
                }
                else if (project.equals("whack")) {
                    platform = "Cross-Platform";
                }
                else if (project.equals("xiff")) {
                    platform = "Cross-Platform";
                }
                else if (project.equals("asterisk-im")) {
                    platform = "Cross-Platform";
                }

            %>
            <!-- BEGIN grey sidebar box 'SNAPSHOT' -->
			<div class="ignite_sidebar_greybox">
				<div class="ignite_sidebar_top"></div>
				<div class="ignite_sidebar_hdr ignite_sidebar_hdr_snapshot"></div>
				<div class="ignite_sidebar_body">
					<div class="ignite_sidebar_body_projstat"><strong>Latest Build</strong> <span><%= Versions.getVersion(project) %></span></div>
                    <% if (downloads != 0) { %>
                    <div class="ignite_sidebar_body_projstat"><strong>Downloads</strong> <span><%= NumberFormat.getNumberInstance().format(downloads) %></span></div>
                    <% } %>
                    <% if (license != null) { %>
                    <div class="ignite_sidebar_body_projstat"><strong>License</strong> <span><%= license %></span></div>
                    <% } %>
                    <% if (platform != null) { %>
                    <div class="ignite_sidebar_body_projstat ignite_sidebar_body_projstat_last"><strong>Platforms</strong> <span><%= platform %></span></div>
                    <% } %>
				</div>
				<div class="ignite_sidebar_btm"></div>
			</div>
			<!-- END grey sidebar box 'SNAPSHOT' -->
