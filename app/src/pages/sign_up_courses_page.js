import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import gator from "../gator.png";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function CoursePage() {
  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddCourse = () => {
    if (!courses.includes(courseCode)) {
      if (courseCode.length === 7 ||courseCode.length === 8) {
        if (/^[A-Za-z]{3}$/.test(courseCode.substring(0, 3)) && /^\d{4}$/.test(courseCode.substring(3,7))) {
          setCourses([...courses, courseCode.trim().toUpperCase()]);
          setCourseCode("");
          setError("");
        }  
        else {
          setError("Invalid course code.");
        }  
      }
      else {
        setError("Invalid course code.");
      }  
    }
    else {
      setError("Course already added");
    }
  };

  const handleRemoveCourse = (course) => {
     setCourses(courses.filter((c) => c !== course));
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
    
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);

      await setDoc(userDocRef, { courses: courses }, { merge: true });
      console.log("Courses saved successfully!");
      navigate("/map");
    }
    catch (error) {
      console.error("Error saving courses:", error);
      setError("Failed to save courses. Please try again.");
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
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
                       

            <div className="mt-2">
              <div className="border border-gray-300 rounded-md p-4">
                {courses.length === 0 ? (
                  <p className="text-gray-500">No courses added yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {courses.map((course, index) => (
                      <li 
                      key={index} 
                      className="flex justify-between items-center"
                      >
                        <span>{course}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(course)}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="course" className=" mt-6 block text-sm font-medium text-gray-700">
                  Add Course Code
                </label>
                <div className="mt-1 flex">
                  <input
                    id="course"
                    name="course"
                    type="text"
                    value={courseCode}
                    placeholder="e.g. CEN3031"
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="flex-grow appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
              </div>
      
            <div className="mt-6">
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
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default CoursePage;