import { cartAPI } from './api';
import { CartItem } from '../types';

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    return await cartAPI.get();
  },

  addToCart: async (productId: string, quantity?: number): Promise<void> => {
    return await cartAPI.add(productId, quantity);
  },

  updateCartItem: async (productId: string, quantity: number): Promise<void> => {
    return await cartAPI.update(productId, quantity);
  },

  removeFromCart: async (productId: string): Promise<void> => {
    return await cartAPI.remove(productId);
  },

  clearCart: async (): Promise<void> => {
    return await cartAPI.clear();
  },
};
