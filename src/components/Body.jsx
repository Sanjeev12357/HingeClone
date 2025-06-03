import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'

const Body = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const userData=useSelector(store =>store.user);


  const fetchUser = async()=>{
    if(userData) return;
   try {
    const res=await axios.get(`${BASE_URL}/profile/view`,{withCredentials:true});
    dispatch(addUser(res.data))
   } catch (error) {
    if(error.status===401){
      navigate('/login');
    }
    
    console.log(error)
   }

  }
  useEffect(()=>{
    
    fetchUser();
  },[])
 
  if(!userData) {
    navigate('/login');
  }
  return (
    <div>
    {userData && (<NavBar/>)}
    
    <Outlet/>
    </div>
  )
}

export default Body