const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
}

async function getUserByEmail(req, res) {
  try {
    const targetedUser = await User.findOne({ email: req.params.email });
    if (targetedUser) {
      // Generate and send JWT
      const token = jwt.sign(
        { email: targetedUser.email },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400, // expires in 24 hours
        },
      );
      res.status(200).json({ user: targetedUser, token });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

async function addUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const targetUser = await User.findOne({ email });

    if (!targetUser) {
      const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
      });

      // Generate a JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return res.status(201).json({ newUser, token });
    }
    return res.status(400).json({ message: 'User already exists' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
}

async function editUser(req, res) {
  try {
    const { email } = req.params;
    const updatedUserData = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { ...updatedUserData },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ updatedUser, message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
}

async function deleteUser(req, res) {
  try {
    const { email } = req.params;

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
}

module.exports = {
  getAllUsers,
  addUser,
  editUser,
  deleteUser,
  getUserByEmail,
  loginUser,
};
