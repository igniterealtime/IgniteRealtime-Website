package org.jivesoftware.site;

import net.sf.json.JSONObject;

import java.util.Date;
import java.util.List;

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
        publishedDate = javax.xml.bind.DatatypeConverter.parseDateTime( firstPost.getString( "created_at" ) ).getTime();
        tags = ((List<String>) entry.getJSONArray( "tags" )).toArray( new String[0] );
        replyCount = entry.getInt( "posts_count" );
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
