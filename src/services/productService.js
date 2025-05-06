import {
  findAll,
  create,
  findById,
  deleteById
} from '../dao/product.dao.js';

export const getAllProducts = async () => {
  return await findAll();
};

export const findProductById = async (pid) => {
  return await findById(pid);
};

export const createProduct = async (data) => {
  return await create(data);
};

export const updateProductStock = async (pid, operacion) => {
  const producto = await findById(pid);
  if (!producto) return null;

  if (operacion === 'incrementar') {
    producto.stock += 1;
  } else if (operacion === 'reducir' && producto.stock > 0) {
    producto.stock -= 1;
  }

  await producto.save();
  return producto;
};

export const deleteProductById = async (pid) => {
  return await deleteById(pid);
};