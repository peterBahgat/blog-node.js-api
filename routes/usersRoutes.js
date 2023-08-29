const express = require('express');
const {
  getAllUsers,
  addUser,
  editUser,
  deleteUser,
  getUserByEmail,
  loginUser,
} = require('../controllers/usersController.js');
const authenticateToken = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Public routes
router.post('/', addUser); // Add a new user
router.post('/login', loginUser); // User login route (no authentication required)

// Protected routes
router.use(authenticateToken); // Apply authentication middleware to all routes below

router.get('/', getAllUsers); // Fetch all users
router.get('/:email', getUserByEmail); // Fetch user by email
router.put('/:email', editUser); // Edit user data
router.delete('/:email', deleteUser); // Delete user account

module.exports = router;
