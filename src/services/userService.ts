import { usersAPI } from './api';
import { User, Address } from '../types';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    return await usersAPI.getAll();
  },

  getUserById: async (id: string): Promise<User | null> => {
    return await usersAPI.getById(id);
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    return await usersAPI.update(id, data);
  },

  addAddress: async (userId: string, address: Omit<Address, 'id'>): Promise<User> => {
    return await usersAPI.addAddress(userId, address);
  },

  updateAddress: async (userId: string, addressId: string, updates: Partial<Address>): Promise<User> => {
    return await usersAPI.updateAddress(userId, addressId, updates);
  },

  deleteAddress: async (userId: string, addressId: string): Promise<User> => {
    return await usersAPI.deleteAddress(userId, addressId);
  },
};
