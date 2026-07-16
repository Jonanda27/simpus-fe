import api from './api';

export interface ResepDetail {
  id: string;
  resepId: string;
  obatId: string;
  jumlah: number;
  aturanPakai: string;
  catatan?: string;
  obat: {
    kodeObat: string;
    namaObat: string;
    sediaan: string;
    stok: number;
    kategori: string;
    gambarUrl?: string;
  };
}

export interface ResepData {
  id: string;
  kunjunganId: string;
  pasienId: string;
  dokterId: string;
  status: string;
  tanggalResep: string;
  pasien: {
    noRM: string;
    namaLengkap: string;
    tanggalLahir: string;
    jenisKelamin: string;
  };
  dokter: {
    namaLengkap: string;
  };
  kunjungan: {
    noAntrian?: string;
    jenisPelayanan?: string;
    poliklinik: {
      namaPoli: string;
    };
  };
  details: ResepDetail[];
}

export const farmasiService = {
  getAntrian: async (): Promise<ResepData[]> => {
    const response = await api.get('/farmasi/antrian');
    return response.data.data;
  },

  getResepById: async (id: string): Promise<ResepData> => {
    const response = await api.get(`/farmasi/resep/${id}`);
    return response.data.data;
  },

  prosesResep: async (id: string) => {
    const response = await api.post(`/farmasi/resep/${id}/proses`);
    return response.data;
  }
};
