import './App.css';
import './index.css'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Map from './pages/map';
import SignIn from './pages/sign_in';
import SignUp from './pages/sign_up';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Sign In and Sign Up buttons */}
        <div className="mt-8 space-x-4">
          <button onClick={() => navigate('/signin')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300">
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300">
            Sign Up
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
          <Route path="/map" element={<Map />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;