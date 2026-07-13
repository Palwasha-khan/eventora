import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Event title is required'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Event description is required'] 
  },
  date: { 
    type: Date, 
    required: [true, 'Event date is required'] 
  },
  time: { 
    type: String, 
    required: [true, 'Event time is required'] 
  },
  location: { 
    type: String, 
    required: [true, 'Event location is required'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Ticket price is required'],
    default: 0 
  },
  totalSeats: { 
    type: Number, 
    required: [true, 'Total capacity seats are required'],
    min: [1, 'Event capacity must have at least 1 seat']
  },
  availableSeats: { 
    type: Number,
    required: true
  },
  image: { 
    type: String, 
    default: '' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

// Pre-validation hook: Automatically set available seats to equal total capacity during event creation
eventSchema.pre('validate', function() {
  if (this.isNew && this.totalSeats && this.availableSeats === undefined) {
    this.availableSeats = this.totalSeats;
  }
  
}); 
 
export default mongoose.model('Event', eventSchema);