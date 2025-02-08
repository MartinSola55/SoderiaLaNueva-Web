import * as turf from '@turf/turf';
import { fetchRoute } from './map.data';

export const initializeMapLayers = (map, initialLocation) => {
    const warehouseFeature = turf.featureCollection([turf.point(initialLocation)]);
    const emptyGeoJson = turf.featureCollection([]);

    // Warehouse Source & Layer
    map.addSource('warehouse', { type: 'geojson', data: warehouseFeature });
    map.addLayer({
        id: 'warehouse',
        type: 'circle',
        source: 'warehouse',
        paint: {
            'circle-radius': 20,
            'circle-color': 'white',
            'circle-stroke-color': '#3887be',
            'circle-stroke-width': 3,
        },
    });
    map.addLayer({
        id: 'warehouse-symbol',
        type: 'symbol',
        source: 'warehouse',
        layout: {
            'icon-image': 'grocery',
            'icon-size': 1.5,
        },
    });

    // Dropoffs Source & Layers
    map.addSource('dropoffs', { type: 'geojson', data: emptyGeoJson });
    map.addLayer({
        id: 'dropoffs-circle',
        type: 'circle',
        source: 'dropoffs',
        paint: {
            'circle-radius': 5,
            'circle-color': '#3887be',
        },
    });
    map.addLayer({
        id: 'dropoffs-symbol',
        type: 'symbol',
        source: 'dropoffs',
        layout: {
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-image': 'marker-15',
        },
    });

    // Route Source & Layers
    map.addSource('route', { type: 'geojson', data: emptyGeoJson });
    map.addLayer({
        id: 'routeline-active',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': '#3887be',
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12],
        },
    });
    map.addLayer(
        {
            id: 'routearrows',
            type: 'symbol',
            source: 'route',
            layout: {
                'symbol-placement': 'line',
                'text-field': '▶',
                'text-size': ['interpolate', ['linear'], ['zoom'], 12, 24, 22, 60],
                'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 12, 30, 22, 160],
                'text-keep-upright': false,
            },
            paint: {
                'text-color': '#3887be',
                'text-halo-color': 'hsl(55, 11%, 96%)',
                'text-halo-width': 3,
            },
        },
        'waterway-label'
    );
};

export const updateDropoffs = (map, dropOffPoints, initialLocation) => {
    const dropoffSource = map.getSource('dropoffs');
    const routeSource = map.getSource('route');

    if (dropoffSource) {
        const features = dropOffPoints.map((point) => turf.point([point.lng, point.lat]));
        const geojson = turf.featureCollection(features);
        dropoffSource.setData(geojson);

        if (features.length > 0) {
            const coordinates = [initialLocation, ...features.map((f) => f.geometry.coordinates)];
            fetchRoute(coordinates, (routeData) => {
                if (routeData) {
                    const routeGeoJson = turf.featureCollection([turf.feature(routeData)]);
                    routeSource.setData(routeGeoJson);
                }
            });
        }
    }
};