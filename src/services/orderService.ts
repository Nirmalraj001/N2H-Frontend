import { ordersAPI } from './api';
import { Order } from '../types';

export const orderService = {
  getAllOrders: async (userId?: string): Promise<Order[]> => {
    return await ordersAPI.getAll(userId);
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    return await ordersAPI.getById(id);
  },

  createOrder: async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    return await ordersAPI.create(data);
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    return await ordersAPI.updateStatus(id, status);
  },
};
