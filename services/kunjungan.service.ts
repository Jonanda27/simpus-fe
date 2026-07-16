import api from './api';
import { Kunjungan } from '../types/kunjungan.types';

export const kunjunganService = {
  getKunjunganScreening: async (): Promise<Kunjungan[]> => {
    const response = await api.get('/kunjungan/screening');
    return response.data.data;
  },
  
  getKunjunganById: async (id: string): Promise<Kunjungan> => {
    const response = await api.get(`/kunjungan/${id}`);
    return response.data.data;
  },
  
  panggilKunjungan: async (id: string): Promise<any> => {
    const response = await api.post(`/kunjungan/${id}/panggil`);
    return response.data.data;
  }
};
