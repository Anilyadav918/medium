const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HttpResponses = require('../config/HttpResponses');
const Util = require('../config/Util');

//protect routes
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  //make sure token exists
  if (!token) {
    return res
      .status(401)
      .json(
        HttpResponses.UnAuthorized(null, 'Not authorised to access this route'),
      );
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};
