import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

router.post('/api/carts', async (req,res) => {
    try {
        const carrito = await Cart.create({})
        res.cookie('cid', carrito._id.toString(), { httpOnly: false });
        res.status(201).json(carrito);
      } catch (error) {
        res.status(500).json({
          mensaje: '❌ Error al crear el carrito',
          detalles: error.message
        });
      }
});

router.get('/api/carts/:cid', async (req,res) => {
    try{
        const carrito = await Cart.findById(req.params.cid);

        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json(carrito);
    } catch(error) {
        res.status(500).json({
          mensaje: '❌ Error al encontrar el carrito',
          detalles: error.message
        });
    }
});

router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
      const {cid, pid} = req.params;

      const carrito = await Cart.findById(cid);
      if (!carrito) {
        return res.status(404).json({ mensaje: 'Carrito no encontrado' });
      }

      const productoEnCarrito = carrito.products.find(p =>p.product.toString() === pid);

      if(productoEnCarrito) {
        productoEnCarrito.quantity += 1;
      } else {
        carrito.products.push({
            product: pid,
            quantity: 1
        });
      }

      await carrito.save();
      res.status(200).json(carrito);

    } catch (error) {
      res.status(500).json({
        mensaje: '❌ Error al agregar producto al carrito',
        detalles: error.message
      });
    }
});

router.delete('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const {cid, pid} = req.params;
        console.log(pid)
        const carrito = await Cart.findById(cid);
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        const index = carrito.products.findIndex(p =>p.product.toString() === pid);
        if (index === -1) {
            return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
        }

        carrito.products.splice(index, 1);

      await carrito.save();
      res.status(200).json(carrito);
    } catch (error) {
      res.status(500).json({
        mensaje: '❌ Error al eliminar el producto del carrito',
        detalles: error.message
      });
    }
});

router.delete('/api/carts/:cid', async (req, res) => {
    try {
        const {cid} = req.params;

        const carrito = await Cart.findById(cid);
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        carrito.products = [];

        await carrito.save();
        res.status(200).json({ mensaje: '🧹 Carrito vaciado exitosamente', carrito });
    } catch (error) {
      res.status(500).json({
        mensaje: '❌ Error al vaciar el carrito',
        detalles: error.message
      });
    }
});

router.put('/api/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const carrito = await Cart.findById(cid);

        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        if (!Array.isArray(req.body)) {
            return res.status(400).json({ mensaje: 'El cuerpo debe ser un array de productos' });
        }          

        carrito.products = req.body;

        await carrito.save()

        res.status(200).json({
            mensaje: '📝 Carrito actualizado correctamente',
            carrito
        });
    } catch (error) {
      res.status(500).json({
        mensaje: '❌ Error al actualizar el carrito',
        detalles: error.message
      });
    }
});

router.put('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const {cid, pid} = req.params;
        const { quantity } = req.body;

        const carrito = await Cart.findById(cid);
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        const productoEnCarrito = carrito.products.find(p =>p.product.toString() === pid);
        if (!productoEnCarrito) {
            return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
        }

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ mensaje: 'La cantidad debe ser un número mayor a 0' });
        }

        productoEnCarrito.quantity = quantity;

        await carrito.save();
        res.status(200).json(carrito);
    } catch (error) {
      res.status(500).json({
        mensaje: '❌ Error al actualizar la cantidad del producto',
        detalles: error.message
      });
    }
});

// Incrementar cantidad
router.patch('/api/carts/:cid/product/:pid/increment', async (req, res) => {
    try {
      const { cid, pid } = req.params;
  
      const carrito = await Cart.findById(cid);
      if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });
  
      const producto = carrito.products.find(p => p.product.toString() === pid);
      if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
  
      producto.quantity += 1;
  
      await carrito.save();
      res.status(200).json(carrito);
    } catch (error) {
      res.status(500).json({ mensaje: '❌ Error al incrementar', detalles: error.message });
    }
});
  
// Disminuir cantidad
router.patch('/api/carts/:cid/product/:pid/decrement', async (req, res) => {
    try {
      const { cid, pid } = req.params;
  
      const carrito = await Cart.findById(cid);
      if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });
  
      const producto = carrito.products.find(p => p.product.toString() === pid);
      if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
  
      if (producto.quantity > 1) {
        producto.quantity -= 1;
      } else {
        carrito.products = carrito.products.filter(p => p.product.toString() !== pid);
      }
  
      await carrito.save();
      res.status(200).json(carrito);
    } catch (error) {
      res.status(500).json({ mensaje: '❌ Error al disminuir', detalles: error.message });
    }
});

router.get('/api/carts/:cid/validate', async (req, res) => {
  try {
    const { cid } = req.params;
    const carrito = await Cart.findById(cid).populate('products.product');

    if (!carrito) return res.status(404).json({ valido: false, mensaje: 'Carrito no encontrado' });

    const productosInvalidos = carrito.products.filter(p => !p.product || !p.product.title);

    if (productosInvalidos.length > 0) {
      return res.status(400).json({
        valido: false,
        mensaje: 'Hay productos en el carrito que fueron eliminados del sistema'
      });
    }

    res.json({ valido: true });
  } catch (error) {
    res.status(500).json({ valido: false, mensaje: 'Error al validar carrito' });
  }
});


export default router;