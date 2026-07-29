export interface User {
  id: number;
  username: string;
  email: string | null;
  role: 'ADMINISTRASI' | 'PERAWAT' | 'DOKTER' | 'ADMIN' | 'KASIR' | 'APOTEKER' | 'LABORATORIUM' | 'PETUGAS_UKM';
  nama_lengkap?: string;
  namaLengkap?: string;
  status_aktif: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  poliklinikId?: string;
  poliklinik?: {
    id: string;
    kodePoli: string;
    namaPoli: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password?: string;
}
