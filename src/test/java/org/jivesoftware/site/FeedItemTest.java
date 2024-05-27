package org.jivesoftware.site;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class FeedItemTest
{
    @Test
    public void testVideoReplacement()
    {
        // Setup test fixture.
        final String input = "<p>We are excited to be able to announce the immediate availability of a new plugin for Openfire: XMPP Web!</p>\n" +
            "<p>This new plugin for the real-time communications server provided by the <a href=\"https://www.igniterealtime.org/\">Ignite Realtime community</a> allows you to install the third-party webclient named ‘<a href=\"https://github.com/nioc/xmpp-web\">XMPP Web</a>’ in mere seconds! By installing this new plugin, the web client is immediately ready for use.</p>\n" +
            "<p></p><div class=\"video-placeholder-container\" data-video-src=\"/uploads/default/original/2X/5/5a21cdad5c5e2053c693aa7734a48f684879b63f.mp4\" data-thumbnail-src=\"https://discourse.igniterealtime.org/uploads/default/original/2X/0/098bfee9e4e77052a15f0a17ddcf06008bd341c9.png\">\n" +
            "</div><p></p>\n" +
            "<p>This new plugin compliments others that similarly allow to deploy a web client with great ease, like <a href=\"https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=candy\">Candy</a>, <a href=\"https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=inverse\">inVerse</a> and <a href=\"https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=jsxc\">JSXC</a>! With the addition of XMPP Web, the selection of easy-to-install clients for your users to use becomes even larger!</p>\n" +
            "<p>The XMPP Web plugin for Openfire is based on release 0.10.2 of the upstream project, which currently is the latest release. It will automatically become available for installation in the admin console of your Openfire server in the next few days. Alternatively, you can download it immediately from its archive page.</p>\n" +
            "<p>Do you think this is a good addition to the suite of plugins? Do you have any questions or concerns? Do you just want to say hi? Please stop by our <a href=\"https://discourse.igniterealtime.org/\">community forum</a> or our <a href=\"https://www.igniterealtime.org/support/group_chat.jsp\">live groupchat</a>!</p>\n" +
            "<p>For other release announcements and news follow us on <a href=\"https://toot.igniterealtime.org/@news\">Mastodon</a> or <a href=\"https://x.com/IgniteRealtime\">X</a></p>\n";

        // Execute system under test.
        final String result = FeedItem.replaceVideo(input);

        // Verify results.
        final String expected = "<p>We are excited to be able to announce the immediate availability of a new plugin for Openfire: XMPP Web!</p>\n" +
            "<p>This new plugin for the real-time communications server provided by the <a href=\"https://www.igniterealtime.org/\">Ignite Realtime community</a> allows you to install the third-party webclient named ‘<a href=\"https://github.com/nioc/xmpp-web\">XMPP Web</a>’ in mere seconds! By installing this new plugin, the web client is immediately ready for use.</p>\n" +
            "<p></p><video width=\"696\" poster=\"https://discourse.igniterealtime.org/uploads/default/original/2X/0/098bfee9e4e77052a15f0a17ddcf06008bd341c9.png\" controls><source src=\"https://discourse.igniterealtime.org/uploads/default/original/2X/5/5a21cdad5c5e2053c693aa7734a48f684879b63f.mp4\"/>Unable to show a video. <a href=\"https://discourse.igniterealtime.org/uploads/default/original/2X/5/5a21cdad5c5e2053c693aa7734a48f684879b63f.mp4\">Download the video</a></video><p></p>\n" +
            "<p>This new plugin compliments others that similarly allow to deploy a web client with great ease, like <a href=\"https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=candy\">Candy</a>, <a href=\"https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=inverse\">inVerse</a> and <a href=\"https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=jsxc\">JSXC</a>! With the addition of XMPP Web, the selection of easy-to-install clients for your users to use becomes even larger!</p>\n" +
            "<p>The XMPP Web plugin for Openfire is based on release 0.10.2 of the upstream project, which currently is the latest release. It will automatically become available for installation in the admin console of your Openfire server in the next few days. Alternatively, you can download it immediately from its archive page.</p>\n" +
            "<p>Do you think this is a good addition to the suite of plugins? Do you have any questions or concerns? Do you just want to say hi? Please stop by our <a href=\"https://discourse.igniterealtime.org/\">community forum</a> or our <a href=\"https://www.igniterealtime.org/support/group_chat.jsp\">live groupchat</a>!</p>\n" +
            "<p>For other release announcements and news follow us on <a href=\"https://toot.igniterealtime.org/@news\">Mastodon</a> or <a href=\"https://x.com/IgniteRealtime\">X</a></p>\n";
        assertEquals(expected, result);
    }
}
