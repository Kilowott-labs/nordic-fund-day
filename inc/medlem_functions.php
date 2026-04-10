<?php
// Hook into the 'init' action
add_action( 'init', 'mf_register_cpt_and_taxonomy' );

/**
 * Register a Custom Post Type for Member Benefits and a custom taxonomy.
 */
function mf_register_cpt_and_taxonomy() {

    // 1. CPT: Medlemsfordel (Member Benefit)
    $cpt_labels = array(
        'name'                  => _x( 'Medlemsfordeler', 'Post Type General Name', 'text_domain' ),
        'singular_name'         => _x( 'Medlemsfordel', 'Post Type Singular Name', 'text_domain' ),
        'menu_name'             => __( 'Medlemsfordeler', 'text_domain' ),
        'name_admin_bar'        => __( 'Medlemsfordel', 'text_domain' ),
        'archives'              => __( 'Fordelsarkiv', 'text_domain' ),
        'attributes'            => __( 'Fordelsattributter', 'text_domain' ),
        'parent_item_colon'     => __( 'Overordnet fordel:', 'text_domain' ),
        'all_items'             => __( 'Alle fordeler', 'text_domain' ),
        'add_new_item'          => __( 'Legg til ny fordel', 'text_domain' ),
        'add_new'               => __( 'Legg til ny', 'text_domain' ),
        'new_item'              => __( 'Ny fordel', 'text_domain' ),
        'edit_item'             => __( 'Rediger fordel', 'text_domain' ),
        'update_item'           => __( 'Oppdater fordel', 'text_domain' ),
        'view_item'             => __( 'Se fordel', 'text_domain' ),
        'view_items'            => __( 'Se fordeler', 'text_domain' ),
        'search_items'          => __( 'Søk i fordeler', 'text_domain' ),
    );
    $cpt_args = array(
        'label'                 => __( 'Medlemsfordel', 'text_domain' ),
        'description'           => __( 'Post type for medlemsfordeler', 'text_domain' ),
        'labels'                => $cpt_labels,
        'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-star-filled',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true, // This enables the REST API for the CPT
        'rest_base'             => 'medlems-fordeler', // API endpoint slug
    );
    register_post_type( 'medlems_fordel', $cpt_args );


    // 2. Custom Taxonomy: Fordelskategori (Benefit Category)
    $tax_labels = array(
        'name'                       => _x( 'Fordelskategorier', 'Taxonomy General Name', 'text_domain' ),
        'singular_name'              => _x( 'Fordelskategori', 'Taxonomy Singular Name', 'text_domain' ),
        'menu_name'                  => __( 'Kategorier', 'text_domain' ),
        'all_items'                  => __( 'Alle kategorier', 'text_domain' ),
        'parent_item'                => __( 'Overordnet kategori', 'text_domain' ),
        'parent_item_colon'          => __( 'Overordnet kategori:', 'text_domain' ),
        'new_item_name'              => __( 'Nytt kategorinavn', 'text_domain' ),
        'add_new_item'               => __( 'Legg til ny kategori', 'text_domain' ),
        'edit_item'                  => __( 'Rediger kategori', 'text_domain' ),
        'update_item'                => __( 'Oppdater kategori', 'text_domain' ),
        'view_item'                  => __( 'Se kategori', 'text_domain' ),
        'separate_items_with_commas' => __( 'Separer kategorier med komma', 'text_domain' ),
        'add_or_remove_items'        => __( 'Legg til eller fjern kategorier', 'text_domain' ),
        'choose_from_most_used'      => __( 'Velg fra mest brukte', 'text_domain' ),
        'popular_items'              => __( 'Populære kategorier', 'text_domain' ),
        'search_items'               => __( 'Søk i kategorier', 'text_domain' ),
        'not_found'                  => __( 'Ikke funnet', 'text_domain' ),
    );
    $tax_args = array(
        'labels'                     => $tax_labels,
        'hierarchical'               => true, // Makes it behave like post categories (true) or tags (false)
        'public'                     => true,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => true,
        'show_in_rest'               => true, // **This is the key to enabling the REST API**
        'rest_base'                  => 'fordelskategorier', // API endpoint slug
    );
    register_taxonomy( 'fordel_kategori', array( 'medlems_fordel' ), $tax_args );

}

// Optional: Flush rewrite rules on plugin activation to ensure the CPT and taxonomy URLs work correctly.
// You only need this if you are using the code as a plugin.
register_activation_hook( __FILE__, 'mf_rewrite_flush' );
function mf_rewrite_flush() {
    mf_register_cpt_and_taxonomy();
    flush_rewrite_rules();
}

add_action('rest_api_init', function () {
    register_rest_route('coretrek/v1', '/filter-medlem-fordel', [
        'methods'  => 'GET',
        'callback' => 'coretrek_filter_medlem_callback',
        'permission_callback' => '__return_true'
    ]);
});

function coretrek_filter_medlem_callback($request) {
    $paged = $request->get_param('page') ? absint($request->get_param('page')) : 1;
    $args = [
        'post_type' => 'medlems_fordel',
        'posts_per_page' => 12,
        'post_status' => 'publish',
        'paged' => $paged
    ];
    //Handle the search parameter
    $search_term = $request->get_param('search');
    if (!empty($search_term)) {
        // Add the 's' parameter to the query arguments for searching
        $args['s'] = sanitize_text_field($search_term);
        //add post type filter in algolia as this uses algolia search
        $args['type'] = 'medlems_fordel';
    }
    $tax_query = [];
    $meta_query = [];

    $category_ids = $request->get_param('fordel_kategori');
    if (!empty($category_ids)) {
        $tax_query[] = ['taxonomy' => 'fordel_kategori', 'field' => 'slug', 'terms' => explode(',', $category_ids)];
    }

    if (!empty($tax_query)) { $args['tax_query'] = $tax_query; }
    if (!empty($meta_query)) { $args['meta_query'] = $meta_query; }
    $query = new WP_Query($args);
    ob_start();

    if ($query->have_posts()) {
        echo '<div class="wp-block-group medlem-grid-container">';
        echo '<ul class="wp-block-post-template medlem-query-loop">';
        while ($query->have_posts()) {
            $query->the_post();
             $pattern = WP_Block_Patterns_Registry::get_instance()->get_registered('coretrek/medlem-card');
    
            if ($pattern) {
                echo do_blocks($pattern['content']);
            };
        }
        echo '</ul>';
        echo '</div>';
    } else {
        
        echo '<div class="no-results"><p>';
        _e( 'Ingen medlem funnet', 'coretrek' );
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

// Image upload for medlems_fordel CPT
function mf_add_image_meta_box() {
    add_meta_box(
        'mf_image_meta_box',
        __( 'Firmalogo', 'text_domain' ),
        'mf_image_meta_box_callback',
        'medlems_fordel',
        'side',
        'default'
    );
}
add_action( 'add_meta_boxes', 'mf_add_image_meta_box' );

// Meta box callback function
function mf_image_meta_box_callback( $post ) {
    wp_nonce_field( 'mf_save_image_meta', 'mf_image_meta_nonce' );
    
    $image_id = get_post_meta( $post->ID, 'medlem_image', true );
    $image_url = $image_id ? wp_get_attachment_image_url( $image_id, 'medium' ) : '';
    
    ?>
    <div class="mf-image-upload-wrapper">
        <div class="mf-image-preview">
            <?php if ( $image_url ) : ?>
                <img src="<?php echo esc_url( $image_url ); ?>" style="max-width: 100%; height: auto;" />
            <?php endif; ?>
        </div>
        <input type="hidden" id="mf_image_id" name="medlem_image" value="<?php echo esc_attr( $image_id ); ?>" />
        <p>
            <button type="button" class="button mf-upload-image-button">
                <?php echo $image_id ? __( 'Endre bilde', 'coretrek' ) : __( 'Last opp bilde', 'coretrek' ); ?>
            </button>
            <?php if ( $image_id ) : ?>
                <button type="button" class="button mf-remove-image-button"><?php _e( 'Fjern bilde', 'coretrek' ); ?></button>
            <?php endif; ?>
        </p>
    </div>
    
    <script type="text/javascript">
    jQuery(document).ready(function($) {
        var mediaUploader;
        
        $('.mf-upload-image-button').on('click', function(e) {
            e.preventDefault();
            
            if (mediaUploader) {
                mediaUploader.open();
                return;
            }
            
            mediaUploader = wp.media({
                title: '<?php _e( "Velg bilde", "coretrek" ); ?>',
                button: {
                    text: '<?php _e( "Bruk dette bildet", "coretrek" ); ?>'
                },
                multiple: false
            });
            
            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                $('#mf_image_id').val(attachment.id);
                $('.mf-image-preview').html('<img src="' + attachment.url + '" style="max-width: 100%; height: auto;" />');
                $('.mf-upload-image-button').text('<?php _e( "Endre bilde", "coretrek" ); ?>');
                if ($('.mf-remove-image-button').length === 0) {
                    $('.mf-upload-image-button').after('<button type="button" class="button mf-remove-image-button"><?php _e( "Fjern bilde", "coretrek" ); ?></button>');
                }
            });
            
            mediaUploader.open();
        });
        
        $(document).on('click', '.mf-remove-image-button', function(e) {
            e.preventDefault();
            $('#mf_image_id').val('');
            $('.mf-image-preview').html('');
            $('.mf-upload-image-button').text('<?php _e( "Last opp bilde", "coretrek" ); ?>');
            $(this).remove();
        });
    });
    </script>
    <?php
}

// Save meta box data
function mf_save_image_meta( $post_id ) {
    // Check nonce
    if ( ! isset( $_POST['mf_image_meta_nonce'] ) || ! wp_verify_nonce( $_POST['mf_image_meta_nonce'], 'mf_save_image_meta' ) ) {
        return;
    }
    
    // Check autosave
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    
    // Check permissions
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }
    
    // Save or delete the meta field
    if ( isset( $_POST['medlem_image'] ) ) {
        $image_id = sanitize_text_field( $_POST['medlem_image'] );
        if ( ! empty( $image_id ) ) {
            update_post_meta( $post_id, 'medlem_image', $image_id );
        } else {
            delete_post_meta( $post_id, 'medlem_image' );
        }
    }
}
add_action( 'save_post_medlems_fordel', 'mf_save_image_meta' );

// Append medlem_image to featured image block
function mf_append_medlem_image_to_featured( $html, $post_id, $post_thumbnail_id, $size, $attr ) {
    if ( get_post_type( $post_id ) !== 'medlems_fordel' ) {
        return $html;
    }
    
    $medlem_image_id = get_post_meta( $post_id, 'medlem_image', true );
    
    if ( $medlem_image_id && $medlem_image_id != $post_thumbnail_id ) {
        $medlem_image_html = wp_get_attachment_image( 
            $medlem_image_id, 
            $size, 
            false, 
            array( 'class' => 'firmalogo' ) 
        );
        
        $html .= $medlem_image_html;
    }
    
    return $html;
}
add_filter( 'post_thumbnail_html', 'mf_append_medlem_image_to_featured', 10, 5 );

