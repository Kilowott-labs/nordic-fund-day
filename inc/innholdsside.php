<?php
// Register CTA URL and Text meta fields
add_action('init', 'register_post_meta_fields');
function register_post_meta_fields() {
    $url_args = [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'auth_callback' => fn() => current_user_can('edit_posts'),
    ];

    $text_args = [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => fn() => current_user_can('edit_posts'),
    ];

    // Register for posts
    $post_types = ['post', 'page', 'medlems_fordel', 'courses'];
    foreach ($post_types as $type) {
        register_post_meta($type, 'cta_link', $url_args);
        register_post_meta($type, 'cta_text', $text_args);
    }

    // Additional CTA for courses CPT
    register_post_meta('courses', 'cta_link_2', $url_args);
    register_post_meta('courses', 'cta_text_2', $text_args);
}

// Add Meta Box for both fields
add_action('add_meta_boxes', function() {
    $screens = ['post', 'page', 'medlems_fordel', 'courses'];
    foreach ($screens as $screen) {
        add_meta_box(
            'cta_link_box',
            __('CTA', 'YTF'),
            function($post) {

                $cta_link   = get_post_meta($post->ID, 'cta_link', true);
                $cta_text   = get_post_meta($post->ID, 'cta_text', true);
                $cta_link_2 = get_post_meta($post->ID, 'cta_link_2', true);
                $cta_text_2 = get_post_meta($post->ID, 'cta_text_2', true);

                echo '<p><label>' . __('CTA URL:', 'YTF') . '</label>';
                echo '<input type="url" style="width:100%" name="cta_link" value="' . esc_attr($cta_link) . '"></p>';

                echo '<p><label>' . __('CTA Text:', 'YTF') . '</label>';
                echo '<input type="text" style="width:100%" name="cta_text" value="' . esc_attr($cta_text) . '"></p>';

                // Only show secondary CTA for courses CPT
                if ($post->post_type === 'courses') {
                    echo '<hr>';
                    echo '<p><label>' . __('Secondary CTA URL:', 'YTF') . '</label>';
                    echo '<input type="url" style="width:100%" name="cta_link_2" value="' . esc_attr($cta_link_2) . '"></p>';

                    echo '<p><label>' . __('Secondary CTA Text:', 'YTF') . '</label>';
                    echo '<input type="text" style="width:100%" name="cta_text_2" value="' . esc_attr($cta_text_2) . '"></p>';
                }
            },
            $screen,
            'side'
        );
    }
});

// Save CTA fields
add_action('save_post', function($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    // Primary CTA
    if (isset($_POST['cta_link'])) update_post_meta($post_id, 'cta_link', esc_url_raw($_POST['cta_link']));
    if (isset($_POST['cta_text'])) update_post_meta($post_id, 'cta_text', sanitize_text_field($_POST['cta_text']));

    // Secondary CTA
    if (isset($_POST['cta_link_2'])) update_post_meta($post_id, 'cta_link_2', esc_url_raw($_POST['cta_link_2']));
    if (isset($_POST['cta_text_2'])) update_post_meta($post_id, 'cta_text_2', sanitize_text_field($_POST['cta_text_2']));
});


//register cta-btn block
add_action('init', function() {
    //cta btn block
    register_block_type('coretrek/cta-button', [
        'render_callback' => function() {
            $post_id = get_the_ID();

            $cta_link   = get_post_meta($post_id, 'cta_link', true);
            $cta_text   = get_post_meta($post_id, 'cta_text', true);
            $cta_link_2 = get_post_meta($post_id, 'cta_link_2', true);
            $cta_text_2 = get_post_meta($post_id, 'cta_text_2', true);

            if ((!$cta_link || !$cta_text) && (!$cta_link_2 || !$cta_text_2)) return '';

            $output = '<div class="wp-block-buttons cta-buttons">';

            if ($cta_link && $cta_text) {
                $output .= '<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="' . esc_url($cta_link) . '">' . esc_html($cta_text) . '</a></div>';
            }

            if ($cta_link_2 && $cta_text_2) {
                $output .= '<div class="wp-block-button is-style-is-ghost"><a class="wp-block-button__link wp-element-button" href="' . esc_url($cta_link_2) . '">' . esc_html($cta_text_2) . '</a></div>';
            }

            $output .= '</div>';

            return $output;
        },
        'attributes' => [],
    ]);

    //excerpt
    register_block_type('coretrek/conditional-excerpt', [
        'render_callback' => function() {
            $post_id = get_the_ID();           
            $post = get_post($post_id);

            if (!$post || empty($post->post_excerpt)) {
                return ''; // nothing shown if excerpt empty
            }

            $style = 'margin-top:var(--wp--preset--spacing--spacer-xsmall);';
            $style .= 'margin-bottom:var(--wp--preset--spacing--spacer-xsmall);';
            $style .= 'line-height:1.5;';
            $class = 'wp-block-post-excerpt has-text-color has-dark-color has-text-xlarge-font-size has-fftext-font-family';

            return '<p class="' . esc_attr($class) . '" style="' . esc_attr($style) . '">' . esc_html($post->post_excerpt) . '</p>';
        },
        'attributes' => [],
    ]);
});

// Always show caption for featured images
function always_show_featured_image_caption($block_content, $block) {
    if (!is_singular('post')) {
        return $block_content;
    }
    
    if ($block['blockName'] === 'core/post-featured-image') {
        $post_id = get_the_ID();
        $thumbnail_id = get_post_thumbnail_id($post_id);
        
        if ($thumbnail_id) {
            $caption = wp_get_attachment_caption($thumbnail_id);
            
            if (!empty($caption)) {
                $caption_html = '<figcaption class="wp-block-post-featured-image__caption">' . esc_html($caption) . '</figcaption>';
                
                if (strpos($block_content, '</figure>') !== false) {
                    $block_content = str_replace('</figure>', $caption_html . '</figure>', $block_content);
                }
            }
        }
    }
    
    return $block_content;
}
add_filter('render_block', 'always_show_featured_image_caption', 10, 2);