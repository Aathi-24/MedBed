const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medbed_super_secret_key_2024');
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found or session expired' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Auth token error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = protect;
module.exports.protect = protect;
module.exports.requireRole = requireRole;
