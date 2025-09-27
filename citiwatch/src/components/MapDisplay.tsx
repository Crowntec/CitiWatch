'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  address?: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ latitude, longitude, address }) => {
  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            {address ? (
              <div>
                <strong>Your Location</strong>
                <br />
                {address}
              </div>
            ) : (
              <div>
                <strong>Your Location</strong>
                <br />
                Lat: {latitude.toFixed(6)}
                <br />
                Lng: {longitude.toFixed(6)}
              </div>
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapDisplay;