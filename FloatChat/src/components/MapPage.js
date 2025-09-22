import React from 'react';
import { MapView } from './MapView';
import './MapPage.css';

export const MapPage = () => {
  return (
    <div className="map-page-container">
      <div className="map-page-header">
        <h1 className="map-page-title">Ocean Observation Network</h1>
        <p className="map-page-subtitle">
          Interactive map showing Argo buoy locations and ocean data visualization
        </p>
      </div>
      <div className="map-page-content">
        <MapView isVisible={true} />
      </div>
    </div>
  );
};
