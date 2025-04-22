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
  const [sessions, setSessions] = useState([]);
  //calls api endpoint to fetch sessions at the very beginning on mount
  useEffect(() => {
    console.log('called');

    const fetchSessions = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/pull_session", {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        const result = await response.json();
  
        if (response.ok) {
          console.log(result.message);
          console.log(result.data); 
          setSessions(result.data);
        } else {
          console.error("Backend error:", result.error);
        }
      } catch (error) {
        console.error('Error in trying to pull sessions:', error);
      }
    };
    fetchSessions();
  }, []);
  
  //libraries and their info
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
    { name: 'Malachowsky Hall', 
      position: [29.644032, -82.347829], 
      color: 'bg-orange-600', 
      hover: 'hover:bg-orange-700', 
      floors: [1,2,3,4,5,6,7],
      hours: {
        Sunday : null,
        Monday : { open: "8:00", close: "20:00" },
        Tuesday : { open: "8:00", close: "20:00" },
        Wednesday : { open: "8:00", close: "20:00" },
        Thursday : { open: "8:00", close: "20:00" },
        Friday : { open: "8:00", close: "20:00" },
        Saturday : null
      }
    },

    { name: 'The Hub', 
      position: [29.648214, -82.345625], 
      color: 'bg-blue-600', 
      hover: 'hover:bg-blue-700', 
      floors: [1,2],
      hours: {
        Sunday : null,
        Monday : { open: "8:00", close: "17:00" },
        Tuesday : { open: "8:00", close: "17:00" },
        Wednesday : { open: "8:00", close: "17:00" },
        Thursday : { open: "8:00", close: "17:00" },
        Friday : { open: "8:00", close: "17:00" },
        Saturday : null
      }
    },
    { name: 'Newell Hall', 
      position: [29.64909, -82.345104], 
      color: 'bg-orange-600', 
      hover: 'hover:bg-orange-700', 
      floors: [1,2,3,4],
      hours: {
        Sunday : { open: "12:00", close: "20:00" },
        Monday : { open: "8:00", close: "20:00" },
        Tuesday : { open: "8:00", close: "20:00" },
        Wednesday : { open: "8:00", close: "20:00" },
        Thursday : { open: "8:00", close: "20:00" },
        Friday : { open: "8:00", close: "20:00" },
        Saturday : { open: "12:00", close: "20:00" }
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
      name: 'Newell Hall',
      coordinates: [
        [29.648997, -82.3449],
        [29.649179, -82.3449],
        [29.649179, -82.345452],
        [29.649002, -82.345452],
        [29.649002, -82.345399],
        [29.648922, -82.345399],
        [29.648922, -82.345281],
        [29.648997, -82.345281],
      ],
    },
    {
      name: 'Malachowsky Hall',
      coordinates: [
        [29.644232, -82.347212],
        [29.644232, -82.348355],
        [29.643859, -82.348355],
        [29.643859, -82.347647],
        [29.643808, -82.347647],
        [29.643808, -82.347266],
        [29.644102, -82.347266],
        [29.644102, -82.347212],
      ],
    },
    {
      name: 'The Hub',
      coordinates: [
        [29.648495, -82.34523],
        [29.648369, -82.345337],
        [29.648327, -82.34546],
        [29.64836, -82.345611],
        [29.648453, -82.345857],
        [29.648332, -82.346061],
        [29.648111, -82.345941],
        [29.648034, -82.346072],
        [29.647791, -82.345922],
        [29.647911, -82.345523],
        [29.648102, -82.345217],
        [29.648064, -82.345126],
        [29.648204, -82.345013],
        [29.648237, -82.34504],
        [29.648372, -82.344938]
      ],
    },
    {
      name: 'Health Science Library',
      coordinates: [
        [29.641225, -82.344615],
        [29.640866, -82.345468],
        [29.640488, -82.345244],
        [29.640833, -82.344391],
      ],
    },
  ];
  const mapRef = useRef(null);

  const defaultCenter = [29.647966553280117, -82.343966960907];
  const defaultZoom = 17;
  
  // State to manage the highlighted building
  const [highlightedBuilding, setHighlightedBuilding] = useState(null);
  
  // Library use states
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('');
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
      const response = await fetch("http://localhost:5001/api/create_session", {
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
  function ResetMapView({ center, zoom, onReset }) {
    const map = useMap();
  
    useEffect(() => {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5,
      });
      if (onReset) onReset();
    }, [center, zoom, map, onReset]);

    return null;
  }

  //function to handle start time input
  const handleStartTimeChange = (time) => {
    setStartTime(time);
  
    if (libHours) {
      const selected = new Date(`1970-01-01T${time}:00`);
      const open = new Date(`1970-01-01T${libHours.open}:00`);
      const close = new Date(`1970-01-01T${libHours.close}:00`);
  
      if (selected < open || selected > close) {
        setStartTimeWarning(true);
      } else {
        setStartTimeWarning(false);
      }
    } else {
      setStartTimeWarning(false);
    }
  };
  
  //function to handle end time input
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

  const handleSessionClick = (session) => {
    setSelectedCourse(session.course || '');
    setSelectedLibrary(session.building);
    setSelectedFloor(session.floor);
    setSelectedDate(session.date);
    setStartTime(session.startTime);
    setEndTime(session.endTime);
    setFocusLevel(session.focusLevel || '');
    setGroupSize(session.groupSize || '');
    setNotes(session.notes || '');
    setPage(5); 
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
              <div className="max-h-[600px] overflow-y-auto w-full">
                {sessions.length > 0 ? (
                  sessions.map((session, index) => (
                    <div 
                      key={index} 
                      className="bg-white shadow-md rounded-lg p-4 mb-3 border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="font-bold text-lg">
                        {session.building}, Floor {session.floor}
                      </div>
                      <div className="text-sm text-gray-600">
                        Date: {session.date}
                      </div>
                      <div className="text-sm text-gray-600">
                        Time: {session.startTime} - {session.endTime}
                      </div>
                      {session.course && (
                        <div className="text-sm text-gray-600">
                          Course: {session.course}
                        </div>
                      )}
                      {session.focusLevel && (
                        <div className="text-sm text-gray-600">
                          Focus Level: {focusLabels[session.focusLevel] || session.focusLevel}
                        </div>
                      )}
                      {session.groupSize && (
                        <div className="text-sm text-gray-600">
                          Group Size: {session.groupSize}
                        </div>
                      )}
                      {session.notes && (
                        <div className="text-sm italic mt-2">
                          "{session.notes}"
                        </div>
                      )}

                      {/* Join Button */}
                      <button
                        className={`mt-4 px-8 py-2 rounded-lg font-bold bg-blue-600 text-white`}
                        onClick={() => handleSessionClick(session)}
                      >
                        Join
                      </button>


                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No active sessions found.</p>
                )}
              </div>
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
                    className={`mt-4 px-4 py-2 rounded-lg font-bold ${
                      canCreateSession ? 'bg-gray-50 hover:bg-gray-200 text-black' : 'bg-gray-400 text-white cursor-not-allowed'
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
              <li><strong>Time:</strong> {formatTimeTo12Hour(startTime)} - {formatTimeTo12Hour(endTime)}</li>
              <li><strong>Focus Level:</strong> {focusLabels[focusLevel]}</li>
              <li><strong>Group Size:</strong> {groupSize}</li>
              <li><strong>Notes:</strong> {notes}</li>
            </ul>
            <p className="mt-2"> Make sure to add this to your calendar! See you then!!</p>
          
            {/* Back Home */}
            <div className="mt-4">
              <button
                onClick={() => {
                  setShouldResetMap(true);
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
                  setShouldResetMap(true);
                  handleBackClick();
                  setPage(3);         
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Create Another Session
              </button>
            </div>
          </div>          
          )}

          {page === 5 && (
            <div className="p-4">
            <h2 className="text-2xl font-semibold">You've Joined A Study Session!</h2>
            <p className="mt-2">Here's the summary of your session:</p>
            <ul className="mt-2">
              <li><strong>Course:</strong> {selectedCourse}</li>
              <li><strong>Location:</strong> {selectedLibrary}, {selectedFloor}</li>
              <li><strong>Date:</strong> {selectedDate}</li>
              <li><strong>Time:</strong> {formatTimeTo12Hour(startTime)} - {formatTimeTo12Hour(endTime)}</li>
              <li><strong>Focus Level:</strong> {focusLabels[focusLevel]}</li>
              <li><strong>Group Size:</strong> {groupSize}</li>
              <li><strong>Notes:</strong> {notes}</li>
            </ul>
            <p className="mt-2"> Make sure to add this to your calendar! See you then!!</p>
          
            {/* Back Home */}
            <div className="mt-4">
              <button
                onClick={() => {
                  setShouldResetMap(true);
                  handleBackClick(); 
                  setPage(1); 
                }}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Back to Home
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
