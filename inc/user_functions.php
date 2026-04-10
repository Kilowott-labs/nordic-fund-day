<?php
// Define role constants
define('YTF_ROLE_TILLITSVALGT', 'tillitsvalgt');
define('YTF_ROLE_MEDLEM', 'medlem');

//add editor role capabilities
function add_editor_role_cap()
{
    $role = get_role( 'editor' );
    if($role){
        $capabilities = [
            'gform_full_access',
            'wpseo_edit_advanced_metadata',
            'promote_users',
            'list_users',
            'edit_users',
            'create_users',
            'remove_users',
            'add_users',
            'custom_role_options',
            'delete_users',
            'edit_theme_options',
            // WooCommerce Product Capabilities
            'edit_products',
            'edit_others_products',
            'edit_published_products',
            'publish_products',
            'read_products',
            'delete_products',
            'delete_published_products',
            'delete_others_products',            
            // WooCommerce Coupon Capabilities
            'edit_shop_coupons',
            'edit_others_shop_coupons',
            'edit_published_shop_coupons',
            'publish_shop_coupons',
            'read_shop_coupons',
            'delete_shop_coupons',
            'delete_published_shop_coupons',
            'delete_others_shop_coupons',            
            // WooCommerce Taxonomy Capabilities
            'manage_product_terms',
            'edit_product_terms',
            'delete_product_terms',
            'assign_product_terms',            
        ];                
        foreach ($capabilities as $cap) {
            $role->add_cap($cap);
        }  
    }
} 
add_action( 'admin_init', 'add_editor_role_cap' );


add_filter('user_edit_form_tag', 'add_multipart_encoding_to_form');
function add_multipart_encoding_to_form() {
    echo ' enctype="multipart/form-data"';
}


add_action( 'admin_print_styles-user-edit.php', 'remove_default_gravatar_section' );
add_action( 'admin_print_styles-profile.php', 'remove_default_gravatar_section' );
function remove_default_gravatar_section() {
    echo '<style type="text/css">
        .user-profile-picture { display: none !important; } 
        .form-table tr:has(label[for="email"]) + tr:has(td[colspan="2"]) { display: none !important; }
    </style>';
}



add_action('show_user_profile', 'custom_avatar_upload_field', 1);
add_action('edit_user_profile', 'custom_avatar_upload_field', 1);
function custom_avatar_upload_field($user) {
    $meta_key = 'custom_profile_image_id';
    $current_avatar_id = get_user_meta($user->ID, $meta_key, true);
    ?>
    
    <h3><?php _e( 'Tilpasset profilbilde', 'coretrek' ); ?></h3>
    <table class="form-table">
        <tr>
            <th><label for="custom_profile_image_upload"><?php _e( 'Last opp avatar', 'coretrek' ); ?></label></th>
            <td>
                <?php
                if ($current_avatar_id) {
                    echo '<div class="custom-avatar-wrapper">';
                    
                    echo wp_get_attachment_image($current_avatar_id, array(90, 90), false, array('class' => 'current-custom-avatar'));
                
                    echo '<a href="#" class="remove-custom-avatar" aria-label="Fjern bilde">✕</a>';
                    
                    echo '<input type="hidden" name="remove_custom_profile_image" id="remove_custom_profile_image" value="0" />';
                    echo '</div>';
                } else {
                    echo '<p class="description">Ingen tilpasset avatar lastet opp. Bruker nettstedets standard reserve.</p>';
                }
                ?>
                <input type="file" name="custom_profile_image_upload" id="custom_profile_image_upload" accept="image/*" />
            </td>
        </tr>
    </table>
    <?php
}

function remove_added_profile_image() {
    if ( ! wp_script_is( 'jquery', 'done' ) ) {
        return; 
    }
    ?>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            $('.remove-custom-avatar').on('click', function(e) {
                e.preventDefault();
                
                const $wrapper = $(this).closest('.custom-avatar-wrapper');
            
                $wrapper.find('.current-custom-avatar, .remove-custom-avatar').hide();
                
                $('#remove_custom_profile_image').val('1');

                $('#custom_profile_image_upload').val('');
            });
        });
    </script>
    <style>
        .custom-avatar-wrapper{
            position: relative;
        }

        .remove-custom-avatar {
            position: absolute;
            top: -5px;
            left: 80px;
            background: #e30000;
            color: white;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            text-decoration: none;
            font-weight: bold;
            cursor: pointer;
        }
    </style>
    <?php
}

add_action( 'admin_footer-user-edit.php', 'remove_added_profile_image' );
add_action( 'admin_footer-profile.php', 'remove_added_profile_image' );


function save_custom_avatar_upload($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }

    $meta_key = 'custom_profile_image_id';
    $old_avatar_id = get_user_meta($user_id, $meta_key, true);
    
    $is_new_upload_present = !empty($_FILES['custom_profile_image_upload']['name']);
    
    $is_removal_requested = isset($_POST['remove_custom_profile_image']) && $_POST['remove_custom_profile_image'] === '1';

    if ($is_new_upload_present) {
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');

        $attachment_id = media_handle_upload('custom_profile_image_upload', $user_id);

        if (!is_wp_error($attachment_id)) {
            
            if ($old_avatar_id) {
                wp_delete_attachment($old_avatar_id, true);
            }

            update_user_meta($user_id, $meta_key, $attachment_id);
            return; 
        }
    }

    if ($is_removal_requested) {
        
        if ($old_avatar_id) {
            wp_delete_attachment($old_avatar_id, true);
        }
        
        delete_user_meta($user_id, $meta_key);
        return; 
    }

}

add_action('personal_options_update', 'save_custom_avatar_upload');
add_action('edit_user_profile_update', 'save_custom_avatar_upload');



add_filter('get_avatar', 'custom_avatar_enforcement_override', 10, 5);
function custom_avatar_enforcement_override($avatar, $id_or_email, $size, $default, $alt) {
    
    $user_id = false;
    if (is_numeric($id_or_email)) {
        $user_id = (int) $id_or_email;
    } elseif (is_object($id_or_email) && isset($id_or_email->user_id)) {
        $user_id = (int) $id_or_email->user_id;
    } elseif (is_email($id_or_email)) {
        $user = get_user_by('email', $id_or_email);
        $user_id = $user ? $user->ID : 0;
    }

    if (!$user_id) {
        return $avatar; 
    }

    $custom_avatar_id = get_user_meta($user_id, 'custom_profile_image_id', true);

    if ($custom_avatar_id) {
        $image_attributes = wp_get_attachment_image_src($custom_avatar_id, array($size, $size));

        if ($image_attributes) {
            $image_url = $image_attributes[0];
            $width = $image_attributes[1];
            $height = $image_attributes[2];
            
            return '<img src="' . esc_url($image_url) . '" 
                        width="' . esc_attr($width) . '" 
                        height="' . esc_attr($height) . '" 
                        alt="' . esc_attr($alt) . '" 
                        class="avatar custom-avatar avatar-' . esc_attr($size) . ' photo" />';
        }
    }

    $default_setting = get_option('avatar_default');


    $forced_default_url = get_avatar_url('0', array(
        'size'    => $size,
        'default' => $default_setting 
    ));


    return '<img src="' . esc_url($forced_default_url) . '" 
                width="' . esc_attr($size) . '" 
                height="' . esc_attr($size) . '" 
                alt="' . esc_attr($alt) . '" 
                class="avatar default-placeholder photo" />';
}


/**
 * Register custom user roles
 */
function ytf_register_user_roles() {
    // Capabilities for Medlem (regular member)
    $medlem_caps = [
        'read' => true,
        'view_own_content' => true,
    ];

    // Capabilities for Tillitsvalgt (representative)
    $tillitsvalgt_caps = [
        'read' => true,
        'view_own_content' => true,
        'view_medlem_content' => true,
    ];

    // Add Medlem role if it doesn't exist
    if (!get_role(YTF_ROLE_MEDLEM)) {
        add_role(
            YTF_ROLE_MEDLEM,
            __('Medlem', 'ytf-integrations'),
            $medlem_caps
        );
    }

    // Add Tillitsvalgt role if it doesn't exist
    if (!get_role(YTF_ROLE_TILLITSVALGT)) {
        add_role(
            YTF_ROLE_TILLITSVALGT,
            __('Tillitsvalgt', 'ytf-integrations'),
            $tillitsvalgt_caps
        );
    }
}
add_action('init', 'ytf_register_user_roles');

/**
 * Remove admin bar for member roles
 */
function ytf_remove_admin_bar_for_members() {
    if (current_user_can(YTF_ROLE_MEDLEM) || current_user_can(YTF_ROLE_TILLITSVALGT)) {
        show_admin_bar(false);
    }
}
add_action('after_setup_theme', 'ytf_remove_admin_bar_for_members');

/**
 * Check if user has access to content
 */
function ytf_user_can_access_content($user_id, $content_owner_role) {
    $user = get_userdata($user_id);
    if (!$user) {
        return false;
    }

    // Admins can access everything
    if (user_can($user, 'manage_options')) {
        return true;
    }

    // Tillitsvalgt can access own content and Medlem content
    if (in_array(YTF_ROLE_TILLITSVALGT, $user->roles)) {
        return in_array($content_owner_role, [YTF_ROLE_TILLITSVALGT, YTF_ROLE_MEDLEM]);
    }

    // Medlem can only access own content
    if (in_array(YTF_ROLE_MEDLEM, $user->roles)) {
        return $content_owner_role === YTF_ROLE_MEDLEM;
    }

    return false;
}

