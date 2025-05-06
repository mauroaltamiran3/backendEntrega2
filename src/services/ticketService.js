import { createTicket } from '../dao/ticket.dao.js';
import { getCartPopulated, clearCart } from './cartService.js';
import Product from '../models/Product.js';
import { sendPurchaseMail } from '../utils/mailer.js';

export const processPurchase = async (cid, userEmail) => {
  const carrito = await getCartPopulated(cid);
  if (!carrito || carrito.products.length === 0) {
    return { error: 'Carrito vacío o no encontrado' };
  }

  for (const item of carrito.products) {
    const producto = item.product;
    const nuevaCantidad = producto.stock - item.quantity;

    if (nuevaCantidad < 0) {
      return { error: `Stock insuficiente para el producto: ${producto.title}` };
    }

    await Product.findByIdAndUpdate(producto._id, {
      $set: { stock: nuevaCantidad }
    });
  }

  const total = carrito.products.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const productosComprados = carrito.products.map(item => ({
    title: item.product.title,
    quantity: item.quantity
  }));

  const code = `TICKET-${Date.now()}`;
  const ticketData = {
    code,
    amount: total,
    purchaser: userEmail,
    products: productosComprados,
    cartId: carrito._id
  };

  const nuevoTicket = await createTicket(ticketData);
  await clearCart(cid);

  await sendPurchaseMail(
    userEmail,
    '✅ Confirmación de compra',
    `
      <h2>Gracias por tu compra</h2>
      <p>Este es tu ticket: <strong>${code}</strong></p>
      <p>Monto total: <strong>$${total}</strong></p>
    `
  );

  return { ticket: nuevoTicket };
};