
<%
    String project = request.getParameter("project");

    // Grab the right license info
    String name = null;
    String avatarSrc = null;
    String profileLink = null;
    String profile = null;
    if (project.equals("openfire")) {
        name = "dwd";
        avatarSrc = "https://discourse.igniterealtime.org/letter_avatar_proxy/v2/letter/d/e19b73/45.png";
        profileLink = "https://discourse.igniterealtime.org/u/dwd";
        profile = "Dave Cridland is also a member of the XMPP Council, the technical steering group that approves XMPP Extension Protocols.";
    }
    else if (project.equals("spark")) {
        name = "wroot";
        avatarSrc = "https://discourse.igniterealtime.org/user_avatar/discourse.igniterealtime.org/wroot/45/16_1.png";
        profileLink = "https://discourse.igniterealtime.org/u/wroot";
        profile = "He is known to remember EVERYTHING and shamelessly remind you about promises you made and already forgot ten years ago.";
    }
    else if (project.equals("sparkweb")) {
        name = "vacant";
        avatarSrc = "https://discourse.igniterealtime.org/letter_avatar_proxy/v2/letter/d/e19b73/45.png";
     // profileLink = "https://discourse.igniterealtime.org/people/dele";
        profile = "Nobody is working on the project currently.";
    }
    else if (project.equals("smack")) {
        name = "Flow";
        avatarSrc = "https://discourse.igniterealtime.org/user_avatar/discourse.igniterealtime.org/flow/45/13_1.png";
        profileLink = "https://discourse.igniterealtime.org/u/flow";
        profile = "Florian Schmaus is also a member of the XMPP Standards Foundation.";
    }
    else if (project.equals("tinder")) {
        name = "Guus";
        avatarSrc = "https://discourse.igniterealtime.org/user_avatar/discourse.igniterealtime.org/guus/45/15_1.png";
        profileLink = "https://discourse.igniterealtime.org/u/guus";
        profile = "Won't tell us where he's from, but says he's from the 'Nether Lands' ... wait that's a real country?";
    }
    else if (project.equals("whack")) {
        name = "Guus";
        avatarSrc = "https://discourse.igniterealtime.org/user_avatar/discourse.igniterealtime.org/guus/45/15_1.png";
        profileLink = "https://discourse.igniterealtime.org/u/guus";
        profile = "Won't tell us where he's from, but says he's from the 'Nether Lands' ... wait that's a real country?";
    }
    else if (project.equals("asterisk-im")) {
        name = "Marcelo";
        avatarSrc = "https://discourse.igniterealtime.org/letter_avatar_proxy/v2/letter/m/58956e/45.png";
        profileLink = "https://discourse.igniterealtime.org/u/mhterres";
        profile = "Single-handedly responsible for saving the Belgian beer industry.";
    }
    else {
        name = "vacant";
        avatarSrc = "https://discourse.igniterealtime.org/letter_avatar_proxy/v2/letter/d/e19b73/45.png";
     // profileLink = "https://discourse.igniterealtime.org/people/driverjase";
     // profile = "Flash guru extraordinaire, part-time superhero.";
        profile = "Nobody is working on the project currently.";
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
