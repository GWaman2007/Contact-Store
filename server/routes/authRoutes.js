const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Helper to sign JWT tokens
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'secret_key_change_me',
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Name, email, and password are required.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        error: 'Conflict',
        message: 'User with this email already exists.'
      });
    }

    const user = new User({
      name: name.trim(),
      email: trimmedEmail,
      password: password
    });
    await user.save();

    const token = generateToken(user._id);

    return res.status(201).json({
      status: 201,
      message: 'User registered successfully',
      access_token: token,
      user: user.toClientJSON()
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Email and password are required.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      status: 200,
      message: 'Login successful',
      access_token: token,
      user: user.toClientJSON()
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: 'User no longer exists.'
      });
    }

    return res.status(200).json({
      status: 200,
      user: user.toClientJSON()
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

module.exports = router;
