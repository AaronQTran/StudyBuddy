// import React from "react";
// import App from '../App.js';

// function SignIn() {
//   return (
//     <div>
//       <h1>signin</h1>
//     </div>
//   );
// }

// export default SignIn
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing in with:", email, password);
    // TODO: Implement authentication logic here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign In</h2>
        
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {/* Password Input */}
          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-6 rounded-lg shadow transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-gray-600 text-center">
          Don't have an account? 
          <span 
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => navigate('/signup')}
          >
          Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
