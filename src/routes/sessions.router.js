import { Router } from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/auth.js';

const router = Router();

// Registro
router.post('/register', passport.authenticate('register', {
  successRedirect: '/login?registro=ok',
  failureRedirect: '/register?error=registro'
}));

router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login?error=login'
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect('/login'); // o cualquier página pública
  });
});

// Usuario actual autenticado
router.get('/current', (req, res) => {
  if (!req.user) return res.status(401).send('No autenticado');
  res.send({
    status: 'success',
    user: {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      role: req.user.role
    }
  });
});

router.post('/setadmin', isAuthenticated, async (req, res) => {
  try {
    req.user.role = 'admin';
    await req.user.save();
    res.redirect('/?admin=ok');
  } catch (error) {
    res.status(500).send('❌ No se pudo cambiar el rol.');
  }
});

router.post('/setuser', isAuthenticated, async (req, res) => {
  try {
    req.user.role = 'user';
    await req.user.save();
    res.redirect('/?user=ok');
  } catch (error) {
    res.status(500).send('❌ No se pudo cambiar el rol.');
  }
});

// Rutas auxiliares
router.get('/success', (req, res) => res.send('✅ Operación exitosa'));
router.get('/failregister', (req, res) => res.send('❌ Falló el registro'));
router.get('/faillogin', (req, res) => res.send('❌ Falló el login'));

// Iniciar auth con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback desde GitHub
router.get('/githubcallback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

export default router;