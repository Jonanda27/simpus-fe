import api from './api';
import { KodePosResponse } from '../types/kodepos.types';

export const kodeposService = {
  fetchKodePos: async (kelurahan: string, kecamatan: string): Promise<KodePosResponse> => {
    try {
      const response = await api.get<KodePosResponse>(
        `/kodepos?kelurahan=${encodeURIComponent(kelurahan)}&kecamatan=${encodeURIComponent(kecamatan)}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Gagal mengambil data kode pos dari server');
    }
  }
};
