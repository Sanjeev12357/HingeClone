import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequest(res.data.connectionRequests));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <h1 className="flex justify-center my-10 text-gray-500 text-lg bg-black h-screen items-center">
        No Requests Found
      </h1>
    );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 tracking-wide text-white">
        Connection Requests
      </h1>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId;

        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#0d0d0d] border border-[#1f1f1f] p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/10 transition mb-6"
          >
            <div className="flex-shrink-0">
              <img
                alt="User"
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-600"
                src={photoUrl}
              />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-2xl font-semibold text-white">{firstName + " " + lastName}</h2>
              {age && gender && <p className="text-gray-400 text-sm">{age + ", " + gender}</p>}
              <p className="text-gray-300 mt-1 text-sm">{about}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => reviewRequest("rejected", request._id)}
                className="px-5 py-2 rounded-full bg-red-700 hover:bg-red-800 text-white shadow-md transition"
              >
                Reject
              </button>
              <button
                onClick={() => reviewRequest("accepted", request._id)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition"
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
