import { Pasien } from './pasien.types';

export interface Poliklinik {
  id: string;
  kodePoli: string;
  namaPoli: string;
  deskripsi?: string;
  status: boolean;
}

export interface Kunjungan {
  id: string;
  pasienId: string;
  pasien: Pasien;
  
  tanggalRegistrasi: string;
  jamRegistrasi: string;
  timestamp?: string;
  
  poliklinikId: string;
  poliklinik: Poliklinik;
  layananTujuan?: string;
  jenisPelayanan: string;
  statusPasien: string;
  
  noAntrian: string;
  prioritas: string;
  caraDatang: string;
  
  noSep?: string;
  statusKunjungan: string;
  
  userPendaftarId?: string;
  dokterTujuanId?: string;
  dokterTujuan?: {
    id: string;
    username: string;
    namaLengkap?: string;
    role: string;
  };
  
  createdAt: string;
  updatedAt: string;
}
