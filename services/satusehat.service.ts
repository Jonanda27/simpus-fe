import api from './api';

export const satusehatService = {
  syncPatientIHS: async (nik: string) => {
    try {
      const response = await api.get(`/satusehat/pasien/nik/${nik}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal terhubung ke server');
    }
  },
  
  checkPatientNIK: async (nik: string) => {
    try {
      const response = await api.get(`/satusehat/pasien/nik/${nik}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal terhubung ke server');
    }
  },
  
  syncPractitionerIHS: async (nik: string, userId?: string) => {
    try {
      const url = userId 
        ? `/satusehat/praktisioner/nik/${nik}?userId=${userId}` 
        : `/satusehat/praktisioner/nik/${nik}`;
        
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal terhubung ke server');
    }
  },

  checkPractitionerNIK: async (nik: string) => {
    try {
      const response = await api.get(`/satusehat/praktisioner/nik/${nik}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal terhubung ke server');
    }
  },
  
  syncPoliklinikLocation: async (id: number) => {
    try {
      const response = await api.post(`/satusehat/lokasi/poli/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal terhubung ke server');
    }
  },

  searchKFA: async (keyword: string) => {
    try {
      const response = await api.get(`/satusehat/kfa?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal mencari data KFA di server');
    }
  }
};
