import { Router } from 'express';
import viewsRouter from './views.router.js';
import productsRouter from './products.router.js';
import cartRouter from './cart.router.js';
import ticketRouter from './tickets.router.js';
import sessionRouter from './sessions.router.js';
import jwtRouter from './jwt.router.js';

const router = Router();

router.use('/', viewsRouter);
router.use('/api/products', productsRouter);
router.use('/api/carts', cartRouter);
router.use('/api/tickets', ticketRouter);
router.use('/session', sessionRouter);
router.use('/', jwtRouter);

export default router;