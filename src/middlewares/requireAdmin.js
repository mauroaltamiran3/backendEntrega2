import { verifyToken } from '../utils.js';

export function requireAdmin(req, res, next) {
  if (req.isAuthenticated?.() && req.user?.role === 'admin') {
    return next();
  }

  // corroboar jwt en header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload?.user?.role === 'admin') {
      req.jwtUser = payload.user;
      req.user = req.jwtUser; 
      return next();
    }
  }

  // jwt en cookie
  const cookieToken = req.cookies.jwtCookie;
  if (cookieToken) {
    const payload = verifyToken(cookieToken);
    if (payload?.user?.role === 'admin') {
      req.jwtUser = payload.user;
      req.user = req.jwtUser; 
      return next();
    }
  }

  return res.status(403).json({ mensaje: 'Acceso restringido. Solo administradores.' });
}
