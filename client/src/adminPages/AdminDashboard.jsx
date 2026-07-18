import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 
import { 
  BarChart3, Users, Ticket, Calendar, MapPin, Printer, Trash2, 
  Settings, Award, ShieldAlert, CheckCircle, Clock, XCircle, LayoutDashboard
} from 'lucide-react';

const AdminDashboard = () => {
  // Tabs: 'overview' (Admin Metrics) or 'my-bookings' (Personal Profile & Tickets)
  const [activeTab, setActiveTab] = useState('overview');
  
  // Admin Metrics States
  const [stats, setStats] = useState({ totalEvents: 0, totalBookings: 0, totalUsers: 0, totalRevenue: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Personal Booking Profile States
  const [personalBookings, setPersonalBookings] = useState([]);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch Admin Overview Metrics
  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get('/admin/stats'); 
      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error("Failed to load admin metrics:", err);
      // Fallback dummy data for visual matching during testing
      setStats({ totalEvents: 8, totalBookings: 24, totalUsers: 142, totalRevenue: 1250 });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch Personal Tickets (Admin's personal bookings)
  const fetchPersonalBookings = async () => {
    try {
      setPersonalLoading(true);
      const response = await api.get('/bookings/my-bookings');
      if (response.data && Array.isArray(response.data.data)) {
        setPersonalBookings(response.data.data);
      } else if (Array.isArray(response.data)) {
        setPersonalBookings(response.data);
      }
    } catch (err) {
      console.error("Failed to load personal tickets:", err);
    } finally {
      setPersonalLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
    fetchPersonalBookings();
  }, []);

  // Cancel a personal booking
  const handleCancelPersonalBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel your personal reservation?")) return;
    setCancellingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      await fetchPersonalBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel ticket.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-deep py-12 px-4 sm:px-6 lg:px-8 text-brand-text-main">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 text-brand-accent">
              <Award className="h-4 w-4" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">Admin Terminal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-brand-text-bright mt-1">
              Control <span className="text-brand-accent">& Personal Hub</span>
            </h1>
          </div>
          
          {/* Custom Navigation Tab Buttons */}
          <div className="flex bg-brand-bg-card p-1.5 rounded-xl border border-brand-border self-start md:self-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-brand-accent text-brand-bg-deep shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                  : 'text-brand-text-muted hover:text-brand-text-bright'
              }`}
            >
              Terminal Stats
            </button>
            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`px-5 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'my-bookings'
                  ? 'bg-brand-accent text-brand-bg-deep shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                  : 'text-brand-text-muted hover:text-brand-text-bright'
              }`}
            >
              My Tickets Profile
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: SYSTEM METRICS OVERVIEW                            */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Active Events", val: stats.totalEvents, icon: Calendar, color: "text-brand-accent" },
                { label: "Total Bookings", val: stats.totalBookings, icon: Ticket, color: "text-brand-accent" },
                { label: "Registered Users", val: stats.totalUsers, icon: Users, color: "text-brand-accent" },
                { label: "Gross Revenue", val: `$${stats.totalRevenue}`, icon: BarChart3, color: "text-emerald-400" },
              ].map((item, idx) => (
                <div key={idx} className="bg-brand-bg-card border border-brand-border p-6 rounded-2xl flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider">{item.label}</p>
                    <h3 className="text-2xl font-extrabold text-brand-text-bright mt-1">{item.val}</h3>
                  </div>
                  <item.icon className={`h-8 w-8 ${item.color} opacity-80`} />
                </div>
              ))}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-brand-bg-card border border-brand-border p-8 rounded-2xl shadow-2xl">
              <h3 className="text-lg font-bold text-brand-text-bright mb-4">Quick Admin Controls</h3>
              {/* Changed from sm:grid-cols-3 to sm:grid-cols-4 to accommodate the new card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Create Event */}
                <a 
                  href="/admin/events/create" 
                  className="flex flex-col items-center justify-center p-6 bg-brand-bg-deep hover:border-brand-accent/40 border border-brand-border rounded-xl transition-all group text-center"
                >
                  <Calendar className="h-6 w-6 text-brand-accent group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-bold text-brand-text-bright">Create New Event</span>
                </a>

                {/* 2. Manage Existing Events (ADDED OPTION) */}
                <a 
                  href="/admin/events" 
                  className="flex flex-col items-center justify-center p-6 bg-brand-bg-deep hover:border-brand-accent/40 border border-brand-border rounded-xl transition-all group text-center"
                >
                  <Settings className="h-6 w-6 text-brand-accent group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-bold text-brand-text-bright">Manage Events (Edit/Delete)</span>
                </a>

                {/* 3. Manage Bookings */}
                <a 
                  href="/admin/bookings" 
                  className="flex flex-col items-center justify-center p-6 bg-brand-bg-deep hover:border-brand-accent/40 border border-brand-border rounded-xl transition-all group text-center"
                >
                  <Ticket className="h-6 w-6 text-brand-accent group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-bold text-brand-text-bright">Manage All Bookings</span>
                </a>

                {/* 4. Browse Catalog */}
                <a 
                  href="/" 
                  className="flex flex-col items-center justify-center p-6 bg-brand-bg-deep hover:border-brand-accent/40 border border-brand-border rounded-xl transition-all group text-center"
                >
                  <Award className="h-6 w-6 text-brand-accent group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-bold text-brand-text-bright">Browse & Book Live Tickets</span>
                </a>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MY TICKETS PROFILE (User View for Admins)         */}
        {/* ========================================================= */}
        {activeTab === 'my-bookings' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 bg-brand-accent/5 border border-brand-accent/20 p-4 rounded-xl mb-4">
              <ShieldAlert className="h-5 w-5 text-brand-accent" />
              <p className="text-xs text-brand-text-muted">
                These are your **personal reservations**. To book more events, navigate back to the public <a href="/" className="text-brand-accent hover:underline font-bold">Catalog page</a>.
              </p>
            </div>

            {personalLoading ? (
              <div className="flex flex-col justify-center items-center py-16 gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-accent border-r-2 border-r-transparent"></div>
                <p className="text-brand-text-muted text-sm">Fetching personal tickets...</p>
              </div>
            ) : personalBookings.length === 0 ? (
              <div className="text-center py-16 bg-brand-bg-card rounded-2xl border border-brand-border max-w-xl mx-auto">
                <Ticket className="h-12 w-12 text-brand-text-muted mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-bold text-brand-text-bright">No Personal Reservations</h3>
                <p className="text-brand-text-muted text-xs mt-1">You haven't reserved any tickets for yourself yet.</p>
                <a href="/" className="inline-block mt-4 px-5 py-2 rounded-lg bg-brand-accent text-brand-bg-deep text-xs font-bold">Book an Event Now</a>
              </div>
            ) : (
              <div className="space-y-6">
                {personalBookings.map((booking) => {
                  const event = booking.eventId;
                  if (!event) return null;

                  return (
                    <div 
                      key={booking._id} 
                      className="bg-brand-bg-card border border-brand-border rounded-xl overflow-hidden flex flex-col md:flex-row justify-between relative group"
                    >
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {booking.status?.toLowerCase() === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/30">Confirmed</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Pending</span>
                          )}
                          <span className="text-[10px] text-brand-text-muted font-bold bg-brand-bg-deep px-2 py-0.5 rounded border border-brand-border">Qty: {booking.seatsBooked}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-brand-text-bright">{event.title}</h3>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-brand-text-muted mt-3">
                          <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1 text-brand-accent" /> {new Date(event.date).toLocaleDateString()}</span>
                          <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1 text-brand-accent" /> {event.location}</span>
                        </div>
                      </div>

                      <div className="p-6 md:w-56 bg-brand-border-dark border-t md:border-t-0 md:border-l border-brand-border flex md:flex-col justify-between gap-4">
                        <div>
                          <p className="text-[9px] text-brand-text-muted uppercase">Charged</p>
                          <p className="text-lg font-extrabold text-brand-text-bright">${booking.totalPrice}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedTicket(booking)}
                            className="flex-1 py-1.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep text-[11px] font-bold rounded-lg cursor-pointer"
                          >
                            <Printer className="h-3 w-3 inline mr-1" /> View Ticket
                          </button>
                          {booking.status?.toLowerCase() !== 'canceled' && (
                            <button 
                              disabled={cancellingId === booking._id}
                              onClick={() => handleCancelPersonalBooking(booking._id)}
                              className="px-2.5 py-1.5 border border-brand-danger-border hover:bg-brand-danger-hover/10 text-brand-danger-text rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- PERSONAL TICKET POPUP MODAL --- */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg-deep/90 backdrop-blur-md">
          <div className="bg-brand-bg-card border-2 border-dashed border-brand-border rounded-2xl w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-4">
              <span className="text-xs font-bold text-brand-accent font-mono">Personal VIP Ticket</span>
              <button onClick={() => setSelectedTicket(null)} className="text-brand-text-muted text-xs hover:text-brand-text-bright font-bold cursor-pointer">CLOSE</button>
            </div>
            
            <h2 className="text-2xl font-extrabold text-brand-text-bright">{selectedTicket.eventId?.title}</h2>
            <div className="grid grid-cols-2 gap-3 bg-brand-bg-deep p-3 rounded-lg text-xs my-4 border border-brand-border">
              <div><p className="text-brand-text-muted">Date</p><p className="font-bold text-brand-text-bright">{new Date(selectedTicket.eventId?.date).toLocaleDateString()}</p></div>
              <div><p className="text-brand-text-muted">Time</p><p className="font-bold text-brand-text-bright">{selectedTicket.eventId?.time}</p></div>
              <div><p className="text-brand-text-muted">Reserved Seats</p><p className="font-bold text-brand-text-bright">x{selectedTicket.seatsBooked}</p></div>
              <div><p className="text-brand-text-muted">Pass ID</p><p className="font-bold text-brand-text-bright font-mono">{selectedTicket._id.substring(12).toUpperCase()}</p></div>
            </div>

            <div className="border-t border-brand-border/40 pt-4 flex flex-col items-center gap-2">
              <div className="bg-brand-text-bright p-2 rounded w-48 h-8 flex justify-between bg-white text-black font-mono text-[8px] items-center">
                {[...Array(20)].map((_, i) => <div key={i} className={`bg-black w-1 ${i % 3 === 0 ? 'h-6' : 'h-5'}`} />)}
                <span>PASSID-{selectedTicket._id.substring(16).toUpperCase()}</span>
              </div>
              <button onClick={() => window.print()} className="mt-2 text-xs text-brand-text-bright bg-brand-border px-4 py-1.5 rounded hover:bg-brand-border-dark border border-brand-border cursor-pointer">Print Ticket</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;