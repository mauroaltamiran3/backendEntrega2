import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Obtener todos los productos
router.get('/api/products', async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: '❌ Error al obtener productos de la base de datos',
      detalles: error.message
    });
  }
});

// Crear un nuevo producto
router.post('/api/products', async (req, res) => {
  try {
    const resultado = await Product.create(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('❌ Error al crear producto:', error.message);
    res.status(400).json({
      mensaje: '❌ Error al crear producto. Verificá los campos requeridos.',
      detalles: error.message
    });
  }
});

router.patch('/api/products/:pid/stock', async (req, res) => {
  try {
    const { pid } = req.params;
    const { operacion } = req.body;

    const producto = await Product.findById(pid);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    if (operacion === 'incrementar') {
      producto.stock += 1;
    } else if (operacion === 'reducir' && producto.stock > 0) {
      producto.stock -= 1;
    }

    await producto.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ mensaje: '❌ Error al actualizar stock', detalles: error.message });
  }
});

router.delete('/api/product/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const eliminado = await Product.findByIdAndDelete(pid);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({
      mensaje: '❌ Error al eliminar el producto',
      detalles: error.message
    });
  }
});

export default router;