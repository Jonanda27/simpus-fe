export interface Perusahaan {
  id: string;
  kodePerusahaan: string;
  namaPerusahaan: string;
  alamat?: string;
  noTelepon?: string;
  email?: string;
  namaPic?: string;
  noHpPic?: string;
  noPks?: string;
  tanggalMulai?: string;
  tanggalBerakhir?: string;
  fileDokumenPks?: string;
  statusKerjasama: 'AKTIF' | 'TIDAK_AKTIF';
  cakupanLayanan?: string;
  plafonTahunan?: number;
}
