import { categoriesAPI } from './api';
import { Category } from '../types';

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    return await categoriesAPI.getAll();
  },

  getCategoryById: async (id: string): Promise<Category | null> => {
    return await categoriesAPI.getById(id);
  },

  createCategory: async (data: Omit<Category, 'id'>): Promise<Category> => {
    return await categoriesAPI.create(data);
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    return await categoriesAPI.update(id, data);
  },

  deleteCategory: async (id: string): Promise<void> => {
    return await categoriesAPI.delete(id);
  },
};
