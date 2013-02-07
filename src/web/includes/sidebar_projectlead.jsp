
<%
    String project = request.getParameter("project");

    // Grab the right license info
    String name = null;
    String avatarSrc = null;
    String profileLink = null;
    String profile = null;
    if (project.equals("openfire")) {
        name = "Guus";
        avatarSrc = "http://community.igniterealtime.org/people/Guus/avatar/46.png";
        profileLink = "http://community.igniterealtime.org/people/Guus";
        profile = "Won't tell us where he's from, but says he's from the 'Nether Lands' ... wait that's a real country?";
    }
    else if (project.equals("spark")) {
        name = "winsrev";
        avatarSrc = "http://community.igniterealtime.org/people/winsrev/avatar/46.png";
        profileLink = "http://community.igniterealtime.org/people/winsrev";
        profile = "Constantly moaning, raving and getting stressed, then writing mysterious code that only works with the magic of Spark.";
    }
    else if (project.equals("sparkweb")) {
        name = "dele";
        avatarSrc = "http://community.igniterealtime.org/people/dele/avatar/46.png";
        profileLink = "http://community.igniterealtime.org/people/dele";
        profile = "We don't know how he does it, but works magic every time he touches the code.";
    }
    else if (project.equals("smack")) {
        name = "Robin";
        avatarSrc = "http://community.igniterealtime.org/people/rcollier/avatar/32.png";
        profileLink = "http://community.igniterealtime.org/people/rcollier";
        profile = "Coding out of an igloo in the wilds of Canada.";
    }
    else if (project.equals("tinder")) {
        name = "Guus";
        avatarSrc = "http://community.igniterealtime.org/people/Guus/avatar/46.png";
        profileLink = "http://community.igniterealtime.org/people/Guus";
        profile = "Won't tell us where he's from, but says he's from the 'Nether Lands' ... wait that's a real country?";
    }
    else if (project.equals("whack")) {
        name = "Guus";
        avatarSrc = "http://community.igniterealtime.org/people/Guus/avatar/46.png";
        profileLink = "http://community.igniterealtime.org/people/Guus";
        profile = "Won't tell us where he's from, but says he's from the 'Nether Lands' ... wait that's a real country?";
    }
    else if (project.equals("xiff")) {
        name = "driverjase";
        avatarSrc = "http://community.igniterealtime.org/people/driverjase/avatar/46.png";
        profileLink = "http://community.igniterealtime.org/people/driverjase";
        profile = "Flash guru extraordinaire, part-time superhero.";
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
