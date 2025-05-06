import Product from '../models/Product.js';

export const findAll = () => Product.find();

export const create = (data) => Product.create(data);

export const findById = (pid) => Product.findById(pid);

export const findCategories = () => Product.distinct('category');

export const deleteById = (pid) => Product.findByIdAndDelete(pid);