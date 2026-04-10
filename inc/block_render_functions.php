<?php 

function custom_file_block_output($block_content, $block) {
    if ($block['blockName'] === 'core/file') {
        
        if (isset($block['attrs']['id']) && !empty($block['attrs']['id'])) {
            $attachment_id = intval($block['attrs']['id']);
            $file_path = get_attached_file($attachment_id);
            
            if ($file_path) {
                $file_size_bytes = filesize($file_path);
                $file_size_formatted = size_format($file_size_bytes, 2); 
                $file_type = strtoupper(pathinfo($file_path, PATHINFO_EXTENSION));

                $doctype_html = sprintf(
                    '<span class="wp-block-file__doctype %s"></span> ', 
                    esc_html($file_type)
                );
                
                $filesize_html = sprintf(
                    ' <span class="wp-block-file__size">%s</span>', 
                    esc_html($file_size_formatted)
                );
                
                
                $closing_tag_a = '</a>';
                $position_a = strpos($block_content, $closing_tag_a);

                if ($position_a !== false) {
                    $block_content = substr_replace($block_content, $filesize_html, $position_a, 0);
                }

            
                $opening_tag_a = '<a '; 
                $position_start = strpos($block_content, $opening_tag_a);
                
                if ($position_start !== false) {
                    $block_content = substr_replace($block_content, $doctype_html, $position_start, 0);
                }
            }
        }
    }
    return $block_content;
}

add_filter('render_block', 'custom_file_block_output', 10, 2);