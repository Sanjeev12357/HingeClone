import React, { useEffect, useState, useCallback } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed, removeFeed, clearFeed } from '../utils/feedSlice';
import { Heart, X, User, MapPin, Calendar, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector(store => store.feed);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Enhanced feed fetching with retry logic
  const getFeed = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const res = await axios.get(`${BASE_URL}/feed`, { 
        withCredentials: true,
        timeout: 10000 // 10 second timeout
      });

      console.log('Feed response:', res.data);

      if (res.data && res.data.users && Array.isArray(res.data.users)) {
        if (res.data.users.length === 0) {
          setError('No profiles available at the moment');
        } else {
          if (isRefresh) {
            dispatch(clearFeed());
            setIndex(0);
          }
          dispatch(addFeed(res.data.users));
          setRetryCount(0);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Feed fetch error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection.');
      } else if (err.response?.status === 401) {
        setError('Please log in again to continue.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load profiles. Please try again.');
      }
      
      // Auto-retry logic
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          getFeed(isRefresh);
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [dispatch, retryCount]);

  useEffect(() => {
    // Always fetch fresh data on component mount
    getFeed();
  }, []);

  const profiles = feed || [];
  const current = profiles[index];

  const handleAction = async (status) => {
    if (!current || actionLoading) return;

    setActionLoading(true);
    try {
      const toUserId = current._id;
      await axios.post(
        `${BASE_URL}/request/send/${status}/${toUserId}`, 
        {}, 
        { 
          withCredentials: true,
          timeout: 5000
        }
      );

      // Show success feedback
      toast.success(
        status === 'interested' 
          ? '💕 Connection request sent!' 
          : '👋 Profile skipped'
      );

      // Remove from feed and move to next
      dispatch(removeFeed(current._id));
      
      // If this was the last profile, try to fetch more
      if (index >= profiles.length - 1) {
        setIndex(0);
        // Try to fetch more profiles
        setTimeout(() => getFeed(), 500);
      } else {
        setIndex(prev => Math.min(prev, profiles.length - 2));
      }
    } catch (error) {
      console.error('Action error:', error);
      toast.error('Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    getFeed(true);
  };

  const handleRetry = () => {
    setRetryCount(0);
    getFeed();
  };

  // Loading state with better skeleton
  if (isLoading && !isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-4 border-gray-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-4 w-80">
            <div className="h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg"></div>
            <div className="h-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg w-3/4 mx-auto"></div>
            <div className="h-20 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl"></div>
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl"></div>
              <div className="flex-1 h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl"></div>
            </div>
          </div>
          <div className="mt-6 text-gray-400 text-sm animate-pulse">
            Loading amazing profiles for you...
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error && !current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4">
        <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-3xl shadow-2xl border border-gray-800 text-center backdrop-blur-sm max-w-md">
          <div className="relative mb-6">
            <AlertCircle size={56} className="mx-auto text-red-400" />
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-xl transition-all duration-300 flex items-center justify-center font-semibold text-white"
            >
              <RefreshCw size={18} className="mr-2" />
              Try Again
            </button>
          </div>
          {retryCount > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              Retry attempt: {retryCount}/3
            </p>
          )}
        </div>
      </div>
    );
  }

  // No profiles state
  if (!current && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4">
        <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-3xl shadow-2xl border border-gray-800 text-center backdrop-blur-sm">
          <div className="relative mb-6">
            <User size={56} className="mx-auto text-purple-400" />
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent mb-3">
            No More Profiles
          </h3>
          <p className="text-gray-400 mb-6">
            You've seen all available profiles. Check back later for new matches!
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="py-3 px-6 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 rounded-xl transition-all duration-300 flex items-center justify-center font-semibold text-white mx-auto disabled:opacity-50"
          >
            {isRefreshing ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw size={18} className="mr-2" />
                Refresh Feed
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4 py-8 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 via-black to-purple-950/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-red-500/5 rounded-full blur-3xl"></div>
      
      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="absolute top-4 right-4 p-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-full transition-all duration-300 border border-gray-600 disabled:opacity-50 z-20"
      >
        <RefreshCw size={20} className={`text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-800 backdrop-blur-md z-10 hover:shadow-pink-500/20 transition-all duration-700"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-500/10 opacity-50 blur-xl"></div>
          
          {/* Profile Header */}
          <div className="relative">
            <div className="h-36 bg-gradient-to-r from-red-900/50 via-purple-900/50 to-red-900/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-500/20"></div>
              <div className="absolute inset-0 backdrop-blur-sm"></div>
            </div>
            
            {/* Profile Image */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
              <div className="p-1 bg-black rounded-full shadow-2xl">
                <div className="p-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-full">
                  {current.photoUrl ? (
                    <img
                      src={current.photoUrl}
                      alt={`${current.firstName} ${current.lastName}`}
                      className="w-28 h-28 rounded-full object-cover border-2 border-black"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-28 h-28 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent border-2 border-gray-800 ${current.photoUrl ? 'hidden' : 'flex'}`}
                  >
                    {current.firstName?.[0]}{current.lastName?.[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="pt-20 pb-6 px-6 relative">
            <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-2">
              {current.firstName} {current.lastName}
            </h2>
            
            {current.age && (
              <p className="text-center text-sm mb-2 flex items-center justify-center">
                <Calendar size={14} className="mr-2 text-purple-400" />
                <span className="text-gray-400">Age {current.age}</span>
              </p>
            )}
            
            <p className="text-center text-sm mb-6 flex items-center justify-center">
              <Star size={14} className="mr-2 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent font-medium">
                {current.emailId}
              </span>
            </p>
            
            <div className="bg-gradient-to-br from-gray-950 to-black p-5 rounded-2xl mb-6 border border-gray-800 shadow-inner">
              <p className="text-center text-gray-300 text-sm leading-relaxed">
                {current.about || "No profile description available"}
              </p>
            </div>

            {/* Skills/Interests */}
            {current.skills?.length > 0 && (
              <div className="mb-8">
                <h3 className="bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent text-xs uppercase font-bold mb-3 ml-1 tracking-wider">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {current.skills.slice(0, 6).map((skill, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-gradient-to-r from-gray-950 to-black px-4 py-2 rounded-full border border-gray-800 bg-gradient-to-r from-red-400/80 to-purple-400/80 bg-clip-text text-transparent font-medium hover:border-purple-500/50 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {current.skills.length > 6 && (
                    <span className="text-xs bg-gradient-to-r from-gray-950 to-black px-4 py-2 rounded-full border border-gray-800 text-gray-400">
                      +{current.skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2 gap-4">
              <button
                onClick={() => handleAction('ignored')}
                disabled={actionLoading}
                className="flex-1 py-4 bg-gradient-to-br from-gray-950 to-black hover:from-gray-900 hover:to-gray-950 rounded-2xl transition-all duration-300 flex items-center justify-center border border-gray-800 hover:border-red-500/50 group shadow-lg hover:shadow-red-500/20 disabled:opacity-50"
              >
                <X size={20} className="text-red-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-semibold">
                  {actionLoading ? 'Processing...' : 'Pass'}
                </span>
              </button>
              
              <button
                onClick={() => handleAction('interested')}
                disabled={actionLoading}
                className="flex-1 py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/30 group disabled:opacity-50"
              >
                <Heart size={20} className="text-white mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white font-semibold">
                  {actionLoading ? 'Sending...' : 'Like'}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Progress Indicator */}
      <div className="mt-8 bg-gradient-to-r from-gray-950 to-black rounded-full px-6 py-3 border border-gray-800 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-medium bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
          Profile {Math.min(index + 1, profiles.length)} of {profiles.length}
        </p>
      </div>
    </div>
  );
};
