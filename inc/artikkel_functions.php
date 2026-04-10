<?php
add_action('rest_api_init', function () {
    register_rest_route('coretrek/v1', '/filter-artikkel', [
        'methods'  => 'GET',
        'callback' => 'coretrek_filter_artikkel_callback',
        'permission_callback' => '__return_true'
    ]);
});

function coretrek_filter_artikkel_callback($request) {
    $paged = $request->get_param('page') ? absint($request->get_param('page')) : 1;
    $args = [
        'post_type' => 'post',
        'posts_per_page' => 12,
        'post_status' => 'publish',
        'paged' => $paged
    ];

    $tax_query = [];
    $meta_query = [];

    $category_ids = $request->get_param('category');
    if (!empty($category_ids)) {
        $tax_query[] = ['taxonomy' => 'category', 'field' => 'slug', 'terms' => explode(',', $category_ids)];
    }

    if (!empty($tax_query)) { $args['tax_query'] = $tax_query; }
    if (!empty($meta_query)) { $args['meta_query'] = $meta_query; }
    $query = new WP_Query($args);
    ob_start();

    if ($query->have_posts()) {
        echo '<div class="wp-block-group artikkel-grid-container">';
        echo '<ul class="wp-block-post-template artikkel-query-loop">';
        while ($query->have_posts()) {
            $query->the_post();
            $pattern = WP_Block_Patterns_Registry::get_instance()->get_registered('coretrek/artikkel-card');
    
            if ($pattern) {
                echo do_blocks($pattern['content']);
            }
        }
        echo '</ul>';
        echo '</div>';
    } else {
        echo '<div class="no-results"><p>';
        _e( 'Ingen artikkel funnet.', 'coretrek' );
        echo '</p></div>';
    }
    $posts_html = ob_get_clean();

    $query_args = $_GET;
    unset($query_args['page']);

    $pagination_html = paginate_links([
        'base'      => '?page=%#%',
        'format'    => '?page=%#%',
        'current'   => max(1, $paged),
        'total'     => $query->max_num_pages,
        'prev_text' => '‹',
        'next_text' => '›',
        'type'      => 'plain',
        'add_args'  => $query_args,
    ]);

    wp_reset_postdata();

    $response_data = [
        'success'    => true,
        'html'       => $posts_html,
        'pagination' => $pagination_html ?: '',
        'current_page'=> $paged
    ];
    
    return new WP_REST_Response($response_data, 200);
}