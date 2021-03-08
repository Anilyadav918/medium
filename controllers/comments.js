const Comment = require('../models/Comment');
const Article = require('../models/Article');
const HttpResponses = require('../config/HttpResponses');
const Util = require('../config/Util');

/**
 * @function createArticles
 *to create articles
 * @param {} req
 * @param {} res
 * @route POST /api/v1/comments
 * @access private
 * @param {string} req.body.comment
 */
exports.createComments = async (req, res, next) => {
  try {
    const comment = req.body.comment;
    const title = req.body.title;
    console.log(comment);
    if (!comment || !title) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Input field not set'));
    }

    const articleFromDb = await Article.findOne({title: title});

    if (articleFromDb) {
      const comments = await Comment.create({
        body: comment,
      });
      return res
        .status(201)
        .json(HttpResponses.Created(comments, 'Successfully created'));
    } else {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, `data does not exist`));
    }
  } catch (err) {
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};
