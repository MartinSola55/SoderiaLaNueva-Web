import { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { initializeMapLayers, updateDropoffs } from './map.helper';
import './map.scss';

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const Map = ({
	dropOffPoints = [],
	visitedPoints = []
}) => {
	// const initialLocation = useMemo(() => [-68.10348998645422, -38.95008965955272], []
	// UTN
	const initialLocation = useMemo(() => [-60.6438082765585, -32.954323094788634], []);
	const mapRef = useRef(null);

	useEffect(() => {
		if (accessToken) {
			mapboxgl.accessToken = accessToken;

			if (!mapRef.current) {
				mapRef.current = new mapboxgl.Map({
					container: 'map',
					style: 'mapbox://styles/mapbox/light-v11',
					center: initialLocation,
					zoom: 13,
				});

				mapRef.current.on('load', () => {
					initializeMapLayers(mapRef.current, initialLocation);
					updateDropoffs(mapRef.current, dropOffPoints, visitedPoints, initialLocation);
				});
			}
		}

		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accessToken, initialLocation]);

	useEffect(() => {
		if (mapRef.current) {
			updateDropoffs(mapRef.current, dropOffPoints, visitedPoints, initialLocation);
		}
	}, [dropOffPoints, visitedPoints, initialLocation]);

	if (!accessToken)
		return null;

	return <div id="map" className="map-container"></div>;
};

export default Map;
