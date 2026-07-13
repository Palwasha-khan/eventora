import express from 'express';
import { initiateBooking, confirmBooking, getMyBookings } from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
 
router.use(protect);

router.post('/initiate', initiateBooking);
router.post('/confirm', confirmBooking);
router.get('/my-bookings', getMyBookings);

export default router;