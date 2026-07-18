import Booking from '../models/Booking.js';
import Event from '../models/Events.js';
import generateOtp from '../utils/generateOtp.js';
import { sendBookingVerificationEmail } from '../utils/email.js'; 
 
// @route   POST /api/bookings/initiate
export const initiateBooking = async (req, res) => {
  const { eventId, seatsBooked } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Specified event not found.' });
    }
 
    if (event.availableSeats < seatsBooked) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient seats available. Only ${event.availableSeats} remaining.` 
      });
    }

    const totalPrice = event.price * seatsBooked;

    const bookingOtp = generateOtp();
    const bookingOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 Minute validation window
 
    const booking = await Booking.create({
      eventId,
      userId: req.user._id,
      seatsBooked,
      totalPrice,
      status: 'pending_otp',
      bookingOtpCode: bookingOtp,
      bookingOtpExpires,
      paymentStatus: 'unpaid'
    });
 
    try {
      await sendBookingVerificationEmail(req.user.email, req.user.name, event.title, seatsBooked, bookingOtp);
    } catch (mailErr) {
      console.error("⚠️ Booking OTP email failed to send:", mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Booking initialized. Please confirm using the OTP code sent to your email.',
      bookingId: booking._id,
      testOtpCode: bookingOtp 
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Confirm Booking via OTP & Deduct Event Seats
// @route   POST /api/bookings/confirm
export const confirmBooking = async (req, res) => {
  const { bookingId, otpCode } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not located.' });
    }

    if (booking.status !== 'pending_otp') {
      return res.status(400).json({ success: false, message: 'This booking has already been processed.' });
    }

    if (booking.bookingOtpCode !== otpCode || new Date() > booking.bookingOtpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired transaction security OTP.' });
    }

    const event = await Event.findById(booking.eventId);
    if (!event || event.availableSeats < booking.seatsBooked) {
      booking.status = 'canceled';
      await booking.save();
      return res.status(400).json({ success: false, message: 'Event seats are no longer available.' });
    }

    event.availableSeats -= booking.seatsBooked;
    await event.save();
 
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.transactionId = 'txn_' + Math.random().toString(36).substr(2, 9).toUpperCase(); // Simulated payment gateway ID
    booking.bookingOtpCode = null;
    booking.bookingOtpExpires = null;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking confirmed and seats successfully reserved!',
      data: booking
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
 
// @route   GET /api/bookings/my-bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('eventId');
    return res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('eventId', 'title date location price')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBookingByAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not located.' });
    }

    if (booking.status === 'canceled') {
      return res.status(400).json({ success: false, message: 'This booking is already canceled.' });
    }

    const event = await Event.findById(booking.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Associated event not found.' });
    }

    // Since we are canceling, return the booked seats back to the event
    event.availableSeats += booking.seatsBooked;
    await event.save();

    // Mark status as canceled
    booking.status = 'canceled';
    booking.paymentStatus = 'unpaid'; // Or 'refunded' if you handle Stripe refunds
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking successfully canceled and seats have been returned to the event capacity.',
      data: booking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};