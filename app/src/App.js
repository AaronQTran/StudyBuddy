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
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { //gets current user when auth state changes, either user object or null
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">

        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigate('/signin')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Sign Up
          </button>
        </div>
        
        <div className="mt-4">
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