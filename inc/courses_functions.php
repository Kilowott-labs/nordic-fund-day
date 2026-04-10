<?php

// Register Courses Custom Post Type
function register_courses_cpt() {
    $labels = array(
        'name' => __('Kurs', 'coretrek'),
        'singular_name' => __('Kurs', 'coretrek'),
        'menu_name' => __('Kurs', 'coretrek'),
        'name_admin_bar' => __('Kurs', 'coretrek'),
        'add_new' => __('Legg til nytt', 'coretrek'),
        'add_new_item' => __('Legg til nytt kurs', 'coretrek'),
        'new_item' => __('Nytt kurs', 'coretrek'),
        'edit_item' => __('Rediger kurs', 'coretrek'),
        'view_item' => __('Vis kurs', 'coretrek'),
        'all_items' => __('Alle kurs', 'coretrek'),
        'search_items' => __('Søk i kurs', 'coretrek'),
        'not_found' => __('Ingen kurs funnet.', 'coretrek'),
        'not_found_in_trash' => __('Ingen kurs funnet i papirkurven.', 'coretrek')
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-welcome-learn-more',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest' => true,
        'rest_base' => 'courses',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );

    register_post_type('courses', $args);
}
add_action('init', 'register_courses_cpt');

// Register Course Type Taxonomy
function register_course_category_taxonomy() {
    $labels = array(
        'name' => __('Kurskategori', 'coretrek'),
        'singular_name' => __('Kurskategori', 'coretrek'),
        'search_items' => __('Søk i kurskategorier', 'coretrek'),
        'all_items' => __('Alle kurskategorier', 'coretrek'),
        'edit_item' => __('Rediger kurskategori', 'coretrek'),
        'update_item' => __('Oppdater kurskategori', 'coretrek'),
        'add_new_item' => __('Legg til ny kurskategori', 'coretrek'),
        'new_item_name' => __('Nytt kurskategorinavn', 'coretrek'),
        'menu_name' => __('Kurskategorier', 'coretrek'),
    );

    $args = array(
        'labels' => $labels,
        'hierarchical' => true,
        'public' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud' => true,
        'show_in_rest' => true,
        'rest_base' => 'course-category',
    );

    register_taxonomy('course_category', array('courses'), $args);
}
add_action('init', 'register_course_category_taxonomy');

// Register Meta Fields for Courses
function register_courses_meta_fields() {
    $meta_fields = array(
        'course_date' => array(
            'type' => 'string',
            'description' => 'Kursstartdato',
            'single' => true,
            'show_in_rest' => true,
        ),
        'course_end_date' => array(
            'type' => 'string',
            'description' => 'Kursets sluttdato',
            'single' => true,
            'show_in_rest' => true,
        ),
        'course_location' => array(
            'type' => 'string',
            'description' => 'Sted',
            'single' => true,
            'show_in_rest' => true,
        ),
        'course_status' => array(
            'type' => 'string',
            'description' => 'Kurs status',
            'single' => true,
            'show_in_rest' => true,
        )
    );

    foreach ($meta_fields as $key => $args) {
        register_post_meta('courses', $key, $args);
    }
}
add_action('init', 'register_courses_meta_fields');

// Add custom columns to Courses admin list
function add_courses_admin_columns($columns) {
    $new_columns = array(
        'cb' => $columns['cb'],
        'title' => $columns['title'],
        'course_category' => __('Kategori', 'coretrek'),
        'course_date' => __('Start dato', 'coretrek'),
        'course_end_date' => __('Slutt dato', 'coretrek'),
        'course_location' => __('Sted', 'coretrek'),
        'course_status' => __('Status', 'coretrek'),
        'date' => $columns['date']
    );
    return $new_columns;
}
add_filter('manage_courses_posts_columns', 'add_courses_admin_columns');

define('STATUS_TRANSLATIONS' , [
    'active' => __('Ledige plasser', 'coretrek'),
    'few'    => __('Få plasser', 'coretrek'),
    'full'   => __('Fullbooket', 'coretrek'),
]);

// Populate custom columns
function populate_courses_admin_columns($column, $post_id) {
    switch ($column) {
        case 'course_category':
            $terms = get_the_terms($post_id, 'course_category');
            if ($terms && !is_wp_error($terms)) {
                $term_names = array();
                foreach ($terms as $term) {
                    $term_names[] = $term->name;
                }
                echo implode(', ', $term_names);
            }
            break;
        case 'course_date':
            $date = get_post_meta($post_id, 'course_date', true);
            if ($date) {
                echo date('d.m.Y', strtotime($date));
            }
            break;
        case 'course_end_date':
            $date = get_post_meta($post_id, 'course_end_date', true);
            if ($date) {
                echo date('d.m.Y', strtotime($date));
            }
            break;
        case 'course_location':
            echo get_post_meta($post_id, 'course_location', true);
            break;
        case 'course_status':
            $status = get_post_meta($post_id, 'course_status', true); 
            $status = empty($status) ? 'active': $status ;
            echo STATUS_TRANSLATIONS[$status];
            break;
    }
}
add_action('manage_courses_posts_custom_column', 'populate_courses_admin_columns', 10, 2);

// Make custom columns sortable
function make_courses_columns_sortable($columns) {
    $columns['course_category'] = 'course_category';
    $columns['course_date'] = 'course_date';
    $columns['course_end_date'] = 'course_end_date';
    $columns['course_status'] = 'course_status';
    return $columns;
}
add_filter('manage_edit-courses_sortable_columns', 'make_courses_columns_sortable');

// Modify REST API response to include meta fields
function modify_courses_rest_response($response, $post, $request) {
    $meta_fields = array(
        'course_date',
        'course_end_date',
        'course_location',
        'course_status'
    );

    foreach ($meta_fields as $field) {
        $response->data[$field] = get_post_meta($post->ID, $field, true);
    }
    // Add course type taxonomy terms
    $course_categories = get_the_terms($post->ID, 'course_category');
    $response->data['course_category'] = $course_categories ? array_map(function($term) {
        return array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug
        );
    }, $course_categories) : array();

    return $response;
}
add_filter('rest_prepare_courses', 'modify_courses_rest_response', 10, 3);



// Add meta box for course details
function add_courses_meta_boxes() {
    add_meta_box(
        'course_details',
        __('Kurs detaljer', 'coretrek'),
        'render_course_details_meta_box',
        'courses',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'add_courses_meta_boxes');

function render_course_details_meta_box($post) {
    wp_nonce_field('save_course_details', 'course_details_nonce');
    
    $meta_fields = array(
        'course_date' => array(
            'label' => __('Start dato', 'coretrek'),
            'type' => 'date'
        ),
        'course_end_date' => array(
            'label' => __('Slutt dato', 'coretrek'),
            'type' => 'date'
        ),
        'course_location' => array(
            'label' => __('Sted', 'coretrek'),
            'type' => 'text'
        ) ,
        'course_status' => array(
            'label' => __('Status', 'coretrek'),
            'type' => 'select',
            'options' => array(
                '' => __('Select Status', 'coretrek'),
                'active' => __('Ledige plasser', 'coretrek'),
                'few' => __('Få plasser', 'coretrek'),
                'full' => __('Fullbooket', 'coretrek')
            )
        )   
    );

    echo '<table class="form-table"><tbody>';
    
    foreach ($meta_fields as $key => $field) {
        $value = get_post_meta($post->ID, $key, true);
        echo '<tr>';
        echo '<th scope="row"><label for="' . $key . '">' . $field['label'] . '</label></th>';
        echo '<td>';
        
        switch ($field['type']) {
            case 'select':
                echo '<select name="' . $key . '" id="' . $key . '" style="width: 100%;">';
                foreach ($field['options'] as $option_value => $option_label) {
                    echo '<option value="' . $option_value . '" ' . selected($value, $option_value, false) . '>' . $option_label . '</option>';
                }
                echo '</select>';
                break;
            case 'date':
                echo '<input type="date" name="' . $key . '" id="' . $key . '" value="' . esc_attr($value) . '" style="width: 100%;" />';
                break;
            case 'number':
                echo '<input type="number" name="' . $key . '" id="' . $key . '" value="' . esc_attr($value) . '" style="width: 100%;" />';
                break;
            default:
                echo '<input type="text" name="' . $key . '" id="' . $key . '" value="' . esc_attr($value) . '" style="width: 100%;" />';
                break;
        }
        
        echo '</td></tr>';
    }
    
    echo '</tbody></table>';
}

// Save meta box data
function save_course_details($post_id) {
    if (!isset($_POST['course_details_nonce']) || 
        !wp_verify_nonce($_POST['course_details_nonce'], 'save_course_details') ||
        defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ||
        !current_user_can('edit_post', $post_id)) {
        return;
    }

    $meta_fields = array(
        'course_date',
        'course_end_date',
        'course_location',
        'course_status'
    );

    foreach ($meta_fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post_courses', 'save_course_details');


function add_course_date_overlay_to_featured_image($html, $post_id, $post_thumbnail_id) {
    if (get_post_type($post_id) === 'courses' && !empty($html)) {
        $course_end_date = get_post_meta($post_id, 'course_end_date', true);
        if ($course_end_date) {
            $date_obj = DateTime::createFromFormat('Y-m-d', $course_end_date);
            if ($date_obj) {
                $day = $date_obj->format('d');
                $month = $date_obj->format('M');
                
                $date_overlay = '<div class="course-date-overlay">
                    <div class="date-day">' . $day . '</div>
                    <div class="date-month">' . strtoupper($month) . '</div></div>';
                
                $html .=  $date_overlay ;
            }
        }
    }
    return $html;
}
add_filter('post_thumbnail_html', 'add_course_date_overlay_to_featured_image', 10, 3);


function add_course_meta_after_post_date( $block_content, $block ) {

    if ( 'core/post-title' === $block['blockName'] && 'courses' === get_post_type() ) {

        // Get the current post's ID from the loop
        $post_id = get_the_ID();

        // Get the custom meta field values
        $from_date = get_post_meta( $post_id, 'course_date', true );
        $location  = get_post_meta( $post_id, 'course_location', true );
        $to_date = get_post_meta( $post_id, 'course_end_date', true );
        $status  = get_post_meta( $post_id, 'course_status', true );

        // Prepare the HTML for our custom meta
        $custom_meta_html = '';
        $custom_status_html ='';
        $main_post = false;
        // Determine status based on end date (only for single course page)
        if ( is_single() ) {
            $main_post_id = get_queried_object_id();
            $current_block_post_id = isset( $block['context']['postId'] ) ? intval( $block['context']['postId'] ) : get_the_ID();

            if ( $current_block_post_id == $main_post_id ) {
                $main_post = true;
                $status_key = $status ?: 'active';
                $active_class = $status_key;
                $translated_status = STATUS_TRANSLATIONS[$status_key] ?? STATUS_TRANSLATIONS['active'];
                $custom_status_html = '<span class="course-meta course-status '.esc_attr($active_class).'"> ' . esc_html( $translated_status ) . '</span>';
            }
        }
        $start_date = $end_date = '';
        // Add 'from_date' if it exists
        if ( ! empty( $from_date ) ) {
            $date_obj = DateTime::createFromFormat('Y-m-d', $from_date);
            if ($date_obj) {
                $timestamp = $date_obj->getTimestamp();       
                $start_date = wp_date('d. M Y', $timestamp);
            }
        }
        if ( ! empty( $to_date ) ) {
            $date_obj = DateTime::createFromFormat('Y-m-d', $to_date);
            if ($date_obj) {
                $timestamp = $date_obj->getTimestamp();       
                $end_date = wp_date('d. M Y', $timestamp);
            }
        }
        if(! empty($start_date)||! empty( $end_date )){
            $date_array = [];
            if(! empty($start_date)) {
                $date_array[] = $start_date;
            }
            if(! empty($end_date)) {
                $date_array[] = $end_date;
            }
            $date_html = implode('-',$date_array);
            $custom_meta_html .= '<span class="course-meta course-from-date">'.$date_html .'</span>';
        }

        // Add 'location' if it exists
        if ( ! empty( $location ) ) {
            $custom_meta_html .= '<span class="course-meta course-location"> ' . esc_html( $location ) . '</span>';
        }

        if(!empty($custom_status_html)){
            $custom_meta_html .= $custom_status_html;
        }

        // If we have custom meta, append it to the original block content
        if ( ! empty( $custom_meta_html ) ) {
            $block_content .= '<div class="course-meta-wrapper">'.$custom_meta_html.'</div>';
        }
    }

    // Always return the block content
    return $block_content;
}

add_filter( 'render_block', 'add_course_meta_after_post_date', 10, 2 );


add_action('rest_api_init', function () {
    register_rest_route('coretrek/v1', '/filter-courses', [
        'methods'  => 'GET',
        'callback' => 'coretrek_filter_courses_callback',
        'permission_callback' => '__return_true'
    ]);
});

function coretrek_filter_courses_callback($request) {
    // 1. SET UP THE QUERY ARGUMENTS
    $paged = $request->get_param('page') ? absint($request->get_param('page')) : 1;
    $args = [
        'post_type' => 'courses',
        'posts_per_page' => 12,
        'post_status' => 'publish',
        'paged' => $paged
    ];

    $tax_query = [];
    $meta_query = [];

    $category_ids = $request->get_param('course_category');
    if (!empty($category_ids)) {
        $tax_query[] = ['taxonomy' => 'course_category', 'field' => 'slug', 'terms' => explode(',', $category_ids)];
    }
    
    $location = $request->get_param('location');
    if (!empty($location)) {
        $meta_query[] = ['key' => 'course_location', 'value' => sanitize_text_field($location), 'compare' => 'IN'];
    }

    if (!empty($tax_query)) { $args['tax_query'] = $tax_query; }
    if (!empty($meta_query)) { $args['meta_query'] = $meta_query; }

    // 2. RUN THE QUERY AND GENERATE THE POSTS HTML
    $query = new WP_Query($args);
    ob_start();

    if ($query->have_posts()) {
        echo '<div class="wp-block-group courses-grid-container">';
        echo '<ul class="wp-block-post-template courses-query-loop">';
        while ($query->have_posts()) {
            $query->the_post();
            $pattern = WP_Block_Patterns_Registry::get_instance()->get_registered('coretrek/kurs-card');
    
            if ($pattern) {
                echo do_blocks($pattern['content']);
            };
        }
        echo '</ul>';
        echo '</div>';
    } else {
        echo '<div class="no-results"><p>';
        _e('Ingen kurs funnet.');
        echo '</p></div>';
    }
    $posts_html = ob_get_clean();

    // 3. PREPARE PAGINATION ARGS (must happen *before* wp_reset_postdata)
    $query_args = $_GET;
    unset($query_args['page']);

    // 4. GENERATE PAGINATION HTML (must also happen *before* wp_reset_postdata)
    $pagination_html = paginate_links([
        'base'      => '?page=%#%',  // Changed from '#%#%' to '?page=%#%'
        'format'    => '?page=%#%',
        'current'   => max(1, $paged),
        'total'     => $query->max_num_pages,
        'prev_text' => '‹',
        'next_text' => '›',
        'type'      => 'plain',
        'add_args'  => $query_args,
    ]);

    // 5. NOW IT'S SAFE TO RESET THE POST DATA
    wp_reset_postdata();

    // 6. PREPARE AND RETURN THE FINAL RESPONSE
    $response_data = [
        'success'    => true,
        'html'       => $posts_html,
        'pagination' => $pagination_html ?: '',
    ];
    
    return new WP_REST_Response($response_data, 200);
}

// Add locations to REST API response
add_action('rest_api_init', function () {
    register_rest_field('courses', 'locations', [
        'get_callback' => function ($post_arr) {
            return get_post_meta($post_arr['id'], 'course_location', true);
        },
    ]);
});

add_action('rest_api_init', function () {
    register_rest_route('coretrek/v1', '/locations', [
        'methods'  => 'GET',
        'callback' => function () {
            global $wpdb;

            // This improved query only gets 'location' meta from the 'courses' post type.
            $query = $wpdb->prepare(
                "SELECT DISTINCT pm.meta_value
                 FROM {$wpdb->postmeta} pm
                 INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
                 WHERE p.post_type = %s
                 AND pm.meta_key = %s
                 AND pm.meta_value != ''
                 ORDER BY pm.meta_value ASC",
                'courses', // The post type
                'course_location' // The meta key
            );

            $results = $wpdb->get_col($query);
            return $results ?: [];
        },
        'permission_callback' => '__return_true' // Good practice for public endpoints
    ]);
});



// Helper function to create a proper block array
function create_template_block($block_name, $attrs = [], $inner_blocks = []) {
    return [
        'blockName'    => $block_name,
        'attrs'        => $attrs,
        'innerBlocks'  => $inner_blocks,
        'innerHTML'    => '',
        'innerContent' => $inner_blocks ? array_fill(0, count($inner_blocks), null) : ['']
    ];
}
// Convert blueprint to render-ready blocks
function build_each_block($blueprint) {
    $blocks = [];
    
    foreach ($blueprint as $block_def) {
        $inner_blocks = [];
        
        if (!empty($block_def['children'])) {
            $inner_blocks = build_each_block($block_def['children']);
        }
        
        $blocks[] = create_template_block(
            $block_def['name'],
            $block_def['attrs'] ?? [],
            $inner_blocks
        );
    }
    
    return $blocks;
}


/**
 * Define custom meta keys for filters
 * Customize this array with your actual post meta keys
 */
function get_course_filter_meta_keys() {
    return ['course_location']; // Add your meta keys here
}

/**
 * Define filter labels
 * Customize labels for your meta keys
 */
function get_course_filter_labels() {
    return [
       "course_location"=> __('Sted','coretrek')
    ];
}

/**
 * Get current filters from URL or passed array
 * 
 * @param array|null $filters Optional filters array
 * @return array Parsed filters
 */
function get_current_course_filters($filters = null) {
    if ($filters === null) {
        $filters = $_GET;
    }
    
    $current = [
        'category' => isset($filters['category']) ? explode(',', $filters['category']) : [],
        'meta' => []
    ];
    
    // Get meta filters
    foreach (get_course_filter_meta_keys() as $meta_key) {
        if (isset($filters[$meta_key]) && !empty($filters[$meta_key])) {
            $current['meta'][$meta_key] = $filters[$meta_key];
        }
    }
    
    return $current;
}

/**
 * Get course count based on filters
 */
function get_course_count($filters = null) {
    $current = get_current_course_filters($filters);
    
    $args = [
        'post_type' => 'courses',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'fields' => 'ids'
    ];
    
    // Apply category filter
    if (!empty($current['category'])) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'course_category',
                'field' => 'slug',
                'terms' => $current['category']
            ]
        ];
    }
    
    // Apply meta filters
    $meta_query = ['relation' => 'AND'];
    
    foreach (get_course_filter_meta_keys() as $meta_key) {
        if (isset($current['meta'][$meta_key]) && !empty($current['meta'][$meta_key])) {
            $meta_query[] = [
                'key' => $meta_key,
                'value' => explode(',', $current['meta'][$meta_key]),
                'compare' => 'IN'
            ];
        }
    }
    
    if (count($meta_query) > 1) {
        $args['meta_query'] = $meta_query;
    }
    
    $query = new WP_Query($args);
    $count = $query->found_posts;
    wp_reset_postdata();
    
    return $count;
}

/**
 * Get available filter options based on current selections (Smart Filtering)
 * 
 * @param array $current_filters Current active filters
 * @return array Available filter options
 */
function get_available_course_filters($current_filters) {
    $available = [
        'categories' => [],
        'meta' => []
    ];
    
    // Always get all categories
    $available['categories'] = get_terms([
        'taxonomy' => 'course_category',
        'hide_empty' => true
    ]);
    
    // Get available meta filter values based on current filters
    $meta_keys = get_course_filter_meta_keys();
    foreach ($meta_keys as $meta_key) {
        $meta_args = [
            'post_type' => 'courses',
            'posts_per_page' => -1,
            'fields' => 'ids',
            'meta_query' => [
                [
                    'key' => $meta_key,
                    'compare' => 'EXISTS'
                ]
            ]
        ];
        
        // Apply category filter
        if (!empty($current_filters['category'])) {
            $meta_args['tax_query'] = [
                [
                    'taxonomy' => 'course_category',
                    'field' => 'slug',
                    'terms' => $current_filters['category']
                ]
            ];
        }
        
        // Apply other meta filters (smart filtering)
        foreach (get_course_filter_meta_keys() as $other_meta_key) {
            if ($other_meta_key !== $meta_key && isset($current_filters['meta'][$other_meta_key]) && !empty($current_filters['meta'][$other_meta_key])) {
                if (!isset($meta_args['meta_query']['relation'])) {
                    $meta_args['meta_query']['relation'] = 'AND';
                }
                $meta_args['meta_query'][] = [
                    'key' => $other_meta_key,
                    'value' => explode(',', $current_filters['meta'][$other_meta_key]),
                    'compare' => 'IN'
                ];
            }
        }
        
        $meta_query = new WP_Query($meta_args);
        $available['meta'][$meta_key] = [];
        
        if ($meta_query->have_posts()) {
            foreach ($meta_query->posts as $post_id) {
                $value = get_post_meta($post_id, $meta_key, true);
                if ($value && !in_array($value, $available['meta'][$meta_key])) {
                    $available['meta'][$meta_key][] = $value;
                }
            }
        }
        sort($available['meta'][$meta_key]);
        wp_reset_postdata();
    }
    
    return $available;
}

/**
 * Generate Filter Pills HTML
 * 
 * @param array|null $filters Optional filters array
 * @return string HTML for filter pills
 */
function get_course_filter_pills($filters = null) {
    $current = get_current_course_filters($filters);
    $active_filters = [];
    
    // Category pills
    if (!empty($current['category'])) {
        foreach ($current['category'] as $cat_slug) {
            $term = get_term_by('slug', $cat_slug, 'course_category');
            if ($term) {
                $active_filters[] = [
                    'type' => 'category',
                    'value' => $cat_slug,
                    'label' => $term->name
                ];
            }
        }
    }
    
    // Meta filter pills
    foreach (get_course_filter_meta_keys() as $meta_key) {
        if (isset($current['meta'][$meta_key]) && !empty($current['meta'][$meta_key])) {
            $values = explode(',', $current['meta'][$meta_key]);
            foreach ($values as $val) {
                $active_filters[] = [
                    'type' => $meta_key,
                    'value' => $val,
                    'label' => ucfirst(str_replace('-', ' ', $val))
                ];
            }
        }
    }
    
    if (empty($active_filters)) {
        return '';
    }
    
    ob_start();
    echo '<div class="active-filters">';
    foreach ($active_filters as $filter) {
        echo '<span class="filter-pill" data-filter-type="' . esc_attr($filter['type']) . '" data-filter-value="' . esc_attr($filter['value']) . '">';
        echo esc_html($filter['label']);
        echo '<button class="remove-filter" aria-label="Remove filter">&times;</button>';
        echo '</span>';
    }
    echo '</div>';
    return ob_get_clean();
}

/**
 * Generate Filter Sidebar HTML
 * 
 * @param array|null $filters Optional filters array
 * @return string HTML for filter sidebar
 */
function get_course_filter_sidebar($include_mobile_footer = false, $filters = null) {
    $current = get_current_course_filters($filters);
    $available = get_available_course_filters($current);
    $filter_labels = get_course_filter_labels();
    $count = get_course_count($filters);
    
    ob_start();
    ?>
    <div class="filter-sidebar" id="filter-sidebar">
        <div class="filter-header">
            <h3><?php _e( 'Filtrer','coretrek'); ?><span class="close-modal"></span></h3>
        </div>

        <div class="filter-form-wrapper">
            <!-- Category Filter -->
            <div class="filter-group">
                <h4 class="filter-title">
                    <span><?php _e('Kategori', 'coretrek'); ?></span>
                </h4>
                <div class="filter-options" id="category-filters">
                    <?php if (!empty($available['categories'])) : ?>
                        <?php foreach ($available['categories'] as $term) : ?><label class="filter-checkbox"><input 
                                    type="checkbox" 
                                    name="category[]" 
                                    value="<?php echo esc_attr($term->slug); ?>"
                                    data-filter-type="category"
                                    <?php checked(in_array($term->slug, $current['category'])); ?>
                                ><span class="checkbox-label"><?php echo esc_html($term->name); ?></span></label><?php endforeach; ?>
                    <?php else : ?>
                        <p class="no-filters"><?php _e('Ingen kategorier tilgjengelig', 'coretrek'); ?></p>
                    <?php endif; ?>
                </div>
            </div>

            <?php
            foreach (get_course_filter_meta_keys() as $meta_key) :
                if (empty($available['meta'][$meta_key])) continue;
                
                $current_values = isset($current['meta'][$meta_key]) ? explode(',', $current['meta'][$meta_key]) : [];
            ?>
                <div class="filter-group">
                    <h4 class="filter-title">
                        <span><?php echo esc_html($filter_labels[$meta_key]); ?></span>
                    </h4>
                    <div class="filter-options" id="<?php echo esc_attr($meta_key); ?>-filters">
                        <?php foreach ($available['meta'][$meta_key] as $value) : ?><label class="filter-checkbox"><input 
                                    type="checkbox" 
                                    name="<?php echo esc_attr($meta_key); ?>[]" 
                                    value="<?php echo esc_attr($value); ?>"
                                    data-filter-type="<?php echo esc_attr($meta_key); ?>"
                                    <?php checked(in_array($value, $current_values)); ?>
                                ><span class="checkbox-label"><?php echo esc_html(ucfirst(str_replace('-', ' ', $value))); ?></span></label><?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <?php if ($include_mobile_footer) : ?>
        <div class="filter-bottom-wrapper mobile-only">
            <a href="#" class="mobile-clear-all"><?php _e('Nullstill', 'coretrek'); ?></a>
            <div class="view_result"><?php _e('Vis', 'coretrek'); ?> <span><?php echo esc_html($count); ?></span> <?php _e('resultater', 'coretrek'); ?></div>               
        </div>
        <?php endif; ?>
    </div>

    <?php
    return ob_get_clean();
}

/**
 * Generate Course Results HTML
 * 
 * @param array|null $filters Optional filters array
 * @return string HTML for course results grid and pagination
 */
function get_course_results($filters = null) {
    $current = get_current_course_filters($filters);
    $paged = isset($filters['paged']) ? intval($filters['paged']) : (get_query_var('paged') ? get_query_var('paged') : 1);
    
    // Build query args
    $args = [
        'post_type' => 'courses',
        'posts_per_page' => 12,
        'paged' => $paged,
        'post_status' => 'publish'
    ];
    
    // Apply category filter
    if (!empty($current['category'])) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'course_category',
                'field' => 'slug',
                'terms' => $current['category']
            ]
        ];
    }
    
    // Apply meta filters
    $meta_query = ['relation' => 'AND'];
    
    foreach (get_course_filter_meta_keys() as $meta_key) {
        if (isset($current['meta'][$meta_key]) && !empty($current['meta'][$meta_key])) {
            $meta_query[] = [
                'key' => $meta_key,
                'value' => explode(',', $current['meta'][$meta_key]),
                'compare' => 'IN'
            ];
        }
    }
    
    if (count($meta_query) > 1) {
        $args['meta_query'] = $meta_query;
    }
    
    $query = new WP_Query($args);
    
    ob_start();
    
    if ($query->have_posts()) {
        echo '<div class="course-grid wp-block-post-template">';
        while ($query->have_posts()) {
            $query->the_post();
            $pattern = WP_Block_Patterns_Registry::get_instance()->get_registered('coretrek/kurs-card');
    
            if ($pattern) {
                echo do_blocks($pattern['content']);
            }
        }
        echo '</div>';
        
        // Pagination
       if ($query->max_num_pages > 1) {
            echo '<div class="pagination-wrapper artikkel-pagination">';
            
            $pagination_args = [
                'total' => $query->max_num_pages,
                'current' => $paged,
                'prev_text' => '‹',
                'next_text' => '›',
                'type' => 'array',
                'base' => get_pagenum_link(1) . '%_%',
                'format' => '?paged=%#%'
            ];
            
            $pages = paginate_links($pagination_args);
            
            if ($pages) {
                echo '<div class="pagination ">';
                foreach ($pages as $page) {
                    echo $page;
                }
                echo '</div>';
            }
            echo '</div>';
        }
    } else {
        echo '<div class="no-results"><p>';
        _e( 'Ingen kurs funnet', 'coretrek' );
        echo '</p></div>';
    }
    
    wp_reset_postdata();
    return ob_get_clean();
}

/**
 * AJAX Handler for filtering courses
 */
function ajax_filter_courses() {
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'course_filter_nonce')) {
        wp_send_json_error('Invalid nonce');
        return;
    }
    
    // Parse filter parameters
    parse_str($_POST['filters'], $filters);
    $include_mobile_footer = true;
    // Get HTML for all components using our reusable functions
    $html = get_course_results($filters);
    $sidebar = get_course_filter_sidebar($include_mobile_footer,$filters);
    $pills = get_course_filter_pills($filters);
    $count = get_course_count($filters);
    
    wp_send_json_success([
        'html' => $html,
        'sidebar' => $sidebar,
        'pills' => $pills,
        'count' => $count
    ]);
}
/**
 * AJAX Handler for getting course count only (Mobile)
 */
function ajax_filter_courses_count() {
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'course_filter_nonce')) {
        wp_send_json_error('Invalid nonce');
        return;
    }
    
    parse_str($_POST['filters'], $filters);
    $count = get_course_count($filters);
    
    wp_send_json_success([
        'count' => $count
    ]);
}

// Register AJAX actions
add_action('wp_ajax_filter_courses', 'ajax_filter_courses');
add_action('wp_ajax_nopriv_filter_courses', 'ajax_filter_courses');
add_action('wp_ajax_filter_courses_count', 'ajax_filter_courses_count');
add_action('wp_ajax_nopriv_filter_courses_count', 'ajax_filter_courses_count');
/**
 * Shortcode to display the course archive layout.
 *
 * Usage: [course_archive_layout]
 */
function display_course_archive_layout_shortcode() {
    ob_start();
    ?>
    <div class="course-archive-container" data-ajax-url="<?php echo esc_url(admin_url('admin-ajax.php')); ?>"
     data-nonce="<?php echo esc_attr(wp_create_nonce('course_filter_nonce')); ?>">
        <div class="container">
            <div class="archive-layout">
                <aside class="archive-sidebar">
                    <div class="mobile-filter-btn">        
                    <?php _e( 'Filtrer','coretrek'); ?>         
                    </div>
                    <?php 
                        if (function_exists('get_course_filter_sidebar')) {
                            echo get_course_filter_sidebar(true); 
                        }
                    ?>
                </aside>
                <main class="archive-content">
                    <div class="filter-pills-container" id="filter-pills">
                        <?php 
                            if (function_exists('get_course_filter_pills')) {
                                echo get_course_filter_pills(); 
                            }
                        ?>
                    </div>
                    <div class="course-grid-wrapper courses-grid-container" id="course-results">
                        <?php 
                            if (function_exists('get_course_results')) {
                                echo get_course_results(); 
                            }
                        ?>
                    </div>
                    <div class="loading-spinner" id="loading-spinner" style="display: none;">
                        <div class="spinner"></div>
                    </div>
                </main>
            </div>
        </div>
    </div>
    <?php

    $output = ob_get_clean();
    return $output;
}

add_shortcode('course_archive_layout', 'display_course_archive_layout_shortcode');


function get_link_by_page_template( $template_name ) {
    $args = array(
        'post_type'      => 'page',      
        'post_status'    => 'publish',   
        'posts_per_page' => 1,           
        'meta_query'     => array(
            array(
                'key'     => '_wp_page_template',
                'value'   => $template_name,
                'compare' => '=',
            ),
        ),
    );

    $pages = get_posts( $args );
    if ( ! empty( $pages ) ) {
        return get_permalink( $pages[0]->ID );
    }

    return false;
}