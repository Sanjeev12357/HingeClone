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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-800 rounded-full mb-4"></div>
          <div className="h-6 w-40 bg-gray-800 rounded mb-3"></div>
          <div className="h-4 w-32 bg-gray-800 rounded mb-6"></div>
          <div className="h-16 w-64 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 text-gray-400">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
          <User size={48} className="mx-auto mb-4 text-blue-400 opacity-60" />
          <h3 className="text-xl font-semibold text-blue-400 mb-2">No One Left</h3>
          <p className="text-gray-400">You've gone through everyone in your feed.</p>
          <p className="text-gray-500 text-sm mt-4">Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
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
                  {current.photoUrl ? (
                    <img
                      src={current.photoUrl}
                      alt={`${current.firstName} ${current.lastName}`}
                      className="w-28 h-28 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-blue-400">
                      {current.firstName?.[0]}{current.lastName?.[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="pt-20 pb-6 px-6">
            <h2 className="text-center text-2xl font-bold text-gray-100 mb-1">
              {current.firstName} {current.lastName}
            </h2>
            
            <p className="text-center text-blue-400 text-sm mb-4 flex items-center justify-center">
              <Star size={14} className="mr-1" />
              {current.emailId}
            </p>
            
            <div className="bg-gray-900 p-4 rounded-xl mb-5">
              <p className="text-center text-gray-300 text-sm leading-relaxed">
                {current.about || "No profile description available"}
              </p>
            </div>

            {/* Skills/Interests */}
            {current.skills?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-blue-400 text-xs uppercase font-semibold mb-2 ml-1">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {current.skills.map((skill, i) => (
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
                onClick={() => handleAction('ignored')}
                className="flex-1 py-3 mr-2 bg-gray-900 hover:bg-gray-700 rounded-xl transition duration-300 flex items-center justify-center border border-gray-700"
              >
                <FaRegObjectGroup size={20} className="text-red-400 mr-2" />
                <span className="text-gray-300 font-medium">Reject</span>
              </button>
              
              <button
                onClick={() => handleAction('interested')}
                className="flex-1 py-3 ml-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition duration-300 flex items-center justify-center"
              >
                <Zap size={20} className="text-white mr-2" />
                <span className="text-white font-medium">Connect</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Progress Indicator */}
      <div className="mt-6 bg-gray-800 rounded-full px-4 py-1 border border-gray-700">
        <p className="text-xs text-blue-400 font-medium">
          Profile {index + 1} of {profiles.length}
        </p>
      </div>
    </div>
  );
};