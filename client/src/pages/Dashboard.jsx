import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// 👤 User View
const UserDashboard = () => (
  <div className="max-w-4xl mx-auto p-8">
    <h1 className="text-3xl font-black text-brand-text-bright mb-2">My Bookings</h1>
    <p className="text-brand-text-muted mb-6 font-medium">Track and manage your upcoming registered events here.</p>
    <div className="bg-brand-bg-card border border-dashed border-brand-border rounded-2xl p-12 text-center text-brand-text-muted font-semibold">
      No bookings made yet. Go to the Home Screen to register for events!
    </div>
  </div>
);

// 🛠️ Admin View
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

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;