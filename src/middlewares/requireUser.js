import { verifyToken } from '../utils.js';

export function requireUser(req, res, next) {
  //  session
  if (req.isAuthenticated?.() && req.user?.email) return next();

  // JWT Header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload?.user?.email) {
      req.jwtUser = payload.user;
      req.user = req.jwtUser; 
      return next();
    }
  }

  // JWT Cookie
  const jwtFromCookie = req.cookies.jwtCookie;
  if (jwtFromCookie) {
    const payload = verifyToken(jwtFromCookie);
    if (payload?.user?.email) {
      req.jwtUser = payload.user;
      req.user = req.jwtUser; 
      return next();
    }
  }

  return res.status(401).json({ mensaje: 'Usuario no autenticado' });
}
