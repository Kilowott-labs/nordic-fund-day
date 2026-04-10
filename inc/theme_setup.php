<?php

//base theme setup
  add_action('after_setup_theme', 'theme_setup');

  function theme_setup() {
    add_theme_support('html5', array('comment-list', 'comment-form', 'search-form', 'gallery', 'caption', 'script', 'style'));
    add_theme_support('post-thumbnails'); 
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
    add_theme_support('custom-header');
    add_post_type_support('page', 'excerpt'); 
    add_theme_support('wp-block-styles');
    add_theme_support('woocommerce');
  }

  //Add support for SVG images
  define('ALLOW_UNFILTERED_UPLOADS', true);
  add_action('upload_mimes', 'add_file_types_to_uploads');
  function add_file_types_to_uploads($file_types){
    $new_filetypes = array();
    $new_filetypes['svg'] = 'image/svg+xml';
    $file_types = array_merge($file_types, $new_filetypes );
    return $file_types;
  }

//Register menus
function register_menus()
{
    register_nav_menus(
        array(
            //'header-menu' => __('Headermeny'), 
            'mega-menu-1' => __('Mega meny 1'),
            'mega-menu-2' => __('Mega meny 2'),
            'mega-menu-3' => __('Mega meny 3'),
            'footer-menu-1' => __('Footer meny 1'),
            'footer-menu-2' => __('Footer meny 2'),
            'footer-menu-3' => __('Footer meny 3')
        )
    );
}
add_action('init', 'register_menus');  

// Disable ALL default WordPress patterns
add_action( 'after_setup_theme', function() {
    remove_theme_support( 'core-block-patterns' );
}, 9 );

// Redirect cart to checkout page
add_action( 'template_redirect', function() {

    if ( function_exists( 'is_cart' ) && is_cart() ) {

        // Ensure WooCommerce cart functions are available
        if ( function_exists( 'WC' ) && WC()->cart ) {

            // Check if the cart is empty
            if ( WC()->cart->is_empty() ) {
                
                // Cart is empty, redirect to the shop page.
                $shop_page_id = wc_get_page_id( 'shop' );
                $shop_url = $shop_page_id ? get_permalink( $shop_page_id ) : get_home_url(); // Fallback to home URL if shop page isn't set
                
                wp_safe_redirect( $shop_url );
                exit;

            } else {
                
                // Cart is NOT empty, redirect to the checkout page.
                $checkout_url = wc_get_checkout_url();

                if ( $checkout_url ) {
                    wp_safe_redirect( $checkout_url );
                    exit;
                }
            }
        }
    }

});


/**
 * fix nexi session error and infinite reload
 */

add_action('woocommerce_after_calculate_totals', function($cart) {
    $logger = wc_get_logger();

    if (!is_checkout()) {
        return;
    }
    $logger->info('bfr ajax');
    $ajax_action = filter_input(INPUT_GET, 'wc-ajax', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    if ('update_order_review' !== $ajax_action) {
        return;
    }
    $logger->info('after ajax');
   
    $raw_post_data = filter_input(INPUT_POST, 'post_data', FILTER_SANITIZE_URL);
    if (empty($raw_post_data)) {
        return;
    }
    $logger->info('after raw post data');
   
    parse_str($raw_post_data, $post_data);
    $payment_id_from_form = $post_data['nexi_payment_id'] ?? '';
    $payment_id_session = WC()->session->get('dibs_payment_id');
   
    // If form payment ID is empty but session has one, this is the problematic initial load
    if (empty($payment_id_from_form) && !empty($payment_id_session)) {
        error_log('Nexi: Initial load detected - form ID empty, session ID exists. Clearing session.');
        $logger->info('Nexi: Initial load detected');
       
        // Clear the session completely
        WC()->session->set('dibs_payment_id', null);
        WC()->session->set('_dibs_payment_id', null);
        WC()->session->set('nets_easy_last_update_hash', null);
        WC()->session->set('nets_easy_currency', null);
       
        // CRITICAL: Stop the plugin's update function from running
        // by making the payment method check fail
        $current_payment_method = WC()->session->get('chosen_payment_method');
        WC()->session->set('chosen_payment_method', 'temporary_override');
       
        // Restore it after the problematic check
        add_action('woocommerce_after_calculate_totals', function() use ($current_payment_method) {
            WC()->session->set('chosen_payment_method', $current_payment_method);
        }, 9999999); // Run AFTER the Nexi check at 999999
    }
    $logger->info('done');

}, 1); // Priority 1 - run before everything

// Register custom taxonomy for pages
add_action('init', 'register_page_taxonomy');
function register_page_taxonomy() {
    $labels = array(
        'name' => 'Kategorier',
        'singular_name' => 'Kategori',
        'search_items' => 'Søk i sidekategorier',
        'all_items' => 'Alle sidekategorier',
        'parent_item' => 'Overordnet kategori',
        'parent_item_colon' => 'Overordnet kategori:',
        'edit_item' => 'Rediger kategori',
        'update_item' => 'Oppdater kategori',
        'add_new_item' => 'Legg til ny kategori',
        'new_item_name' => 'Ny kategorinavn',
        'menu_name' => 'Kategorier'
    );

    $args = array(
        'hierarchical' => true, // Som kategorier
        'labels' => $labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'side-kategori'),
        'show_in_rest' => true, // Viktig for Gutenberg-editor
    );

    register_taxonomy('page_category', array('page'), $args);
}
