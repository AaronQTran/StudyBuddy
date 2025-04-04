import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from "framer-motion";
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function Map() {
  //Rectangle
  {/*Main Content*/}
  
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
  // Track the sidebar "pages"
  const [page, setPage] = useState(1);

  return (
    <div className="flex h-screen w-screen">
    {/* Floating Sidebar */}
    <div className="absolute top-4 left-4 h-[calc(100vh-2rem)] w-1/4 bg-white bg-opacity-90 shadow-2xl rounded-2xl p-4 z-[1000] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {page === 1 && (
            <div className="text-center">
              <h2 className="text-4xl font-bold transform translate-y-64">
                <span className="text-[#000000]">Would You Like To </span>
                <span className="text-[#0938f8]"> Join</span>  
                <span className="text-[#000000]"> or</span>
                <span className="text-[#FA4616]"> Create</span>
                <span className="text-[#000000]"> a Study Session?</span>
              </h2> 
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-blue-700 hover:bg-blue-800 text-white px-9 py-2 rounded-lg font-semibold transition transform translate-y-72"
                  onClick={() => setPage(2)}
                >
                  Join
                </button>
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 rounded-lg font-semibold transition transform translate-y-72"
                  onClick={() => setPage(3)}
                >
                  Create
                </button>
              </div>
            </div>
          )}

          {page === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Join a Study Session</h2>
              <p>Select a session from the list below:</p>
              <ul className="mt-4">
                
              </ul>
              <button
                className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setPage(1)}
              >
                Back
              </button>
            </div>
          )}

          {page === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Pick a Study Spot!</h2>
              
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setPage(1)}
              >
                Back
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  
      {/* Map Container*/}
      <div className="w-full h-full">
        <MapContainer
          center={[29.647966553280117, -82.343966960907]}
          zoom={17}
          minZoom={5}
          maxZoom={20}
          style={{ height: '100vh', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
  
          {/* Library Markers */}
          {libraries.map((library, index) => (
            <Marker key={index} position={library.position}>
              <Popup>{library.name}</Popup>
            </Marker>
          ))}
  
          {/* Building Outlines */}
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
    </div>
  );  
}

export default Map;
