import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { XCircle, Loader, Info, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  
  // States for the custom modal popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const navigate = useNavigate();

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/all-bookings');
      setBookings(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Triggered when user clicks the row X button
  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  // Triggered when user confirms inside the popup modal
  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;
    
    setIsModalOpen(false); // Close modal immediately
    setActioningId(selectedBookingId);
    
    try {
      // NOTE: Ensure this path matches your backend route layout (/admin/bookings or /bookings)
      await api.delete(`/bookings/${selectedBookingId}/cancel`);
      fetchAllBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setActioningId(null);
      setSelectedBookingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-deep py-12 px-6 text-brand-text-main relative">
      <div className="max-w-6xl mx-auto">

        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-text-muted hover:text-brand-accent transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-brand-border">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-text-bright">
              Global <span className="text-brand-accent">Bookings Registry</span>
            </h1>
            <p className="text-xs text-brand-text-muted mt-1">
              Monitor reservation statuses. Confirmations are handled automatically via Stripe payments.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-brand-bg-card border border-brand-border px-4 py-2.5 rounded-xl text-xs text-brand-text-muted">
            <Info className="h-4 w-4 text-brand-accent" />
            <span>Payments auto-verify bookings. Admin can cancel reservations below.</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-brand-text-muted">Loading reservations...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-brand-text-muted">No reservations booked on the platform yet.</div>
        ) : (
          <div className="bg-brand-bg-card border border-brand-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-bg-deep/50 border-b border-brand-border text-xs font-bold tracking-wide uppercase text-brand-text-muted">
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Event</th>
                    <th className="p-4 text-center">Seats</th>
                    <th className="p-4 text-right">Revenue</th>
                    <th className="p-4 text-center">Payment Status</th>
                    <th className="p-4 text-center">Booking Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm text-brand-text-bright">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-brand-bg-deep/25 transition-colors">
                      <td className="p-4">
                        <p className="font-bold">{booking.userId?.name || 'Deleted User'}</p>
                        <p className="text-[11px] text-brand-text-muted">{booking.userId?.email || 'N/A'}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">{booking.eventId?.title || 'Unknown Event'}</p>
                        <p className="text-[11px] text-brand-text-muted">
                          {booking.eventId?.date ? new Date(booking.eventId.date).toLocaleDateString() : 'N/A'}
                        </p>
                      </td>
                      <td className="p-4 text-center font-mono font-bold">{booking.seatsBooked}</td>
                      <td className="p-4 text-right font-bold text-brand-accent">${booking.totalPrice}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.paymentStatus === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === 'confirmed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : booking.status === 'canceled'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {actioningId === booking._id ? (
                          <Loader className="h-4 w-4 animate-spin inline-block text-brand-accent" />
                        ) : (
                          <div className="flex justify-end">
                            {booking.status !== 'canceled' ? (
                              <button 
                                onClick={() => openCancelModal(booking._id)}
                                className="p-1.5 hover:bg-rose-500/10 text-rose-400 border border-transparent hover:border-rose-500/20 rounded-lg transition-all cursor-pointer"
                                title="Cancel Booking & Release Seats"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            ) : (
                              <span className="text-xs text-brand-text-muted italic pr-2">Canceled</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* TAILWIND CONFIRMATION MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-bg-card border border-brand-border w-full max-w-md rounded-2xl p-6 shadow-2xl scale-in transition-transform">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-text-bright">Confirm Cancellation</h3>
            </div>
            
            <p className="text-sm text-brand-text-muted mb-6 leading-relaxed">
              Are you sure you want to cancel this booking? This action will immediately return the allocated seats back to the event's available capacity.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setIsModalOpen(false); setSelectedBookingId(null); }}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-brand-border text-brand-text-muted hover:bg-brand-bg-deep transition-colors cursor-pointer"
              >
                Nevermind
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;