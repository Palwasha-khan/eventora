import Event from '../models/Events.js';
 
// @route   POST /api/events
export const createEvent = async (req, res) => {
  const { title, description, date, time, location, price, totalSeats, image } = req.body;

  try {
    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      price,
      totalSeats, 
      image,
      createdBy: req.user._id 
    });

    return res.status(201).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
 
// @route   GET /api/events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate('createdBy', 'name email');
    return res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
 
// @route   GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
 
// @route   PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
 
    if (req.body.totalSeats) {
      const seatsBookedSoFar = event.totalSeats - event.availableSeats;
      req.body.availableSeats = req.body.totalSeats - seatsBookedSoFar;
      
      if (req.body.availableSeats < 0) {
        return res.status(400).json({ success: false, message: 'Cannot scale down total seats below current booked quantity.' });
      }
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
 
// @route   DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    await event.deleteOne();
    return res.status(200).json({ success: true, message: 'Event removed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

