const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  photo: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  bio: {
    type: String
  },
  username: {
    type: String,
    index: true
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
  Author.findOne({ username: username }).then((author) => {
    newPost._author = author._id
    author.posts.push(newPost);
    newPost.save().then((err, auth) => {
      if (err)
      throw err;

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

module.exports = User;
