const express = require('express');

const {upladProfilePhoto} = require('../controllers/users');

const router = express.Router();
const {protect} = require('../middleware/auth');
router.route('/:id/profilePhoto').put(protect, upladProfilePhoto);

module.exports = router;
