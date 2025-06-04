import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [formData, setFormData] = useState({
    emailId: "rahul@gmail.com",
    password: "Rahul@123",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear error message on change
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.emailId) {
      newErrors.emailId = "Email is required.";
    } else if (!emailRegex.test(formData.emailId)) {
      newErrors.emailId = "Enter a valid email.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(`${BASE_URL}/login`, formData, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        server: "Login failed. Please check your credentials.",
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden">
      {/* Background gradient orbs for subtle ambiance */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-red-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-red-600/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md bg-black/90 backdrop-blur-xl border border-gray-800/50 p-8 rounded-2xl shadow-2xl relative z-10">
        {/* Premium gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 via-purple-600/20 to-red-600/20 rounded-2xl blur opacity-30"></div>
        <div className="relative bg-black rounded-2xl p-8">
          
          <h2 className="text-3xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-red-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
              Welcome Back 💘
            </span>
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1">
                <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent font-medium">
                  Email
                </span>
              </label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 text-white placeholder-gray-400 ${
                  errors.emailId ? "focus:ring-red-400" : "focus:ring-purple-400"
                }`}
                required
              />
              {errors.emailId && (
                <p className="text-sm text-red-400 mt-1">{errors.emailId}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">
                <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent font-medium">
                  Password
                </span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 text-white placeholder-gray-400 ${
                  errors.password ? "focus:ring-red-400" : "focus:ring-purple-400"
                }`}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Server error */}
            {errors.server && (
              <p className="text-sm text-center text-red-500">{errors.server}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 via-purple-600 to-red-600 hover:from-red-500 hover:via-purple-500 hover:to-red-500 transition-all duration-300 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent font-bold">
                Log In
              </span>
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              New here?
            </span>{" "}
            <Link to="/signup" className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-red-300 font-medium transition-all duration-300">
              Create an account
            </Link>
          </p>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-red-500 to-purple-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-purple-500 to-red-500 rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;