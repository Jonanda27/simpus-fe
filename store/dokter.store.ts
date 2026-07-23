import { create } from 'zustand';
import { Dokter, DokterPayload, dokterService } from '../services/dokter.service';
import { satusehatService } from '../services/satusehat.service';

interface DokterState {
  dokters: Dokter[];
  isLoading: boolean;
  error: string | null;
  
  fetchDokters: () => Promise<void>;
  createDokter: (data: DokterPayload) => Promise<void>;
  updateDokter: (id: string, data: Partial<DokterPayload>) => Promise<void>;
  deleteDokter: (id: string) => Promise<void>;
  syncDokterIHS: (nik: string, userId: string) => Promise<any>;
  checkIHSNik: (nik: string) => Promise<any>;
}

export const useDokterStore = create<DokterState>((set, get) => ({
  dokters: [],
  isLoading: false,
  error: null,

  fetchDokters: async () => {
    set({ isLoading: true, error: null });
    try {
      const dokters = await dokterService.getAllDokter();
      set({ dokters, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Gagal mengambil data dokter', isLoading: false });
    }
  },

  createDokter: async (data: DokterPayload) => {
    set({ isLoading: true, error: null });
    try {
      await dokterService.createDokter(data);
      await get().fetchDokters();
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || 'Gagal menambahkan dokter', isLoading: false });
      throw error;
    }
  },

  updateDokter: async (id: string, data: Partial<DokterPayload>) => {
    set({ isLoading: true, error: null });
    try {
      await dokterService.updateDokter(id, data);
      await get().fetchDokters();
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || 'Gagal mengubah dokter', isLoading: false });
      throw error;
    }
  },

  deleteDokter: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await dokterService.deleteDokter(id);
      await get().fetchDokters();
    } catch (error: any) {
      set({ error: error.message || 'Gagal menghapus dokter', isLoading: false });
      throw error;
    }
  },

  syncDokterIHS: async (nik: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await satusehatService.syncPractitionerIHS(nik, userId);
      if (response.success) {
        await get().fetchDokters();
        return response;
      }
      return response;
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal sinkronisasi IHS Dokter', 
        isLoading: false 
      });
      throw error;
    }
  },

  checkIHSNik: async (nik: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await satusehatService.checkPractitionerNIK(nik);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengecek NIK ke SATUSEHAT', 
        isLoading: false 
      });
      throw error;
    }
  }
}));
