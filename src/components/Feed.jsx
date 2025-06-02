import React, { useEffect, useState, useCallback } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed, removeFeed } from '../utils/feedSlice';
import { Heart, Zap, User, MapPin, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegObjectGroup } from 'react-icons/fa';

export const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector(store => store.feed);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
 

  // fetch once
  const getFeed = useCallback(async () => {
    if (feed) return setIsLoading(false);
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/feed`, { withCredentials: true });
      dispatch(addFeed(res.data.users));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, feed]);

  useEffect(() => { getFeed(); }, [getFeed]);

  const profiles = feed || [];
  const current = profiles[index];

  const handleAction = async (status) => {
    // stubbed: replace with your real endpoints
    try {
        const toUserId = current._id;
        await axios.post(`${BASE_URL}/request/send/${status}/${toUserId}`, {  }, { withCredentials: true });
      console.log(`Action ${status} performed on user ${current._id}`);
      // Optionally, you can update the feed state here if needed
      dispatch(removeFeed(current._id));
    } catch (e) {
      console.error('action error', e);
    } finally {
      setIndex(i => (i + 1) % profiles.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-black rounded-full mb-4 border border-gray-800"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
          </div>
          <div className="h-6 w-40 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg mb-3"></div>
          <div className="h-4 w-32 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg mb-6"></div>
          <div className="h-16 w-64 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
        <div className="bg-gradient-to-br from-gray-950 to-black p-10 rounded-3xl shadow-2xl border border-gray-800 text-center backdrop-blur-sm">
          <div className="relative mb-6">
            <User size={56} className="mx-auto text-transparent bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 blur-xl rounded-full"></div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent mb-3">
            No One Left
          </h3>
          <p className="text-gray-400 mb-2">You've gone through everyone in your feed.</p>
          <p className="text-gray-600 text-sm bg-gradient-to-r from-red-500/10 to-purple-500/10 px-4 py-2 rounded-full border border-gray-800">
            Check back later for new matches!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 py-8 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 via-black to-purple-950/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-red-500/5 rounded-full blur-3xl"></div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`group relative bg-gradient-to-br ${index % 2 === 0 ? "from-gray-900 via-gray-800 to-black" : "from-black via-gray-900 to-gray-800"} rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-800 backdrop-blur-md z-10 hover:shadow-pink-500/20 transition-all duration-700`}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-500/10 opacity-50 blur-xl"></div>
          
          {/* Profile Header */}
          <div className="relative">
            {/* Cover Image/Background */}
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
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent border-2 border-gray-800">
                      {current.firstName?.[0]}{current.lastName?.[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="pt-20 pb-6 px-6 relative">
            <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-2">
              {current.firstName} {current.lastName}
            </h2>
            
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
                  {current.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-gradient-to-r from-gray-950 to-black px-4 py-2 rounded-full border border-gray-800 bg-gradient-to-r from-red-400/80 to-purple-400/80 bg-clip-text text-transparent font-medium hover:border-purple-500/50 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2 gap-4">
              <button
                onClick={() => handleAction('ignored')}
                className="flex-1 py-4 bg-gradient-to-br from-gray-950 to-black hover:from-gray-900 hover:to-gray-950 rounded-2xl transition-all duration-300 flex items-center justify-center border border-gray-800 hover:border-red-500/50 group shadow-lg hover:shadow-red-500/20"
              >
                <FaRegObjectGroup size={20} className="text-red-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-semibold">
                  Reject
                </span>
              </button>
              
              <button
                onClick={() => handleAction('interested')}
                className="flex-1 py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/30 group"
              >
                <Zap size={20} className="text-white mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white font-semibold">Connect</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Progress Indicator */}
      <div className="mt-8 bg-gradient-to-r from-gray-950 to-black rounded-full px-6 py-3 border border-gray-800 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-medium bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
          Profile {index + 1} of {profiles.length}
        </p>
      </div>
    </div>
  );
};