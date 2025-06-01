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
        <div className="text-center bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl rounded-3xl p-12 border border-gray-800 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">No Connections Yet</h2>
          <p className="text-gray-400 max-w-sm mx-auto text-lg">
            Start connecting with people to see them here. Your network is waiting to grow!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
            Your Connections
          </h1>
          <div className="w-40 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 mx-auto rounded-full shadow-xl"></div>
          <p className="text-gray-300 mt-8 text-xl font-light">
            {connections.length} {connections.length === 1 ? 'connection' : 'connections'} in your premium network
          </p>
        </div>

        {/* Connections Grid */}
        <div className="grid gap-10">
          {connections.map((connection, index) => {
            const isFromMe = connection?.fromUserId?._id === currentUser?._id;
            const otherUser = isFromMe ? connection?.toUserId : connection?.fromUserId;

            const cardColor = index % 2 === 0
              ? "from-gray-900 via-gray-800 to-black"
              : "from-black via-gray-900 to-gray-800";

            return (
              <div
                key={connection?._id}
                className={`group bg-gradient-to-br ${cardColor} p-10 rounded-3xl border border-gray-800 shadow-xl hover:shadow-pink-500/20 transition-all duration-700 relative overflow-hidden backdrop-blur-md`}
              >
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-4">
                        {otherUser?.firstName + " " }
                      </h2>

                      {otherUser?.age && otherUser?.gender && (
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                          <span className="px-5 py-2 rounded-full text-sm font-semibold bg-purple-700/50 text-white border border-purple-400/30 shadow-md backdrop-blur-sm">
                            {otherUser?.age} years old
                          </span>
                          <span className="px-5 py-2 rounded-full text-sm font-semibold bg-pink-700/50 text-white border border-pink-400/30 shadow-md backdrop-blur-sm capitalize">
                            {otherUser?.gender}
                          </span>
                        </div>
                      )}

                      {otherUser?.about && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                          <p className="text-gray-300 leading-relaxed text-lg font-light">
                            {otherUser?.about}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Chat Button */}
                    <div className="shrink-0">
                      <Link to={`/chat/${connection?._id}`}>
                        <button className="relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white font-semibold rounded-xl hover:from-red-500 hover:via-pink-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg border border-pink-500/30">
                          Chat Now
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </Link>
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
