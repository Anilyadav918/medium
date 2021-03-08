const express = require('express');

const {createUser, loginUser, getLoggedInUser} = require('../controllers/auth');

const router = express.Router();
const {protect} = require('../middleware/auth');
router.route('/register').post(createUser);
router.route('/login').post(loginUser);

router.route('/me').get(protect, getLoggedInUser);

module.exports = router;
