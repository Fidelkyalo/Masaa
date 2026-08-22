import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'masaa_super_secret_jwt_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo/prototype convenience, attach default fallback session if no token
    req.user = { id: 'usr_1', email: 'fidel@masaa.app', name: 'Fidel Kyalo', role: 'System Admin' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = { id: 'usr_1', email: 'fidel@masaa.app', name: 'Fidel Kyalo', role: 'System Admin' };
    } else {
      req.user = user;
    }
    next();
  });
}
