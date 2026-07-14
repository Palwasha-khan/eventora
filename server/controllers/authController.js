import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import generateOtp from '../utils/generateOtp.js';
import { sendAccountVerificationEmail } from '../utils/email.js';
 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
 
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email address already registered.' });
    }
 
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user (password will be automatically hashed via User schema pre-save hook)
    const user = await User.create({
      name,
      email,
      password, 
      otpCode: otp,
      otpExpires
    });
 
   try {
      await sendAccountVerificationEmail(user.email, user.name, otp);
    } catch (mailError) {
      console.error("⚠️ Mail failed to send but user was created:", mailError.message);
      // Don't crash the whole response if email fails during testing, let them know!
      return res.status(201).json({
        success: true,
        message: 'Registration successful but email failed to send. Check console log for code.',
        testOtpCode: otp // Sending it back for easy manual testing
      });
    }
    res.status(201).json({
      success: true,
      message: 'Registration successful. An OTP code has been dispatched to your email address.'
    });
  } catch (error) {

    console.error("❌ Actual Database or Schema Error captured:", error.message); res.status(500).json({ success: false, message: error.message });
  }
};
 
// @route   POST /api/auth/verify-otp
export const verifyAccountOtp = async (req, res) => {
  const { email, otp } = req.body;

  const Otp = Number(otp);
   try {
    const user = await User.findOne({ email});

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not located.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Account is already verified.' });
    }

  if (String(user.otpCode) !== String(otp) || new Date() > user.otpExpires) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP verification code.' });
  }
 
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ success: false, message: 'expired OTP verification code...' });
    }
     if (user.otpCode != Otp) {
      return res.status(400).json({ success: false, message: 'Invalid  OTP verification code...' });
    }
 
    user.isVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account verified successfully. You may now log in.',
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/auth/resend-otp
export const resendAccountOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not located...' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'This account is already verified.' });
    }
    const newOtp = generateOtp();
    user.otpCode = newOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendAccountVerificationEmail(user.email, user.name, newOtp);
    } catch (mailError) {
      console.error("⚠️ Mail failed to send during resend:", mailError.message);
      return res.status(200).json({
        success: true,
        message: 'New OTP generated, but email failed to send. Check backend logs.',
        testOtpCode: newOtp 
      });
    }

    res.status(200).json({
      success: true,
      message: 'A fresh OTP verification code has been dispatched to your email.'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

   if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Account not verified. Please verify your email via OTP.' });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/auth/logout
export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: 'Logout successful. Please delete your token on the client side.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 