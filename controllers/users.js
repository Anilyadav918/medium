const path = require('path');
const User = require('../models/User');
const HttpResponses = require('../config/HttpResponses');
const Util = require('../config/Util');

/**
 * @function upladProfilePhoto
 *to uplaod a user profile Photo
 * @param {} req
 * @param {} res
 * @route PUT /api/v1/user/:id/profilePhoto
 * @access private
 * @param {string} req.file

 */
exports.upladProfilePhoto = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'Input field not set'));
    }
    const userFromDb = await User.findOne({_id: id});

    if (Util.IsNullOrUndefined(userFromDb)) {
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
      const updatedData = await User.findByIdAndUpdate(id, {
        image: file.name,
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
