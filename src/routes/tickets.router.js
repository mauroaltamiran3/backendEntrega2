import express from 'express';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import { processPurchase } from '../services/ticketService.js';
import { createCart } from '../services/cartService.js';

const router = express.Router();

router.post('/api/tickets/:cid', handlePolicies(['USER', 'ADMIN']), async (req, res) => {
  try {
    const user = req.user || req.jwtUser;
    if (!user || !user.email) {
      return res.status(401).json({ mensaje: 'No autenticado' });
    }
    
    const { cid } = req.params;
    const resultado = await processPurchase(cid, user.email);

    if (resultado.error) {
      return res.status(400).json({ mensaje: resultado.error });
    }

    res.clearCookie('cid');
    const nuevoCarrito = await createCart();
    res.cookie('cid', nuevoCarrito._id.toString(), { httpOnly: false });

    res.status(201).json({ ticketId: resultado.ticket._id });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al generar ticket', detalles: error.message });
  }
});

export default router;