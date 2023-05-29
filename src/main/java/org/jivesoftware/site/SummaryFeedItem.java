package org.jivesoftware.site;

import org.json.JSONObject;

/**
 * A summary representation of a Discourse RSS item.
 *
 * @author Guus der Kinderen, guus.der.kinderen@gmail.com
 */
public class SummaryFeedItem
{
    public String authorName;
    public String authorUsername;
    public String messageUrl;
    public String subject;

    public SummaryFeedItem( JSONObject entry )
    {
        if (entry == null)
        {
            throw new IllegalArgumentException( "Argument 'entry' cannot be null." );
        }

        final JSONObject firstPost = entry.getJSONObject( "post_stream" ).getJSONArray( "posts" ).getJSONObject( 0 );
        authorUsername = firstPost.getString( "username" );
        authorName = firstPost.optString( "name" );
        if ( authorName == null || authorName.isEmpty() )
        {
            authorName = authorUsername;
        }
        subject = entry.getString( "title" );
        messageUrl = "https://discourse.igniterealtime.org/t/" + firstPost.getString( "topic_slug" );
    }

//    public SummaryFeedItem( SyndEntry entry )
//    {
//        if (entry == null)
//        {
//            throw new IllegalArgumentException( "Argument 'entry' cannot be null." );
//        }
//
//        if ( entry.getAuthor() == null )
//        {
//            this.authorName = "";
//            this.authorUsername = "";
//        }
//        else if ( entry.getAuthor().contains( " " ))
//        {
//            this.authorName = entry.getAuthor().substring( entry.getAuthor().indexOf( ' ' ) ).trim();
//            this.authorUsername = entry.getAuthor().substring( 1, entry.getAuthor().indexOf( ' ' ) ).trim();
//        }
//        else
//        {
//            this.authorName = entry.getAuthor().trim();
//            this.authorUsername = entry.getAuthor().trim();
//        }
//
//        while ( this.authorUsername.startsWith( "@" ) )
//        {
//            this.authorUsername = this.authorUsername.substring( 1 ).trim();
//        }
//
//        this.messageUrl = entry.getLink();
//        this.subject = entry.getTitle().trim();
//    }

    public String getAuthorName()
    {
        return authorName;
    }

    public String getMessageUrl()
    {
        return messageUrl;
    }

    public String getSubject()
    {
        return subject;
    }

    public String getAuthorUsername()
    {
        return authorUsername;
    }
}
