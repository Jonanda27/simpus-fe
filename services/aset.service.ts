import api from './api';

export const asetService = {
  getAsets: async (search?: string, kategori?: string) => {
    const params: any = {};
    if (search) params.search = search;
    if (kategori) params.kategori = kategori;
    const res = await api.get('/aset', { params });
    return res.data;
  },

  createAset: async (data: FormData) => {
    const res = await api.post('/aset', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  getAsetById: async (id: string) => {
    const res = await api.get(`/aset/${id}`);
    return res.data;
  },

  updateAset: async (id: string, data: FormData) => {
    const res = await api.put(`/aset/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  getRuangan: async () => {
    const res = await api.get('/aset/ruangan');
    return res.data;
  },

  createRuangan: async (data: { namaRuangan: string; lokasi?: string }) => {
    const res = await api.post('/aset/ruangan', data);
    return res.data;
  },
};
