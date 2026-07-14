import express from 'express';
import { registerUser, verifyAccountOtp, loginUser, logoutUser, resendAccountOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyAccountOtp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/resend-otp', resendAccountOtp);

export default router;