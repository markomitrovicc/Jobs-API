const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  const customError = {
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg : err.message || "Something went wrong, please try again later..."
  };
  
  if (err.code || err.code === 11000) {
    customError.msg = `Duplicate value for ${Object.keys(err.keyValue)} field. Please try another value.`,
    customError.statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map(item => item.message ).join(', '),
      customError.statusCode = 400
  }

  if (err.name === 'CastError') {
    customError.msg = 'No user with that id',
    customError.statusCode = 404
  }

  // return res.status(500).json({err});
  return res.status(customError.statusCode).json({ msg : customError.msg });
}

module.exports = errorHandlerMiddleware
