const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Database connection established directly
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err.message));

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Task routes (protected by auth inside taskRoutes)
app.use('/api/tasks', require('./routes/taskRoutes'));

// Basic health check route
app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

// Simple global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'An unexpected server error occurred.'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
