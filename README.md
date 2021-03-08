# medium
Backend of medium blogs

#database mongoDB Atlas
#Backend Nodejs
#Framework Expressjs

Article SCHEMA 
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


User SCHEMA
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    bio: String,

    image: String,

    favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],

    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

//Encrypt password using bcrypt js
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and return token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//match user entered password to hash password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

Comment SCHEMA
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
