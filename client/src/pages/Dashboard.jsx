import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Custom Axios instance pointing to /api
import { Calendar, MapPin, Ticket, AlertCircle, Trash2, Printer, CheckCircle, Clock, XCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for View/Print Ticket Modal
  const [selectedTicket, setSelectedTicket] = useState(null);
 
  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/bookings/my-bookings');
      if (response.data && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
      } else if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError('Could not retrieve your bookings. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

 
  

  // Helper to render beautiful stylized status tags
  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/30">
            <CheckCircle className="h-3.5 w-3.5" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="h-3.5 w-3.5 animate-pulse" /> Pending
          </span>
        );
      case 'canceled':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-danger-hover/10 text-brand-danger-text border border-brand-danger-border/30">
            <XCircle className="h-3.5 w-3.5" /> Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-border text-brand-text-muted">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-deep py-12 px-4 sm:px-6 lg:px-8 text-brand-text-main">
      <div className="max-w-6xl mx-auto">
        
        {/* Dashboard Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-brand-border">
          <div>
            <span className="text-xs font-bold uppercase text-brand-accent tracking-widest">Portal Access</span>
            <h1 className="text-3xl font-extrabold text-brand-text-bright tracking-tight mt-1">
              Your <span className="text-brand-accent">Reserved Experience Tickets</span>
            </h1>
            <p className="text-brand-text-muted text-sm mt-1">
              Manage reservations, view access credentials, and request booking modifications.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto bg-brand-bg-card border border-brand-border px-4 py-2.5 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-brand-accent" />
            <span className="text-xs text-brand-text-bright font-mono font-semibold">SECURE ACCESS GRANTED</span>
          </div>
        </div>

        {/* Loading Experience */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-24 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-accent border-r-2 border-r-transparent"></div>
            <p className="text-brand-text-muted animate-pulse">Retrieving your passes...</p>
          </div>
        )}

        {/* Local Error feedback */}
        {error && (
          <div className="bg-brand-bg-card border border-brand-danger-border p-5 rounded-xl max-w-xl mx-auto flex items-start gap-3 shadow-lg">
            <AlertCircle className="h-6 w-6 text-brand-danger-text shrink-0" />
            <div>
              <h4 className="font-semibold text-brand-text-bright">Dashboard Error</h4>
              <p className="text-brand-text-muted text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-20 bg-brand-bg-card rounded-2xl border border-brand-border max-w-xl mx-auto">
            <Ticket className="h-14 w-14 text-brand-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-brand-text-bright">No Active Tickets Scheduled</h3>
            <p className="text-brand-text-muted text-sm mt-2 px-6">
              You haven't reserved any events yet. Check out the home catalog to grab some slots!
            </p>
            <a 
              href="/"
              className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-brand-accent text-brand-bg-deep font-bold text-sm hover:bg-brand-accent-hover transition-all duration-200"
            >
              Browse Live Events
            </a>
          </div>
        )}

        {/* Bookings Tickets List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const event = booking.eventId; // Expects fully populated Event object
              if (!event) return null;

              return (
                <div 
                  key={booking._id} 
                  className="bg-brand-bg-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-accent/40 transition-all duration-300 flex flex-col lg:flex-row justify-between relative group"
                >
                  {/* Left Side: Image and Event Meta details */}
                  <div className="flex flex-col md:flex-row items-stretch flex-1">
                    <div className="relative w-full md:w-56 h-40 md:h-auto shrink-0 overflow-hidden">
                      <img 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        src={
                          event.image 
                            ? `http://localhost:4000${event.image.replace(/^\/?public/, '')}`
                            : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400'
                        } 
                        alt={event.title} 
                      />
                      <div className="absolute inset-0 bg-linear-to-r from-transparent to-brand-bg-card opacity-90 hidden md:block"></div>
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2.5">
                          {renderStatusBadge(booking.status)}
                          <span className="text-xs text-brand-text-muted font-semibold bg-brand-bg-deep px-2.5 py-1 rounded-md border border-brand-border">
                            Qty: {booking.seatsBooked}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-brand-text-bright truncate group-hover:text-brand-accent-light transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-brand-text-muted text-xs line-clamp-2 mt-1">
                          {event.description}
                        </p>
                      </div>

                      {/* Card meta row */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-brand-text-muted mt-4 border-t border-brand-border/40 pt-4">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-brand-accent shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-2 text-brand-accent shrink-0" />
                          <span className="max-w-37.5 truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Billing / Ticket Action Panel */}
                  <div className="p-6 lg:w-72 lg:border-l border-t lg:border-t-0 border-brand-border flex flex-row lg:flex-col justify-between gap-4 bg-brand-border-dark">
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Amount Charged</p>
                      <p className="text-2xl font-extrabold text-brand-text-bright">
                        {booking.totalPrice === 0 ? (
                          <span className="text-brand-accent-light">FREE</span>
                        ) : (
                          `$${booking.totalPrice}`
                        )}
                      </p>
                      <span className="text-[10px] text-brand-text-muted font-mono mt-0.5">TxID: {booking._id.substring(12).toUpperCase()}</span>
                    </div>

                    <div className="flex lg:flex-col gap-2 self-center lg:self-stretch">
                      {/* View stub ticket trigger */}
                      <button 
                        onClick={() => setSelectedTicket(booking)}
                        className="px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" /> View Ticket
                      </button>

                     
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

 

      {/* --- THEMED TICKET MODAL DESIGN --- */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg-deep/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-brand-bg-card border-2 border-dashed border-brand-border rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            
            {/* Header branding info */}
            <div className="bg-brand-border-dark px-6 py-4 flex justify-between items-center border-b border-brand-border">
              <div className="flex items-center gap-2 text-brand-accent">
                <Ticket className="h-5 w-5" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">Official Gate Pass</span>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-brand-text-muted hover:text-brand-text-bright text-sm font-bold transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            {/* Simulated Printed Stub */}
            <div className="p-6 relative space-y-6">
              
              {/* Event Main Headings */}
              <div>
                <span className="text-xs font-bold text-brand-accent-light uppercase">Admit One Access Stub</span>
                <h2 className="text-3xl font-extrabold text-brand-text-bright truncate mt-0.5">
                  {selectedTicket.eventId?.title}
                </h2>
                <p className="text-xs text-brand-text-muted mt-1">
                  Location: {selectedTicket.eventId?.location}
                </p>
              </div>

              {/* Grid Metadata Details */}
              <div className="grid grid-cols-2 gap-4 bg-brand-bg-deep border border-brand-border p-4 rounded-xl text-xs">
                <div>
                  <p className="text-brand-text-muted font-semibold uppercase">Date</p>
                  <p className="text-brand-text-bright font-bold mt-0.5">
                    {new Date(selectedTicket.eventId?.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-brand-text-muted font-semibold uppercase">Time</p>
                  <p className="text-brand-text-bright font-bold mt-0.5">{selectedTicket.eventId?.time}</p>
                </div>
                <div>
                  <p className="text-brand-text-muted font-semibold uppercase">Reserved Seats</p>
                  <p className="text-brand-text-bright font-bold mt-0.5">x{selectedTicket.seatsBooked} VIP Standard</p>
                </div>
                <div>
                  <p className="text-brand-text-muted font-semibold uppercase">Status</p>
                  <p className="text-brand-text-bright font-bold mt-0.5 uppercase tracking-wide">
                    {selectedTicket.status}
                  </p>
                </div>
              </div>

              {/* simulated barcode stub graphic */}
              <div className="border-t border-brand-border/60 pt-6 flex flex-col items-center">
                <div className="bg-brand-text-bright px-6 py-3.5 rounded-lg flex flex-col items-center gap-1.5 shadow-lg select-none">
                  {/* barcode graphic segments */}
                  <div className="h-10 w-64 flex items-stretch gap-0.5">
                    {[...Array(38)].map((_, i) => {
                      const heights = ["h-full", "h-4/5", "h-5/6"];
                      const margins = i % 3 === 0 ? "w-[3px] bg-brand-bg-deep" : i % 5 === 0 ? "w-[1.5px] bg-brand-bg-deep" : "w-[1px] bg-brand-bg-deep";
                      return <div key={i} className={`${heights[i % 3]} ${margins}`} />;
                    })}
                  </div>
                  <span className="text-[10px] text-brand-bg-deep font-mono font-bold tracking-[6px] pl-1.5">
                    PASSID-{selectedTicket._id.substring(12).toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-brand-text-muted font-mono mt-3 text-center">
                  Present this gate barcode on your mobile device at point of entry. 
                </p>
              </div>

            </div>

            {/* Ticket Footer print handler */}
            <div className="px-6 py-4 bg-brand-border-dark border-t border-brand-border flex justify-between items-center">
              <span className="text-[10px] text-brand-text-muted font-mono">Issued to: {selectedTicket.userId?.name || "Attendee Portal"}</span>
              <button 
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-brand-border hover:bg-brand-border-dark border border-brand-border text-brand-text-bright text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" /> Print Stub
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;