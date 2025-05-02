export function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect('/login');
  }
  
  export function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') return next();
    return res.status(403).send('🚫 Acceso solo para administradores');
  }
  