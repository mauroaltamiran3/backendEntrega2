import express from 'express';
import Ticket from '../models/Ticket.js';
import { extractUser } from '../middlewares/extractUser.js';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import { fork } from 'child_process';
import path from 'path';
import {
  createCart,
  getCartById,
  getCartPopulated
} from '../services/cartService.js';
import {
  getAllProducts,
  findProductById
} from '../services/productService.js';
import {findCategories} from '../dao/product.dao.js';

const router = express.Router();

router.get('/', async (req, res) => {
  let cid = req.cookies.cid;
  let carrito = cid ? await getCartById(cid) : null;

  if (!carrito) {
    carrito = await createCart();
    cid = carrito._id.toString();
    res.cookie('cid', cid, { httpOnly: false });
    console.log('🛒 Nuevo carrito creado porque no existía ninguno.');
  }

  const { categoria } = req.query;

  let query = {};
  if (categoria) query.category = categoria;

  const productos = await getAllProducts(query);
  const categorias = await findCategories();

  res.render('home', {
    productos,
    categorias,
    categoriaSeleccionada: categoria || '',
    carritoId: cid,
    style: ['home', 'navbar']
  });
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const carrito = await getCartPopulated(cid);

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

router.get('/cart/:cid/comprar', extractUser, handlePolicies(['USER', 'ADMIN']), async (req, res) => {
  const { cid } = req.params;

  const carrito = await getCartPopulated(cid);

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

router.get('/realtimeproducts', handlePolicies(['ADMIN']), async (req, res) => {
  let cid = req.cookies.cid;

  if (!cid) {
    const carrito = await createCart();
    cid = carrito._id.toString();
    res.cookie('cid', cid, { httpOnly: false });
  }

  const productos = await getAllProducts();
  res.render('realTimeProducts', {
    productos,
    carritoId: cid,
    style: ['realTimeProducts', 'navbar']
  });
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

    const product = await findProductById(pid);

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

router.get('/jwt/login', (req, res) => {
  res.render('jwtLogin', {
    style: ['auth', 'navbar']
  });
});

router.get('/jwt/profile', (req, res) => {
  res.render('jwtProfile', {
    style: ['auth', 'navbar']
  });
});

router.get('/admin/test', handlePolicies(['ADMIN']), (req, res) => {
  const user = req.user || req.jwtUser;
  res.send(`✅ Bienvenido admin: ${user?.first_name || 'Desconocido'}`);
});

router.get('/info', (req, res) => {
  const info = {
    argumentos: process.argv.slice(2).join(' '),
    plataforma: process.platform,
    versionNode: process.version,
    memoria: Math.round(process.memoryUsage().rss / 1024 / 1024),
    pathEjecucion: process.execPath,
    processId: process.pid,
    carpetaProyecto: process.cwd()
  };

  res.render('info', {
    info,
    style: ['info', 'navbar']
  });
});

router.get('/calculo-bloq', (req, res) => {
  let suma = 0;
  for (let i = 0; i < 5e8; i++) {
    suma += i;
  }
  res.send(`✅ Resultado bloqueante: ${suma}`);
});

router.get('/calculo-nobloq', (req, res) => {
  const child = fork(path.resolve('src/utils/suma.js'));

  child.send('start');

  child.on('message', resultado => {
    res.send(`✅ Resultado desde child process: ${resultado}`);
  });
});

export default router;