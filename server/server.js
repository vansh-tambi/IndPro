const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS setup supporting CLIENT_URL environment variables in production
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Database connection with graceful retry loop (useful on Render/Atlas startup latency)
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';

const connectDB = () => {
  console.log('Connecting to MongoDB database...');
  mongoose.connect(mongoURI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => {
      console.error('MongoDB connection error, retrying in 5 seconds:', err.message);
      setTimeout(connectDB, 5000);
    });
};

connectDB();

// API Endpoint Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

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
