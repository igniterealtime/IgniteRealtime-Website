
<%
    String project = request.getParameter("project");

    // Grab the right license info
    String name = null;
    String avatarSrc = null;
    String profileLink = null;
    String profile = null;
    if (project.equals("openfire")) {
        name = "gato";
        avatarSrc = "http://www.igniterealtime.org/community/people/dombiak_gaston/avatar/32.png";
        profileLink = "http://www.igniterealtime.org/community/people/dombiak_gaston";
        profile = "Found in the forests of Argentina chewing on his own leg and reading a book on concurrent programming.";
    }
    else if (project.equals("spark")) {
        name = "winsrev";
        avatarSrc = "http://www.igniterealtime.org/community/people/winsrev/avatar/46.png";
        profileLink = "http://www.igniterealtime.org/community/people/winsrev";
        profile = "Constantly moaning, raving and getting stressed, then writing mysterious code that only works with the magic of Spark.";
    }
    else if (project.equals("sparkweb")) {
        name = "DavidSmith";
        avatarSrc = "http://www.igniterealtime.org/community/people/DavidSmith/avatar/46.png";
        profileLink = "http://www.igniterealtime.org/community/people/DavidSmith";
        profile = "Found on the internet arguing about UI design. Probably not a werewolf maybe.";
    }
    else if (project.equals("smack")) {
        name = "matt";
        avatarSrc = "http://www.igniterealtime.org/community/people/matt/avatar/32.png";
        profileLink = "http://www.igniterealtime.org/community/people/matt";
        profile = "\"That code doesn't have comments?! AHHH!\"";
    }
    else if (project.equals("whack")) {
        name = "gato";
        avatarSrc = "http://www.igniterealtime.org/community/people/dombiak_gaston/avatar/32.png";
        profileLink = "http://www.igniterealtime.org/community/people/dombiak_gaston";
        profile = "Found in the forests of Argentina chewing on his own leg and reading a book on concurrent programming.";
    }
    else if (project.equals("xiff")) {
        name = "DavidSmith";
        avatarSrc = "http://www.igniterealtime.org/community/people/DavidSmith/avatar/46.png";
        profileLink = "http://www.igniterealtime.org/community/people/DavidSmith";
        profile = "Found on the internet arguing about UI design. Probably not a werewolf maybe.";
    }
%>
            <!-- BEGIN grey gradient sidebar box 'PROJECT LEAD' -->
			<div class="ignite_sidebar_gradbox">
				<div class="ignite_sidebar_top-g"></div>
				<div class="ignite_sidebar_hdr ignite_sidebar_hdr_projlead"></div>
				<div class="ignite_sidebar_body_projlead">
					<p>
					<table cellpadding="0" cellspacing="0">
                    <tr valign="top"><td><a href="<%= profileLink %>"><img src="<%= avatarSrc %>" alt="<%= name %>"  align="left" /></a></td>
                    <td>
                    <strong><a href="<%= profileLink %>"><%= name %></a></strong>
					<%= profile %></td></tr></table></p>
				</div>
				<div class="ignite_sidebar_btm-g"></div>
			</div>
			<!-- END grey gradient sidebar box 'PROJECT LEAD' -->
