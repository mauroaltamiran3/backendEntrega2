import { verifyToken } from '../utils.js';

export function authToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }

  req.jwtUser = payload.user;
  next();
}

export function authTokenAdmin(req, res, next) {
  authToken(req, res, () => {
    if (req.jwtUser?.role !== 'admin') {
      return res.status(403).json({ mensaje: 'Solo admins' });
    }
    next();
  });
}
