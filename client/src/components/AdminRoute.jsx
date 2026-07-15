import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
 
  const isAdmin = token && user.role === 'admin';

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;