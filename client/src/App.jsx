import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar.jsx'; 
import Login from './pages/Login';
import Register from './pages/Register';

const Home = () => (
  <div className="max-w-4xl mx-auto p-12 text-center mt-10">
    <div className="bg-brand-bg-card border border-brand-border rounded-3xl p-8 shadow-xl">
      <h1 className="text-4xl font-black text-brand-text-bright mb-4">Discover Amazing Local Events</h1>
      <p className="text-brand-text-muted mb-6 font-medium">Create, explore, and book events seamlessly with Evently.</p>
      <button className="bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep font-black py-3 px-6 rounded-2xl shadow-lg shadow-brand-accent/10 transition-all cursor-pointer">
        Browse Events
      </button>
    </div>
  </div>
);

const UserDashboard = () => (
  <div className="max-w-4xl mx-auto p-8">
    <h1 className="text-3xl font-black text-brand-text-bright mb-2">My Bookings</h1>
    <p className="text-brand-text-muted mb-6 font-medium">Track and manage your upcoming registered events here.</p>
    <div className="bg-brand-bg-card border border-dashed border-brand-border rounded-2xl p-12 text-center text-brand-text-muted font-semibold">
      No bookings made yet. Go to the Home Screen to register for events!
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="max-w-6xl mx-auto p-8">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-black text-brand-text-bright">Admin Control Center</h1>
        <p className="text-brand-text-muted font-medium">Manage your created events and passenger bookings.</p>
      </div>
      <button className="bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep font-black py-2.5 px-5 rounded-xl shadow-lg shadow-brand-accent/10 transition-all cursor-pointer">
        ➕ Create New Event
      </button>
    </div>
    <div className="bg-brand-bg-card border border-dashed border-brand-border rounded-2xl p-12 text-center text-brand-text-muted font-semibold">
      You haven't created any events yet. Click "Create New Event" to begin!
    </div>
  </div>
);

const DashboardSwitcher = () => {
  const { user } = useContext(AuthContext);
  return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg-deep">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-accent border-t-transparent"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg-deep text-brand-text-bright transition-colors duration-350">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardSwitcher />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;