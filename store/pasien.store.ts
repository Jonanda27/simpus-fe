import { create } from 'zustand';
import { Pasien } from '../types/pasien.types';
import { pasienService } from '../services/pasien.service';

interface PasienState {
  pasiens: Pasien[];
  isLoading: boolean;
  error: string | null;
  fetchPasiens: () => Promise<void>;
  deletePasien: (id: number) => Promise<void>;
  clearError: () => void;
}

export const usePasienStore = create<PasienState>((set, get) => ({
  pasiens: [],
  isLoading: false,
  error: null,

  fetchPasiens: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await pasienService.getAllPasien();
      if (response.success) {
        set({ pasiens: response.data, isLoading: false });
      } else {
        set({ error: 'Gagal memuat data pasien', isLoading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Terjadi kesalahan sistem', 
        isLoading: false 
      });
    }
  },

  deletePasien: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await pasienService.deletePasien(id);
      if (response.success) {
        const currentPasiens = get().pasiens;
        set({ 
          pasiens: currentPasiens.filter((p: Pasien) => p.id !== id),
          isLoading: false 
        });
      } else {
        set({ error: 'Gagal menghapus data pasien', isLoading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Terjadi kesalahan saat menghapus', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));