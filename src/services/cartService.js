import { findById, create } from '../dao/cart.dao.js';

export const createCart = async () => {
  return await create();
};

export const getCartById = async (cid) => {
  return await findById(cid);
};

export const getCartPopulated = async (cid) => {
  return await findById(cid).populate('products.product');
};

export const addProductToCart = async (cid, pid) => {
  const cart = await findById(cid);
  if (!cart) return null;

  const existing = cart.products.find(p => p.product.toString() === pid);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }
  await cart.save();
  return cart;
};

export const removeProductFromCart = async (cid, pid) => {
  const cart = await findById(cid);
  if (!cart) return null;

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  return cart;
};

export const clearCart = async (cid) => {
  const cart = await findById(cid);
  if (!cart) return null;
  cart.products = [];
  await cart.save();
  return cart;
};

export const updateCartProducts = async (cid, products) => {
  const cart = await findById(cid);
  if (!cart) return null;
  cart.products = products;
  await cart.save();
  return cart;
};

export const updateProductQuantity = async (cid, pid, quantity) => {
  const cart = await findById(cid);
  if (!cart) return null;
  const product = cart.products.find(p => p.product.toString() === pid);
  if (!product) return null;
  product.quantity = quantity;
  await cart.save();
  return cart;
};

export const incrementProductQuantity = async (cid, pid) => {
  return updateProductQuantity(cid, pid, await getAdjustedQuantity(cid, pid, +1));
};

export const decrementProductQuantity = async (cid, pid) => {
  const cart = await findById(cid);
  if (!cart) return null;
  const product = cart.products.find(p => p.product.toString() === pid);
  if (!product) return null;

  if (product.quantity > 1) {
    product.quantity -= 1;
  } else {
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
  }

  await cart.save();
  return cart;
};

export const getAdjustedQuantity = async (cid, pid, delta) => {
  const cart = await findById(cid);
  if (!cart) return null;
  const product = cart.products.find(p => p.product.toString() === pid);
  return product ? product.quantity + delta : delta;
};

export const validateCartProducts = async (cid) => {
  const cart = await findById(cid).populate('products.product');
  if (!cart) return { valido: false, mensaje: 'Carrito no encontrado' };

  try {
    const productosInvalidos = cart.products.filter(
      p => !p.product || !p.product.title
    );

    if (productosInvalidos.length > 0) {
      return {
        valido: false,
        mensaje: 'Hay productos inválidos en el carrito',
        productosInvalidos: productosInvalidos.map(p => p.product?._id?.toString() || '')
      };
    }

    return { valido: true };
  } catch (err) {
    return { valido: false, mensaje: 'Error validando productos del carrito' };
  }
};