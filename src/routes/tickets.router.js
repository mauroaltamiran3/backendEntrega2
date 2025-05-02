import express from 'express';
import Cart from '../models/Cart.js';
import Ticket from '../models/Ticket.js';
import Product from '../models/Product.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/api/tickets/:cid', isAuthenticated,  async (req, res) => {
  try {
    const { cid } = req.params;
    const carrito = await Cart.findById(cid).populate('products.product');

    if (!carrito || carrito.products.length === 0) {
      return res.status(404).json({ mensaje: 'Carrito vacío o no encontrado' });
    }

    for (const item of carrito.products) {
      const producto = item.product;
      const nuevaCantidad = producto.stock - item.quantity;

      if (nuevaCantidad < 0) {
        return res.json(400).json({ mensaje: `Stock insuficiente para el producto: ${producto.title}` })
      }

      await Product.findByIdAndUpdate(producto._id, {
        $set: { stock: nuevaCantidad }
      });
    }

    const total = carrito.products.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);

    const code = `TICKET-${Date.now()}`;

    const productosComprados = carrito.products.map(item => ({
      title: item.product.title,
      quantity: item.quantity
    }));
    console.log('📦 Creando ticket desde carrito:', carrito._id);

    if (!req.user || !req.user.email) {
      return res.status(401).json({ mensaje: 'No autenticado' });
    }

    const nuevoTicket = await Ticket.create({
      code,
      amount: total,
      purchaser: req.user.email,
      products: productosComprados,
      cartId: carrito._id
    });
    console.log('🎟️ Ticket creado:', nuevoTicket);

    await carrito.save();
    carrito.products = [];

    res.clearCookie('cid');
    const nuevoCarrito = await Cart.create({});
    res.cookie('cid', nuevoCarrito._id.toString(), { httpOnly: false });
    
    res.status(201).json({ ticketId: nuevoTicket._id });
  } catch (error) {
    res.status(500).json({
      mensaje: '❌ Error al generar ticket',
      detalles: error.message
    });
  }
});


export default router;
