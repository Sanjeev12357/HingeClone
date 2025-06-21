import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Mail, Lock, Calendar, Camera, FileText, Award, Upload, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    age: '',
    gender: '',
    photoUrl: '',
    about: '',
    skills: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);

  const steps = [
    { id: 1, title: 'Personal Info', icon: User, required: true },
    { id: 2, title: 'Account Details', icon: Mail, required: true },
    { id: 3, title: 'Demographics', icon: Calendar, required: false },
    { id: 4, title: 'Profile Picture', icon: Camera, required: false },
    { id: 5, title: 'About You', icon: FileText, required: false },
    { id: 6, title: 'Skills', icon: Award, required: false }
  ];

  // Password strength validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`at least ${minLength} characters`);
    if (!hasUpperCase) errors.push('one uppercase letter');
    if (!hasLowerCase) errors.push('one lowercase letter');
    if (!hasNumbers) errors.push('one number');
    if (!hasSpecialChar) errors.push('one special character');

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password' && value) {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        toast.warn(`Password must contain: ${validation.errors.join(', ')}`);
      }
    }
  };

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
        setFormData(prev => ({
          ...prev,
          photoUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          toast.error('First name is required');
          return false;
        }
        if (!formData.lastName.trim()) {
          toast.error('Last name is required');
          return false;
        }
        return true;

      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.emailId.trim()) {
          toast.error('Email is required');
          return false;
        }
        if (!emailRegex.test(formData.emailId)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        if (!formData.password) {
          toast.error('Password is required');
          return false;
        }
        
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
          toast.error(`Password must contain: ${passwordValidation.errors.join(', ')}`);
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2)) {
      toast.error('Please complete all required steps correctly');
      return;
    }
    
    setLoading(true);
    
    try {
      let imageUrl = formData.photoUrl;
      if (uploadMethod === 'file' && selectedFile) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const filteredData = { ...formData };
      
      if (imageUrl && imageUrl !== formData.photoUrl) {
        filteredData.photoUrl = imageUrl;
      }
      
      Object.keys(filteredData).forEach(key => {
        if (filteredData[key] === '' && key !== 'firstName' && key !== 'lastName' && key !== 'emailId' && key !== 'password') {
          delete filteredData[key];
        }
      });
      
      if (filteredData.age) {
        filteredData.age = parseInt(filteredData.age, 10);
      }
      
      if (filteredData.skills) {
        filteredData.skills = filteredData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      }
      
      const response = await axios.post(`${BASE_URL}/signup`, filteredData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      
      if (response.status >= 200 && response.status < 300) {
        toast.success('Account created successfully! Redirecting to login...');
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } catch (err) {
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data.replace('ERROR : ', '');
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="input-group">
              <div className="input-icon">
                <User size={20} />
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="form-input"
                required
              />
            </div>
            <div className="input-group">
              <div className="input-icon">
                <User size={20} />
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="form-input"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="input-group">
              <div className="input-icon">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="form-input"
                required
              />
            </div>
            <div className="input-group">
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="form-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {formData.password && (
              <div className="password-strength">
                <p className="text-sm text-gray-400 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className={`flex items-center ${formData.password.length >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    At least 8 characters
                  </div>
                  <div className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    One uppercase letter
                  </div>
                  <div className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(formData.password) ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    One lowercase letter
                  </div>
                  <div className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${/\d/.test(formData.password) ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    One number
                  </div>
                  <div className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    One special character
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="input-group">
              <div className="input-icon">
                <Calendar size={20} />
              </div>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age"
                className="form-input"
                min="18"
                max="100"
              />
            </div>
            <div className="input-group">
              <div className="input-icon">
                <User size={20} />
              </div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="upload-method-selector">
              <div className="flex space-x-4 mb-6">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="url"
                    checked={uploadMethod === 'url'}
                    onChange={(e) => setUploadMethod(e.target.value)}
                  />
                  <span>URL</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="file"
                    checked={uploadMethod === 'file'}
                    onChange={(e) => setUploadMethod(e.target.value)}
                  />
                  <span>Upload File</span>
                </label>
              </div>
            </div>

            {uploadMethod === 'url' ? (
              <div className="input-group">
                <div className="input-icon">
                  <Camera size={20} />
                </div>
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                  placeholder="Profile Picture URL"
                  className="form-input"
                />
              </div>
            ) : (
              <div className="file-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <Upload size={32} className="mb-4" />
                  <p className="text-lg font-medium mb-2">Click to upload to Cloudinary</p>
                  <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB</p>
                </label>
                {selectedFile && (
                  <p className="mt-4 text-sm text-green-400">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            )}

            {formData.photoUrl && (
              <div className="image-preview">
                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                <img
                  src={formData.photoUrl}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (uploadMethod === 'url') {
                      toast.error('Invalid image URL. Please check the URL and try again.');
                    }
                  }}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="input-group">
              <div className="input-icon">
                <FileText size={20} />
              </div>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                className="form-textarea"
                rows="4"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="input-group">
              <div className="input-icon">
                <Award size={20} />
              </div>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="JavaScript, React, Node.js, Python..."
                className="form-input"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Success!</h2>
          <p className="success-message">
            Your account has been created successfully. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Step {currentStep} of {steps.length}</p>
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Step indicators */}
        <div className="step-indicators">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`step-indicator ${step.id <= currentStep ? 'active' : ''}`}
              >
                <div className="step-icon">
                  <Icon size={16} />
                </div>
                <span className="step-title">{step.title}</span>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-content">
            <h3 className="form-section-title">
              {steps[currentStep - 1].title}
              {steps[currentStep - 1].required && <span className="required">*</span>}
            </h3>
            
            {renderStepContent()}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`btn-secondary ${currentStep === 1 ? 'disabled' : ''}`}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className={`btn-success ${loading || uploadingImage ? 'disabled' : ''}`}
              >
                {loading ? 'Creating Account...' : uploadingImage ? 'Uploading...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <a href="/login" className="login-link">Sign in</a>
          </p>
        </div>
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

      <style jsx>{`
        .signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .signup-card {
          background: rgba(33, 37, 41, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .signup-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .signup-title {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24, #feca57);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .signup-subtitle {
          color: #adb5bd;
          font-size: 1rem;
        }

        .progress-container {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          margin-bottom: 30px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #ee5a24);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .step-indicators {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #6c757d;
          transition: color 0.3s ease;
        }

        .step-indicator.active {
          color: #ff6b6b;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .step-indicator.active .step-icon {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
        }

        .step-title {
          font-size: 0.75rem;
          text-align: center;
          max-width: 60px;
        }

        .signup-form {
          margin-bottom: 20px;
        }

        .form-content {
          margin-bottom: 30px;
        }

        .form-section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #f8f9fa;
          margin-bottom: 20px;
        }

        .required {
          color: #ff6b6b;
        }

        .input-group {
          position: relative;
          margin-bottom: 20px;
        }

        .input-icon {
          position: absolute;
          left: 0;
          top: 0;
          height: 50px;
          width: 50px;
          background: #6c757d;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 1;
        }

        .form-input, .form-textarea {
          width: 100%;
          height: 50px;
          background: #6c757d;
          border: none;
          border-radius: 10px;
          padding: 0 15px 0 60px;
          color: #f8f9fa;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-textarea {
          height: auto;
          padding: 15px 15px 15px 60px;
          resize: vertical;
          min-height: 100px;
        }

        .form-input:focus, .form-textarea:focus {
          background: #5a6268;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: #adb5bd;
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #adb5bd;
          cursor: pointer;
          padding: 5px;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #f8f9fa;
        }

        .password-strength {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 15px;
          margin-top: 10px;
        }

        .upload-method-selector {
          margin-bottom: 20px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #f8f9fa;
          font-weight: 500;
        }

        .radio-option input[type="radio"] {
          margin-right: 8px;
          accent-color: #ff6b6b;
        }

        .file-upload-area {
          border: 2px dashed #6c757d;
          border-radius: 10px;
          padding: 40px 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .file-upload-area:hover {
          border-color: #ff6b6b;
          background: rgba(255, 107, 107, 0.05);
        }

        .file-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          color: #adb5bd;
        }

        .image-preview {
          text-align: center;
          margin-top: 20px;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .btn-primary, .btn-secondary, .btn-success {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-success {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3);
        }

        .disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .signup-footer {
          text-align: center;
          color: #adb5bd;
        }

        .login-link {
          color: #ff6b6b;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .login-link:hover {
          color: #ee5a24;
        }

        .success-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }

        .success-card {
          background: rgba(33, 37, 41, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 60px 40px;
          text-align: center;
          max-width: 400px;
          width: 100%;
          margin: 20px;
        }

        .success-icon {
          font-size: 4rem;
          color: #28a745;
          margin-bottom: 20px;
        }

        .success-title {
          font-size: 2rem;
          font-weight: 700;
          color: #f8f9fa;
          margin-bottom: 15px;
        }

        .success-message {
          color: #adb5bd;
          font-size: 1rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .signup-card {
            padding: 30px 20px;
            margin: 10px;
          }

          .signup-title {
            font-size: 2rem;
          }

          .step-indicators {
            gap: 5px;
          }

          .step-title {
            font-size: 0.7rem;
            max-width: 50px;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SignupForm;
