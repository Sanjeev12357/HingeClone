import { useState, useEffect } from 'react';
import { Save, X, PlusCircle, Upload, Camera, User, Calendar, Mail, FileText, Award } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../utils/userSlice';
import { Heart, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProfile() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const current = user;
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    about: '',
    skills: [],
    age: '',
    gender: '',
    photoUrl: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

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
      setPreviewUrl(user.photoUrl || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });

    if (name === 'photoUrl') {
      setPreviewUrl(value);
    }
  };

  // Handle file selection for Cloudinary upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!selectedFile) return null;

    setUploadingImage(true);
    const formDataImage = new FormData();
    formDataImage.append('image', selectedFile);

    try {
      const response = await axios.post(`${BASE_URL}/upload/image`, formDataImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      toast.success('Image uploaded successfully to Cloudinary!');
      return response.data.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image to Cloudinary. Please try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
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

    try {
      // Upload image to Cloudinary if file is selected
      let imageUrl = profile.photoUrl;
      if (uploadMethod === 'file' && selectedFile) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const updatedProfile = {
        ...profile,
        photoUrl: imageUrl,
        age: profile.age ? parseInt(profile.age, 10) : undefined
      };

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
        toast.success('Profile updated successfully!');
        
        if (response.data?.user) {
          dispatch(updateUser(response.data.user));
        } else {
          dispatch(updateUser(updatedProfile));
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex px-4 md:px-10 justify-center gap-5 md:gap-8 py-8">
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-900 to-black p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-800 backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
          Edit Your Profile
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent mb-4">
              <User size={20} className="text-red-400" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent text-sm font-bold mb-2">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <label className="block bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent text-sm font-bold mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent text-sm font-bold mb-2">
                  Age
                </label>
                <input
                  name="age"
                  type="number"
                  value={profile.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  min="18"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent text-sm font-bold mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent mb-4">
              <Camera size={20} className="text-red-400" />
              Profile Picture
            </h3>
            
            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="url"
                  checked={uploadMethod === 'url'}
                  onChange={(e) => setUploadMethod(e.target.value)}
                  className="accent-red-500"
                />
                <span className="text-gray-300 font-medium">URL</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="file"
                  checked={uploadMethod === 'file'}
                  onChange={(e) => setUploadMethod(e.target.value)}
                  className="accent-red-500"
                />
                <span className="text-gray-300 font-medium">Upload to Cloudinary</span>
              </label>
            </div>

            {uploadMethod === 'url' ? (
              <div>
                <label className="block bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent text-sm font-bold mb-2">
                  Profile Picture URL
                </label>
                <input
                  name="photoUrl"
                  type="url"
                  value={profile.photoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="w-full border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-red-400 transition-colors duration-300 flex flex-col items-center gap-4"
                >
                  <Upload size={32} className="text-gray-400" />
                  <div>
                    <p className="bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent font-semibold text-lg mb-2">
                      Click to upload to Cloudinary
                    </p>
                    <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </label>
                {selectedFile && (
                  <p className="mt-3 text-green-400 text-sm font-medium">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            )}

            {previewUrl && (
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Preview:</p>
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-3 border-red-400 mx-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (uploadMethod === 'url') {
                      toast.error('Invalid image URL');
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent mb-4">
              <FileText size={20} className="text-red-400" />
              About Me
            </h3>
            
            <div>
              <label className="block bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent text-sm font-bold mb-2">
                Tell us about yourself
              </label>
              <textarea
                name="about"
                value={profile.about}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 resize-vertical"
                placeholder="Share your interests, hobbies, and what makes you unique..."
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent mb-4">
              <Award size={20} className="text-red-400" />
              Skills & Interests
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
                    >
                      <span>{skill}</span>
                      <button 
                        type="button" 
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic flex items-center justify-center w-full">
                    No skills added yet
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a skill or interest"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
                >
                  <PlusCircle size={18} />
                  Add
                </button>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-between gap-4 pt-6">
            <button
              type="button"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : uploadingImage ? 'Uploading...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
          Live Preview
        </h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={previewUrl || 'preview'}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-800"
          >
            {/* Profile Header */}
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-red-600 to-purple-600 relative"></div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
                <div className="p-1 bg-black rounded-full">
                  <div className="p-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-full">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-28 h-28 rounded-full object-cover border-2 border-black"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent border-2 border-black">
                        {profile.firstName?.[0]}{profile.lastName?.[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="pt-20 pb-6 px-6">
              <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent mb-2">
                {profile.firstName} {profile.lastName}
              </h2>
              
              <p className="text-center text-sm mb-4 flex items-center justify-center gap-1">
                <Star size={14} className="text-purple-400" />
                <span className="bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent font-medium">
                  {current?.emailId || "user@example.com"}
                </span>
              </p>
              
              <div className="flex justify-center mb-4 gap-4">
                {profile.age && (
                  <p className="text-center text-gray-300 text-sm flex items-center gap-1">
                    <Calendar size={14} className="text-purple-400" />
                    {profile.age} years
                  </p>
                )}
                {profile.gender && (
                  <p className="text-center text-gray-300 text-sm flex items-center gap-1">
                    <User size={14} className="text-purple-400" />
                    {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-950 p-4 rounded-xl mb-5 border border-gray-800">
                <p className="text-center text-gray-300 text-sm leading-relaxed">
                  {profile.about || "No profile description available"}
                </p>
              </div>

              {profile.skills?.length > 0 && (
                <div className="mb-6">
                  <h3 className="bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent text-xs uppercase font-bold mb-3 text-center tracking-wider">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {profile.skills.slice(0, 6).map((skill, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-gray-950 border border-gray-800 px-3 py-1 rounded-full bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 6 && (
                      <span className="text-xs bg-gray-950 border border-gray-800 px-3 py-1 rounded-full text-gray-400">
                        +{profile.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 gap-3">
                <button className="flex-1 py-3 bg-gray-950 hover:bg-gray-900 rounded-xl transition-all duration-300 flex items-center justify-center border border-gray-800 group">
                  <Heart size={18} className="text-red-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-semibold">Like</span>
                </button>
                
                <button className="flex-1 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-xl transition-all duration-300 flex items-center justify-center group">
                  <Zap size={18} className="text-white mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-white font-semibold">Connect</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
