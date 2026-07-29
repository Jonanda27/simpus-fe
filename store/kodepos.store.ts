import { create } from 'zustand';
import { kodeposService } from '../services/kodepos.service';

interface KodePosState {
  kodePos: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchKodePos: (kelurahan: string, kecamatan: string) => Promise<string | null>;
  resetKodePos: () => void;
}

export const useKodePosStore = create<KodePosState>((set) => ({
  kodePos: '',
  isLoading: false,
  error: null,

  fetchKodePos: async (kelurahan: string, kecamatan: string) => {
    if (!kelurahan || !kecamatan) return null;
    
    set({ isLoading: true, error: null });
    try {
      const res = await kodeposService.fetchKodePos(kelurahan, kecamatan);
      if (res.success && res.kode_pos) {
        set({ kodePos: res.kode_pos, isLoading: false });
        return res.kode_pos;
      }
      set({ isLoading: false });
      return null;
    } catch (err: any) {
      set({ error: err.message || 'Gagal mencari kode pos', isLoading: false });
      return null;
    }
  },

  resetKodePos: () => {
    set({ kodePos: '', isLoading: false, error: null });
  }
}));
