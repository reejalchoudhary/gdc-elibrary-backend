export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

export const isStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Student privileges required.'
    });
  }

  if (req.user.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending approval. Please wait for admin approval.'
    });
  }

  next();
};

export const isApproved = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role === 'student' && req.user.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending approval. Please wait for admin approval.'
    });
  }

  next();
};





