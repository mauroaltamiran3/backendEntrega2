export function handlePolicies(permittedRoles = []) {
  return (req, res, next) => {
    const user = req.user || req.jwtUser;

    if (!user || !user.role) {
      return res.status(403).json({ mensaje: 'Acceso denegado. No autenticado' });
    }

    const userRole = user.role.toUpperCase();
    const allowedRoles = permittedRoles.map(role => role.toUpperCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ mensaje: `Acceso denegado. Rol requerido: ${allowedRoles.join(', ')}` });
    }

    next();
  };
}