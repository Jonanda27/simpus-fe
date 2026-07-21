import api from './api';

export const keuanganService = {
  // === TARIF PELAYANAN ===
  getTarifPelayanan: async (search?: string, kategori?: string) => {
    const params: any = {};
    if (search) params.search = search;
    if (kategori) params.kategori = kategori;
    const res = await api.get('/keuangan/tarif-pelayanan', { params });
    return res.data;
  },

  createTarifPelayanan: async (data: any) => {
    const res = await api.post('/keuangan/tarif-pelayanan', data);
    return res.data;
  },

  updateTarifPelayanan: async (id: string, data: any) => {
    const res = await api.put(`/keuangan/tarif-pelayanan/${id}`, data);
    return res.data;
  },

  deleteTarifPelayanan: async (id: string) => {
    const res = await api.delete(`/keuangan/tarif-pelayanan/${id}`);
    return res.data;
  },

  // === TARIF FARMASI ===
  getTarifFarmasi: async (search?: string) => {
    const params: any = {};
    if (search) params.search = search;
    const res = await api.get('/keuangan/tarif-farmasi', { params });
    return res.data;
  },

  createTarifFarmasi: async (data: any) => {
    const res = await api.post('/keuangan/tarif-farmasi', data);
    return res.data;
  },

  updateTarifFarmasi: async (id: string, data: any) => {
    const res = await api.put(`/keuangan/tarif-farmasi/${id}`, data);
    return res.data;
  },

  deleteTarifFarmasi: async (id: string) => {
    const res = await api.delete(`/keuangan/tarif-farmasi/${id}`);
    return res.data;
  },

  // === MASTER HELPER ===
  getMasterICD9: async () => {
    const res = await api.get('/keuangan/master-icd9');
    return res.data;
  },

  getMasterLab: async () => {
    const res = await api.get('/keuangan/master-lab');
    return res.data;
  },
};
