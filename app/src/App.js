import './App.css'; 
import './index.css'; 
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; 
import { useEffect, useState } from 'react'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import Map from './pages/map'; 
import SignIn from './pages/sign_in'; 
import SignUp from './pages/sign_up';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { //gets current user when auth state changes, either user object or null
      setUser(currentUser);
      setisLoading(false); //triggers a rerender with new state variables
    });

    return () => unsubscribe();
  }, [auth]);

  if(isLoading){
    return <div>loading</div>
  }
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};


function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FFFCF6] text-gray-900">
      {/* Navbar */}
      <div className="flex justify-between items-center px-12 py-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/public/studybuddylogo.png" alt="StudyBuddy Logo" className="w-12 h-12" />
          <h1 className="text-3xl font-bold">
            <span className="text-blue-700">Study</span>
            <span className="text-orange-500">Buddy</span>
          </h1>
        </div>
        {/* Buttons */}
        <div className="space-x-4">
          <button
            onClick={() => navigate('/signin')}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Sign Up
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="px-12 py-24">
        <h1 className="text-8xl font-bold">
          <span className="text-blue-700">Study</span>
          <span className="text-orange-500">Buddy</span>
        </h1>
        <h2 className="text-6xl font-bold mt-2 text-black">at UF</h2>
        
        <p className="mt-6 text-lg max-w-2xl">
          Join a growing community of students sharing study locations and real-time availability. 
          Connect with other gators, share study spots, and stay focused together!
        </p>
        
        {/* Optional: Additional buttons for navigation */}
        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigate('/map')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Go to Map (Protected)
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <Map />
                </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;