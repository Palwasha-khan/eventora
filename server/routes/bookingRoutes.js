import express from 'express';
import { initiateBooking, confirmBooking, getMyBookings, getAllBookings, cancelBookingByAdmin, getAdminStats } from '../controllers/bookingController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
 
router.use(protect);

router.post('/initiate', initiateBooking);
router.post('/confirm', confirmBooking);
router.get('/my-bookings', getMyBookings);
router.get('/all-bookings',admin, getAllBookings);
router.get('/stats', protect, admin, getAdminStats);
router.put('/bookings/:id/cancel',admin, cancelBookingByAdmin);

export default router;