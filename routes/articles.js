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

router.route('/').get(getArticles).post(createArticles);

router.route('/:id').get(getArticle).put(updateArticles).delete(deleteArticles);

router.route('/:id/photo').put(upladPhoto);

module.exports = router;
