import { useState, useEffect } from 'react';
import { Save, X, PlusCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../utils/userSlice';
import { Heart, Zap, User, MapPin, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditProfile() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const current = user;
  
  // Initialize with empty values first
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    about: '',
    skills: [],
    age: '',
    gender: '',
    photoUrl: ''
  });
  
  // Update profile when user data changes in Redux
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        about: user.about || '',
        skills: user.skills || [],
        age: user.age || '',
        gender: user.gender || '',
        photoUrl: user.photoUrl || ''
      });
    }
  }, [user]); // This will run whenever the user object changes
  
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const addSkill = () => {
    if (newSkill.trim() !== '' && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Ensure age is converted to number if present
      const updatedProfile = {
        ...profile,
        age: profile.age ? parseInt(profile.age, 10) : undefined
      };

      // Remove empty fields to avoid sending them in the request
      Object.keys(updatedProfile).forEach(key => {
        if (updatedProfile[key] === '' || updatedProfile[key] === undefined) {
          delete updatedProfile[key];
        }
      });

      const response = await axios.patch(`${BASE_URL}/profile/edit`, updatedProfile, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage('Profile updated successfully!');
        
        // Update the Redux store with the new user data
        if (response.data?.user) {
          dispatch(updateUser(response.data.user));
        } else {
          // If the API doesn't return updated user data, update with our local state
          dispatch(updateUser(updatedProfile));
        }
      } else {
        setErrorMessage(response.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage(error.response?.data?.message || 'Network error: Could not connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // For debugging - remove in production
  const logCurrentProfile = () => {
    console.log('Current profile state:', profile);
  };

  // Show loading state if user data is not yet available
  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-800 text-gray-200 flex justify-center items-center h-64">
        <div className="text-blue-400">Loading profile data...</div>
      </div>
    );
  }

  // Pre-fill the form with sample data
  const prefillForm = () => {
    setProfile({
      firstName: "Abhishek",
      lastName: "Raj",
      age: 25,
      gender: "male",
      photoUrl: "https://geographyandyou.com/images/user-profile.png",
      about: "An enthusiastic Android Developer!",
      skills: ["Kotlin", "jetpack", "Aws", "Cloud"]
    });
  };

  return (
    <div className='flex px-10 justify-center gap-[20px] bg-black'>
      <div className="w-1/2 p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-800 text-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">Edit Your Profile</h1>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-900 text-green-300 rounded border border-green-700">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900 text-red-300 rounded border border-red-700">
            {errorMessage}
          </div>
        )}
        
        {/* Quick fill button for testing */}
        <div className="mb-4 text-center">
          <button 
            type="button"
            onClick={prefillForm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors"
          >
            Fill with Sample Data
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={profile.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={profile.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          {/* Age field */}
          <div className="mb-4">
            <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="age">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={profile.age}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Gender field */}
          <div className="mb-4">
            <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={profile.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Photo URL field */}
          <div className="mb-4">
            <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="photoUrl">
              Profile Photo URL
            </label>
            <input
              id="photoUrl"
              name="photoUrl"
              type="text"
              value={profile.photoUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-blue-400 text-sm font-bold mb-2" htmlFor="about">
              About Me
            </label>
            <textarea
              id="about"
              name="about"
              value={profile.about}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-blue-400 text-sm font-bold mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-800 border border-blue-700 text-blue-400 px-3 py-1 rounded-full flex items-center"
                  >
                    <span>{skill}</span>
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-400 hover:text-red-400 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">No skills added yet</div>
              )}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a skill"
                className="flex-grow px-3 py-2 bg-gray-800 border border-gray-700 rounded-l text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 flex items-center transition-colors"
              >
                <PlusCircle size={18} className="mr-1" />
                Add
              </button>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 flex items-center transition-colors"
              onClick={() => window.history.back()}
            >
              <X size={18} className="mr-1" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Save size={18} className="mr-1" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="min-h-screen w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current?._id || 'preview'}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full overflow-hidden border border-gray-700"
          >
            {/* Profile Header */}
            <div className="relative">
              {/* Cover Image/Background */}
              <div className="h-32 bg-gradient-to-r from-blue-800 to-indigo-900"></div>
              
              {/* Profile Image */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
                <div className="p-1 bg-gray-800 rounded-full">
                  <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full">
                    {profile.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-36 h-32 rounded-full object-center"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-blue-400">
                        {profile.firstName?.[0]}{profile.lastName?.[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="pt-20 pb-6 px-6">
              <h2 className="text-center text-2xl font-bold text-gray-100 mb-1">
                {profile.firstName} {profile.lastName}
              </h2>
              
              <p className="text-center text-blue-400 text-sm mb-4 flex items-center justify-center">
                <Star size={14} className="mr-1" />
                {current?.emailId || "user@example.com"}
              </p>
              
              {/* Age and Gender */}
              <div className="flex justify-center mb-4 gap-4">
                {profile.age && (
                  <p className="text-center text-gray-300 text-sm flex items-center">
                    <Calendar size={14} className="mr-1 text-blue-400" />
                    {profile.age} years
                  </p>
                )}
                {profile.gender && (
                  <p className="text-center text-gray-300 text-sm flex items-center">
                    <User size={14} className="mr-1 text-blue-400" />
                    {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-900 p-4 rounded-xl mb-5">
                <p className="text-center text-gray-300 text-sm leading-relaxed">
                  {profile.about || "No profile description available"}
                </p>
              </div>

              {/* Skills/Interests */}
              {profile.skills?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-blue-400 text-xs uppercase font-semibold mb-2 ml-1">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-gray-900 text-blue-400 px-3 py-1 rounded-full border border-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  className="flex-1 py-3 mr-2 bg-gray-900 hover:bg-gray-700 rounded-xl transition duration-300 flex items-center justify-center border border-gray-700"
                >
                  <Heart size={20} className="text-red-400 mr-2" />
                  <span className="text-gray-300 font-medium">Like</span>
                </button>
                
                <button
                  className="flex-1 py-3 ml-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition duration-300 flex items-center justify-center"
                >
                  <Zap size={20} className="text-white mr-2" />
                  <span className="text-white font-medium">Connect</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}