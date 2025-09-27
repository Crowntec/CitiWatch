'use client';

import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapDisplay = dynamic(() => import('./MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onConfirm: () => void;
  onCancel: () => void;
  address?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  onConfirm,
  onCancel,
  address
}) => {
  return (
    <div className="space-y-4">
      <MapDisplay 
        latitude={latitude} 
        longitude={longitude} 
        address={address} 
      />
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Is this your correct location?</h3>
        <p className="text-blue-700 text-sm mb-4">
          {address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yes, this is correct
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            No, let me enter manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;