

(function () {
  'use strict';

  // MapTiler API key (replace with your actual key)
  const apiKey ='RNljv5vaYnB9KFXIn8Am';

  document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map centered on Hubli, Karnataka
    const hubliCoords = [75.1240, 15.3647]; // [Longitude, Latitude]

    const map = new maplibregl.Map({
      container: 'locationMap',
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: hubliCoords,
      zoom: 12, // Zoom level to show Hubli properly
    });

    // Default marker at Hubli
    let marker = new maplibregl.Marker().setLngLat(hubliCoords).addTo(map);

    // Function to update location input field with address
    function updateLocationField(lng, lat) {
      fetch(`https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            document.getElementById('location').value = data.features[0].place_name;
          } else {
            document.getElementById('location').value = `${lat}, ${lng}`;
          }
        })
        .catch(error => console.error('Reverse geocoding error:', error));
    }

    // Allow user to select location by clicking on the map
    map.on('click', function (event) {
      const lng = event.lngLat.lng;
      const lat = event.lngLat.lat;

      // Move marker to clicked location
      marker.setLngLat([lng, lat]);

      // Update location input field
      updateLocationField(lng, lat);
    });

    // Update map and marker when user types a location
    document.getElementById('location').addEventListener('input', function (event) {
      const location = event.target.value.trim();

      if (location.length >= 3) {
        fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${apiKey}`)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              const coords = data.features[0].geometry.coordinates;
              const lng = coords[0];
              const lat = coords[1];

              // Update map and marker
              map.setCenter([lng, lat]);
              map.setZoom(12);
              marker.setLngLat([lng, lat]);
            }
          })
          .catch(error => console.error('Geocoding error:', error));
      }
    });

    // Set the default location in the input field
    updateLocationField(hubliCoords[0], hubliCoords[1]);
  });
})();
