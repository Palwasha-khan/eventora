import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seatsBooked: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending_otp', 'confirmed', 'canceled'], 
    default: 'pending_otp' 
  },
  bookingOtpCode: { type: String, default: null },
  bookingOtpExpires: { type: Date, default: null },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid', 'refunded'], 
    default: 'unpaid' 
  },
  transactionId: { type: String, default: null }
}, { timestamps: true });

export default  mongoose.model('Booking', bookingSchema);
 