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
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handlelogout=async()=>{ 
    try {
      await axios.post(BASE_URL + "/logout",{withCredentials:true});
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      
    }
  }

  return (
    <header className="bg-zinc-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 text-pink-400 font-bold text-xl">
            <FaHeart />
            <Link to="/">LoveLink</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-pink-300 transition">Discover</a>
            <a href="#" className="hover:text-pink-300 transition">Messages</a>
            <a href="#" className="hover:text-pink-300 transition">Profile</a>
          </nav>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm font-medium">{user?.firstName || "Guest"}</span>

            <button className="p-2 hover:bg-zinc-800 rounded-full transition">
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
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
                  ?
                </div>
              )}

              <div className="absolute right-0 mt-2 w-40 bg-zinc-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 z-50">
                <Link to={"/profile"} className="block px-4 py-2 hover:bg-zinc-700 flex items-center gap-2">
                  <FiSettings /> Settings
                </Link>
                <a onClick={handlelogout} className="block px-4 py-2 hover:bg-zinc-700 flex items-center gap-2">
                  <FiLogOut /> Logout
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-xl">
              {isMobile ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobile && (
        <div className="md:hidden px-4 py-4 bg-zinc-900 space-y-2">
          <a href="#" className="block hover:text-pink-300" onClick={toggleMobileMenu}>Discover</a>
          <a href="#" className="block hover:text-pink-300" onClick={toggleMobileMenu}>Messages</a>
          <a href="#" className="block hover:text-pink-300" onClick={toggleMobileMenu}>Profile</a>
          <a href="#" className="block hover:text-pink-300" onClick={toggleMobileMenu}>Settings</a>
          <a onClick={handlelogout} className="block px-4 py-2 hover:bg-zinc-700 flex items-center gap-2">
                  <FiLogOut /> Logout
                </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
