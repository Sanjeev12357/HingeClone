import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiSettings, FiLogOut, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const user = useSelector((store) => store.user);

  const toggleMobileMenu = () => setIsMobile(!isMobile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlelogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
   <header className="bg-neutral-900 text-white shadow-md">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 font-bold text-xl">
            <FaHeart className="text-red-500" />
            <Link
              to="/"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500"
            >
              LuvShuv
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link
              to="/"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500 hover:opacity-80"
            >
              Discover
            </Link>
            <Link
              to="/connections"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500 hover:opacity-80"
            >
              Connections
            </Link>
            <Link
              to="/requests"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500 hover:opacity-80"
            >
              Requests
            </Link>
            <Link
              to="/profile"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500 hover:opacity-80"
            >
              Profile
            </Link>
            <Link
              to="/premium"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500 hover:opacity-80"
            >
              Premium
            </Link>
          </nav>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-300">
              {user?.firstName || "Guest"}
            </span>

            <button className="p-2 hover:bg-gray-800 rounded-full transition text-gray-300">
              <FiSearch />
            </button>

            <div className="relative group">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                  ?
                </div>
              )}

              <div className="absolute right-0 mt-2 w-40 bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-800 flex items-center gap-2 text-gray-300"
                >
                  <FiSettings /> Settings
                </Link>
                <button
                  onClick={handlelogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center gap-2 text-gray-300"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-xl text-white">
              {isMobile ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobile && (
        <div className="md:hidden px-4 py-4 bg-black space-y-2 text-sm">
          {["Discover", "Connections", "Requests", "Profile", "Premium"].map(
            (item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                onClick={toggleMobileMenu}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500 hover:opacity-80"
              >
                {item}
              </Link>
            )
          )}
          <button
            onClick={handlelogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 w-full text-left"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
