import { create } from 'zustand';
import Swal from 'sweetalert2';
import { ukmService } from '../services/ukm.service';
import { UKMState } from '../types/ukm.types';

export const useUKMStore = create<UKMState>((set, get) => ({
  programs: [],
  registerList: [],
  isLoading: false,

  fetchDashboardStats: async () => {
    set({ isLoading: true });
    try {
      const res = await ukmService.getDashboardStats();
      set({ programs: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch UKM dashboard', error);
    }
  },

  fetchPasienByProgram: async (programId) => {
    set({ isLoading: true });
    try {
      const res = await ukmService.getPasienByProgram(programId);
      set({ registerList: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch UKM patients', error);
    }
  },

  addLogPemantauan: async (registerId, data) => {
    try {
      await ukmService.addLogPemantauan(registerId, data);
      Swal.fire('Sukses', 'Log pemantauan berhasil ditambahkan', 'success');
      return true;
    } catch (error: any) {
      Swal.fire('Gagal', error.response?.data?.message || 'Gagal menambahkan log', 'error');
      return false;
    }
  }
}));
