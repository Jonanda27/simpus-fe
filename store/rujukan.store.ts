import { create } from 'zustand';
import { rujukanService, RujukanData } from '../services/rujukan.service';

interface RujukanState {
  antrianList: any[];
  rujukanDetail: RujukanData | null;
  isLoading: boolean;
  isSendingSS: boolean;
  error: string | null;

  fetchAntrian: () => Promise<void>;
  fetchRujukanDetail: (kunjunganId: string) => Promise<void>;
  kirimServiceRequest: (kunjunganId: string) => Promise<boolean>;
}

export const useRujukanStore = create<RujukanState>((set, get) => ({
  antrianList: [],
  rujukanDetail: null,
  isLoading: false,
  isSendingSS: false,
  error: null,

  fetchAntrian: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await rujukanService.getAntrian();
      set({ antrianList: data });
    } catch (err: any) {
      set({ error: err.message || 'Gagal mengambil antrean rujukan' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRujukanDetail: async (kunjunganId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await rujukanService.getRujukanDetail(kunjunganId);
      set({ rujukanDetail: data });
    } catch (err: any) {
      set({ error: err.message || 'Gagal mengambil detail rujukan' });
    } finally {
      set({ isLoading: false });
    }
  },

  kirimServiceRequest: async (kunjunganId) => {
    set({ isSendingSS: true, error: null });
    try {
      const result = await rujukanService.kirimServiceRequestSatuSehat(kunjunganId);
      if (result.status === 'success') {
        // Refresh data untuk mendapatkan satusehatId terbaru
        await get().fetchRujukanDetail(kunjunganId);
      }
      set({ isSendingSS: false });
      return result.status === 'success';
    } catch (err: any) {
      set({
        error: err.message || 'Gagal mengirim ServiceRequest ke SATUSEHAT',
        isSendingSS: false
      });
      return false;
    }
  }
}));
