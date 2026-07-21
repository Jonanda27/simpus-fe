import api from './api';

export interface RefItem {
  id: string;
  kode: string;
  label: string;
  deskripsi?: string | null;
  isBpjs?: boolean;
  butuhDataRujukan?: boolean;
  warnaBadge?: string | null;
  warna?: string | null;
  statusAktif?: boolean;
  urutan?: number;
}

export interface AllReferensiData {
  jenisPenjamin: RefItem[];
  jenisPelayanan: RefItem[];
  caraDatang: RefItem[];
  prioritas: RefItem[];
  kategoriTriage: RefItem[];
  metodePembayaran: RefItem[];
  sediaanObat: RefItem[];
  kategoriObat: RefItem[];
}

export const referensiService = {
  getAll: async (): Promise<AllReferensiData> => {
    const res = await api.get('/referensi/all');
    return res.data.data;
  },

  getByType: async (type: string): Promise<RefItem[]> => {
    const res = await api.get(`/referensi/${type}`);
    return res.data.data;
  },
};
