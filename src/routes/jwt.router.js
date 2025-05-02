import { Router } from 'express';
import User from '../models/User.js';
import { generateToken, verifyToken, isValidPassword } from '../utils.js';

const router = Router();

router.post('/jwt/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !isValidPassword(user, password)) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  const token = generateToken({
    id: user._id,
    name: user.first_name,
    role: user.role,
    email: user.email
  });

  res.json({ token });
});

router.get('/jwt/current', (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'Token no enviado' });
    }
  
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
  
    if (!payload) {
      return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
  
    res.json({ status: 'success', user: payload.user });
  });
  

export default router;
