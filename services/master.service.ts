import api from './api';

export const masterService = {
  getObat: async (search?: string) => {
    const params = search ? { search } : {};
    const res = await api.get('/master/obat', { params });
    return res.data;
  },

  createObat: async (data: FormData) => {
    const res = await api.post('/master/obat', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  updateObat: async (id: string, data: FormData) => {
    const res = await api.put(`/master/obat/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  deleteObat: async (id: string) => {
    const res = await api.delete(`/master/obat/${id}`);
    return res.data;
  },

  getAlergi: async () => {
    const res = await api.get('/master-alergi');
    return res.data;
  },

  getIcd10: async (search?: string) => {
    const params = search ? { q: search } : {};
    const res = await api.get('/icd10/search', { params });
    return res.data;
  }
};
