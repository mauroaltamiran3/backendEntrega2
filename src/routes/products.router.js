import express from 'express';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import {
  getAllProducts,
  createProduct,
  updateProductStock,
  deleteProductById
} from '../services/productService.js';

const router = express.Router();

router.get('/api/products', handlePolicies(['ADMIN']), async (req, res) => {
  try {
    const productos = await getAllProducts();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al obtener productos', detalles: error.message });
  }
});

router.post('/api/products', handlePolicies(['ADMIN']), async (req, res) => {
  try {
    const resultado = await createProduct(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ mensaje: '❌ Error al crear producto', detalles: error.message });
  }
});

router.patch('/api/products/:pid/stock', handlePolicies(['ADMIN']), async (req, res) => {
  try {
    const producto = await updateProductStock(req.params.pid, req.body.operacion);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al actualizar stock', detalles: error.message });
  }
});

router.delete('/api/product/:pid', handlePolicies(['ADMIN']), async (req, res) => {
  try {
    const eliminado = await deleteProductById(req.params.pid);
    if (!eliminado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al eliminar producto', detalles: error.message });
  }
});

export default router;