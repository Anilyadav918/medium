const express = require('express');

const {
  getArticles,
  getArticle,
  createArticles,
  updateArticles,
  deleteArticles,
  upladPhoto,
} = require('../controllers/articles');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.route('/').get(getArticles).post(protect, createArticles);

router
  .route('/:id')
  .get(getArticle)
  .put(protect, updateArticles)
  .delete(protect, deleteArticles);

router.route('/:id/photo').put(protect, upladPhoto);

module.exports = router;
