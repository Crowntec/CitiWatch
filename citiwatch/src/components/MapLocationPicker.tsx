'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapLocationPickerProps {
  latitude: number;
  longitude: number;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

export default function MapLocationPicker({ 
  latitude, 
  longitude, 
  onConfirm, 
  onCancel, 
  isVisible 
}: MapLocationPickerProps) {
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Fix for default markers in leaflet
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
        setLeafletReady(true);
      });
    }
  }, []);

  if (!isVisible || !leafletReady) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700">
        {/* Header */}
        <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-600">
          <h3 className="text-lg font-medium text-white">Confirm Your Location</h3>
          <p className="text-sm text-gray-400 mt-1">
            Is this the correct location for your complaint?
          </p>
        </div>

        {/* Map */}
        <div className="p-6">
          <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-600">
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[latitude, longitude]}>
                <Popup>
                  <div className="text-sm">
                    <strong>Your Location</strong><br />
                    Lat: {latitude.toFixed(6)}<br />
                    Lng: {longitude.toFixed(6)}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Location details */}
          <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="fas fa-map-marker-alt text-red-400"></i>
              <div>
                <p className="text-sm text-gray-300">
                  <strong>Coordinates:</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This location will be attached to your complaint
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-700/50 px-6 py-4 border-t border-gray-600 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <i className="fas fa-check mr-2"></i>
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}