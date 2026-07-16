export interface DetailTagihan {
  id: string;
  namaItem: string;
  kategori: string;
  jumlah: number;
  hargaSatuan: number;
  subTotal: number;
}

export interface Pembayaran {
  jumlahBayar: number;
  kembalian: number;
  metodePembayaran: string;
}

export interface Tagihan {
  id: string;
  totalBiaya: number;
  statusTagihan: string;
  createdAt: string;
  details: DetailTagihan[];
  kunjungan?: any;
  pembayaran?: Pembayaran;
}

export interface KasirState {
  antrian: any[];
  riwayat: any[];
  selectedKunjungan: any | null;
  tagihanAktif: Tagihan | null;
  
  isLoadingAntrian: boolean;
  isLoadingTagihan: boolean;
  isProcessing: boolean;

  fetchAntrian: () => Promise<void>;
  fetchRiwayat: () => Promise<void>;
  pilihPasien: (kunjungan: any) => Promise<void>;
  prosesPembayaran: (tagihanId: string, metode: string, jumlahBayar: number) => Promise<boolean>;
  clearSelection: () => void;
}
