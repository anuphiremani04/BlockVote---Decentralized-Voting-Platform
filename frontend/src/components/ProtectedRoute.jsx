import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ requireAdmin = false }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  
  try {
    if (userStr) user = JSON.parse(userStr);
  } catch(e) {}

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
