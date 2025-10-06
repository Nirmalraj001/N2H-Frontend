import { productsAPI } from './api';
import { Product } from '../types';

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const productService = {
  getAllProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    return await productsAPI.getAll(filters);
  },

  getProductById: async (id: string): Promise<Product | null> => {
    return await productsAPI.getById(id);
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    return await productsAPI.create(data);
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    return await productsAPI.update(id, data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    return await productsAPI.delete(id);
  },
};
