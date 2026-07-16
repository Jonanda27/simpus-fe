import api from './api';

export const icd10Service = {
  // Mencari master ICD-10
  async search(query: string) {
    const response = await api.get(`/icd10/search?q=${query}`);
    return response.data;
  },

  // Menyimpan diagnosis pasien
  async saveDiagnosis(data: any) {
    const response = await api.post('/icd10/diagnosis', data);
    return response.data;
  },

  // Mengambil riwayat diagnosis berdasarkan ID pasien
  async getDiagnosisByPasien(pasienId: string) {
    const response = await api.get(`/icd10/diagnosis/pasien/${pasienId}`);
    return response.data;
  },

  // Master Data CRUD
  async createICD10(data: any) {
    const response = await api.post('/icd10/master', data);
    return response.data;
  },

  async updateICD10(id: string, data: any) {
    const response = await api.put(`/icd10/master/${id}`, data);
    return response.data;
  },

  async deleteICD10(id: string) {
    const response = await api.delete(`/icd10/master/${id}`);
    return response.data;
  },

  // Menghapus diagnosis pasien
  async deleteDiagnosis(id: string) {
    const response = await api.delete(`/icd10/diagnosis/${id}`);
    return response.data;
  }
};
