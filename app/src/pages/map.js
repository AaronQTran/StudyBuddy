import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function App() {
  // Coordinates for library markers
  const libraries = [
    { name: 'Marston Science Library', position: [29.647966553280117, -82.343966960907] },
    { name: 'Smathers Library', position: [29.650847698728658, -82.34179973602296] },
    { name: 'Library West', position: [29.651323219660075, -82.34292626380922] },
    { name: 'Health Science Library', position: [29.640917189545437, -82.34488964080812] },
  ];

  // Coordinates for building outlines (example coordinates for illustration)
  const buildingOutlines = [
    {
      name: 'Marston Science Library',
      coordinates: [
        [29.64794, -82.34403],
        [29.64801, -82.34392],
        [29.64793, -82.34385],
        [29.64786, -82.34397],
      ],
    },
    {
      name: 'Smathers Library',
      coordinates: [
        [29.65087, -82.34189],
        [29.65092, -82.34172],
        [29.65079, -82.34165],
        [29.65075, -82.34185],
      ],
    },
    {
      name: 'Library West',
      coordinates: [
        [29.65136, -82.34301],
        [29.65138, -82.34285],
        [29.65127, -82.34282],
        [29.65124, -82.34300],
      ],
    },
    {
      name: 'Health Science Library',
      coordinates: [
        [29.64094, -82.34497],
        [29.64100, -82.34482],
        [29.64087, -82.34475],
        [29.64083, -82.34490],
      ],
    },
  ];

  // State to manage the highlighted building
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);

  return (
    <div className="relative h-screen w-screen">
      <MapContainer
        center={[29.647966553280117, -82.343966960907]} // Centered at Marston
        zoom={17}
        minZoom={5}
        maxZoom={20}
        style={{ height: '100vh', width: '100vw' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render Library Markers */}
        {libraries.map((library, index) => (
          <Marker key={index} position={library.position}>
            <Popup>{library.name}</Popup>
          </Marker>
        ))}

        {/* Render Building Outlines */}
        {buildingOutlines.map((building, index) => (
          <Polygon
            key={index}
            pathOptions={{
              color: highlightedBuilding === building.name ? 'red' : 'blue',
              fillColor: highlightedBuilding === building.name ? 'lightcoral' : 'lightblue',
              fillOpacity: 0.5,
              weight: 2,
            }}
            positions={building.coordinates}
            eventHandlers={{
              mouseover: () => setHighlightedBuilding(building.name),
              mouseout: () => setHighlightedBuilding(null),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
