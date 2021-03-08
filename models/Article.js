const mongoose = require('mongoose');
const slugify = require('slugify');

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    slug: {type: String, lowercase: true, unique: true},
    description: {
      type: String,
      required: [true, 'Please add a decription'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    body: {
      type: String,
      required: true,
    },
    favoritesCount: {type: Number, default: 0},

    tagList: [{type: String}],

    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],

    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

//Create Article slug from the name
ArticleSchema.pre('save', function (next) {
  this.slug = slugify(this.title, {lower: true});
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);
