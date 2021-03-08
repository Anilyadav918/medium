const path = require('path');
const User = require('../models/User');
const HttpResponses = require('../config/HttpResponses');
const Util = require('../config/Util');
const jwt = require('jsonwebtoken');

/**
 * @function createUser
 *to register user
 * @param {} req
 * @param {} res
 * @route POST /api/v1/auth/register
 * @access public
 * @param {string} req.body.username
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @param {string} req.body.bio
 */
exports.createUser = async (req, res, next) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const bio = req.body.bio;
    if (!username || !email || !password || !bio) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Input field not set'));
    }

    const userFromDb = await User.findOne({email: email});

    if (Util.IsNullOrUndefined(userFromDb)) {
      const user = await User.create({
        username: username,
        email: email,
        password: password,
        bio: bio,
      });
      sendTokenResponse(user, 200, res);
      //create token
      //   const token = user.getSignedJwtToken();
      //   return res
      //     .status(201)
      //     .json(HttpResponses.Created({user, token}, 'Successfully created'));
    } else {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `User with this email ${email} already exist`,
          ),
        );
    }
  } catch (err) {
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};

/**
 * @function loginUser
 *to login user
 * @param {} req
 * @param {} res
 * @route POST /api/v1/auth/login
 * @access public
 * @param {string} req.body.email
 * @param {string} req.body.password
 */
exports.loginUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Input field not set'));
    }

    const user = await User.findOne({email: email}).select('+password');

    if (Util.IsNullOrUndefined(user)) {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(null, `User does exist for email ${email}`),
        );
    }
    //check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(null, 'Entered password is not correct'),
        );
    }
    //const token = user.getSignedJwtToken();
    sendTokenResponse(user, 200, res);
    //return res.status(200).json(HttpResponses.Ok(token, 'success'));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};

//get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({success: true, token});
};

/**
 * @function getLoggedInUser
 *to get current login user
 * @param {} req
 * @param {} res
 * @route POST /api/v1/auth/me
 * @access private

 */
exports.getLoggedInUser = async (req, res, next) => {
  try {
    // const id = req.user;
    // console.log(id);
    // process.exit();
    // if (!id) {
    //   return res
    //     .status(400)
    //     .json(HttpResponses.BadRequest(null, 'Input field not set'));
    // }
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (Util.IsNullOrUndefined(user)) {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `User does exist for id ${decoded.id}`,
          ),
        );
    }

    return res.status(200).json(HttpResponses.Ok(user, 'success'));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};
