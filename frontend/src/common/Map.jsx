import ReactMapGl, { Marker, Source, Layer } from "react-map-gl";
import { useState, useEffect, useRef } from "react";
import '../styles/map.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const TOKEN = import.meta.env.VITE_TOKEN;

function Map({ from, to, route }) {

    const [viewport, setViewport] = useState({
        latitude: from.latitude,
        longitude: from.longitude,
        zoom: 11,
    });

    const mapRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (mapRef.current) {
                const map = mapRef.current.getMap();
                map.resize();
            }
        }, 100);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="map">
            <ReactMapGl
                {...viewport}
                mapboxAccessToken={TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onMove={(event) => { setViewport(event.viewState); }}
                ref={mapRef}
            >
                <Source type="geojson" data={route}>
                    <Layer
                        id="route"
                        type="line"
                        paint={{
                            "line-color": "#007cbf",
                            "line-width": 8,
                        }}
                    />
                </Source>
                <Marker latitude={from.latitude} longitude={from.longitude}/>
                <Marker latitude={to.latitude} longitude={to.longitude} />
            </ReactMapGl>
        </div>
    );
}

export default Map;