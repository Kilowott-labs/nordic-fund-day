<?php
//breadcrumb custom changes
add_filter( 'wpseo_breadcrumb_links', function( $links ) {
    if ( is_singular() ) {
        global $post;
        $post_type = get_post_type( $post );
        $post_type_obj = get_post_type_object( $post_type );

        if ( $post_type_obj && ($post_type_obj->has_archive || $post_type_obj->name == 'post' ) ) {
            if($post_type_obj->name == 'post'){
                $breadcrumb_label = __('Aktuelt','ytf');
                $archive_link = get_link_by_page_template( 'archive-posts' );
                // Insert before the current post
                array_splice( $links, count( $links ) - 1, 0, [
                    [
                        'url'  => $archive_link,
                        'text' => $breadcrumb_label,
                    ]
                ]);
            }else if($post_type_obj->name == 'courses'){
                $count = count($links);
                if ( $count >= 2 ) {
                    $archive_index = $count - 2;
                    $links[$archive_index]['text'] = __( 'Kurs og arrangementer', 'ytf' );
                    $links[$archive_index]['url']  = get_link_by_page_template('archive-courses');
                }
            }else if($post_type_obj->name == 'medlems_fordel'){
                $count = count($links);
                if ( $count >= 2 ) {
                    $archive_index = $count - 2;
                    $links[$archive_index]['text'] = __( 'Medlemsfordeler', 'ytf' );
                    $links[$archive_index]['url']  = get_link_by_page_template('archive-medlems_fordel');
                }
            }
        }
    }
    if ( ( is_category() || is_tag() || is_tax() ) && is_paged() ) {
        //remove the last link from paged url to show only home link
        array_pop( $links );
    }
    return $links;
});
