import express from 'express';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    return res.json({ message: 'Invalid user data' });
  }
});

// Login User


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Generate the token and send it as a cookie
    generateToken(res, user._id); 

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


// Get User Profile (Protected Route)
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update User Profile
router.put('/profile', protect, async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name) {
    user.name = name;
  }

  if (currentPassword && newPassword) {
    if (await user.matchPassword(currentPassword)) {
      user.password = newPassword;
    } else {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }
  }

  try {
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(400);
    throw new Error('Error updating user');
  }
});

router.post('/logout', protect, (req, res) => {
  // Clear the JWT token stored in the cookies
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
    sameSite: 'strict',
    maxAge: 0, // Set maxAge to 0 to delete the cookie immediately
  });

  res.status(200).json({ message: 'Logged out successfully' });
});





export default router;
