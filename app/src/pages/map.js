import React, { useState, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
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
    { name: 'Marston Science Library', 
      position: [29.647966553280117, -82.343966960907], 
      color: 'bg-blue-700', 
      hover: 'hover:bg-blue-800', 
      floors: [1,2,3,4,5], 
      hours: {
        Sunday : { open: "10:00", close: "23:59" },
        Monday : { open: "0:00", close: "23:59" },
        Tuesday : { open: "0:00", close: "23:59" }, 
        Wednesday : { open: "0:00", close: "23:59" }, 
        Thursday : { open: "0:00", close: "23:59" }, 
        Friday : { open: "0:00", close: "22:00" }, 
        Saturday : { open: "9:00", close: "20:00" }
      } 
    },
    { name: 'Smathers Library', 
      position: [29.650847698728658, -82.34179973602296], 
      color: 'bg-orange-600', 
      hover: 'hover:bg-orange-700', 
      floors: [1,2,3,4], 
      hours: {
        Sunday : { open: "2:00", close: "22:00" },
        Monday : { open: "8:00", close: "19:00" },
        Tuesday : { open: "8:00", close: "19:00" },
        Wednesday : { open: "8:00", close: "19:00" },
        Thursday : { open: "8:00", close: "19:00" },
        Friday : { open: "8:00", close: "17:00" },
        Saturday : null
      }
    },
    { name: 'Library West', 
      position: [29.651323219660075, -82.34292626380922], 
      color: 'bg-blue-700', 
      hover: 'hover:bg-blue-800', 
      floors: [1,2,3,4,5,6], 
      hours: {
        Sunday : { open: "10:00", close: "1:00" },
        Monday : { open: "8:00", close: "1:00" },
        Tuesday : { open: "8:00", close: "1:00" },
        Wednesday : { open: "8:00", close: "1:00" },
        Thursday : { open: "8:00", close: "1:00" },
        Friday : { open: "8:00", close: "22:00" },
        Saturday : { open: "9:00", close: "20:00" }
      }
    },
    { name: 'Health Science Library', 
      position: [29.640917189545437, -82.34488964080812], 
      color: 'bg-orange-600', 
      hover: 'hover:bg-orange-700', 
      floors: [1,2], 
      hours: {
        Sunday : { open: "13:00", close: "22:00" },
        Monday : { open: "8:00", close: "22:00" },
        Tuesday : { open: "8:00", close: "22:00" },
        Wednesday : { open: "8:00", close: "22:00" },
        Thursday : { open: "8:00", close: "22:00" },
        Friday : { open: "8:00", close: "17:00" },
        Saturday : { open: "13:00", close: "17:00" }
      }
    },
    { name: 'Reitz Union', 
      position: [29.646316, -82.347701], 
      color: 'bg-blue-600', 
      hover: 'hover:bg-blue-700', 
      floors: ['LL','G', '1','2','3'], 
      hours: {
        Sunday : { open: "9:00", close: "21:00" },
        Monday : { open: "7:00", close: "23:00" },
        Tuesday : { open: "7:00", close: "23:00" },
        Wednesday : { open: "7:00", close: "23:00" },
        Thursday : { open: "7:00", close: "23:00" },
        Friday : { open: "7:00", close: "23:00" },
        Saturday : { open: "9:00", close: "21:00" }
      }
    },
  ];
  
  //function to convert the date to a day of the week: 
  function getDayOfWeek(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' }); 
  }



  // Coordinates for building outlines (example coordinates for illustration)
  const buildingOutlines = [
    {
      name: 'Marston Science Library',
      coordinates: [
        [29.647691, -82.34365],
        [29.648043, -82.343649],
        [29.648043, -82.343718],
        [29.648218, -82.34372],
        [29.6482, -82.344045],
        [29.648116, -82.34405],
        [29.648041, -82.344147],
        [29.648036, -82.344241],
        [29.647752, -82.344257],
        [29.647747, -82.344053],
        [29.647696, -82.344055],
      ],
    },
    {
      name: 'Smathers Library',
      coordinates: [
        [29.65123, -82.341515],
        [29.65123, -82.342154],
        [29.651092, -82.342154],
        [29.651092, -82.342022],
        [29.651088, -82.342025],
        [29.650967, -82.342017],
        [29.650962, -82.341979],
        [29.650512, -82.341974],
        [29.650535, -82.34155]
      ],
    },
    {
      name: 'Reitz Union',
      coordinates: [
        [29.646638, -82.346998],
        [29.646656, -82.348725],
        [29.646288, -82.348731],
        [29.646288, -82.348114],
        [29.645785, -82.34814], 
        [29.645775, -82.347588],
        [29.646158, -82.347411],
        [29.646214, -82.347019]
      ],
    },
    {
      name: 'Library West',
      coordinates: [
        [29.651099, -82.342485],
        [29.651407, -82.342485],
        [29.651407, -82.342548],
        [29.651687, -82.342551],
        [29.651692, -82.34327],
        [29.651414, -82.343272],
        [29.651414, -82.343335],
        [29.651099, -82.343335],
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

  function onMapClick(e) {
    const { lat, lng } = e.latlng;

    console.log(`Clicked at latitude: ${lat}, longitude: ${lng}`);
  }
  const defaultCenter = [29.647966553280117, -82.343966960907];
  const defaultZoom = 17;
  
  // State to manage the highlighted building
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);
  
  // Library use states
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [page, setPage] = useState(1);
  const [shouldResetMap, setShouldResetMap] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const selectedLibObj = libraries.find(lib => lib.name === selectedLibrary);
  const dayOfWeek = getDayOfWeek(selectedDate);
  const libHours = selectedLibObj?.hours?.[dayOfWeek];
  const [startTimeWarning, setStartTimeWarning] = useState(false);
  const [endTimeWarning, setEndTimeWarning] = useState(false);
  const canCreateSession =
  selectedLibrary &&
  selectedFloor &&
  selectedCourse &&
  selectedDate &&
  startTime &&
  endTime &&
  startTime < endTime &&
  groupSize;


  //reset all parameters
  const handleBackClick = () => {
    setSelectedLibrary('');
    setSelectedFloor('');
    if (mapRef.current) {
      mapRef.current.setView([29.647966553280117, -82.343966960907], 17);
    }
    setSelectedDate(''); 
    setStartTime(''); 
    setEndTime('');
    setFocusLevel(0); 
    setGroupSize(''); 
    setNotes(''); 
    setSelectedCourse(''); 
  };

  //Move this function outside of handleBackClick
  const handleSubmit = async () => {
    //for now i dont want to include people to get the basic MVP done.
    //we want to get course numbers here - bring it up next meeting
    //notes and focus level needed
    setPage(4);
    //done! - aicha 
    var id = "id" + Math.random().toString(16).slice(2)
    console.log(id)
    const data = {
      ssid: id,
      building: selectedLibrary,
      floor: selectedFloor,
      course: selectedCourse,
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      focusLevel: focusLevel,
      groupSize: groupSize, 
      notes: notes
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

  //use states 
  const [focusLevel, setFocusLevel] = useState(0); 
  const [groupSize, setGroupSize] = useState(1);
  const [notes, setNotes] = useState('');
  const [userCourses, setUserCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const focusLabels = {
    0: "Just For Vibes",
    1: "Casual",
    2: "Semi-Focused",
    3: "Focused",
    4: "Locked In",
    5: "Extremely Locked In" 
  };

  //function to get the courses
  useEffect(() => {
    const fetchCourses = async () => {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserCourses(data.courses || []);
      }
    };

    fetchCourses();
  }, []);

  //function to make the map zoom

  function ZoomToMarker({ position }) {
    const map = useMap();
  
    useEffect(() => {
      if (position) {
        map.flyTo(position, 18, {
          animate: true,
          duration: 1, // duration in seconds
        });
      }
    }, [position, map]);
  
    return null;
  }

  //function to reset the map
  function ResetMapView({ center, zoom, onReset  }) {
    const map = useMap();
  
    useEffect(() => {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5,
      });
      if (onReset) onReset();
    }, [center, zoom, map]);

    return null;
  }

  const handleStartTimeChange = (time) => {
    setStartTime(time);
  
    if (libHours && (time < libHours.open || time > libHours.close)) {
      setStartTimeWarning(true);
    } else {
      setStartTimeWarning(false);
    }
  };
  
  const handleEndTimeChange = (time) => {
    setEndTime(time);
  
    if (libHours && (time < startTime || time > libHours.close)) {
      setEndTimeWarning(true);
    } else {
      setEndTimeWarning(false);
    }
  };

  //change to am/pm
  const formatTimeTo12Hour = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hour, +minute);
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };


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
            <div className="h-screen overflow-y-auto w-full">
            <h2 className="text-2xl font-bold mb-6">Pick a Study Spot!</h2>
            
            <div className="space-y-4">
              {libraries.map((library) =>
                selectedLibrary === library.name ? (
                  <div
                    key={library.name}
                    className={`${library.color} relative shadow-lg p-6 rounded-lg border border-gray-300`}

                  >
                    <button
                      onClick={() => {
                        setSelectedLibrary(null);
                        setShouldResetMap(true);
                        handleBackClick();
                      }}
                      className="absolute top-2 right-2 text-white hover:text-red-500 text-xl font-bold"
                    >
                      ×
                    </button>
                    <h3 className="absolute top-2 left-2 text-lg font-semibold text-white mb-2">{library.name}</h3>
                    
                    <div className="text-white space-y-18 text-left">

                  {/* Floor */}
                  <div className="flex space-x-4 space-y-4">
                    <label className="w-20 font-semibold transform translate-y-5">Floor*:</label>
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
                  {/* Class */}
                  <div className="my-4">
                    <label className="mb-2 font-semibold block">Select Course*:</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full p-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">-- Select a course --</option>
                      {userCourses.map((course, index) => (
                        <option key={index} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Duration section */}
                  <div>
                    <label className="block mb-2 font-semibold">Duration*:</label>

                    <div className="space-y-4">

                      {/* Day */}
                      <div className="flex items-center space-x-4">
                        <label htmlFor="date" className="w-20 transform translate-x-8">Date:</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          min={today}
                          max="2025-12-31"
                          className="flex-1 p-2 border rounded-md text-black"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>

                      {/* Start Time */}
                      <div className="flex items-center space-x-4"> 
                        <label htmlFor="startTime" className="w-20 transform translate-x-8">Start:</label>
                        {libHours ? (
                          <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            className="flex-1 border border-gray-300 rounded-lg p-2 text-black"
                            min={libHours.open}
                            max={libHours.close}
                            value={startTime}
                            onChange={(e) => handleStartTimeChange(e.target.value)}
                          />
                        ) : (
                          <p className="text-white">Library is closed</p>
                        )}
                      </div>

                      {/* End Time */}
                      <div className="flex items-center space-x-4">
                        <label htmlFor="endTime" className="w-20 transform translate-x-8">End:</label>
                        {libHours ? (
                          <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            className="flex-1 border border-gray-300 rounded-lg p-2 text-black"
                            min={startTime || libHours.open}
                            max={libHours.close}
                            value={endTime}
                            onChange={(e) => handleEndTimeChange(e.target.value)}
                          />
                        ) : (
                          <p className="text-white">Library is closed</p>
                        )}
                      </div>

                      {/* Warning Message */}
                      {startTimeWarning && (
                        <p className="text-yellow-400 text-sm mt-1">
                          ⚠️ Start time must be between {formatTimeTo12Hour(libHours.open)} and {formatTimeTo12Hour(libHours.close)}
                        </p>
                      )}

                      {endTimeWarning && (
                        <p className="text-yellow-400 text-sm mt-1">
                          ⚠️ End time must be after the start time and before {formatTimeTo12Hour(libHours.close)}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Focus Level */}
                  <div className="my-4">
                    <label className="mb-2 font-semibold block">Focus Level:</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={focusLevel}
                      onChange={(e) => setFocusLevel(e.target.value)}
                      className="w-full accent-blue-500"
                    />
                    <div className="text-sm text-white mt-1">Current Level: {focusLabels[focusLevel]}</div>
                  </div>
                  {/* Group Size */}
                  <div className="my-4">
                    <label className="mb-2 font-semibold">Group Size*: </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={groupSize}
                      onChange={(e) => setGroupSize(Number(e.target.value))}
                      className="w-20 p-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="e.g. 7"
                    />
                  </div>
                  {/* Notes */}
                  <div className="my-4">
                    <label className="mb-2 font-semibold block">Notes:</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write any additional information you want people to know here!"
                      rows={4}
                      className="w-full p-2 border border-gray-300 text-black rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  {/* Create Button */}
                  <button
                    className={`mt-4 px-4 py-2 rounded-lg font-bold text-white ${
                      canCreateSession ? 'bg-gray-50 hover:bg-gray-200' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!canCreateSession}
                    onClick={handleSubmit}
                  >
                    Create
                  </button>

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
              </div>
            </div>
          )}

          {page === 4 && (
            <div className="p-4">
            <h2 className="text-2xl font-semibold">Your Study Session Has Been Created!</h2>
            <p className="mt-2">Here's the summary of your session:</p>
            <ul className="mt-2">
              <li><strong>Course:</strong> {selectedCourse}</li>
              <li><strong>Location:</strong> {selectedLibrary}, {selectedFloor}</li>
              <li><strong>Date:</strong> {selectedDate}</li>
              <li><strong>Time:</strong> {startTime} - {endTime}</li>
              <li><strong>Focus Level:</strong> {focusLabels[focusLevel]}</li>
              <li><strong>Group Size:</strong> {groupSize}</li>
              <li><strong>Notes:</strong> {notes}</li>
            </ul>
          
            {/* Back Home */}
            <div className="mt-4">
              <button
                onClick={() => {
                  handleBackClick(); 
                  setPage(1); 
                }}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Back to Home
              </button>
            </div>
          
            {/* Another Session */}
            <div className="mt-4">
              <button
                onClick={() => {
                  handleBackClick();
                  setPage(3);         
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Create Another Session
              </button>
            </div>
          
            {/* Potential: Link for sharing */}
            <div className="mt-4">
              <button
                onClick={() => alert("Sharing options coming soon!")}
                className="bg-gray-200 hover:bg-gray-300 text-black px-6 py-2 rounded-lg font-semibold"
              >
                Share Your Session
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
          onClick={onMapClick} // Attach the click event handler
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
  
          {/* Zoom */}
          {selectedLibrary ? (
            <ZoomToMarker
              position={
                libraries.find(lib => lib.name === selectedLibrary)?.position
              }
            />
          ) : shouldResetMap ? (
            <ResetMapView
              center={defaultCenter}
              zoom={defaultZoom}
              onReset={() => setShouldResetMap(false)} // reset flag
            />
          ) : null}


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
                click: () => {
                  setSelectedLibrary(building.name);
                  setPage(3);
                },
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );  
}
export default Map;