package org.jivesoftware.site;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Date;

/**
 * A representation of a Discourse RSS item.
 *
 * @author Guus der Kinderen, guus.der.kinderen@gmail.com
 */
public class FeedItem extends SummaryFeedItem
{
    private String contents;
    private Date publishedDate;
    private String[] tags;
    private int replyCount;

    public FeedItem( JSONObject entry )
    {
        super( entry );

        final JSONObject firstPost = entry.getJSONObject( "post_stream" ).getJSONArray( "posts" ).getJSONObject( 0 );
        contents = firstPost.getString( "cooked" );
        contents = replaceVideo(contents);

        publishedDate = javax.xml.bind.DatatypeConverter.parseDateTime( firstPost.getString( "created_at" ) ).getTime();

        final JSONArray arrayElements = entry.getJSONArray("tags");
        tags = new String[arrayElements.length()];
        for (int i=0; i<arrayElements.length(); i++) {
            tags[i] = arrayElements.getString(i);
        }
        replyCount = entry.getInt( "posts_count" );
    }

    /**
     * Replaces embedded video in Discourse markup with a HTML5 'video' element.
     */
    public static String replaceVideo(final String data) {
        if (data == null) {
            return data;
        }

        final int start = data.indexOf("<div class=\"video-placeholder-container\" ");
        if (start < 0) {
            return data;
        }
        int end = data.indexOf("</div>", start);
        if (end < 0) {
            return data;
        } else {
            end += "</div>".length();
        }

        // Video
        int startVideoSrc = data.indexOf("data-video-src=\"", start);
        if (startVideoSrc < 0) {
            return data;
        } else {
            startVideoSrc += "data-video-src=\"".length();
        }
        int endVideoSrc = data.indexOf('"', startVideoSrc);
        final String videoSrc = data.substring(startVideoSrc, endVideoSrc);

        // Thumbnail ('poster')
        final String videoPoster;
        int startVideoPoster = data.indexOf("data-thumbnail-src=\"", start);
        if (startVideoPoster >= 0) {
            startVideoPoster += "data-thumbnail-src=\"".length();
            int endVideoPoster = data.indexOf('"', startVideoPoster);
            if (endVideoPoster < 0) {
                return data; // No closing quote? Sounds dodgy. Better abort.
            } else {
                videoPoster = data.substring(startVideoPoster, endVideoPoster);
            }
        } else {
            videoPoster = null;
        }

        // Build replacement data.
        final StringBuilder replacement = new StringBuilder();
        replacement.append("<video width=\"696\"");
        if (videoPoster != null && !videoPoster.isEmpty()) {
            replacement.append(" poster=\"").append(videoPoster).append("\"");
        }
        replacement.append(" controls>");
        replacement.append("<source src=\"").append(videoSrc).append("\"/>");
        replacement.append("Unable to show a video. <a href=\"").append(videoSrc).append("\">Download the video</a>");
        replacement.append("</video>");

        // Switch the original with the replacement.
        return data.substring(0, start) + replacement + data.substring(end);
    }
//    public FeedItem( SyndEntry entry )
//    {
//        super( entry );
//
//        contents = entry.getDescription().getValue();
//        if ( contents.contains( "<blockquote>" ) )
//        {
//            final int start = contents.indexOf( "<blockquote>" ) + "<blockquote>".length();
//            final int end = contents.lastIndexOf( "</blockquote>" );
//            if ( end > start)
//            {
//                contents = contents.substring( start, end );
//            }
//        }
//        publishedDate = entry.getPublishedDate();
//    }

    public String getContents()
    {
        return contents;
    }

    public Date getPublishedDate()
    {
        return publishedDate;
    }

    public String[] getTags()
    {
        return tags;
    }

    public int getReplyCount()
    {
        return replyCount;
    }
}
