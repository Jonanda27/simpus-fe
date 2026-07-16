import { create } from 'zustand';
import { Perusahaan } from '../types/perusahaan.types';
import { perusahaanService } from '../services/perusahaan.service';

interface PerusahaanState {
  perusahaan: Perusahaan[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPerusahaan: (statusKerjasama?: string) => Promise<void>;
  createPerusahaan: (formData: FormData) => Promise<boolean>;
}

export const usePerusahaanStore = create<PerusahaanState>((set) => ({
  perusahaan: [],
  isLoading: false,
  error: null,

  fetchPerusahaan: async (statusKerjasama?: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await perusahaanService.getAll(statusKerjasama);
      if (res.success) {
        set({ perusahaan: res.data, isLoading: false });
      } else {
        set({ error: 'Gagal mengambil data', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createPerusahaan: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await perusahaanService.create(formData);
      if (res.success) {
        // Option 1: Re-fetch list
        // Option 2: Just return true and let UI re-fetch
        set({ isLoading: false });
        return true;
      }
      set({ error: 'Gagal menambahkan data', isLoading: false });
      return false;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  }
}));
