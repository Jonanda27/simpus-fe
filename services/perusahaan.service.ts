import api from './api';
import { Perusahaan } from '../types/perusahaan.types';

export const perusahaanService = {
  // Get all perusahaan
  getAll: async (statusKerjasama?: string) => {
    const params = statusKerjasama ? { statusKerjasama } : {};
    const response = await api.get('/perusahaan', { params });
    return response.data;
  },

  // Create new perusahaan
  create: async (formData: FormData) => {
    const response = await api.post('/perusahaan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update perusahaan
  update: async (id: string, formData: FormData) => {
    const response = await api.put(`/perusahaan/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
