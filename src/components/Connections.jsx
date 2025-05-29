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
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Connections Yet</h2>
          <p className="text-gray-400 max-w-sm mx-auto">
            Start connecting with people to see them here. Your network is waiting to grow!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent mb-4">
            Your Connections
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full shadow-lg"></div>
          <p className="text-gray-300 mt-6 text-xl font-light">
            {connections.length} {connections.length === 1 ? 'connection' : 'connections'} in your premium network
          </p>
        </div>

        {/* Connections Grid */}
        <div className="grid gap-6">
          {connections.map((connection) => {
            const isFromMe = connection?.fromUserId?._id === currentUser?._id;
            const otherUser = isFromMe
              ? connection?.toUserId
              : connection?.fromUserId;

            return (
              <div
                key={connection?._id}
                className="group bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-600 hover:border-gold-400/70 overflow-hidden backdrop-blur-sm relative"
              >
                {/* Premium glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400/10 via-transparent to-gold-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-8">
                  <div className="flex items-center gap-8">
                    {/* Profile Image */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-500 group-hover:ring-gold-400/70 transition-all duration-500 shadow-2xl">
                        <img
                          alt={`${otherUser?.firstName} ${otherUser?.lastName}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={otherUser?.photoUrl}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-gray-700 shadow-lg"></div>
                      {/* Premium badge */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full border-3 border-gray-700 shadow-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-gold-300 transition-colors duration-300">
                            {otherUser?.firstName + " " + otherUser?.lastName}
                          </h2>
                          
                          {otherUser?.age && otherUser?.gender && (
                            <div className="flex items-center gap-3 mb-4">
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-500 text-gold-300 border border-gray-500">
                                {otherUser?.age} years old
                              </span>
                              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-500 text-gold-300 border border-gray-500 capitalize">
                                {otherUser?.gender}
                              </span>
                            </div>
                          )}
                          
                          {otherUser?.about && (
                            <p className="text-gray-200 leading-relaxed line-clamp-2 text-lg">
                              {otherUser?.about}
                            </p>
                          )}
                        </div>

                        {/* Chat Button */}
                        <div className="ml-6 flex-shrink-0">
                          <Link to={"/chat/" + connection?._id}>
                            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black font-bold rounded-2xl hover:from-gold-300 hover:via-gold-400 hover:to-gold-500 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-gold-400/30 border-2 border-gold-400 hover:border-gold-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Chat Now
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