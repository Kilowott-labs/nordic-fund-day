<?php
/**
 * Nordic Fund Day functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package nordic-fund-day
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

add_action('enqueue_block_assets', 'nfd_enqueue_scripts_styles');
function nfd_enqueue_scripts_styles(){
    // Enqueue main theme styles from consolidated dist folder
    if ( file_exists( get_template_directory() . '/dist/styles.css' ) ) {
        wp_enqueue_style('nfd-style', get_template_directory_uri() . "/dist/styles.css", [], filemtime(get_template_directory() . "/dist/styles.css"), "all");
    }
}

//register pattern category
function theme_register_pattern_categories() {
    register_block_pattern_category(
        'YTF', 
        array(
            'label' => __( 'YTF', 'nordic-fund-day' ) 
        )
    );
}
add_action( 'init', 'theme_register_pattern_categories' );

function nfd_featured_image_placeholder( $block_content, $block ) {
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
            esc_attr__( 'Default Image Placeholder', 'nordic-fund-day' )
        );
        
    }
    
    return $block_content;
}
add_filter( 'render_block', 'nfd_featured_image_placeholder', 10, 2 );

//localize assets path
function nfd_block_assets() {
    wp_localize_script('wp-blocks', 'nfdThemeUrl', [
        'assets' => get_template_directory_uri() . '/assets'
    ]);
}
add_action('enqueue_block_editor_assets', 'nfd_block_assets');


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
		'nfd-google-fonts',
		'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&display=swap',
		[],
		null
	);
} );


add_action( 'enqueue_block_editor_assets', function () {
	wp_enqueue_style(
		'nfd-google-fonts-editor',
		'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&display=swap',
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

	// Enqueue Lenis smooth scroll
	wp_enqueue_script(
		'lenis',
		'https://unpkg.com/lenis@1.1.18/dist/lenis.min.js',
		[],
		'1.1.18',
		true
	);

	// Enqueue global page animations (Lenis, GSAP scroll effects, section reveals)
	wp_enqueue_script(
		'nfd-page-animations',
		get_template_directory_uri() . '/dist/main.js',
		['gsap', 'gsap-scrolltrigger', 'lenis'],
		filemtime(get_template_directory() . '/dist/main.js'),
		true
	);
} );

// ============================================================
// PERFORMANCE: Defer/async scripts, preconnect, resource hints
// ============================================================

// Add defer to all theme scripts (non-blocking)
add_filter( 'script_loader_tag', function ( $tag, $handle ) {
	$defer_handles = [ 'gsap', 'gsap-scrolltrigger', 'lenis', 'nfd-page-animations' ];
	if ( in_array( $handle, $defer_handles, true ) ) {
		return str_replace( ' src=', ' defer src=', $tag );
	}
	return $tag;
}, 10, 2 );

// Add preconnect for CDN domains
add_action( 'wp_head', function () {
	echo '<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>' . "\n";
	echo '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>' . "\n";
	echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
	echo '<link rel="dns-prefetch" href="https://unpkg.com">' . "\n";
}, 1 );

// Remove WordPress default bloat
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );
remove_action( 'wp_head', 'rest_output_link_wp_head' );

// Add cache headers for static assets via .htaccess alternative
add_action( 'send_headers', function () {
	if ( is_page( 'nordic-fund-day' ) ) {
		header( 'X-Content-Type-Options: nosniff' );
		header( 'X-Frame-Options: SAMEORIGIN' );
		header( 'Referrer-Policy: strict-origin-when-cross-origin' );
	}
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

// Load Tailwind CSS and Google Fonts into the editor iframe canvas
add_action( 'after_setup_theme', function () {
	add_editor_style( 'dist/tailwind.css' );
	add_editor_style( 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&display=swap' );
} );

// ============================================================
// PERFORMANCE: Dequeue unused assets on Nordic Fund Day landing
// ============================================================
add_action( 'wp_enqueue_scripts', function () {
	if ( ! is_page( 'nordic-fund-day' ) ) {
		return;
	}

	// --- Remove WooCommerce CSS ---
	wp_dequeue_style( 'woocommerce-layout' );
	wp_dequeue_style( 'woocommerce-general' );
	wp_dequeue_style( 'woocommerce-smallscreen' );
	wp_dequeue_style( 'wc-blocks-style' );
	wp_dequeue_style( 'woocommerce-blocktheme' );
	wp_dequeue_style( 'wc-blocks-vendors-style' );
	wp_dequeue_style( 'brands-styles' );

	// --- Remove WooCommerce JS ---
	wp_dequeue_script( 'wc-add-to-cart' );
	wp_dequeue_script( 'woocommerce' );
	wp_dequeue_script( 'wc-cart-fragments' );
	wp_dequeue_script( 'jquery-blockui' );
	wp_dequeue_script( 'js-cookie' );
	wp_dequeue_script( 'sourcebuster' );
	wp_dequeue_script( 'wc-order-attribution' );

	// --- Remove Algolia search ---
	wp_dequeue_style( 'algolia-live-search' );
	wp_dequeue_style( 'algolia-autocomplete-theme-classic' );
	wp_dequeue_script( 'algolia-live-search' );
	wp_dequeue_script( 'algolia-autocomplete' );
	wp_dequeue_script( 'algoliasearch' );

	// --- Remove jQuery (not used by our blocks) ---
	wp_dequeue_script( 'jquery' );
	wp_dequeue_script( 'jquery-core' );
	wp_dequeue_script( 'jquery-migrate' );

	// --- Remove Boost.ai chat on landing page ---
	wp_dequeue_script( 'boost-ai-chatpanel' );
}, 999 );

// Disable WP emoji scripts/styles on landing page
add_action( 'init', function () {
	if ( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], 'nordic-fund-day' ) !== false ) {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
	}
} );

// Preload critical assets + SEO meta
add_action( 'wp_head', function () {
	if ( ! is_page( 'nordic-fund-day' ) ) {
		return;
	}
	// Preload fonts
	echo '<link rel="preload" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&display=swap" as="style">' . "\n";
	// Preload hero background image (LCP element)
	echo '<link rel="preload" as="image" href="' . esc_url( get_template_directory_uri() ) . '/assets/images/hero-layer.png.png" fetchpriority="high">' . "\n";
	// SEO
	echo '<meta name="description" content="Nordic Fund Day — the must-attend investor event for Nordic and Baltic deal flow. May 5-6, 2026 in Stavanger, Norway.">' . "\n";
	// Open Graph
	echo '<meta property="og:title" content="Nordic Fund Day — Stavanger, Norway">' . "\n";
	echo '<meta property="og:description" content="The must-attend investor event for Nordic and Baltic deal flow. May 5-6, 2026.">' . "\n";
	echo '<meta property="og:type" content="website">' . "\n";
}, 1 );

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