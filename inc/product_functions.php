<?php
/**
 * WooCommerce Product Filter REST API
 * Add this to your theme's functions.php or a custom plugin
 */

add_action('rest_api_init', function () {
    register_rest_route('coretrek/v1', '/filter-products', array(
        'methods' => 'GET',
        'callback' => 'coretrek_filter_products',
        'permission_callback' => '__return_true',
    ));
});

function coretrek_filter_products($request) {
    $params = $request->get_params();
    
    // Get parameters - support both 'page' and 'paged'
    $page = isset($params['page']) ? absint($params['page']) : (isset($params['paged']) ? absint($params['paged']) : 1);
    $per_page = get_option('posts_per_page', 12);
    $product_cat = isset($params['product_cat']) ? sanitize_text_field($params['product_cat']) : '';
    
    // Build WP_Query args
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => $per_page,
        'paged' => $page,
        'post_status' => 'publish',
        'orderby' => 'menu_order title',
        'order' => 'ASC',
    );
    
    // Add category filter if specified
    if (!empty($product_cat)) {
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'product_cat',
                'field' => 'slug',
                'terms' => $product_cat,
            ),
        );
    }
    
    // Execute query
    $query = new WP_Query($args);
    
    // Start output buffering
    ob_start();
    
    if ($query->have_posts()) {
        echo '<ul class="wp-block-woocommerce-product-template wp-block-product-template is-layout-grid wp-block-post-template-is-layout-grid products columns-3">';
        
        while ($query->have_posts()) {
            $query->the_post();
            global $product;
            
            // Get product object
            $product = wc_get_product(get_the_ID());
            
            if (!$product) {
                continue;
            }
            
            // Get product data
            $product_id = $product->get_id();
            $product_permalink = get_permalink($product_id);
            $product_image = $product->get_image('woocommerce_thumbnail');
            $product_title = $product->get_name();
            $product_price = $product->get_price_html();
            $is_on_sale = $product->is_on_sale();
            
            // Get product categories
            $categories = wp_get_post_terms($product_id, 'product_cat', array('fields' => 'ids'));
            $category_data = !empty($categories) ? implode(',', $categories) : '';
            
            // Product wrapper classes
            $classes = array(
                'wp-block-post',
                'post-' . $product_id,
                'product',
                'type-product',
                'status-' . $product->get_status(),
            );
            
            if ($is_on_sale) {
                $classes[] = 'sale';
            }
            
            if (!$product->is_in_stock()) {
                $classes[] = 'outofstock';
            }
            ?>
            <li class="<?php echo esc_attr(implode(' ', $classes)); ?>" data-product-id="<?php echo esc_attr($product_id); ?>" data-categories="<?php echo esc_attr($category_data); ?>">
                
                <!-- wp:group -->
                <div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained">
                    
                    <?php if ($is_on_sale) : ?>
                    <!-- wp:woocommerce/product-sale-badge -->
                    <div class="wp-block-woocommerce-product-sale-badge">
                        <div class="wc-block-components-product-sale-badge wc-block-components-product-sale-badge--align-left wc-block-grid__product-onsale">
                            <span aria-hidden="true"><?php esc_html_e('Sale!', 'woocommerce'); ?></span>
                            <span class="screen-reader-text"><?php esc_html_e('Product on sale', 'woocommerce'); ?></span>
                        </div>
                    </div>
                    <!-- /wp:woocommerce/product-sale-badge -->
                    <?php endif; ?>
                    
                    <!-- wp:woocommerce/product-image -->
                    <div class="wp-block-woocommerce-product-image">
                        <div class="wc-block-components-product-image wc-block-grid__product-image">
                            <a href="<?php echo esc_url($product_permalink); ?>" tabindex="-1">
                                <?php echo $product_image; ?>
                            </a>
                        </div>
                    </div>
                    <!-- /wp:woocommerce/product-image -->
                    
                    <!-- wp:post-title {"isLink":true,"__woocommerceNamespace":"woocommerce/product-collection/product-title"} -->
                    <h2 class="wp-block-post-title has-link">
                        <a href="<?php echo esc_url($product_permalink); ?>" class="wc-block-components-product-name" rel="bookmark">
                            <?php echo esc_html($product_title); ?>
                        </a>
                    </h2>
                    <!-- /wp:post-title -->
                    
                    <!-- wp:woocommerce/product-price -->
                    <div class="wp-block-woocommerce-product-price">
                        <div class="wc-block-components-product-price price">
                            <?php echo $product_price; ?>
                        </div>
                    </div>
                    <!-- /wp:woocommerce/product-price -->
                    
                    
                </div>
                <!-- /wp:group -->
                
            </li>
            <?php
        }
        
        echo '</ul>';
        
    } else {
        // No products found message
        ?>
        <!-- wp:woocommerce/empty-product-collection-state -->
        <div class="wp-block-woocommerce-empty-product-collection-state woocommerce-no-products-found">
            <div class="wp-block-group is-layout-constrained">
                <p class="woocommerce-info"><?php esc_html_e('No products were found matching your selection.', 'woocommerce'); ?></p>
            </div>
        </div>
        <!-- /wp:woocommerce/empty-product-collection-state -->
        <?php
    }
    
    $html = ob_get_clean();
    
    // Generate pagination
    ob_start();
    
    if ($query->max_num_pages > 1) {
        $total_pages = $query->max_num_pages;
        $current_page = max(1, $page);
        
        echo '<!-- wp:query-pagination -->';
        echo '<nav class="woocommerce-pagination wp-block-query-pagination artikkel-pagination is-layout-flex wp-block-query-pagination-is-layout-flex" aria-label="' . esc_attr__('Pagination', 'woocommerce') . '">';
        
        // Previous link
        if ($current_page > 1) {
            $prev_url = add_query_arg(array('page' => $current_page - 1), remove_query_arg('page'));
            echo '<!-- wp:query-pagination-previous /-->';
            echo '<a class="wp-block-query-pagination-previous prev page-numbers" href="' . esc_url($prev_url) . '">';
            echo  esc_html__('‹', 'coretrek') ;
            echo '</a>';
        }
        
        // Page numbers
        echo '<!-- wp:query-pagination-numbers /-->';
        echo '<div class="wp-block-query-pagination-numbers">';
        
        for ($i = 1; $i <= $total_pages; $i++) {
            // Show first page, last page, current page, and 2 pages around current
            if ($i == 1 || $i == $total_pages || ($i >= $current_page - 2 && $i <= $current_page + 2)) {
                if ($i == $current_page) {
                    echo '<span class="page-numbers current" aria-current="page">' . $i . '</span>';
                } else {
                    $page_url = add_query_arg(array('page' => $i), remove_query_arg('page'));
                    echo '<a class="page-numbers" href="' . esc_url($page_url) . '">' . $i . '</a>';
                }
            } elseif ($i == $current_page - 3 || $i == $current_page + 3) {
                echo '<span class="page-numbers dots">…</span>';
            }
        }
        
        echo '</div>';
        
        // Next link
        if ($current_page < $total_pages) {
            $next_url = add_query_arg(array('page' => $current_page + 1), remove_query_arg('page'));
            echo '<!-- wp:query-pagination-next /-->';
            echo '<a class="wp-block-query-pagination-next next page-numbers" href="' . esc_url($next_url) . '">';
            echo  esc_html__('›', 'coretrek') ;
            echo '</a>';
        }
        
        echo '</nav>';
        echo '<!-- /wp:query-pagination -->';
    }
    
    $pagination = ob_get_clean();
    
    // Reset post data
    wp_reset_postdata();
    
    // Return response
    return array(
        'success' => true,
        'html' => $html,
        'pagination' => $pagination,
        'current_page' => $page,
        'total_pages' => $query->max_num_pages,
        'total_products' => $query->found_posts,
    );
}

