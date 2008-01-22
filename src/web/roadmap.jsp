<%@ taglib uri="oscache" prefix="cache" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>    

<html>
<head>
<title>Roadmap</title>
<meta name="body-id" content="about" />
<style type="text/css" media="screen">
	@import "/styles/interior.css";
</style>
</head>
<body>


	<!-- BEGIN body area -->
	<div id="ignite_body">

		<!-- BEGIN left column (main content) -->
		<div id="ignite_body_leftcol">

			<!-- BEGIN body content area -->
			<div id="ignite_int_body">

				<!-- BEGIN body header -->
				<div id="ignite_body_header">
					<h1>Roadmap</h1>
				</div>
				<!-- END body header -->


				<div class="ignite_int_body_padding">
                    <h2 class="road">Openfire*</h2>
                    <p>
                        <div class="road-table">
                        <table width="100%">
                            <thead>
                                <tr>
                                    <th class="nothing">&nbsp;</th>
                                    <th>Version 3.5.x, Q1 2008 - Q2 2008</th>
                                    <th>Future</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="label">Openfire Open Source</td>
                                    <td><ul>
                                        <li>Use TLS and SASL for external components</li>
                                        <li>Add audit tracking to the admin console</li>
                                        <li>Optimize database for big installations</li>
                                        <li>LDAP integration improvements</li>
                                        <li>Add Openfire to Linux distributions</li>
                                    </ul></td>
                                    <td class="col3"><ul>
                                        <li>Multi-domains support</li>
                                        <li>File sharing in rooms</li>
                                    </ul></td>
                                </tr>
                                <tr>
                                    <td class="label">Openfire Enterprise</td>
                                    <td>
                                        <ul>
                                            <li>Clustering support in Pubsub and PEP</li>
                                            <li>Plugin distribution in the cluster</li>
                                            <li>First version of SparkWeb desktop version</li>
                                        </ul>
                                    </td>
                                    <td class="col3">
                                        <ul>
                                            <li>Audio and video in SparkWeb</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </p>
				
			<p>* Plan as of January 23, 2008. Subject to change; we make no promises on future releases. :-)</p>


                <h2>Top Ten Issues</h2>

                <p>Your vote counts! We prioritize work on new features and improvements based
                on community feedback. The top ten issues (by votes) are listed below. You can also
                view the <a href="http://www.igniterealtime.org/issues/secure/IssueNavigator.jspa?mode=hide&requestId=10310">full list</a>.</p>
                <p>To cast your own votes, visit the <a href="http://www.igniterealtime.org/issues">issue tracker</a>,
                login (or create an account), then click
                to vote for an issue while viewing the issue report.</p>
                <% String voteRSS = "http://www.igniterealtime.org/issues/secure/IssueNavigator.jspa?"+
                            "view=rss&&resolution=-1&sorter/field=issuekey&sorter/order=DESC&sorter/field=votes&sorter/order=DESC&tempMax=10&reset=true&decorator=none"; %>
                <!-- BEGIN blue sidebar box 'LATEST ISSUES' -->
                <div class="vote-table">
                <cache:cache time="60" key="<%= voteRSS %>">
                        <c:import url="<%= voteRSS %>" var="issuesxml" />
                        <c:import url="/xsl/issuevotes.xsl" var="issuesxsl" />
                        <x:transform xml="${issuesxml}" xslt="${issuesxsl}" />
                </cache:cache>
				</div>
                </div>

			</div>
			<!-- END body content area -->

		</div>
		<!-- END left column (main content) -->

		<!-- BEGIN right column (sidebar) -->
		<div id="ignite_body_rightcol">

            <!-- New Issues -->
            <% String issuesRSS = "http://www.igniterealtime.org/issues/secure/IssueNavigator.jspa?" +
                "view=rss&&resolution=-1&status=1&sorter/field=issuekey&sorter/order=DESC&sorter/field=created&sorter/order=DESC&tempMax=10&reset=true&decorator=none "; %>
			<!-- BEGIN blue sidebar box 'LATEST ISSUES' -->
			<cache:cache time="60" key="<%= issuesRSS %>">
			<div class="ignite_sidebar_whitebox">
				<div class="ignite_sidebar_top"></div>
				<div class="ignite_sidebar_hdr ignite_sidebar_hdr_issues"></div>
				<div class="ignite_sidebar_body">

					<c:import url="<%= issuesRSS %>" var="issuesxml" />
					<c:import url="/xsl/issues.xsl" var="issuesxsl" />
					<x:transform xml="${issuesxml}" xslt="${issuesxsl}" />

				</div>
				<div class="ignite_sidebar_btm"></div>
			</div>
			</cache:cache>

            <!-- Just Fixed -->
            <!-- Just Fixed -->
            <% issuesRSS = "http://www.igniterealtime.org/issues/secure/IssueNavigator.jspa?view=rss"+
                    "&&status=5&status=6&sorter/field=issuekey&sorter/order=DESC&sorter/field=created&sorter/order=DESC&tempMax=10&reset=true&decorator=none"; %>
            <!-- BEGIN blue sidebar box 'LATEST ISSUES' -->
            <cache:cache time="60" key="<%= issuesRSS %>">
            <div class="ignite_sidebar_whitebox">
                <div class="ignite_sidebar_top"></div>
                <div class="ignite_sidebar_hdr ignite_sidebar_hdr_issues_fixed"></div>
                <div class="ignite_sidebar_body">

                    <c:import url="<%= issuesRSS %>" var="issuesxml" />
                    <c:import url="/xsl/issues.xsl" var="issuesxsl" />
                    <x:transform xml="${issuesxml}" xslt="${issuesxsl}" />

                </div>
                <div class="ignite_sidebar_btm"></div>
            </div>
            </cache:cache>



        </div>


        <!-- END right column (sidebar) -->

	</div>
	<!-- END body area -->



</body>
</html>