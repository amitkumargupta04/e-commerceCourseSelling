
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

  console.log("courses: ", courses);

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-100 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src="data:image/png;base64,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" alt="Profile" className="rounded-full h-12 w-12" />
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500">
                <FaDiscourse className="mr-2" /> Courses
              </a>
            </li>
            <li className="mb-4">
              <a href="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </a>
            </li>
            <li>
              {isLoggedIn ? (
                <Link to={"/"}
                  
                  className="flex items-center"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-2" /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-0 md:ml-64 w-full bg-white p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold">Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type here to search..."
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>

            <FaCircleUser className="text-4xl text-blue-600" />
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            // Check if courses array is empty
            <p className="text-center text-gray-500">
              No course posted yet by admin
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="rounded mb-4"
                  />
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl">
                      ₹{course.price}{" "}
                      <span className="text-gray-500 line-through">5999</span>
                    </span>
                    <span className="text-green-600">20% off</span>
                  </div>

                  {/* Buy page */}
                  <Link
                    to={`/buy/${course._id}`} // Pass courseId in URL
                    className="bg-orange-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;