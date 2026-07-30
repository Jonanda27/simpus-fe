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
  
  syncPoliklinikLocation: async (id: number | string) => {
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

  getEncounterDetail: async (encounterId: string) => {
    try {
      const response = await api.get(`/satusehat/encounter/${encounterId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal terhubung ke server SATUSEHAT');
    }
  },

  getMonitoringEncounters: async () => {
    try {
      const response = await api.get('/satusehat/encounters');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal mengambil daftar encounter');
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
  },

  getResourceByEncounter: async (resourceType: string, encounterId: string) => {
    try {
      const response = await api.get(`/satusehat/resource-by-encounter/${resourceType}/${encounterId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error(`Gagal mengambil data ${resourceType} dari SATUSEHAT`);
    }
  },

  getActiveResourcesByEncounter: async (encounterId: string) => {
    try {
      const response = await api.get(`/satusehat/resource-list/${encounterId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal mengambil daftar resource aktif dari SATUSEHAT');
    }
  },

  retrySyncEncounter: async (kunjunganId: string) => {
    try {
      const response = await api.post(`/satusehat/kunjungan/${kunjunganId}/sync`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal melakukan sync ulang ke SATUSEHAT');
    }
  },

  sendQuestionnaireResponse: async (data: any) => {
    try {
      const response = await api.post('/satusehat/questionnaire-response', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal mengirim QuestionnaireResponse ke SATUSEHAT');
    }
  },

  sendMedicationDispense: async (data: any) => {
    try {
      const response = await api.post('/satusehat/dispense', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Gagal mengirim MedicationDispense ke SATUSEHAT');
    }
  }
};
