import api from './api';
import { LogPemantauanUKM } from '../types/ukm.types';

export const ukmService = {
  getDashboardStats: async () => {
    const response = await api.get('/ukm/dashboard');
    return response.data;
  },

  getPasienByProgram: async (programId: string) => {
    const response = await api.get(`/ukm/program/${programId}/pasien`);
    return response.data;
  },

  addLogPemantauan: async (registerId: string, data: Partial<LogPemantauanUKM>) => {
    const response = await api.post(`/ukm/register/${registerId}/log`, data);
    return response.data;
  }
};
