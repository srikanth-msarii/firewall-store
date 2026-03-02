import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectAdmin = async (req, res, next) => {
  let token;

  // Check for "Bearer <token>" in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin user from token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || (!req.user.isAdmin && (!req.user.permissions || req.user.permissions.length === 0))) {
        return res.status(401).json({ message: 'Not authorized, not an admin or staff' });
      }

      next(); // User is an admin or staff, proceed
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check for specific permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.user && (req.user.isAdmin || (req.user.permissions && req.user.permissions.includes(permission)))) {
      next();
    } else {
      res.status(403).json({ message: `Not authorized, requires ${permission} permission` });
    }
  };
};

export { protectAdmin, checkPermission };