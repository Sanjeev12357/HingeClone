import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Camera, User, Mail, Lock, Calendar, Heart, Smile, CheckCircle, Loader2, X, Plus } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { Link } from 'react-router-dom';

export default function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    age: '',
    gender: '',
    photoUrl: '',
    about: '',
    skills: []
  });

  // Form validation states
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: ''
  });

  const steps = [
    { id: 1, title: "Basic Info", required: true },
    { id: 2, title: "Security", required: true },
    { id: 3, title: "Personal Details", required: false },
    { id: 4, title: "Interests", required: false },
    { id: 5, title: "About You", required: false }
  ];

  const totalSteps = steps.length;

  // Form validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateStep = (step) => {
    const newErrors = { ...errors };
    let isValid = true;

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      } else {
        newErrors.firstName = '';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      } else {
        newErrors.lastName = '';
      }
    }

    if (step === 2) {
      if (!validateEmail(formData.emailId)) {
        newErrors.emailId = 'Please enter a valid email';
        isValid = false;
      } else {
        newErrors.emailId = '';
      }

      if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      } else {
        newErrors.password = '';
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const addSkill = () => {
    if (newSkill.trim() !== '' && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Filter out empty optional fields
      const filteredData = { ...formData };
      Object.keys(filteredData).forEach(key => {
        if (filteredData[key] === '' && key !== 'firstName' && key !== 'lastName' && key !== 'emailId' && key !== 'password') {
          delete filteredData[key];
        }
      });
      
      // Convert age to number if present
      if (filteredData.age) {
        filteredData.age = parseInt(filteredData.age, 10);
      }
      
      const response = await axios.post(`${BASE_URL}/signup`, filteredData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
        setTimeout(() => {
          // Redirect to login or dashboard after successful signup
          window.location.href = '/login';
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo data for testing
  const fillDemoData = () => {
    setFormData({
      firstName: "Abhishek",
      lastName: "Raj",
      emailId: "abhishek@example.com",
      password: "StrongPass@123", 
      age: 25,
      gender: "male",
      photoUrl: "https://geographyandyou.com/images/user-profile.png",
      about: "An enthusiastic Android Developer!",
      skills: ["Kotlin", "jetpack", "Aws", "Cloud"]
    });
  };

  // Variants for animations
  const pageVariants = {
    initial: { 
      opacity: 0,
      x: 100
    },
    in: { 
      opacity: 1,
      x: 0
    },
    out: { 
      opacity: 0,
      x: -100
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  // StepDots component
  const StepDots = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mt-6 mb-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              step.id < currentStep 
                ? 'bg-blue-500' 
                : step.id === currentStep 
                  ? 'bg-blue-500 ring-2 ring-blue-300 ring-opacity-50' 
                  : 'bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    );
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 border border-gray-700"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Signup Successful!</h2>
            <p className="text-gray-300 text-center">
              Welcome to our community. You'll be redirected to the login page shortly.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-700"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400">
            {steps.find(step => step.id === currentStep)?.title}
          </h2>
          <div className="text-sm text-gray-300 font-medium">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <StepDots />

        <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-4"
              >
                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="firstName">
                    First Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-3 bg-gray-700 border ${errors.firstName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="lastName">
                    Last Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-3 bg-gray-700 border ${errors.lastName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-4"
              >
                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="emailId">
                    Email Address*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="emailId"
                      name="emailId"
                      type="email"
                      value={formData.emailId}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-3 bg-gray-700 border ${errors.emailId ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {errors.emailId && <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>}
                </div>

                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="password">
                    Password*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-3 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  <p className="text-gray-400 text-xs mt-2">
                    Password must be at least 8 characters long
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-4"
              >
                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="age">
                    Age
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="18"
                      max="100"
                      className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your age"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="gender">
                    Gender
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Heart size={18} className="text-gray-500" />
                    </div>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="photoUrl">
                    Profile Photo URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Camera size={18} className="text-gray-500" />
                    </div>
                    <input
                      id="photoUrl"
                      name="photoUrl"
                      type="text"
                      value={formData.photoUrl}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-4"
              >
                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2">
                    Your Interests
                  </label>
                  <p className="text-gray-300 text-sm mb-3">
                    Add skills or interests to help you connect with like-minded people
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3 min-h-16 p-2 bg-gray-700 border border-gray-600 rounded-lg">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full flex items-center"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-blue-200 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic flex items-center justify-center w-full h-12">
                        No interests added yet
                      </div>
                    )}
                  </div>

                  <div className="flex mt-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add an interest"
                      className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 flex items-center transition-colors"
                    >
                      <Plus size={18} className="mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="space-y-4"
              >
                <div>
                  <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="about">
                    About You
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <Smile size={18} className="text-gray-500" />
                    </div>
                    <textarea
                      id="about"
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell others about yourself..."
                    ></textarea>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Share something interesting about yourself that will help others connect with you
                  </p>
                </div>

                {/* Show preview of profile card */}
                <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-blue-400 font-semibold mb-2">Profile Preview</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {formData.photoUrl ? (
                        <img 
                          src={formData.photoUrl} 
                          alt="Profile" 
                          className="h-16 w-16 rounded-full object-cover border-2 border-blue-500"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-blue-800 flex items-center justify-center text-xl font-bold text-white">
                          {formData.firstName?.[0]}{formData.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        {formData.firstName} {formData.lastName}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {formData.gender && `${formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}`}
                        {formData.age && formData.gender && ", "}
                        {formData.age && `${formData.age} years`}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 bg-gray-700/50'
                  : 'text-white bg-gray-700 hover:bg-gray-600'
              }`}
              disabled={currentStep === 1}
            >
              <ArrowLeft size={18} className="mr-1" />
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
              >
                Next
                <ArrowRight size={18} className="ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  'Complete Signup'
                )}
              </button>
            )}
          </div>
        </form>


        {/* Fill demo data button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={fillDemoData}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Fill with demo data
          </button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}