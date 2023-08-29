const express = require('express');
const {
  getAllPosts,
  addPost,
  editPost,
  deletePost,
  getPostsByUser,
} = require('../controllers/postsControllers.js');

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', addPost);
router.put('/:id', editPost);
router.delete('/:id', deletePost);
router.get('/user/:userId', getPostsByUser);

module.exports = router;
