import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-black">
        <div className="text-center bg-gray-900/80 backdrop-blur-xl rounded-3xl p-12 border border-gray-700/50 shadow-2xl">
          <div className="mb-6">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">No Connections Yet</h2>
          <p className="text-gray-300/90 max-w-sm mx-auto text-lg">
            Start connecting with people to see them here. Your network is waiting to grow!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-red-500 bg-clip-text text-transparent mb-6">
            Your Connections
          </h1>
          <div className="w-40 h-1.5 bg-gradient-to-r from-red-500 via-purple-500 to-red-600 mx-auto rounded-full shadow-2xl shadow-red-500/30"></div>
          <p className="text-gray-300 mt-8 text-xl font-light">
            {connections.length} {connections.length === 1 ? 'connection' : 'connections'} in your premium network
          </p>
        </div>

        {/* Connections Grid */}
        <div className="grid gap-8">
          {connections.map((connection, index) => {
            const isFromMe = connection?.fromUserId?._id === currentUser?._id;
            const otherUser = isFromMe
              ? connection?.toUserId
              : connection?.fromUserId;

            // Alternate card styles for variety
            const isEven = index % 2 === 0;
            const cardGradient = isEven 
              ? "from-gray-900/90 via-gray-800/80 to-gray-900/90" 
              : "from-gray-800/90 via-gray-700/80 to-gray-800/90";
            const borderGradient = isEven
              ? "from-red-500/40 to-purple-500/40"
              : "from-purple-500/40 to-red-500/40";

            return (
              <div
                key={connection?._id}
                className={`group bg-gradient-to-br ${cardGradient} rounded-3xl shadow-2xl hover:shadow-red-500/20 transition-all duration-700 border-2 border-gray-700/50 hover:border-red-500/50 backdrop-blur-xl relative overflow-hidden`}
                style={{
                  backgroundImage: `linear-gradient(${cardGradient}), linear-gradient(135deg, ${borderGradient})`,
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
              >
                {/* Animated background glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${borderGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-xl`}></div>
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400/20 rounded-full animate-pulse"></div>
                  <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400/30 rounded-full animate-pulse delay-1000"></div>
                  <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-red-400/15 rounded-full animate-pulse delay-500"></div>
                </div>
                
                <div className="relative p-10">
                  <div className="flex items-center gap-10">
                    {/* Enhanced Profile Image */}
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-gray-600/50 group-hover:ring-red-500/60 transition-all duration-700 shadow-2xl relative">
                        <img
                          alt={`${otherUser?.firstName} ${otherUser?.lastName}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          src={otherUser?.photoUrl}
                        />
                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      {/* Online status indicator */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-4 border-slate-800 shadow-xl flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Premium crown badge */}
                      <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-full border-4 border-slate-800 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        <svg className="w-5 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 16L3 21l5.25-1.25L12 19l3.75 1.25L21 21l-2-5h-3l-1-1v-4l1-1h3V7h-3l-1-1V2L12 4 6 2v4l-1 1H2v3h3l1 1v4l-1 1H5z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Enhanced User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-500">
                            {otherUser?.firstName + " " + otherUser?.lastName}
                          </h2>
                          
                          {otherUser?.age && otherUser?.gender && (
                            <div className="flex items-center gap-4 mb-5">
                              <span className="inline-flex items-center px-5 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white border border-purple-400/30 shadow-lg backdrop-blur-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-4v9a1 1 0 01-1 1H9a1 1 0 01-1-1v-9H4a1 1 0 01-1-1V8a1 1 0 011-1h4z" />
                                </svg>
                                {otherUser?.age} years old
                              </span>
                              <span className="inline-flex items-center px-5 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-pink-600/80 to-red-600/80 text-white border border-pink-400/30 shadow-lg backdrop-blur-sm capitalize">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {otherUser?.gender}
                              </span>
                            </div>
                          )}
                          
                          {otherUser?.about && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                              <p className="text-purple-50/90 leading-relaxed text-lg font-light">
                                {otherUser?.about}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Chat Button */}
                        <div className="ml-8 flex-shrink-0">
                          <Link to={"/chat/" + connection?._id}>
                            <button className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 via-purple-600 to-red-600 text-white font-bold rounded-2xl hover:from-red-400 hover:via-purple-500 hover:to-red-500 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 shadow-2xl hover:shadow-red-500/50 border-2 border-red-400/50 hover:border-red-300/70 overflow-hidden">
                              {/* Button shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                              
                              {/* Chat icon with animation */}
                              <div className="relative">
                                <svg className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                
                                {/* Pulsing dot */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                              </div>
                              
                              <span className="relative font-bold text-lg tracking-wide">Chat Now</span>
                              
                              {/* Arrow icon */}
                              <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;