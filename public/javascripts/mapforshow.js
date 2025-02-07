
  (function () {
    'use strict';

    // MapTiler API key (replace with your actual key)
    const apiKey = 'RNljv5vaYnB9KFXIn8Am';

    document.addEventListener("DOMContentLoaded", function () {
      const location = "<%= campground.location %>"; // Pass the location string from backend

      // Function to get coordinates for a location using Geocoding API
      function getCoordinatesFromLocation(location) {
        fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${apiKey}`)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              const coords = data.features[0].geometry.coordinates;
              const lng = coords[0];
              const lat = coords[1];
              initializeMap(lng, lat);
            } else {
              console.error('Location not found');
            }
          })
          .catch(error => console.error('Geocoding error:', error));
      }

      // Initialize the map with given coordinates
      function initializeMap(lng, lat) {
        const map = new maplibregl.Map({
          container: 'locationMap',
          style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
          center: [lng, lat],
          zoom: 12, // Zoom level
        });

        const marker = new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);

        // Disable interactions (read-only map)
        map.on('click', function () {
          // No action on click
        });

        // Make the location input field readonly
        const locationField = document.getElementById('location');
        if (locationField) {
          locationField.setAttribute('readonly', true); // Set input to readonly
        }
      }

      // Start geocoding the location
      getCoordinatesFromLocation(location);
    });
  })();

