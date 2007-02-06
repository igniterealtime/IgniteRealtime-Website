<?php

if (empty($wp)) {
	require_once('wp-config.php');
	wp('feed=rss2');
}

header('Content-type: text/xml; charset=' . get_settings('blog_charset'), true);
$more = 1;

function get_numposts2() {
	global $wpdb;
	global $wp_query;

        if (is_category()) {
                $cat_id = $wp_query->get_queried_object_id();
                return $wpdb->get_var("SELECT COUNT(*) FROM $wpdb->posts posts, $wpdb->post2cat p2c WHERE p2c.category_id = '$cat_id' AND posts.post_status = 'publish' AND p2c.post_id = posts.ID");
        }
        else {
	        return $wpdb->get_var("SELECT COUNT(*) FROM $wpdb->posts posts WHERE post_status = 'publish'");    
        }
}

function the_category_rss2($type = 'rss') {
    $categories = get_the_category();
    $the_list = '';
    foreach ($categories as $category) {
        $category->category_nicename = convert_chars($category->category_nicename);
        if ('rdf' == $type) {
            $the_list .= "\n\t\t<dc:subject>$category->category_nicename</dc:subject>\n";
        } else {
            $the_list .= "\n\t\t<category>$category->category_nicename</category>\n";
        }
    }
    echo apply_filters('the_category_rss', $the_list, $type);
}

?>
<?php echo '<?xml version="1.0" encoding="'.get_settings('blog_charset').'"?'.'>'; ?>

<!-- generator="wordpress/<?php bloginfo_rss('version') ?>" -->
<rss version="2.0" 
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:ignite="http://www.igniterealtime.org/xmlns/downloadstats/rss"
	<?php do_action('rss2_ns'); ?>
>

<channel>
	<title><?php bloginfo_rss('name'); ?></title>
	<link><?php bloginfo_rss('url') ?></link>
	<description><?php bloginfo_rss("description") ?></description>
	<pubDate><?php echo mysql2date('D, d M Y H:i:s +0000', get_lastpostmodified('GMT'), false); ?></pubDate>
	<generator>http://wordpress.org/?v=<?php bloginfo_rss('version'); ?></generator>
	<language><?php echo get_option('rss_language'); ?></language>
	<ignite:numposts><?php echo get_numposts2(); ?></ignite:numposts>
	<?php do_action('rss2_head'); ?>
	<?php $items_count = 0; if ($posts) { foreach ($posts as $post) { start_wp(); ?>
	<item>
		<title><?php the_title_rss() ?></title>
		<link><?php permalink_single_rss() ?></link>
		<comments><?php comments_link(); ?></comments>
        <ignite:commentCount><?php echo get_comments_number($post->ID) ?></ignite:commentCount>
		<pubDate><?php echo mysql2date('D, d M Y H:i:s +0000', get_post_time('Y-m-d H:i:s', true), false); ?></pubDate>
		<dc:creator><?php the_author() ?></dc:creator>
		<?php the_category_rss2() ?>

		<guid isPermaLink="false"><?php the_guid(); ?></guid>
<?php if (get_settings('rss_use_excerpt')) : ?>
		<description><![CDATA[<?php the_excerpt_rss() ?>]]></description>
<?php else : ?>
		<description><![CDATA[<?php the_excerpt_rss() ?>]]></description>
	<?php if ( strlen( $post->post_content ) > 0 ) : ?>
		<content:encoded><![CDATA[<?php the_content('', 0, '') ?>]]></content:encoded>
	<?php else : ?>
		<content:encoded><![CDATA[<?php the_excerpt_rss() ?>]]></content:encoded>
	<?php endif; ?>
<?php endif; ?>
		<wfw:commentRss><?php echo comments_rss(); ?></wfw:commentRss>
<?php rss_enclosure(); ?>
	<?php do_action('rss2_item'); ?>
	</item>
	<?php $items_count++; if (($items_count == get_settings('posts_per_rss')) && empty($m)) { break; } } } ?>
</channel>
</rss>
