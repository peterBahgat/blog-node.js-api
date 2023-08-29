const Post = require('../models/PostModel');

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().populate('author', 'fullName email');
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' }, err);
  }
}

async function addPost(req, res) {
  try {
    const newPost = await Post.create(req.body);
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred', err });
  }
}

async function editPost(req, res) {
  try {
    const { id } = req.params;
    const updatedPostData = req.body;

    const updatedPost = await Post.findByIdAndUpdate(id, updatedPostData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred', err });
  }
}

async function getPostsByUser(req, res) {
  try {
    const userId = req.params.userId;

    // Find all posts by the given user ID
    const posts = await Post.find({ author: userId }).populate(
      'author',
      'fullName email',
    );

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
}

module.exports = { getAllPosts, addPost, editPost, deletePost, getPostsByUser };
