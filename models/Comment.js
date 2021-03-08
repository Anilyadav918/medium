const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },

    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'},

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Comment', CommentSchema);
