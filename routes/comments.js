const express = require('express');

const {createComments} = require('../controllers/comments');

const router = express.Router();

router.route('/').post(createComments);

module.exports = router;
