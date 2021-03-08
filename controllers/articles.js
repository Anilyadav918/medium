const path = require('path');
const Article = require('../models/Article');
const HttpResponses = require('../config/HttpResponses');
const Util = require('../config/Util');

/**
 * @function createArticles
 *to create articles
 * @param {} req
 * @param {} res
 * @route POST /api/v1/articles
 * @access private
 * @param {string} req.body.title
 * @param {string} req.body.description
 */
exports.createArticles = async (req, res, next) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const body = req.body.body;
    if (!title || !description || !body) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Input field not set'));
    }
    const articleFromDb = await Article.findOne({title: title});

    if (Util.IsNullOrUndefined(articleFromDb)) {
      const article = await Article.create({
        title: title,
        description: description,
        body: body,
      });
      return res
        .status(201)
        .json(HttpResponses.Created(article, 'Successfully created'));
    } else {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `Article with this name ${title} already exist`,
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
 * @function getArticles
 *to get all articles
 * @param {} req
 * @param {} res
 * @route GET /api/v1/articles
 * @access public
 */
exports.getArticles = async (req, res, next) => {
  try {
    let query;
    //copy req.query

    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in|nin|or|and)\b/g,
      (match) => `$${match}`,
    );
    //finding resources
    query = Article.find(JSON.parse(queryStr));

    //select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select('_id title description body slug photo ');
    }
    //const articles1 = await query;
    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Article.countDocuments();

    const numPages = Math.ceil(total / limit);

    query = query.skip(startIndex).limit(limit);

    //executing query
    const articles = await query;

    //pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    res.status(200).json({
      success: true,
      count: articles.length,
      pagination: pagination,
      numPages,
      data: articles,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/**
 * @function getArticle
 *to get a article
 * @param {} req
 * @param {} res
 * @route GET /api/v1/articles/:id
 * @access public
 */
exports.getArticle = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Input field not set'));
    }
    const articleFromDb = await Article.findOne({_id: id});

    if (!Util.IsNullOrUndefined(articleFromDb)) {
      return res
        .status(200)
        .json(HttpResponses.Ok(articleFromDb, 'Successfully fetched'));
    } else {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `Article with this id ${id} does not exist`,
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
 * @function updateArticles
 *to update articles
 * @param {} req
 * @param {} res
 * @route PUT /api/v1/articles/:id
 * @access private
 * @param {string} req.params.id
 
 */
exports.updateArticles = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Input field not set'));
    }
    const articleFromDb = await Article.findOne({_id: id});

    if (!Util.IsNullOrUndefined(articleFromDb)) {
      const updatedArticle = await Article.findOneAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      return res
        .status(200)
        .json(HttpResponses.Ok(updatedArticle, 'Successfully fetched'));
    } else {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `Article with this id ${id} does not exist`,
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
 * @function deleteArticles
 *to delete articles
 * @param {} req
 * @param {} res
 * @route DELETE /api/v1/articles/:id
 * @access private
 * @param {string} req.params.id

 */
exports.deleteArticles = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Input field not set'));
    }
    const articleFromDb = await Article.findOne({_id: id});

    if (!Util.IsNullOrUndefined(articleFromDb)) {
      const deletedArticle = await Article.findByIdAndDelete(id);
      return res
        .status(200)
        .json(HttpResponses.Ok(deletedArticle, 'Successfully deleted'));
    } else {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `Article with this id ${id} does not exist`,
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
 * @function upladPhoto
 *to uplaod Photo
 * @param {} req
 * @param {} res
 * @route PUT /api/v1/articles/:id/photo
 * @access private
 * @param {string} req.file

 */
exports.upladPhoto = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Input field not set'));
    }
    const articleFromDb = await Article.findOne({_id: id});

    if (Util.IsNullOrUndefined(articleFromDb)) {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `Article with this id ${id} does not exist`,
          ),
        );
    }

    if (!req.files) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Please select a file'));
    }
    const file = req.files.file;

    //Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'please upload a valid image'));
    }
    //check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `please upload a file with less than ${MAX_FILE_UPLOAD}`,
          ),
        );
    }
    //create custom file name
    file.name = `photo_${id}${path.parse(file.name).ext}`;

    //upload file
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json(
            HttpResponses.InternalServerError(
              err.message,
              'something went wrong in file upload process',
            ),
          );
      }
      const updatedData = await Article.findByIdAndUpdate(id, {
        photo: file.name,
      });
      return res
        .status(200)
        .json(HttpResponses.Ok(updatedData, 'successfully updloaded'));
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};
