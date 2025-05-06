import Cart from '../models/Cart.js';

export const findById = (cid) => Cart.findById(cid);

export const create = (data = {}) => Cart.create(data);