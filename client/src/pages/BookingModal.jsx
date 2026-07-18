import React, { useState } from 'react';
import { X, Loader2, Ticket, ShieldCheck, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const BookingModal = ({ event, onClose, onBookingSuccess }) => {
  const [step, setStep] = useState(1); // Step 1: Seats Selection, Step 2: OTP Verification, Step 3: Success
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [otpCode, setOtpCode] = useState('');
  
  const [bookingId, setBookingId] = useState(null);
  const [testOtp, setTestOtp] = useState(''); // Holds the test code returned by backend for easy copying
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Submit Initial Request to Initiate Route
  const handleInitiateBooking = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('/bookings/initiate', {
        eventId: event._id,
        seatsBooked: Number(seatsBooked)
      });

      if (response.data?.success) {
        setBookingId(response.data.bookingId);
        // Save the test code so you don't necessarily have to check your terminal log or email console during local testing
        setTestOtp(response.data.testOtpCode || ''); 
        setStep(2); // Progress to OTP Verification screen
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize booking.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit OTP to Confirm Route
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/bookings/confirm', {
        bookingId,
        otpCode
      });

      if (response.data?.success) {
        setStep(3); // Success Screen reached
        if (onBookingSuccess) onBookingSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-brand-bg-card border border-brand-border w-full max-w-md rounded-2xl p-6 relative shadow-2xl text-brand-text-main">
        
        {/* Close Button */}
        {step !== 3 && (
          <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-muted hover:text-brand-text-bright transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        )}

        {/* STEP 1: SELECT SEATS */}
        {step === 1 && (
          <form onSubmit={handleInitiateBooking} className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-brand-text-bright">Reserve Your Spot</h3>
              <p className="text-xs text-brand-text-muted mt-0.5 line-clamp-1">Event: {event.title}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">Number of Seats</label>
              <div className="relative">
                <Ticket className="absolute left-4 top-3 h-4 w-4 text-brand-text-muted" />
                <input
                  type="number"
                  min="1"
                  max={event.availableSeats}
                  value={seatsBooked}
                  onChange={(e) => setSeatsBooked(e.target.value)}
                  className="w-full bg-brand-bg-deep border border-brand-border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                  required
                />
              </div>
              <p className="text-[11px] text-brand-text-muted mt-1.5 font-medium">
                Price per seat: <span className="text-brand-text-bright">${event.price}</span> | Available: {event.availableSeats}
              </p>
            </div>

            <div className="pt-2 border-t border-brand-border/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-text-muted block">Total Price</span>
                <span className="text-base font-black text-emerald-400">${event.price * seatsBooked}</span>
              </div>
              <button
                type="submit"
                disabled={loading || event.availableSeats === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-40"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Proceed to Checkout'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <form onSubmit={handleConfirmBooking} className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-brand-text-bright">Security Verification</h3>
              <p className="text-xs text-brand-text-muted mt-0.5">Enter the security code issued to complete purchase validation.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}
 

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-text-bright mb-2">OTP Verification Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-3 h-4 w-4 text-brand-text-muted" />
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full font-mono tracking-widest text-center bg-brand-bg-deep border border-brand-border rounded-xl py-2.5 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-bg-deep text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Order Payment'}
            </button>
          </form>
        )}

        {/* STEP 3: TRANSACTION SUCCESS SUMMARY */}
        {step === 3 && (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-text-bright">Seats Successfully Reserved!</h3>
              <p className="text-xs text-brand-text-muted mt-1">Your payment simulation was processed and slots are committed.</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-brand-bg-deep hover:bg-brand-bg-deep/80 border border-brand-border rounded-xl text-xs font-bold text-brand-text-bright transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingModal;