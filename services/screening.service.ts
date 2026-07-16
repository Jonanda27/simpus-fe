import api from './api';
import { Screening, CreateScreeningPayload, ApiResponse } from '../types/screening.types';

export const screeningService = {
  /** POST /screening — Simpan hasil screening baru */
  createScreening: async (payload: CreateScreeningPayload): Promise<ApiResponse<Screening>> => {
    const response = await api.post('/screening', payload);
    return response.data;
  },

  /** GET /screening/kunjungan/:id — Ambil screening berdasarkan kunjungan */
  getScreeningByKunjungan: async (kunjunganId: string): Promise<ApiResponse<Screening>> => {
    const response = await api.get(`/screening/kunjungan/${kunjunganId}`);
    return response.data;
  },
};
