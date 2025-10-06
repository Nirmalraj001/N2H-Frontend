import { authAPI } from './api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (data: LoginRequest): Promise<{ user: User; token: string }> => {
    // Calls real API endpoint /api/auth/login
    return await authAPI.login(data.email, data.password);
  },

  register: async (data: RegisterRequest): Promise<{ user: User; token: string }> => {
    // Calls real API endpoint /api/auth/register
    return await authAPI.register(data.name, data.email, data.password);
  },

  logout: async (): Promise<void> => {
    // If backend supports logout endpoint, call it. Otherwise just remove token client-side
    // await authAPI.logout(); 
    localStorage.removeItem("token");
  },

  getCurrentUser: async (): Promise<User> => {
    return await authAPI.getCurrentUser();
  },

  forgotPassword: async (email: string): Promise<void> => {
    return await authAPI.forgotPassword(email);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    return await authAPI.changePassword(currentPassword, newPassword);
  },
};

