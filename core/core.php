<?php
/*
    Module Name: Core Blocks
    Description: Module that adds some options to native core Wordpress blocks
    Version: 1.0
    Author: coretrek
*/

// Function to enqueue assets for the block editor
function coretrek_enqueue_block_editor_assets() {
    // Check if the asset file exists to prevent errors
    if ( ! file_exists( get_template_directory() . '/dist/core.asset.php' ) ) {
        return;
    }

    $asset_file = include get_template_directory() . '/dist/core.asset.php';

    // Enqueue the JavaScript file
    wp_enqueue_script(
        'coretrek-core-editor-script',
        get_template_directory_uri() . '/dist/core.js',
        $asset_file['dependencies'],
        $asset_file['version'],
        true
    );

    // Enqueue the CSS file for the editor
    wp_enqueue_style(
        'coretrek-core-editor-style',
        get_template_directory_uri() . '/dist/core.css',
        array(),
        $asset_file['version']
    );
}
add_action('enqueue_block_editor_assets', 'coretrek_enqueue_block_editor_assets');

// Function to enqueue CSS for the front end
function coretrek_enqueue_front_end_assets() {
    // Check if the asset file exists to prevent errors
    if ( ! file_exists( get_template_directory() . '/dist/core.asset.php' ) ) {
        return;
    }

    $asset_file = include get_template_directory() . '/dist/core.asset.php';

    // Enqueue the CSS file for the front end
    wp_enqueue_style(
        'coretrek-core-front-end-style',
        get_template_directory_uri() . '/dist/core.css',
        array(),
        $asset_file['version']
    );
    
    // Enqueue the main JavaScript file
    if ( file_exists( get_template_directory() . '/dist/main.asset.php' ) ) {
        $js_asset_file = include get_template_directory() . '/dist/main.asset.php';
        wp_enqueue_script(
            'coretrek-main-script',
            get_template_directory_uri() . '/dist/main.js',
            $js_asset_file['dependencies'],
            $js_asset_file['version'],
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'coretrek_enqueue_front_end_assets');