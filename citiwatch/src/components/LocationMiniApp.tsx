'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapDisplay = dynamic(() => import('./MapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Loading map...</div>
    </div>
  )
});

interface LocationMiniAppProps {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string) => void;
  loading?: boolean;
}

const LocationMiniApp: React.FC<LocationMiniAppProps> = ({
  latitude,
  longitude,
  onLocationChange,
  loading = false
}) => {

  const [gettingLocation, setGettingLocation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempLocation, setTempLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);



  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Store temporary location and show confirmation
        setTempLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setShowConfirmation(true);
        setGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get location. ';
        
        if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
          errorMessage += 'Location access was denied. Please allow location access and try again.';
        } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
          errorMessage += 'Location information is unavailable.';
        } else if (error.code === GeolocationPositionError.TIMEOUT) {
          errorMessage += 'Location request timed out.';
        }
        
        alert(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  };

  const confirmLocation = () => {
    if (tempLocation) {
      onLocationChange(
        tempLocation.latitude.toString(),
        tempLocation.longitude.toString()
      );
      setShowConfirmation(false);
      setTempLocation(null);
    }
  };

  const cancelLocation = () => {
    setShowConfirmation(false);
    setTempLocation(null);
  };

  const clearLocation = () => {
    onLocationChange('', '');
  };

  const hasLocation = latitude && longitude;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          Location *
        </label>
        {hasLocation && (
          <button
            type="button"
            onClick={clearLocation}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear location
          </button>
        )}
      </div>

      {/* Location Confirmation Modal */}
      {showConfirmation && tempLocation && (
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-300 mb-3">
            Is this your correct location?
          </h3>
          
          <div className="mb-4">
            <MapDisplay
              latitude={tempLocation.latitude}
              longitude={tempLocation.longitude}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={confirmLocation}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Yes, this is correct
            </button>
            <button
              type="button"
              onClick={cancelLocation}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              No, try again
            </button>
          </div>
        </div>
      )}

      {/* Location Set State */}
      {hasLocation && !showConfirmation && (
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-300">
                Location Set
              </p>
              <p className="text-sm text-green-200 mt-1">
                Your location has been confirmed
              </p>
            </div>
          </div>
          
          {/* Working Map Preview */}
          <div className="mt-3">
            <MapDisplay
              latitude={parseFloat(latitude)}
              longitude={parseFloat(longitude)}
            />
          </div>
        </div>
      )}

      {/* No Location Set State */}
      {!hasLocation && !showConfirmation && (
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
          <div className="text-center">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-red-300 mb-3 font-medium">
              Location is required
            </p>
            <p className="text-xs text-red-200 mb-4">
              Please set your location to help identify the issue area
            </p>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={gettingLocation || loading}
              className="inline-flex items-center px-4 py-2 border border-red-600 shadow-sm text-sm leading-4 font-medium rounded-md text-red-300 bg-red-900/50 hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 disabled:opacity-50 transition-colors"
            >
              {gettingLocation ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-red-500 border-t-red-300 rounded-full"></div>
                  Getting location...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Set Current Location
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMiniApp;