jQuery(document).ready(function($) {
    var map;
    var userLocation = null; // Store user location
    var markers = []; // Array to store all markers

    function initMap() {
        var bounds = new google.maps.LatLngBounds();

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10
        });

        // Add branch markers and extend the bounds
        branches.forEach(function(branch) {
            var marker = new google.maps.Marker({
                position: {lat: branch.lat, lng: branch.lng},
                map: map,
                title: branch.name
            });

            // Extend the map bounds to include this marker
            bounds.extend(marker.position);

            // Add marker to the markers array
            markers.push(marker);

            // Add click event listener for each marker
            google.maps.event.addListener(marker, 'click', function() {
                showBranchDetails(branch);
            });
        });

        // Adjust the map to fit all markers
        map.fitBounds(bounds);
    }

    function showBranchDetails(branch) {
        var distance = haversineDistance(referencePoint.lat, referencePoint.lng, branch.lat, branch.lng);

        $('#nearest-branch').html(
            '<h3>' + branch.name + '</h3>' +
            '<p><strong>Address:</strong> ' + branch.address + '</p>' +
            '<p><strong>Phone:</strong> ' + branch.phone + '</p>' +
            '<p><strong>Hours:</strong> ' + branch.hours + '</p>' +
            '<p><strong>Distance to nearest branch:</strong> ' + distance.toFixed(2) + ' km</p>' +
            '<a href="https://www.google.com/maps/dir/?api=1&origin=' + referencePoint.lat + ',' + referencePoint.lng + '&destination=' + branch.lat + ',' + branch.lng + '" target="_blank">Get Directions</a>'
        );

        // Clear existing markers
        clearMarkers();

        // Add marker for the selected branch
        new google.maps.Marker({
            position: {lat: branch.lat, lng: branch.lng},
            map: map,
            title: branch.name
        });

        // Center map on the selected branch and zoom in
        map.setCenter({lat: branch.lat, lng: branch.lng});
        map.setZoom(14); // Adjust zoom level as needed
    }

    function clearMarkers() {
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = []; // Clear the markers array
    }

    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    // Button click to locate the nearest branch
    $('#locate-nearest-branch').on('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                findNearestBranch(userLocation);
            }, function() {
                alert('Geolocation failed. Please enable location services.');
            });
        } else {
            alert('Your browser does not support geolocation.');
        }
    });

    // Initialize the map on page load
    $(window).on('load', initMap);
});
