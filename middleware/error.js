const errorHandler = (err, req, res, next) => {
  //log to console for development
  //console.log(err.stack.red);
  const error = {...err};
  error.message = err.message;

  //Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with value of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //mongoose duplicate key error
  if (err.code === 1100) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }
  //mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error',
  });
};

module.exports = errorHandler;
