import axios from 'axios';
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addRequest } from '../utils/requestSlice';

const Requests = () => {

  const dispatch = useDispatch();


  const fetchRequests=async()=>{
    try {
      const res=await axios.get(BASE_URL+"/user/requests/recieved",{
        withCredentials:true
      })
      console.log(res.data);

      dispatch(addRequest(res.data));
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }

  useEffect(()=>{
    fetchRequests();
  },[])
  return (
    <div>Requests</div>
  )
}

export default Requests