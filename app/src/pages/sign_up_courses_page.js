import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gator from "../gator.png";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

function CoursePage() {
  const [formData, setFormData] = useState({
    courses: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddCourse = (course) => {
    setFormData(prevState => ({
      ...prevState,
      courses: [...prevState.courses, course]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    
    try{
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      await updateProfile(userCredentials.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });
      navigate("/map")
      console.log('account creation success');
    } catch(error){
      console.error("Error creating account:", error.message);
      setError(error.code)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <img src={gator} alt="Logo" className="absolute top-0 left-0 w-56 h-36 m-4" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Join StudyBuddy Today
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
                       

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                Add Course
              </label>
              <div className="mt-1 flex">
                <input
                  id="course"
                  name="course"
                  type="text"
                  value={formData.courseInput || ""}
                  placeholder="e.g. CEN3031"
                  onChange={(e) => setFormData({ ...formData, courseInput: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleAddCourse(formData.courseInput)}
                  className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/")}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default CoursePage;