const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
      
      // Fetch user and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User account not found. Please register or sign in again.' });
      }
      
      return next();
    } catch (err) {
      console.error('Token authentication failed:', err.message);
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No authentication token found. Access denied.' });
  }
};

module.exports = { protect };
