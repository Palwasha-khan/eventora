import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 
import MainLayout from './layouts/MainLayout';
 
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
 
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
 
import Home from './pages/Home';
import Dashboard from './pages/Dashboard'; // General User Bookings Dashboard
import AdminDashboard from './adminPages/AdminDashboard';
import ManageEvents from './adminPages/ManageEvents';
import CreateEvent from './adminPages/CreateEvent';
import EditEvent from './adminPages/EditEvent';
import ManageBookings from './adminPages/ManageBookings';



function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC AUTH ROUTES (No Navbar/Layout) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route element={<MainLayout />}>
          
        <Route path="/" element={<Home />} />

         <Route element={<PrivateRoute />}>
           <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<AdminRoute />}>
            {/* Admin Overview & Metrics panel */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Admin Event Management Actions */}
            <Route path="/admin/events" element={<ManageEvents />} />
            <Route path="/admin/events/create" element={<CreateEvent />} />
            <Route path="/admin/events/edit/:id" element={<EditEvent/>} />
            
            {/* Admin Global Booking Approvals & Cancellations */}
            <Route path="/admin/bookings" element={<ManageBookings/>} />
          </Route>

        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;