import { verifyToken } from '../utils.js';

export function extractUser(req, res, next) {
  if (req.isAuthenticated?.() && req.user?.email) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload?.user?.email) {
      req.user = payload.user;
      return next();
    }
  }

  const cookieToken = req.cookies.jwtCookie;
  if (cookieToken) {
    const payload = verifyToken(cookieToken);
    if (payload?.user?.email) {
      req.user = payload.user;
      return next();
    }
  }

  return res.status(401).json({ mensaje: 'Usuario no autenticado' });
}