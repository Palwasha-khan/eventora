import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Protection Guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Authentication Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';

// Public & General User Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard'; // General User Bookings Dashboard

// Administrative Dashboards & Event Controllers
import AdminDashboard from './pages/AdminDashboard';
import ManageEvents from './pages/ManageEvents';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import ManageBookings from './pages/ManageBookings';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC AUTH ROUTES (No Navbar/Layout) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* --- MAIN APP ROUTE HOUSING (Inside MainLayout) --- */}
        <Route element={<MainLayout />}>
          
          {/* Public Page - Anyone can browse events */}
          <Route path="/" element={<Home />} />

          {/* --- PROTECTED USER ROUTES --- */}
          <Route element={<PrivateRoute />}>
            {/* User Dashboard: View personal ticket history & status */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* --- PROTECTED ADMIN-ONLY ROUTES --- */}
          <Route element={<AdminRoute />}>
            {/* Admin Overview & Metrics panel */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Admin Event Management Actions */}
            <Route path="/admin/events" element={<ManageEvents />} />
            <Route path="/admin/events/create" element={<CreateEvent />} />
            <Route path="/admin/events/edit/:id" element={<EditEvent />} />
            
            {/* Admin Global Booking Approvals & Cancellations */}
            <Route path="/admin/bookings" element={<ManageBookings />} />
          </Route>

        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;