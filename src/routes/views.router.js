import express from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Ticket from '../models/Ticket.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  let cid = req.cookies.cid;
  let carrito = cid ? await Cart.findById(cid) : null;

  if (!carrito) {
    carrito = await Cart.create({});
    cid = carrito._id.toString();
    res.cookie('cid', cid, { httpOnly: false });
    console.log('🛒 Nuevo carrito creado porque no existía ninguno.');
  }

  const { categoria } = req.query;

  // Consulta condicional por categoría
  let query = {};
  if (categoria) query.category = categoria;

  // Productos filtrados y listado de todas las categorías
  const productos = await Product.find(query).lean();
  const categorias = await Product.distinct('category');

  res.render('home', {
    productos,
    categorias,
    categoriaSeleccionada: categoria || '',
    carritoId: cid,
    style: ['home', 'navbar']
  });
});

router.get('/carts/:cid', async (req,res) => {
  try {
    const { cid } = req.params;
    const carrito = await Cart.findById(cid)
      .populate('products.product')

    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }

    res.render('cart', {
      carrito,
      carritoId: cid,
      style: ['cart', 'navbar']
    });
  } catch (error) {
    res.status(500).send('❌ Error al cargar el carrito');
  }
});

router.get('/cart/:cid/comprar', isAuthenticated, async (req, res) => {
  const { cid } = req.params;
  
  const carrito = await Cart.findById(cid)
    .populate('products.product');

  if (!carrito) {
    return res.status(404).send('Carrito no encontrado');
  }

  const totalCompra = carrito.products.reduce((acc, item) => {
    return acc + item.quantity * item.product.price;
  }, 0);

  res.render('comprar', {
    carrito,
    totalCompra,
    carritoId: cid,
    style: ['comprar', 'navbar']
  });
});

router.get('/realtimeproducts', isAdmin, async (req, res) => {
  let cid = req.cookies.cid;

  if (!cid) {
    const carrito = await Cart.create({});
    cid = carrito._id.toString();
    res.cookie('cid', cid, { httpOnly: false });
  }
  
  const productos = await Product.find();
  res.render('realTimeProducts', 
    {
      productos,
      carritoId: cid,
      style: ['realTimeProducts', 'navbar'] });
});

router.get('/ticket/:tid', async (req, res) => {
  const { tid } = req.params;
  let cid = req.cookies.cid;

  const ticket = await Ticket.findById(tid).populate({
    path: 'cartId',
    populate: { path: 'products.product' }
  });

  if (!ticket) return res.status(404).send('Ticket no encontrado');

  res.render('ticket', {
    ticket,
    style: ['ticket', 'navbar'],
    carritoId: cid
  });
});

router.get('/product/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    let cid = req.cookies.cid;

    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).send('❌ Producto no encontrado');
    }

    res.render('detalles', {
      product,
      carritoId: cid,
      style: ['detalles', 'navbar']
    });

  } catch (error) {
    console.error('❌ Error al cargar detalles del producto:', error.message);
    res.status(500).send('❌ Error al cargar el producto');
  }
});

router.get('/register', (req, res) => {
  res.render('register', {
    style: ['auth', 'navbar']
  });
  
});

router.get('/login', (req, res) => {
  res.render('login', {
    style: ['auth', 'navbar']
  });  
});

export default router;