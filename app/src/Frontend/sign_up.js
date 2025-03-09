// import React from "react";
// import App from '../App.js';

// function SignUp() {
//   return (
//     <div>
//       <h1>signup</h1>
//     </div>
//   );
// }

// export default SignUp
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signing up with:", email, password);
    // TODO: Implement sign-up logic here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your UF email"
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
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mt-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          {/* Sign Up Button */}
          <button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 mt-6 rounded-lg shadow transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-4 text-gray-600 text-center">
          Already have an account? 
          <span 
            className="text-green-500 hover:underline cursor-pointer"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;

