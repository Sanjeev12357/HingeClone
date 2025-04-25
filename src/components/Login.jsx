import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [formData, setFormData] = useState({
    emailId: "johndoe2@example.com",
    password: "Sanjeev@123",
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
      return navigate("/");
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        server: "Login failed. Please check your credentials.",
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white px-4">
      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-pink-400 mb-6">
          Welcome Back 💘
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-zinc-700 rounded-lg focus:outline-none focus:ring-2 ${
                errors.emailId ? "focus:ring-red-400" : "focus:ring-pink-400"
              }`}
              required
            />
            {errors.emailId && (
              <p className="text-sm text-red-400 mt-1">{errors.emailId}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-zinc-700 rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-400" : "focus:ring-pink-400"
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
            className="w-full bg-pink-500 hover:bg-pink-600 transition py-2 rounded-lg font-semibold text-white shadow-md"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-6">
          New here?{" "}
          <Link to="/signup" className="text-pink-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
