import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import buoys from '../assets/buoys.json';

// Fix default icon paths so markers appear correctly in bundlers like CRA
// Reference images from leaflet package
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Normalized buoy points from JSON
const rawPoints = buoys
  .filter(b => typeof b.lat === 'number' && typeof b.lng === 'number')
  .map(b => ({
    id: b.id || `${b.lat},${b.lng}`,
    position: [b.lat, b.lng],
    raw: b,
  }));

export const MapView = ({ isVisible }) => {
  const [filters, setFilters] = useState({
    active: true,
    new: true,
    maintenance: true,
    offline: true,
  });

  const dataPoints = useMemo(() => {
    return rawPoints.filter(p => {
      const status = (p.raw.status || '').toLowerCase();
      if (status.includes('active')) return filters.active;
      if (status.includes('new')) return filters.new;
      if (status.includes('maintenance')) return filters.maintenance;
      if (status.includes('offline')) return filters.offline;
      return true; // show if status unknown
    });
  }, [filters]);

  if (!isVisible) {
    return null;
  }

// Fit map to data bounds on mount/update
function FitToData({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    const latlngs = points.map(p => L.latLng(p.position[0], p.position[1]));
    const bounds = L.latLngBounds(latlngs);
    try {
      map.fitBounds(bounds.pad(0.1), { animate: true });
    } catch (_) {}
  }, [map, points]);
  return null;
}

// Scale control wrapper
function ScaleControl({ position = 'bottomleft' }) {
  const map = useMap();
  useEffect(() => {
    const control = L.control.scale({ position });
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map, position]);
  return null;
}

// Mouse position display (lat/lng) in a small control
function MousePositionControl({ position = 'bottomright' }) {
  const map = useMap();
  useEffect(() => {
    const div = L.DomUtil.create('div', 'leaflet-control mouse-pos');
    div.style.background = 'rgba(255,255,255,0.9)';
    div.style.padding = '4px 8px';
    div.style.borderRadius = '6px';
    div.style.fontSize = '12px';
    const control = L.control({ position });
    control.onAdd = () => div;
    control.addTo(map);
    const onMove = (e) => {
      const { lat, lng } = e.latlng;
      div.innerHTML = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    };
    map.on('mousemove', onMove);
    return () => {
      map.off('mousemove', onMove);
      control.remove();
    };
  }, [map, position]);
  return null;
}

  return (
    <div className="map-view-container">
      <MapContainer
        key="map"
        className="map-container"
        center={[28.6139, 77.2090]}
        zoom={5}
        minZoom={2}
        scrollWheelZoom={true}
        worldCopyJump={false}
        maxBounds={[[ -85, -180 ], [ 85, 180 ]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
      >
        <LocateControl position="topright" />
        <FitToData points={dataPoints} />
        {/* Base layers */}
        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              noWrap={true}
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Streets">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={true}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <ScaleControl position="bottomleft" />
        <MousePositionControl position="bottomright" />
        {/* Plot data points with labels */}
        {dataPoints.map((point) => {
          const status = (point.raw.status || '').toLowerCase();
          const color = status.includes('active')
            ? '#10b981' // green
            : status.includes('new')
            ? '#3b82f6' // blue
            : status.includes('maintenance')
            ? '#f59e0b' // amber
            : status.includes('offline')
            ? '#ef4444' // red
            : '#fbbf24'; // default yellow
          return (
            <Marker
              key={point.id}
              position={point.position}
              icon={L.divIcon({
                className: 'buoy-icon',
                html: `
                  <div class="buoy" style="--buoy-color: ${color}">
                    <div class="mast"></div>
                    <div class="float"></div>
                  </div>
                `,
                iconSize: [14, 20],
                iconAnchor: [7, 10],
              })}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{point.raw.id || 'Buoy'}</div>
                  {point.raw.timestamp && (
                    <div><strong>Timestamp:</strong> {point.raw.timestamp}</div>
                  )}
                  {point.raw.status && (
                    <div><strong>Status:</strong> {point.raw.status}</div>
                  )}
                  {point.raw.battery && (
                    <div><strong>Battery:</strong> {point.raw.battery}</div>
                  )}
                  <div><strong>Lat:</strong> {point.position[0].toFixed(4)}, <strong>Lng:</strong> {point.position[1].toFixed(4)}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {/* Floating legend overlay */}
      <div className="map-legend">
        <div className="legend-title">Legend</div>
        <label className="legend-item">
          <input type="checkbox" checked={filters.active} onChange={(e) => setFilters(f => ({...f, active: e.target.checked}))} />
          <span className="dot" style={{ background: '#10b981' }} /> Active
        </label>
        <label className="legend-item">
          <input type="checkbox" checked={filters.new} onChange={(e) => setFilters(f => ({...f, new: e.target.checked}))} />
          <span className="dot" style={{ background: '#3b82f6' }} /> New
        </label>
        <label className="legend-item">
          <input type="checkbox" checked={filters.maintenance} onChange={(e) => setFilters(f => ({...f, maintenance: e.target.checked}))} />
          <span className="dot" style={{ background: '#f59e0b' }} /> Maintenance
        </label>
        <label className="legend-item">
          <input type="checkbox" checked={filters.offline} onChange={(e) => setFilters(f => ({...f, offline: e.target.checked}))} />
          <span className="dot" style={{ background: '#ef4444' }} /> Offline
        </label>
      </div>
    </div>
  );
};

// Custom control to locate and zoom to user's current position
function LocateControl() {
  const map = useMap();

  useEffect(() => {
    const Locate = L.Control.extend({
      onAdd: function () {
        const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control map-locate-btn');
        btn.title = 'Locate me';
        btn.innerHTML = '📍';
        L.DomEvent.on(btn, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              const latlng = [latitude, longitude];
              L.circleMarker(latlng, {
                radius: 8,
                color: '#2563eb',
                weight: 3,
                fillColor: '#3b82f6',
                fillOpacity: 0.6,
              })
                .addTo(map)
                .bindPopup('You are here')
                .openPopup();
              map.setView(latlng, 12, { animate: true });
            },
            (err) => {
              console.error('Geolocation error', err);
              alert('Unable to retrieve your location.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });
        return btn;
      },
      onRemove: function () {}
    });

    const control = new Locate({ position: 'topleft' });
    map.addControl(control);
    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
}
