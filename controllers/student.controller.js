import User from '../models/User.model.js';

// Get student profile
export const getProfile = async (req, res, next) => {
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

// Update student profile (limited fields)
export const updateProfile = async (req, res, next) => {
  try {
    const { name, mobile } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        rollno: user.rollno,
        mobile: user.mobile
      }
    });
  } catch (error) {
    next(error);
  }
};

