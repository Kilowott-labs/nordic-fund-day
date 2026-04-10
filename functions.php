<?php
/**
 * Coretrek functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package coretrek
 */
define( 'YOAST_ACTIVE', defined( 'WPSEO_VERSION' ) ? true : false );

//core module inclusion
require_once __DIR__ . '/inc/theme_setup.php';

//core module inclusion
require_once __DIR__ . '/core/core.php';

//core module inclusion
require_once __DIR__ . '/blocks/blocks.php';

//innholdsside inc file
require_once __DIR__ . '/inc/innholdsside.php';
//breadcrumb inc file
if ( YOAST_ACTIVE ) {
    require_once __DIR__ . '/inc/breadcrumb.php';
}

require_once __DIR__ . '/inc/courses_functions.php';
require_once __DIR__ . '/inc/medlem_functions.php';
require_once __DIR__ . '/inc/artikkel_functions.php';
require_once __DIR__ . '/inc/algolia_functions.php';
require_once __DIR__ . '/inc/product_functions.php';
require_once __DIR__ . '/inc/category_functions.php';
require_once __DIR__ . '/inc/user_functions.php';
require_once __DIR__ . '/inc/block_render_functions.php';

add_action('enqueue_block_assets', 'coretrek_enqueue_scripts_styles');
function coretrek_enqueue_scripts_styles(){
    // Enqueue main theme styles from consolidated dist folder
    if ( file_exists( get_template_directory() . '/dist/styles.css' ) ) {
        wp_enqueue_style('coretrek-style', get_template_directory_uri() . "/dist/styles.css", [], filemtime(get_template_directory() . "/dist/styles.css"), "all");
    }
}

//register pattern category
function theme_register_pattern_categories() {
    register_block_pattern_category(
        'YTF', 
        array(
            'label' => __( 'YTF', 'coretrek' ) 
        )
    );
}
add_action( 'init', 'theme_register_pattern_categories' );

function coretrek_featured_image_placeholder( $block_content, $block ) {
    // Target the specific block by its name.
    if ( 'core/post-featured-image' !== $block['blockName'] ) {
        return $block_content;
    }
    
    $has_linked_card_class = false;
    
    // Check if the block has the specific className from your template
    if ( isset( $block['attrs']['className'] ) && 
         strpos( $block['attrs']['className'], 'course-featured-image-container' ) !== false ) {
        $has_linked_card_class = true;
    }
    
    // Also check the rendered content for the class
    if ( ! $has_linked_card_class && 
         strpos( $block_content, 'course-featured-image-container' ) !== false ) {
        $has_linked_card_class = true;
    }
    
    if ( ! $has_linked_card_class ) {
        return $block_content;
    }

    // Check if content is empty (no featured image set)
    if ( empty( trim( $block_content ) ) ) {
        // Get the post ID from the block context
        $post_id = isset( $block['context']['postId'] ) ? $block['context']['postId'] : get_the_ID();
        
        // Define the path to your placeholder image.
        $placeholder_url = get_template_directory_uri() . '/assets/images/placeholder_image.svg';
        
        // Get the class name if it exists
        $class_name = isset( $block['attrs']['className'] ) ? esc_attr( $block['attrs']['className'] ) : '';
        
        $date_overlay ='';
        // Add date overlay for courses (excluding single course page)
        if ( get_post_type( $post_id ) === 'courses' && ! is_singular( 'courses' ) ) {
            $course_end_date = get_post_meta( $post_id, 'course_end_date', true );
            if ( $course_end_date ) {
                $date_obj = DateTime::createFromFormat( 'Y-m-d', $course_end_date );
                if ( $date_obj ) {
                    $day = $date_obj->format( 'd' );
                    $month = $date_obj->format( 'M' );
                    
                    $date_overlay = '<div class="course-date-overlay">
                        <div class="date-day">' . $day . '</div>
                        <div class="date-month">' . strtoupper( $month ) . '</div></div>';
                }
            }
        }

        // Create the HTML for your placeholder.
        $block_content = sprintf(
            '<figure class="wp-block-post-featured-image %s">
                <img src="%s" alt="%s" class="wp-image-placeholder" />'.$date_overlay.'
            </figure>',
            $class_name,
            esc_url( $placeholder_url ),
            esc_attr__( 'Default Image Placeholder', 'coretrek' )
        );
        
    }
    
    return $block_content;
}
add_filter( 'render_block', 'coretrek_featured_image_placeholder', 10, 2 );

//localize assets path
function coretrek_block_assets() {
    wp_localize_script('wp-blocks', 'coretrekThemeUrl', [
        'assets' => get_template_directory_uri() . '/assets'
    ]);
}
add_action('enqueue_block_editor_assets', 'coretrek_block_assets');


function boost_ai_chat_scripts() {
   // Enqueue the Boost.ai chat panel script
    wp_enqueue_script(
        'boost-ai-chatpanel',
        'https://compendia.boost.ai/chatPanel/chatPanel.js',
        array(),
        null, 
        true 
    );
}
add_action('wp_footer', 'boost_ai_chat_scripts');


add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'coretrek-dm-sans',
		'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap',
		[],
		null
	);
} );


add_action( 'enqueue_block_editor_assets', function () {
	wp_enqueue_style(
		'coretrek-dm-sans-editor',
		'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap',
		[],
		null
	);
} );

add_action( 'wp_enqueue_scripts', function () {
	// Enqueue compiled Tailwind CSS for frontend
	wp_enqueue_style(
		'tailwind-css',
		get_template_directory_uri() . '/dist/tailwind.css',
		[],
		filemtime(get_template_directory() . '/dist/tailwind.css')
	);
	
	// Enqueue GSAP for Hero Design block animations
	wp_enqueue_script(
		'gsap',
		'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
		[],
		'3.12.5',
		true
	);
	
	// Enqueue GSAP ScrollTrigger plugin
	wp_enqueue_script(
		'gsap-scrolltrigger',
		'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
		['gsap'],
		'3.12.5',
		true
	);
	
	// Enqueue scroll animations utility
	// wp_enqueue_script(
	// 	'ytf-scroll-animations',
	// 	get_template_directory_uri() . '/assets/js/scroll-animations.js',
	// 	['gsap', 'gsap-scrolltrigger'],
	// 	filemtime(get_template_directory() . '/assets/js/scroll-animations.js'),
	// 	true
	// );
} );

add_action( 'enqueue_block_editor_assets', function () {
	// Enqueue compiled Tailwind CSS for block editor (main window)
	wp_enqueue_style(
		'tailwind-css-editor',
		get_template_directory_uri() . '/dist/tailwind.css',
		[],
		filemtime(get_template_directory() . '/dist/tailwind.css')
	);
} );

// Load Tailwind CSS into the editor iframe canvas
add_action( 'after_setup_theme', function () {
	add_editor_style( 'dist/tailwind.css' );
} );

// Blockstudio LLM file rewrite
add_action('init', function() {
    add_rewrite_rule(
        'blockstudio-llm\.txt$',
        'index.php?blockstudio_llm=1',
        'top'
    );
});

add_filter('query_vars', function($vars) {
    $vars[] = 'blockstudio_llm';
    return $vars;
});

add_action('template_redirect', function() {
    if (get_query_var('blockstudio_llm')) {
        $file = WP_CONTENT_DIR . '/plugins/blockstudio/includes/llm/blockstudio-llm.txt';
        if (file_exists($file)) {
            header('Content-Type: text/plain; charset=utf-8');
            readfile($file);
        }
        exit;
    }
});