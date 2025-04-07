import React, { useState, useRef, useEffect} from 'react';
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
  // Coordinates for library markers

  const libraries = [
    { name: 'Marston Science Library', position: [29.647966553280117, -82.343966960907], color: 'bg-blue-700', hover: 'hover:bg-blue-800', floors: [1,2,3,4,5] },
    { name: 'Smathers Library', position: [29.650847698728658, -82.34179973602296], color: 'bg-orange-600', hover: 'hover:bg-orange-700', floors: [1,2,3,4]},
    { name: 'Library West', position: [29.651323219660075, -82.34292626380922], color: 'bg-blue-700', hover: 'hover:bg-blue-800', floors: [1,2,3,4,5,6]},
    { name: 'Health Science Library', position: [29.640917189545437, -82.34488964080812], color: 'bg-orange-600', hover: 'hover:bg-orange-700', floors: [1,2]},
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
  const mapRef = useRef(null);
  // State to manage the highlighted building
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);
  // Library use states
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [page, setPage] = useState(1);

  const handleBackClick = () => {
    setSelectedLibrary('');
    setSelectedFloor('');
    if (mapRef.current) {
      mapRef.current.setView([29.647966553280117, -82.343966960907], 17);
    }
  };

  //Move this function outside of handleBackClick
  const handleSubmit = async () => {
    //for now i dont want to include people to get the basic MVP done.
    //we want to get course numbers here - bring it up next meeting
    //notes and focus level needed
    var id = "id" + Math.random().toString(16).slice(2)
    console.log(id)
    const data = {
      ssid: id,
      building: selectedLibrary,
      floor: selectedFloor,
      date: selectedDate,
      startTime: startTime,
      endTime: endTime
    }
    console.log(data)
    try{
      const response = await fetch("http://localhost:3000/api/create_session", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if(response.ok){
        console.log(result.message); 
      }else{
        console.log(result.error);
      }
    }catch(error){
      console.log('error in trying to create session')
    }
  }

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
            <h2 className="text-2xl font-bold mb-6">Pick a Study Spot!</h2>
            
            <div className="space-y-4">
              {libraries.map((library) =>
                selectedLibrary === library.name ? (
                  <div
                    key={library.name}
                    className={`${library.color} relative shadow-lg p-6 rounded-lg border border-gray-300`}

                  >
                    <button
                      onClick={handleBackClick}
                      className="absolute top-2 right-2 text-white hover:text-red-500 text-xl font-bold"
                    >
                      ×
                    </button>
                    <h3 className="absolute top-2 left-2 text-lg font-semibold text-white mb-2">{library.name}</h3>
                    
                    <div className="text-white space-y-18 text-left">

                  {/* Floor */}
                  <div className="flex space-x-4 space-y-4">
                    <label className="w-20 font-semibold transform translate-y-5">Floor:</label>
                    <select
                      name="selectedFloor"
                      className="flex-1 p-2 border rounded-md text-black"
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(e.target.value)}
                    >
                      <option value="" disabled>Select Floor</option>
                      {libraries.find(lib => lib.name === selectedLibrary)?.floors.map((floor, index) => (
                        <option key={index} value={floor}>{floor}</option>
                      ))}
                    </select>
                  </div>

                  {/* Duration section */}
                  <div>
                    <label className="block mb-2 font-semibold">Duration:</label>

                    <div className="space-y-4">

                      {/* Day */}
                      <div className="flex items-center space-x-4">
                        <label htmlFor="date" className="w-20 transform translate-x-8">Date:</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          className="flex-1 p-2 border rounded-md text-black"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>

                      {/* Start Time */}
                      <div className="flex items-center space-x-4">
                        <label htmlFor="startTime" className="w-20 transform translate-x-8">Start:</label>
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          className="flex-1 border border-gray-300 rounded-lg p-2 text-black"
                          onChange={(e) =>setStartTime(e.target.value)}
                        />
                      </div>

                      {/* End Time */}
                      <div className="flex items-center space-x-4">
                        <label htmlFor="endTime" className="w-20 transform translate-x-8">End:</label>
                        <input
                          type="time"
                          id="endTime"
                          name="endTime"
                          className="flex-1 border border-gray-300 rounded-lg p-2 text-black"
                          onChange={(e) =>setEndTime(e.target.value)}
                        />
                      </div>

                    </div>
                  </div>

                </div>

                  </div>
                ) : (                
                  <button
                    key={library.name}
                    className={`${library.color} ${library.hover} text-white px-8 py-2 rounded-lg w-full text-left`}
                    onClick={() => {
                      setSelectedLibrary(library.name);
                    }}             
                  >
                    {library.name}
                  </button>
                )
              )}

              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-2 rounded-lg w-full"
                onClick={() => setPage(1)}
              >
                Back
              </button>
              <button
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 rounded-lg font-semibold transition transform translate-y-24"
                  onClick={handleSubmit}
                >
                  Fetch
                </button>
              </div>
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
          whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
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
