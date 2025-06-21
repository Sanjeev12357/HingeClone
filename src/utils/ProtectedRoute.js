// utils/ProtectedRoute.js
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const userData = useSelector(state => state.user);
  const navigate = useNavigate();
  if (!userData) {
    navigate('/login');
  }

  return children
}

export default ProtectedRoute
