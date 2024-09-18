<%@ page import="org.jivesoftware.site.*" %>
<%@ page import="org.slf4j.LoggerFactory" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%

                String project = request.getParameter("project");

                request.setAttribute("version", Versions.getVersion(project));
                long downloads = 0;

                try {
                    downloads = DownloadStats.getDownloadsForType(DownloadServlet.DownloadInfo.valueOf(project));
                }
                catch (Exception e) { LoggerFactory.getLogger( "sidebar_snapshot.jsp" ).debug( "An exception occurred that can probably be ignored.", e); }

                request.setAttribute("downloads", downloads);

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
                    license = "Open Source Apache";
                }
                else if (project.equals("whack")) {
                    license = "Open Source Apache";
                }
                else if (project.equals("botz")) {
                    license = "Open Source Apache";
                }
                else if (project.equals("xiff")) {
                    license = "Open Source LGPL";
                }
                request.setAttribute("license", license);

                // Grab the right platform info
                String platform = null;
                if (project.equals("openfire")) {
                    platform = "Windows, Linux, Unix, Mac OS X";
                }
                else if (project.equals("spark")) {
                    platform = "Windows, Linux, Unix, Mac OS X";
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
                else if (project.equals("botz")) {
                    platform = "Openfire";
                }
                request.setAttribute("platform", platform);
            %>
            <div class="ignite_sidebar_greybox">
                <div class="ignite_sidebar_top"></div>
                <div class="ignite_sidebar_hdr ignite_sidebar_hdr_snapshot"></div>
                <div class="ignite_sidebar_body">
                    <div class="ignite_sidebar_body_projstat"><strong>Latest Build</strong> <span><c:out value="${version}"/></span></div>
                    <c:if test="${not empty downloads and downloads gt 0}">
                        <div class="ignite_sidebar_body_projstat"><strong>Downloads</strong> <span><fmt:formatNumber value="${downloads}"/></span></div>
                    </c:if>
                    <c:if test="${not empty license}">
                        <div class="ignite_sidebar_body_projstat"><strong>License</strong> <span><c:out value="${license}"/></span></div>
                    </c:if>
                    <c:if test="${not empty platform}">
                        <div class="ignite_sidebar_body_projstat ignite_sidebar_body_projstat_last"><strong>Platforms</strong> <span><c:out value="${platform}"/></span></div>
                    </c:if>
                </div>
                <div class="ignite_sidebar_btm"></div>
            </div>
            <!-- END grey sidebar box 'SNAPSHOT' -->
