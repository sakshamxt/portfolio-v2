import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public (ONLY FOR FIRST TIME SETUP)
const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  // IMPORTANT: Add a check to allow only one user registration
  const userExists = await User.findOne();
  if (userExists) {
    return res.status(400).json({ message: 'Admin user already exists. Cannot register another.' });
  }

  if (!email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const user = await User.create({
    email,
    password, // Password will be hashed by the pre-save hook in the model
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};


// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};


export { registerAdmin, loginUser };