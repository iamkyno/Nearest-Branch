<?php


//Add to functions file

// Google Maps API
wp_enqueue_script('google-maps-api', 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY', array(), null, true);
  
// Custom JS for branch locator
wp_enqueue_script('branch-locator-js', CHILD_URL . '/js/branch-locator.js', array('jquery'), null, true);


function get_branches_data() {
    // Define a WP_Query to get posts from the 'branches' post type
    $args = array(
        'post_type' => 'branches',
        'posts_per_page' => -1
    );
    
    $query = new WP_Query($args);
    $branches = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            // Retrieve custom fields using get_post_meta or ACF functions
            $lat = get_post_meta(get_the_ID(), 'branch_latitude', true); // Replace with your custom field key
            $lng = get_post_meta(get_the_ID(), 'branch_longitude', true); // Replace with your custom field key
            $address = get_post_meta(get_the_ID(), 'branch_address', true);
            $phone = get_post_meta(get_the_ID(), 'branch_phone', true);
            $hours = get_post_meta(get_the_ID(), 'branch_hours', true);
            
            // Push data into the branches array
            $branches[] = array(
                'name' => get_the_title(),
                'lat' => floatval($lat),
                'lng' => floatval($lng),
                'address' => $address,
                'phone' => $phone,
                'hours' => $hours
            );
        }
    }

    wp_reset_postdata();

    return $branches;
}

// Create a shortcode to output the map and pass the branch data to JS
function branch_map_shortcode() {
    $branches = get_branches_data(); // Get the branch data

    // Pass the branches data to the JavaScript
    ?>
    <div id="map" style="width: 100%; height: 500px;"></div>
    <div id="nearest-branch"></div>
    <button id="locate-nearest-branch">Find Nearest Branch</button>

    <script type="text/javascript">
        var branches = <?php echo json_encode($branches); ?>;
    </script>
    <?php
}
add_shortcode('branch_map', 'branch_map_shortcode');
