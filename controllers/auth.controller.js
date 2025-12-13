import User from '../models/User.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils.js';

// Student Registration
export const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, rollno, department, year, mobile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new student with pending status
    const student = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      rollno,
      department,
      year,
      mobile,
      role: 'student',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Registration submitted! Please wait for admin approval.',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        status: student.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// Student Login
export const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is a student
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Invalid login credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is approved
    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your registration is pending admin approval. Please wait!'
      });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact admin.'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          year: user.year,
          rollno: user.rollno,
          role: user.role,
          status: user.status
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin Login
export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin user (can be by username/email)
    const user = await User.findOne({
      $or: [
        { email: username.toLowerCase() },
        { name: username }
      ],
      role: 'admin'
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Access Token
export const refreshToken = async (req, res, next) => {
  try {
    const user = req.user;

    // Generate new tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    const user = req.user;

    // Remove refresh token
    user.refreshToken = null;
    await user.save();

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

