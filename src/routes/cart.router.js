import express from 'express';
import {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  clearCart,
  updateCartProducts,
  updateProductQuantity,
  incrementProductQuantity,
  decrementProductQuantity,
  validateCartProducts
} from '../services/cartService.js';

const router = express.Router();

router.post('/api/carts', async (req, res) => {
  try {
    const carrito = await createCart(res);
    res.status(201).json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al crear el carrito', detalles: error.message });
  }
});

router.get('/api/carts/:cid', async (req, res) => {
  try {
    const carrito = await getCartById(req.params.cid);
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al encontrar el carrito', detalles: error.message });
  }
});

router.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const carrito = await addProductToCart(req.params.cid, req.params.pid);
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al agregar producto al carrito', detalles: error.message });
  }
});

router.delete('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const carrito = await removeProductFromCart(req.params.cid, req.params.pid);
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al eliminar el producto del carrito', detalles: error.message });
  }
});

router.delete('/api/carts/:cid', async (req, res) => {
  try {
    const resultado = await clearCart(req.params.cid);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al vaciar el carrito', detalles: error.message });
  }
});

router.put('/api/carts/:cid', async (req, res) => {
  try {
    const resultado = await updateCartProducts(req.params.cid, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al actualizar el carrito', detalles: error.message });
  }
});

router.put('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const carrito = await updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al actualizar la cantidad del producto', detalles: error.message });
  }
});

router.patch('/api/carts/:cid/product/:pid/increment', async (req, res) => {
  try {
    const carrito = await incrementProductQuantity(req.params.cid, req.params.pid);
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al incrementar', detalles: error.message });
  }
});

router.patch('/api/carts/:cid/product/:pid/decrement', async (req, res) => {
  try {
    const carrito = await decrementProductQuantity(req.params.cid, req.params.pid);
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al disminuir', detalles: error.message });
  }
});

router.get('/api/carts/:cid/validate', async (req, res) => {
  try {
    const resultado = await validateCartProducts(req.params.cid);
    res.status(resultado.valido ? 200 : 400).json(resultado);
  } catch (error) {
    res.status(500).json({ valido: false, mensaje: 'Error al validar carrito' });
  }
});

export default router;