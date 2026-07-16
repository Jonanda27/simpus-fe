export interface ProgramUKM {
  id: string;
  kodeProgram: string;
  namaProgram: string;
  deskripsi: string;
  statusAktif: boolean;
  _count?: {
    registerPasien: number;
  };
}

export interface RegisterUKM {
  id: string;
  pasienId: string;
  programId: string;
  tanggalDaftar: string;
  statusProgram: string;
  pasien?: any;
  program?: ProgramUKM;
  logPemantauan?: LogPemantauanUKM[];
}

export interface LogPemantauanUKM {
  id: string;
  registerId: string;
  tanggal: string;
  petugasId: string;
  catatan: string;
  tindakLanjut: string;
  statusBerobat: string;
}

export interface UKMState {
  programs: ProgramUKM[];
  registerList: RegisterUKM[];
  isLoading: boolean;
  
  fetchDashboardStats: () => Promise<void>;
  fetchPasienByProgram: (programId: string) => Promise<void>;
  addLogPemantauan: (registerId: string, data: Partial<LogPemantauanUKM>) => Promise<boolean>;
}
