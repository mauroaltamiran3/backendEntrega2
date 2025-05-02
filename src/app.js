import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { engine } from 'express-handlebars';
import sections from 'express-handlebars-sections';
import helpers from 'handlebars-helpers';
import Handlebars from 'handlebars';
import moment from 'moment';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import __dirname from './utils.js';
import cookieParser from 'cookie-parser';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import ticketsRouter from './routes/tickets.router.js';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import sessionRouter from './routes/sessions.router.js';

const app = express();
const PORT = process.env.PORT || 8080;

const mathHelpers = helpers({
  handlebars: Handlebars
});

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(error => console.error('❌ Error al conectar a MongoDB:', error));

// Obtener los helpers de comparación

// Configuración de Handlebars
app.engine('handlebars', engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    multiply: (a, b) => a * b,
    formatNumber: (value) => {
      if (typeof value !== 'number') return '—';
      return value.toLocaleString('es-AR');
    },
    formatDate: (fecha) => moment(fecha).format('DD/MM/YYYY HH:mm:ss') + 'hs',
    gt: mathHelpers.gt,
    ifEquals: (a, b, options) => (a === b ? options.fn(this) : options.inverse(this)),
    section: sections()
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, '..', 'public')));
app.use((req, res, next) => {
  res.locals.carritoID = req.cookies.cid || null;
  next();
});

app.use(session({
  secret: 'miClaveUltraSecreta',
  resave: false,
  saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use((req, res, next) => {
  res.locals.usuario = req.user || null;
  next();
});
app.use('/', viewsRouter);
app.use('/session', sessionRouter);
app.use(productsRouter);
app.use(cartRouter);
app.use(ticketsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});