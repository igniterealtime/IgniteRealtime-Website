
<%
    String project = request.getParameter("project");

    // Grab the right license info
    String name = null;
    String avatarSrc = null;
    String profileLink = null;
    String profile = null;
    if (project.equals("openfire")) {
        name = "dombiak_gaston";
        avatarSrc = "http://www.igniterealtime.org/community/people/gato/avatar/32.png";
        profileLink = "http://www.igniterealtime.org/community/people/gato";
        profile = "Found in the forests of Argentina chewing on his own leg and reading a book on concurrent programming.";
    }
    else if (project.equals("spark")) {
        name = "ddman";
        avatarSrc = "http://www.igniterealtime.org/community/people/ddman/avatar/32.png";
        profileLink = "http://www.igniterealtime.org/community/people/gato";
        profile = "Java Swing nerd that can bench 380lb.";
    }
    else if (project.equals("smack")) {
        name = "matt";
        avatarSrc = "http://www.igniterealtime.org/community/people/matt/avatar/32.png";
        profileLink = "http://www.igniterealtime.org/community/people/matt";
        profile = "\"That code doesn't have comments?! AHHH!\"";
    }
    else if (project.equals("xiff")) {
        name = "nick";
        avatarSrc = "http://www.igniterealtime.org/community/people/nick/avatar/32.png";
        profileLink = "http://www.igniterealtime.org/community/people/nick";
        profile = "A lyma bean-loving Flash developer working on the AS3.0 port of the XIFF library.";
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