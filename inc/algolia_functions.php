<?php
if (class_exists("Algolia_Search")) {
    class Extended_Algolia_Search extends Algolia_Search {

        /**
         * @var int
         */
        private $nb_hits;

        /**
         * @var Algolia_Index
         */
        private $index;

        /**
         * @param Algolia_Index $index
         */
        public function __construct(Algolia_Index $index) {
            $this->index = $index;
            parent::__construct($index);

            add_action('pre_get_posts', array($this, 'pre_get_posts'), 100, 1);
        }
        

        /**
         * Determines if we should filter the query passed as argument.
         *
         * @param WP_Query $query
         *
         * @return bool
         */
        public function pre_get_posts(WP_Query $query) {

            if (!$query->get('s')) {
                return;
            }
            $current_page = 1;
            if ($query->get('paged')) {
                $current_page = $query->get('paged');
            } elseif ($query->get('page')) {
                $current_page = $query->get('page');
            }
            $type = false;
            $filters ='';
            if ($query->get('type')&&$query->get('type') !='all') {
                $type = $query->get('type');
                $filters = 'post_type:'.$type;
            }
            
            $posts_per_page = get_option('posts_per_page',12);
            $params = apply_filters(
                'algolia_search_params', array(
                    'attributesToRetrieve' => ['post_id'],
                    'hitsPerPage' => 12,
                    'filters' => $filters,
                    'page' => $current_page - 1, // Algolia pages are zero indexed.
                    )
                );

            // $order_by = apply_filters('algolia_search_order_by', null);
            // $order = apply_filters('algolia_search_order', 'desc');
            $nb_hits_val = 0;
           
            try {
                $results = $this->index->search($query->query['s'], $params);           
            } catch (\AlgoliaSearch\AlgoliaException $exception) {
                error_log($exception->getMessage());
                return;
            }
            $post_ids = array();
            $nb_hits_val = $results['nbHits'];
             //var_dump(  $nb_hits_val);
             //wc_get_logger()->info(" hits: ".print_r($results['hits'],true));
            foreach ($results['hits'] as $result) {
                $post_ids[] = $result['post_id'];
            }
            $query->set('offset', 0);
            
            // $this->nb_hits = count(array_unique($post_ids));
            $this->nb_hits = $nb_hits_val;

            add_filter('found_posts', array($this, 'found_posts'), 10, 2);
            add_filter('posts_search', array($this, 'posts_search'), 10, 2);

            if (empty($post_ids)) {
                $post_ids = array(0);
            }
             //var_dump($post_ids);
             //echo count($post_ids);
            $query->set('posts_per_page', 12);
            $query->set('post__in', $post_ids);
            $query->set('orderby', 'post__in');
            if($type) {
                $query->set('post_type', $type);
            }
            $query->set('override_algolia', 'gocrazy');
            // Todo: this actually still excludes trash and auto-drafts.
            $query->set('post_status', 'publish');
            $query->set('s', '');
        }
        public function ajax_search($search_query, $filters, $page = 0, $hitsPerPage = 24) {
            // $params = [
            //     'attributesToRetrieve' =>  'post_id',
            //     'hitsPerPage' => $hitsPerPage,
            //     'filters' => $filters,
            //     'page' => $page,
            // ];
            $params = apply_filters(
                'algolia_search_params', array(
                'attributesToRetrieve' => 'post_id',
                'hitsPerPage' => $hitsPerPage,
                'filters' => $filters,
                'page' => $page, // Algolia pages are zero indexed.
                )
            );
        
            $order_by = apply_filters('algolia_search_order_by', null);
            $order = apply_filters('algolia_search_order', 'desc');
        
            try {
                return $this->index->search($search_query, $params, $order_by, $order);  
            } catch (\AlgoliaSearch\AlgoliaException $e) {
                error_log($e->getMessage());
                return false;
            }
        }

        public function posts_search($search, WP_Query $query) {
            return $query->get('override_algolia') ? '' : $search;
        }

        public function found_posts($found_posts, WP_Query $query) {
            return $query->get('override_algolia') ? $this->nb_hits : $found_posts;
        }

        public function get_all_search_result_ids($search_word) {
            $params = array(
                'attributesToRetrieve' => 'post_id',
                'hitsPerPage' => 1000,
                'page' => 0, // Algolia pages are zero indexed.
            );
            $order_by = apply_filters('algolia_search_order_by', null);
            $order = apply_filters('algolia_search_order', 'desc');

            try {
                $results = $this->index->search($search_word, $params, $order_by, $order);
            } catch (\AlgoliaSearch\AlgoliaException $exception) {
                error_log($exception->getMessage());

                return;
            }
            return $results['hits'];
        }

    }

}
add_filter('algolia_should_filter_query', function($flag){
    return false;
}, 10, 1);


if (class_exists("Algolia_Plugin")) {
    add_action('init', function () {
        global $extended_algolia;
        if($extended_algolia){
            return;
        }
        if (!is_admin() || is_ajax()) { // done so that indexes are not repeated in settings; hook init called twice in admin panel
            $algolia = Algolia_Plugin_Factory::create();
            if (!$algolia->get_api()->is_reachable()) {
                return;
            }

            $algolia->load_indices();

            $index = $algolia->get_index('searchable_posts');

            if (null == $index) {
                return;
            }
            $extended_algolia = new Extended_Algolia_Search($index);
        }
    });
}

function exclude_post_types($should_index, WP_Post $post) {
    if (false === $should_index) {
        return false;
    }

    if ($post->post_status !== 'publish') {
        return false;
    }
    
    if(!in_array($post->post_type,['post', 'courses', 'medlems_fordel','product'])){
        return false;
    }

    if(in_array($post->post_type, array('product'))){
        $should_index = false;
        $product = wc_get_product($post);
        if('search' === $product->get_catalog_visibility() || 'visible' === $product->get_catalog_visibility()){
            $should_index = true;
        }
    }

    return $should_index;
}

add_filter('algolia_should_index_searchable_post', 'exclude_post_types', 10, 2);


add_action('wp_ajax_get_algolia_next_page', 'get_algolia_next_page', 10);
add_action('wp_ajax_nopriv_get_algolia_next_page', 'get_algolia_next_page', 10);

function get_algolia_next_page() {
    $page_no = isset($_POST['page_no']) ? intval($_POST['page_no']) : 1;
    $search  = isset($_POST['search']) ? sanitize_text_field($_POST['search']) : '';
    $type    = isset($_POST['type']) ? sanitize_key($_POST['type']) : 'all';

    $posts_per_page = get_option('posts_per_page',12);

    $args = [
        'post_status'    => 'publish',
        's'              => $search,
        'posts_per_page' => $posts_per_page,
        'paged'          => $page_no,
        'override_algolia' => 'gocrazy',
        'type'=> $type
    ];

    // Filter by post type if tab is not "all"
    if ($type !== 'all') {
        $args['post_type'] = $type;
    } else {
        $args['post_type'] = ['post', 'courses', 'medlems_fordel','product'];
    }

    $wp_query = new WP_Query($args);

    ob_start();

    if ($wp_query->have_posts()) :
        while ($wp_query->have_posts()) :
            $wp_query->the_post();
            ?>
                                <div id="post-<?php the_ID(); ?>" <?php post_class('search-result-item'); ?>>
                                    <a href="<?php the_permalink(); ?>">
                                    <?php if ( has_post_thumbnail() ) :
                                    ?>
                                        <div class="entry-thumbnail">
                                                <?php
                                                the_post_thumbnail('thumbnail');
                                                ?>
                                        </div>
                                    <?php endif;  ?>
                                    <?php
                                    $post_id = get_the_ID();
                                    $current_post_type = get_post_type( $post_id );
                                    if ( $current_post_type == 'courses' ){
                                        $from_date = get_post_meta( $post_id, 'course_date', true );
                                        $location  = get_post_meta( $post_id, 'course_location', true );
                                        if ( ! empty( $from_date ) ) {
                                            $date_obj = DateTime::createFromFormat('Y-m-d', $from_date);
                                           
                                        }  
                                    }
                                    ?>
                                    <div class="entry-text-content">
                                        <div class="entry-category">
                                            <?php
                                            $categories = get_the_category();
                                            if ( ! empty( $categories ) ) {
                                                $category_names = array();
                                                foreach ( $categories as $category ) {
                                                    $category_names[] = esc_html( $category->name );
                                                }
                                                echo implode( ', ', $category_names );
                                            }
                                            ?>
                                        </div>
                                        <?php if ( $current_post_type == 'post' ){ ?>
                                        <div class="entry-date">
                                           <?php  echo get_the_date("j. F Y"); ?>
                                        </div>
                                        <?php } ?>
                                        <h2 class="entry-title">
                                            <?php the_title(); ?>
                                        </h2>
                                        <?php if ( $current_post_type == 'courses' ){ ?>
                                        <div class="meta-data">
                                            <?php  if ($date_obj) {
                                                $timestamp = $date_obj->getTimestamp();      
                                                $formatted_date = wp_date('d. M Y', $timestamp);
                                                ?>
                                            
                                            <div class="entry-from-date"><?php echo $formatted_date; ?></div>
                                            <?php } ?>
                                            <?php if ( ! empty( $location ) ) { ?>
                                        
                                            <div class="entry-location"><?php echo esc_html( $location ); ?></div>
                                            <?php } ?>
                                        </div>
                                        <?php } ?>
                                        <div class="entry-summary"><?php the_excerpt(); ?></div>
                                    </div>
                                </a>
                                </div>
            <?php
        endwhile;
    else :
        echo '<div class="no-results"><p>';
        _e( 'Ingen resultater funnet', 'coretrek' );
        echo '</p></div>';
    endif;

    $html = ob_get_clean();

    // Pagination HTML (rebuild dynamically)
    ob_start();
    echo paginate_links([
        'base'      => esc_url_raw(add_query_arg(['paged' => '%#%'])),
        'format'    => '',
        'current'   => max(1, $page_no),
        'total'     => $wp_query->max_num_pages,
        'prev_text' => __('‹', 'coretrek'),
        'next_text' => __('›', 'coretrek'),
        'type'      => 'plain',
    ]);
    $pagination_html = ob_get_clean();

    wp_reset_postdata();

    wp_send_json([
        'html'       => $html,
        'pagination' => $pagination_html,
        'max_pages'  => $wp_query->max_num_pages,
        'page'       => $page_no,
        'query'      => $wp_query->request,
    ]);
}

function coretrek_algolia_search_shortcode() {
    ob_start();

    // Get current search term and tab
    $s = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
    $active_tab = isset($_GET['type']) ? sanitize_key($_GET['type']) : 'all';

    // Define the available tabs
    $tabs = [
        'all'             => __('Alt innhold','coretrek'),
        'post'            => __('Artikler','coretrek'),
        'medlems_fordel'  => __('Medlemsfordeler','coretrek'),
        'courses'         => __('Kurs og arrangementer','coretrek'),
        'product'         => __('Produkter','coretrek'),
    ];

    // Ensure the active tab is valid
    if (!array_key_exists($active_tab, $tabs)) {
        $active_tab = 'all';
    }

    // Determine post types based on active tab
    $post_types = $active_tab === 'all'
        ? array_keys(array_diff_key($tabs, ['all' => '']))
        : [$active_tab];

    // Handle pagination
    $paged = max(1, get_query_var('paged', isset($_GET['paged']) ? intval($_GET['paged']) : 1));
    // Build the custom query
    $args = [
        'post_type'      => $post_types,
        's'              => $s,
        'posts_per_page' => get_option('posts_per_page', 12),
        'paged'          => $paged,
        'post_status'    => 'publish',
        'override_algolia' => 'gocrazy',
        'type'=> $active_tab
    ];

    $query = new WP_Query($args);
    ?>
            <div class="algolia-search-container">

                <header class="page-header">
                    <h1 class="page-title">
                        <?php printf( __( 'Søkeresultat : %s', 'coretrek' ),esc_html( $s )); ?>
                    </h1>

                </header>
                    <div class="wp-block-search__inside-wrapper "><input class="wp-block-search__input aa-input" id="wp-block-search__input-1" placeholder=" Skriv inn ditt søkeord" value="<?php echo esc_html($s);  ?>" type="search" name="s" required="" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-owns="algolia-autocomplete-listbox-0" dir="auto" style=""><pre aria-hidden="true" ></pre>
                    <p><button aria-label="Søk" class="wp-block-search__button wp-element-button" type="submit">Søk</button></p></div>
                <div class="algolia-content">
                <nav class="algolia-tabs category-filter">
                    <div class="radio-button-group">
                        <?php foreach ($tabs as $key => $label) : 
                            $tab_url = add_query_arg([
                                's'    => $s,
                                'type' => ($key === 'all' ? false : $key),
                                'paged' => false,
                            ], home_url('/'));

                            $class = ($key === $active_tab) ? 'active' : '';
                        ?>
                            <label class="<?php echo esc_attr($class); ?>">
                                <input 
                                    type="radio"
                                    name="tab"
                                    data-url="<?php echo esc_url($tab_url); ?>"
                                    <?php checked($key, $active_tab); ?>
                                >
                                <?php echo esc_html($label); ?>
                            </label>
                        <?php endforeach; ?>
                    </div>
                </nav>

                <div id="ajax-search-results-wrapper"
                    data-type="<?php echo esc_attr($active_tab); ?>"
                    data-search="<?php echo esc_attr($s); ?>"
                    data-page="<?php echo esc_attr($paged); ?>">

                    <div class="search-results-list" id="ajax-search-results">
                        <?php if ($query->have_posts()) : ?>
                            <?php while ($query->have_posts()) : $query->the_post(); ?>
                            <div id="post-<?php the_ID(); ?>" <?php post_class('search-result-item'); ?>>
                                    <a href="<?php the_permalink(); ?>">
                                    <?php if ( has_post_thumbnail() ) :
                                    ?>
                                        <div class="entry-thumbnail">
                                                <?php
                                                the_post_thumbnail('thumbnail');
                                                ?>
                                        </div>
                                    <?php endif;  ?>
                                    <?php
                                    $post_id = get_the_ID();
                                    $current_post_type = get_post_type( $post_id );
                                    if ( $current_post_type == 'courses' ){
                                        $from_date = get_post_meta( $post_id, 'course_date', true );
                                        $location  = get_post_meta( $post_id, 'course_location', true );
                                        if ( ! empty( $from_date ) ) {
                                            $date_obj = DateTime::createFromFormat('Y-m-d', $from_date);
                                           
                                        }  
                                    }
                                    ?>
                                    <div class="entry-text-content">
                                        <div class="entry-category">
                                            <?php
                                            $categories = get_the_category();
                                            if ( ! empty( $categories ) ) {
                                                $category_names = array();
                                                foreach ( $categories as $category ) {
                                                    $category_names[] = esc_html( $category->name );
                                                }
                                                echo implode( ', ', $category_names );
                                            }
                                            ?>
                                        </div>
                                        <?php if ( $current_post_type == 'post' ){ ?>
                                        <div class="entry-date">
                                           <?php  echo get_the_date("j. F Y"); ?>
                                        </div>
                                        <?php } ?>
                                        <h2 class="entry-title">
                                            <?php the_title(); ?>
                                        </h2>
                                        <?php if ( $current_post_type == 'courses' ){ ?>
                                        <div class="meta-data">
                                            <?php  if ($date_obj) {
                                                $timestamp = $date_obj->getTimestamp();      
                                                $formatted_date = wp_date('d. M Y', $timestamp);
                                                ?>
                                            
                                            <div class="entry-from-date"><?php echo $formatted_date; ?></div>
                                            <?php } ?>
                                            <?php if ( ! empty( $location ) ) { ?>
                                        
                                            <div class="entry-location"><?php echo esc_html( $location ); ?></div>
                                            <?php } ?>
                                        </div>
                                        <?php } ?>
                                        <div class="entry-summary"><?php the_excerpt(); ?></div>
                                    </div>
                                </a>
                                </div>
                            <?php endwhile; ?>
                        <?php else : ?>
                           <div class="no-results"><p>
                            <?php _e( 'Ingen resultater funnet', 'coretrek' ); ?>
                            </p></div>
                        <?php endif; ?>
                    </div>

                    <nav class="algolia-pagination artikkel-pagination" id="ajax-pagination">
                        <?php
                        echo paginate_links([
                            'base'      => add_query_arg('paged', '%#%'),
                            'format'    => '',
                            'current'   => $paged,
                            'total'     => $query->max_num_pages,
                            'prev_text' => __('‹', 'coretrek'),
                            'next_text' => __('›', 'coretrek'),
                        ]);
                        ?>
                    </nav>
                </div>
                </div>

            </div>


    <?php
    wp_reset_postdata();

    return ob_get_clean();
}
add_shortcode('algolia_search_results', 'coretrek_algolia_search_shortcode');


add_filter( 'algolia_searchable_post_shared_attributes','algolia_add_post_shared_attributes', 10, 2 );
 function algolia_add_post_shared_attributes(  $attributes, WP_Post $post ) {

    if($post->post_type =='courses'){
        $from_date = get_post_meta( $post->ID, 'course_date', true );
        if ( ! empty( $from_date ) ) {
            $date_obj = DateTime::createFromFormat('Y-m-d', $from_date);
            if ($date_obj) {
                $timestamp = $date_obj->getTimestamp();       
                $formatted_date = wp_date('d. M Y', $timestamp);
                $attributes['from_date'] = $formatted_date;
            }
        }
        $location  = get_post_meta( $post->ID, 'course_location', true );
        if ( ! empty( $location ) ) {
            $attributes['location'] =  $location;
        }
    }

    return $attributes;
}