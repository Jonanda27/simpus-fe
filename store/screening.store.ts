import { create } from 'zustand';
import { Screening, CreateScreeningPayload } from '../types/screening.types';
import { screeningService } from '../services/screening.service';

interface ScreeningState {
  // Data
  currentScreening: Screening | null;

  // UI State
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  createScreening: (payload: CreateScreeningPayload) => Promise<void>;
  fetchScreeningByKunjungan: (kunjunganId: string) => Promise<void>;
  clearScreening: () => void;
  clearError: () => void;
}

export const useScreeningStore = create<ScreeningState>((set) => ({
  currentScreening: null,
  isSubmitting: false,
  isLoading: false,
  error: null,

  /** Simpan hasil screening ke database */
  createScreening: async (payload: CreateScreeningPayload) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await screeningService.createScreening(payload);
      if (response.success) {
        set({ currentScreening: response.data, isSubmitting: false });
      } else {
        set({ error: response.message || 'Gagal menyimpan screening', isSubmitting: false });
        throw new Error(response.message || 'Gagal menyimpan screening');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Terjadi kesalahan sistem';
      set({ error: msg, isSubmitting: false });
      throw error;
    }
  },

  /** Ambil data screening yang sudah ada berdasarkan kunjunganId */
  fetchScreeningByKunjungan: async (kunjunganId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await screeningService.getScreeningByKunjungan(kunjunganId);
      if (response.success) {
        set({ currentScreening: response.data, isLoading: false });
      } else {
        set({ currentScreening: null, isLoading: false });
      }
    } catch (error: any) {
      // 404 = belum ada screening, bukan error fatal
      if (error?.response?.status === 404) {
        set({ currentScreening: null, isLoading: false });
      } else {
        const msg = error?.response?.data?.message || 'Gagal memuat data screening';
        set({ error: msg, isLoading: false });
      }
    }
  },

  clearScreening: () => set({ currentScreening: null }),
  clearError: () => set({ error: null }),
}));
