const mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  photo: {
    type: String
  },
  email: {
    type: String,
  },
  bio: {
    type: String
  },
  username: {
    type: String,
    index: true,
    trim: true,
    required: true,
    unique: true
  },
  posts : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  password: {
    type: String
  },
  registerId: {
    type: String
  },
  jwtToken :{
    type: String
  }
});

userSchema.createUser = (newUser, callback) => {
  newUser.save(callback);
};

userSchema.createPost = (username, newPost, callback) => {
  User.findOne({ username: username }).then((author) => {
    newPost._author = author._id
    author.posts.push(newPost);
    newPost.save().then((err, auth) => {
      if (err) throw err;

      author.save(callback);
    })
  })
}

userSchema.methods.getAuthorByPostTitle = (postTitle, callback) => {
  Post.findOne({ title: postTitle }).populate('_author').exec((err, post) => {
    if(err)
      throw err;
    else
      return posts;
  });
};

let User = mongoose.model('User', userSchema);

userSchema.plugin(uniqueValidator);
module.exports = User;
