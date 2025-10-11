"use client";

import React, { useState } from 'react';
import { 
  LoadingSpinner, 
  LoadingCard, 
  LoadingButton, 
  LoadingTable, 
  LoadingPage, 
  LoadingInline,
  LoadingOverlay 
} from './Loading';

export const LoadingTest: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-white text-2xl mb-8">Loading Animation Test - All Components</h1>
      
      {/* Basic Spinners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-white mb-4">Small with Logo</h2>
          <LoadingSpinner size="sm" color="blue" withLogo={true} />
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-white mb-4">Medium with Logo</h2>
          <LoadingSpinner size="md" color="blue" withLogo={true} />
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-white mb-4">Large with Logo</h2>
          <LoadingSpinner size="lg" color="blue" withLogo={true} />
        </div>
      </div>
      
      {/* Cards and Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-white mb-4">Loading Card (with Logo)</h2>
          <LoadingCard message="Loading your data..." withLogo={true} />
        </div>
        
        <div>
          <h2 className="text-white mb-4">Loading Card (without Logo)</h2>
          <LoadingCard message="Simple loading..." withLogo={false} />
        </div>
      </div>
      
      {/* Buttons */}
      <div className="mb-8">
        <h2 className="text-white mb-4">Loading Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <LoadingButton 
            isLoading={buttonLoading}
            onClick={() => {
              setButtonLoading(true);
              setTimeout(() => setButtonLoading(false), 3000);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            withLogo={true}
            loadingText="Processing with Logo..."
          >
            Click Me (With Logo)
          </LoadingButton>
          
          <LoadingButton 
            isLoading={buttonLoading}
            onClick={() => {
              setButtonLoading(true);
              setTimeout(() => setButtonLoading(false), 3000);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
            withLogo={false}
            loadingText="Processing..."
          >
            Click Me (Simple)
          </LoadingButton>
        </div>
      </div>
      
      {/* Table Loading */}
      <div className="mb-8">
        <h2 className="text-white mb-4">Loading Table</h2>
        <LoadingTable 
          columns={4} 
          rows={3} 
          message="Loading complaints data..."
          withLogo={true}
        />
      </div>
      
      {/* Inline Loading */}
      <div className="mb-8">
        <h2 className="text-white mb-4">Inline Loading Examples</h2>
        <div className="bg-gray-800 p-4 rounded-lg space-y-4">
          <LoadingInline message="Loading profile..." size="sm" withLogo={true} />
          <LoadingInline message="Fetching notifications..." size="md" withLogo={false} />
          <LoadingInline size="lg" withLogo={true} />
        </div>
      </div>
      
      {/* Overlay Test */}
      <div className="mb-8">
        <h2 className="text-white mb-4">Overlay Test</h2>
        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded mr-4"
          onClick={() => setShowOverlay(true)}
        >
          Show Loading Overlay (With Logo)
        </button>
        
        {showOverlay && (
          <LoadingOverlay 
            message="Loading CitiWatch application..." 
            withLogo={true}
          />
        )}
        
        <button 
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => setShowOverlay(false)}
        >
          Hide Overlay
        </button>
      </div>
      
      {/* Page Loading Example */}
      <div className="mb-8">
        <h2 className="text-white mb-4">Page Loading Preview</h2>
        <div className="bg-gray-800 rounded-lg p-4 h-64 relative overflow-hidden">
          <LoadingPage 
            title="CitiWatch Dashboard" 
            message="Preparing your personalized experience..."
            withLogo={true}
            className="absolute inset-0 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingTest;