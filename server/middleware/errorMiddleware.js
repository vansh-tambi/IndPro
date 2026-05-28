const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose CastError (e.g., invalid ObjectId format)
  if (err.name === 'CastError') {
    message = 'Resource not found (invalid ID format)';
    statusCode = 400;
  }

  // Handle Mongoose duplicate key error (e.g., registration with existing email)
  if (err.code === 11000) {
    message = 'Duplicate entry detected (field must be unique)';
    statusCode = 400;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    statusCode = 400;
  }

  console.error(`[Error Middleware] ${message}`);
  if (statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
