import api from './api';
import { AuthResponse, LoginCredentials, User } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Login gagal');
      }
      throw new Error('Terjadi kesalahan pada server');
    }
  },
  
  
  getMe: async (token: string): Promise<{ success: boolean; user: User }> => {
    try {
      const response = await api.get<{ success: boolean; user: User }>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Sesi tidak valid');
      }
      throw new Error('Terjadi kesalahan pada server saat verifikasi sesi');
    }
  }
};
