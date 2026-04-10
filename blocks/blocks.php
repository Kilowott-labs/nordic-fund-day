<?php
/*
    Module Name: Coretrek Basic
    Description: Module that adds Coretrek blocks
    Version: 3.0
    Author: Coretrek
*/


/**
 * Include Basic Blocks Category
 */
// require_once __DIR__ . '/templates/author-title.php';
// require_once __DIR__ . '/templates/case-logo.php';
// require_once __DIR__ . '/templates/breadcrumbs.php';
// require_once __DIR__ . '/templates/logo.php';
// require_once __DIR__ . '/templates/share.php';
// require_once __DIR__ . '/templates/post-featured-video.php';
// require_once __DIR__ . '/templates/post-reading-time.php';
// require_once __DIR__ . '/templates/service-icon.php';

function register_ytf_blocks() {
	// Automatically register all blocks in the dist directory
	$dist_dir = get_template_directory() . '/dist';
	
	if ( is_dir( $dist_dir ) ) {
		$block_dirs = array_filter( glob( $dist_dir . '/*' ), 'is_dir' );
		
		foreach ( $block_dirs as $block_dir ) {
			$block_json_path = $block_dir . '/block.json';
			
			// Only register if block.json exists
			if ( file_exists( $block_json_path ) ) {
				register_block_type( $block_dir );
			}
		}
	}
}

add_action( 'init', 'register_ytf_blocks' );

// function unregister_wp_core_patterns() {
// 	// let's remove native patterns
// 	remove_theme_support( 'core-block-patterns' );
// 	unregister_block_pattern_category( 'buttons' );
// 	unregister_block_pattern_category( 'columns' );
// 	unregister_block_pattern_category( 'gallery' );
// 	unregister_block_pattern_category( 'header' );
// 	unregister_block_pattern_category( 'text' );
// 	unregister_block_pattern_category( 'uncategorized' );
// }

// add_action( 'after_setup_theme', 'unregister_wp_core_patterns' );

add_filter( 'block_categories_all', function( $categories, $post ) {
    //add helper category
    $categories[] = array(
		'slug'  => 'helper',
		'title' => 'Hjelper'
	);

    // add category to first
    return array_merge(
        [
            [
                'slug'  => 'ytf',
                'title' => __( 'YTF', 'ytf' ),
            ],
        ],
        $categories
    );
}, 10, 2 );