import { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { initializeMapLayers, updateDropoffs } from './map.helper';
import './map.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWZlcm5hbmRlemNhcmlhZ2EiLCJhIjoiY202Nndzbmx6MDUzODJrb3A2eHVvb3lmdiJ9.aJRNY14s6I22MLq8jLBPYw';

const Map = ({ dropOffPoints }) => {
    const initialLocation = useMemo(() => [-68.10348998645422, -38.95008965955272], []);
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/light-v11',
                center: initialLocation,
                zoom: 13,
            });

            mapRef.current.on('load', () => {
                initializeMapLayers(mapRef.current, initialLocation);
                updateDropoffs(mapRef.current, dropOffPoints, initialLocation);
            });
        }
    }, [dropOffPoints, initialLocation]);

    return <div id="map" className="map-container"></div>;
};

export default Map;
