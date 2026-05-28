const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to sign JWTs
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d',
  });
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Simple validations
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Please enter your name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Please enter your email.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Please enter a password.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check duplicate user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Create user (triggers pre-save hashing hook)
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Registration server error:', err.message);
    return res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
};

// Authenticate a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validations
    if (!email || !email.trim() || !password) {
      return res.status(400).json({ message: 'Please enter both your email and password.' });
    }

    // Verify account existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // Verify password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Login server error:', err.message);
    return res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
