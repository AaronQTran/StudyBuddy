import './App.css'; 
import './index.css'; 
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; 
import { useEffect, useState } from 'react'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import logo from "./studybuddylogo.png"; 
import Map from './pages/map'; 
import SignIn from './pages/sign_in'; 
import SignUp from './pages/sign_up';
import CoursePage from './pages/sign_up_courses_page';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const auth = getAuth();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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

    <div className="min-h-screen bg-cover bg-center bg-[url('/src/background.jpg')]">
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to white/50"></div>
      <div className="relative">
      {/* Navbar */}
      <div className="flex justify-between items-center px-12 py-6">
        {/* Logo */}
        <div className="flex items-center space-x-0 ml-0 mt-0">
          <img src={logo} alt="StudyBuddy Logo" className="w-16 h-16" />
          <h1 className="text-3xl font-bold">
            <span className="text-[#0021A5]">Study</span>
            <span className="text-[#FA4616]">Buddy</span>
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
      <div className="bg-white bg-opacity-50 shadow rounded-lg p-2 sm:p-0 w-full max-w-4xl">
        <div className="px-12 py-24 text-left">
          <h1 className="text-8xl font-bold">
            <span className="text-[#1350f2]">Study</span>
            <span className="text-[#FA4616]">Buddy</span>
          </h1>
          <h2 className="text-6xl font-bold mt-2 text-[#000000]">at UF</h2>
          
          <p className="mt-6 text-lg max-w-2xl text-[#000000]">
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
        </div>  
      </div>  
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/coursepage" element={<CoursePage />} />

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