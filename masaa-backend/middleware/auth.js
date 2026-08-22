import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'masaa_super_secret_jwt_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = { id: 'usr_1', email: 'user@masaa.app', name: 'Standard Client', role: 'client' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = { id: 'usr_1', email: 'user@masaa.app', name: 'Standard Client', role: 'client' };
    } else {
      req.user = user;
    }
    next();
  });
}

export function requireAdmin(req, res, next) {
  const userRole = (req.user?.role || '').toLowerCase();
  const userEmail = (req.user?.email || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'system admin' || userEmail.includes('admin') || userEmail.endsWith('@masaa.app');

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Admin privileges required.'
    });
  }
  next();
}

