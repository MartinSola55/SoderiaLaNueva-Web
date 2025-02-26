import mapboxgl from 'mapbox-gl';
import Toast from '../Toast/Toast';

export const fetchRoute = (coordinates, callback) => {
    const coordinatesStr = coordinates.map((c) => c.join(',')).join(';');
    const query = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinatesStr}?geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;

    fetch(query)
        .then((response) => response.json())
        .then((data) => {
            if (data.trips && data.trips[0]) {
                callback(data.trips[0].geometry);
            } else {
                Toast.error('No route data found');
                callback(null);
            }
        })
        .catch((error) => {
            Toast.error(error);
            callback(null);
        });
};
