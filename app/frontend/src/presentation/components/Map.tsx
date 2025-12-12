import React from 'react';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Marker } from '../../domain/types';
import L from 'leaflet';

// Fix icono default de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    markers: Marker[];
}

const Map: React.FC<MapProps> = ({ markers }) => {
    const defaultPosition: [number, number] = [40.416775, -3.703790]; // Madrid

    return (
        <div className="w-full h-[500px] border-2 border-neo-black shadow-hard mb-6 z-0 relative">
            <MapContainer center={defaultPosition} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker, idx) => (
                    <LeafletMarker key={marker._id || idx} position={[marker.latitude, marker.longitude]}>
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-2">{marker.location_name}</h3>
                                <img
                                    src={marker.image_url}
                                    alt={marker.location_name}
                                    className="w-32 h-32 object-cover border-2 border-black shadow-sm mx-auto"
                                />
                                <p className="text-xs mt-2 text-gray-500">{marker.user_email}</p>
                            </div>
                        </Popup>
                    </LeafletMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;
