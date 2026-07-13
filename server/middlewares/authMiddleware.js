import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect Routes - Verifies the User is Logged In
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from Bearer string
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user profile from database, excluding the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found, authorization denied.' });
      }

      // Check if user account has completed OTP activation
      if (!req.user.isVerified) {
        return res.status(403).json({ success: false, message: 'Account not verified. Please complete OTP verification.' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Session expired or token invalid.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No authorization token provided.' });
  }
};
 
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Administrative privileges required.' });
  }
};