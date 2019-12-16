const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  universalQuery: {
    type: String
  },
  title: {
    type: String
  },
  body: {
    type: String
  },
  photo: {
    type: String
  },
  date: {
    type: Date
  },
  tags: [{
    type: String
  }],
  _author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  _authorName: {
    type: String
  }
})

postSchema.getPostsByAuthorId = (authorId, callback) => {
  Post.find({_author: authorId}).exec((err, posts) => {
    if(err)
      throw err;
    else
      return posts;
  });
};

let Post = mongoose.model('Post', postSchema);

module.exports = Post;
