<!-- BEGIN header -->
<#assign header = JiveGlobals.getJiveProperty("skin.default.headerHTML")!>
<#if header != ''>
    ${header}
<#else>
    <div id="jive-global-header">
        <div id="jive-global-header-texture">
            <a href="http://www.igniterealtime.org" id="jive-global-header-logo"></a>
            <a href="http://www.jivesoftware.com?source=Website-Ignite"><div id="ignite_jive"></div></a>
            <div id="ignite_nav">
                <ol>
                    <li id="nav01"><a href="/index.jsp">Home</a></li>
                    <li id="nav02"><a href="/projects/index.jsp">Projects</a></li>
                    <li id="nav03"><a href="/downloads/index.jsp">Downloads</a></li>
                    <li id="nav04"><a href="/community/">Community</a></li>
                    <li id="nav05"><a href="/fans/index.jsp">Fans</a></li>
                    <li id="nav07"><a href="/support/index.jsp">Support</a></li>
                    <li id="nav08"><a href="/about/index.jsp">About</a></li>
                    </ol>
                <div id="ignite_nav_groupchat" class="ignite_nav_groupchat" style="display: none;">
                    <span class="ignite_nav_groupchat-block" id="ignite_nav_groupchat-block"></span>
                    <span id="ignite_nav_groupchat_moreinfo" style="display: none;"><a href="http://www.igniterealtime.org/support/group_chat.jsp">More Information</a></span>
                </div>
            </div>
            <script type="text/javascript">
                // The javascript timer for the header group chat callout
                runGroupChatTimer();
            </script>
        </div>
    </div>
</#if>
<!-- END header -->
