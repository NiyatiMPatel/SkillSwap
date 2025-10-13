import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
export const signup = async (req, res) => {
  try {
    const { email, mobile, password, name } = req.body;

    // Validation
    if (!email && !mobile) {
      return res.status(400).json({
        message: 'Please provide email or mobile number',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or mobile',
      });
    }

    // Create user
    const user = await User.create({
      name: name || 'User',
      email,
      mobile,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: error.message || 'Error creating user',
    });
  }
};

/**
 * @route   POST /api/auth/signin
 * @desc    Authenticate user and get token
 * @access  Public
 */
export const signin = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    // Validation
    if (!email && !mobile) {
      return res.status(400).json({
        message: 'Please provide email or mobile number',
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Please provide password',
      });
    }

    // Find user and include password
    const user = await User.findOne({
      $or: [{ email }, { mobile }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Signed in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        bio: user.bio,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      message: error.message || 'Error signing in',
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        bio: user.bio,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching user',
    });
  }
};
