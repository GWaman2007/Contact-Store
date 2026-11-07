const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and extract authenticated user identity
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_me');
    req.user = decoded; // { userId: '...' }
    next();
  } catch (err) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: 'Token is invalid or expired.'
    });
  }
};
