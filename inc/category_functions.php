<?php
/**
 * Get taxonomy terms (with transient caching) for given taxonomy name.
 *
 * @param string $taxonomy
 * @return array
 */
function coretrek_get_cached_terms($taxonomy) {
    $excluded_slugs = ['uncategorized', 'ukategorisert'];
    $transient_key = 'coretrek_terms_' . $taxonomy;

    // Try to get cached data
    $terms = get_transient($transient_key);
    if ($terms !== false) {
        return $terms;
    }

    // Fetch from database
    $query = get_terms([
        'taxonomy'   => $taxonomy,
        'hide_empty' => true,
    ]);

    if (is_wp_error($query)) {
        return [];
    }

    $terms = [];
    foreach ($query as $term) {
        if (in_array($term->slug, $excluded_slugs, true)) {
            continue;
        }
        $terms[] = [
            'slug' => $term->slug,
            'name' => $term->name,
        ];
    }

    // Cache for 24 hours
    set_transient($transient_key, $terms, 24 * HOUR_IN_SECONDS);

    return $terms;
}

/**
 * Clear the transient cache when any supported taxonomy changes.
 */
function coretrek_clear_all_term_transients($term_id, $tt_id, $taxonomy) {
    $supported_taxonomies = ['fordel_kategori', 'category'];

    if (in_array($taxonomy, $supported_taxonomies, true)) {
        delete_transient('coretrek_terms_' . $taxonomy);
    }
}
add_action('created_term', 'coretrek_clear_all_term_transients', 10, 3);
add_action('edited_term', 'coretrek_clear_all_term_transients', 10, 3);
add_action('delete_term', 'coretrek_clear_all_term_transients', 10, 3);


function coretrek_clear_transients_on_save_post( $post_id, $post, $update ) {
    // 1. Safety Checks (Skip autosaves and revisions)
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( wp_is_post_revision( $post_id ) ) {
        return;
    }

    // 2. MAP Post Types to Taxonomies
    $type_tax_map = [
        'post'    => 'category',
        'medlems_fordel'  => 'fordel_kategori'
    ];

    // 3. Check if the current post type is in our map
    $current_post_type = $post->post_type;

    if ( array_key_exists( $current_post_type, $type_tax_map ) ) {
        
        $taxonomy_to_clear = $type_tax_map[ $current_post_type ];

        // Delete the transient
        delete_transient( 'coretrek_terms_' . $taxonomy_to_clear );
    }
}

// Hook into save_post
add_action( 'save_post', 'coretrek_clear_transients_on_save_post', 10, 3 );

function get_current_category_name() {
    $category_html = '';
    if (is_category()) {
        $category = get_queried_object();
        $category_html = esc_html($category->name);
    } elseif (is_tax()) {
        $term = get_queried_object();
       $category_html = esc_html($term->name);
    }
    if($category_html){
        return '<h2 style="margin-top:var(--wp--preset--spacing--spacer-large);margin-bottom:var(--wp--preset--spacing--spacer-xxsmall);" class="is-style-Heading-style-h1 wp-block-post-title">'.$category_html.'</h2>';
    }else{
        return '';
    }
}
add_shortcode('current_category_name', 'get_current_category_name');