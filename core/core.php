<?php
/**
 * Nordic Fund Day — Core module
 * Enqueues core editor assets only.
 * Frontend assets (Tailwind, GSAP, main.js) are handled in functions.php.
 */

function nfd_enqueue_block_editor_assets() {
    if ( ! file_exists( get_template_directory() . '/dist/core.asset.php' ) ) {
        return;
    }

    $asset_file = include get_template_directory() . '/dist/core.asset.php';

    // Enqueue the JS file for the editor
    wp_enqueue_script(
        'nfd-core-editor-script',
        get_template_directory_uri() . '/dist/core.js',
        $asset_file['dependencies'],
        $asset_file['version']
    );
}
add_action( 'enqueue_block_editor_assets', 'nfd_enqueue_block_editor_assets' );
