// services/bulkOrderService.ts
import { BulkOrder, BulkOrderItem } from '../types';
import { bulkOrderAPI } from './api';

export const bulkOrderService = {
  createBulkOrder: async (items: any): Promise<void> => {
    return await bulkOrderAPI.create(items);
  },
  getBulkOrderById: async (id: string): Promise<void> => {
    return await bulkOrderAPI.getById(id);
  },
  getUserBulkOrders: async (userId: string): Promise<void> => {
    return await bulkOrderAPI.getUserOrders(userId);
  },

  // ADMIN
  getAllBulkOrders: async (): Promise<void> => {
    return await bulkOrderAPI.getAll();
  },
  updateBulkOrderStatus: async (id: string, status: string): Promise<void> => {
    return await bulkOrderAPI.updateStatus(id, status);
  },
};
