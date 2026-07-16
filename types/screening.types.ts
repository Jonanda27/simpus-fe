// ─────────────────────────────────────────────────────────
// Tipe data untuk modul Screening & Triage (Perawat)
// ─────────────────────────────────────────────────────────

/** Data tambahan tersimpan dalam JSON column di DB */
export interface ScreeningDataTambahan {
  triage?: {
    jalanNapas?: string | null;
    sirkulasi?: string | null;
    kesadaran?: string | null;
  };
  riwayat?: {
    lamaKeluhan?: string | null;
    riwayatPenyakitSekarang?: string | null;
    riwayatPenyakitDahulu?: string | null;
    riwayatAlergi?: string | null;
    riwayatOperasi?: string | null;
    riwayatRawatInap?: string | null;
    riwayatTransfusi?: string | null;
  };
  gayaHidup?: {
    lamaMerokok?: string | null;
    jumlahBatang?: string | null;
    alkohol?: string | null;
    narkoba?: string | null;
    aktivitasFisik?: string | null;
    polaMakan?: string | null;
    konsumsiBuah?: string | null;
    konsumsiSayur?: string | null;
    konsumsiGaram?: string | null;
    konsumsiGula?: string | null;
    tidur?: string | null;
  };
  faktorRisiko?: {
    faktorRisikoLain?: string[];
    ptmJantung?: string[];
    ptmStroke?: string[];
    ptmKanker?: string[];
    gulaDarahSewaktu?: number | null;
  };
  tb?: {
    gejalaTB?: string[];
    kontakTB?: string | null;
    riwayatTB?: string[];
    faktorRisikoTB?: string[];
    hasilTB?: string | null;
  };
  jiwa?: {
    jiwaEmosional?: string[];
    jiwaSosial?: string[];
    jiwaPsikologis?: string[];
    jiwaBunuhDiri?: string[];
    jiwaZat?: string[];
    jiwaRiwayat?: string[];
  };
  catatan?: {
    catatanPenyakitKeluarga?: string | null;
    catatanGayaHidup?: string | null;
    catatanRisikoLain?: string | null;
    catatanPtmKhusus?: string | null;
    catatanPengukuran?: string | null;
    catatanSkriningTB?: string | null;
    catatanKesehatanJiwa?: string | null;
  };
}

/** Shape data Screening yang dikembalikan dari API */
export interface Screening {
  id: string;
  pasienId: string;
  kunjunganId: string;

  tanggalScreening: string;
  petugas: string;
  jenisKedatangan: string;
  kategoriTriage: string;

  // Tanda Vital & Antropometri
  tinggiBadan?: number | null;
  beratBadan?: number | null;
  lingkarPerut?: number | null;
  imt?: number | null;
  tekananDarahSistolik?: number | null;
  tekananDarahDiastolik?: number | null;
  nadi?: number | null;
  frekuensiNapas?: number | null;
  suhuTubuh?: number | null;
  saturasiOksigen?: number | null;
  skalaNyeri?: number | null;

  // Keluhan & Gaya Hidup
  keluhanUtama?: string | null;
  riwayatKeluarga: string[];
  merokok?: string | null;

  // Hasil
  statusKesehatan?: string | null;
  prioritasPelayanan?: string | null;
  catatanPetugas?: string | null;

  // JSON column
  dataTambahan?: ScreeningDataTambahan | null;

  createdAt: string;
  updatedAt: string;
}

/** Payload untuk membuat screening baru (POST /screening) */
export interface CreateScreeningPayload {
  pasienId: string;
  kunjunganId: string;

  // Step 1: Umum & Vital
  jenisKedatangan?: string;
  usia?: number;
  keluhanUtama?: string;
  lamaKeluhan?: string;
  riwayatPenyakitSekarang?: string;
  riwayatPenyakitDahulu?: string;
  riwayatAlergi?: string;
  riwayatOperasi?: string;
  riwayatRawatInap?: string;
  riwayatTransfusi?: string;
  tinggiBadan?: number;
  beratBadan?: number;
  lingkarPerut?: number;
  imt?: number;
  tekananDarahSistolik?: number;
  tekananDarahDiastolik?: number;
  nadi?: number;
  frekuensiNapas?: number;
  suhuTubuh?: number;
  saturasiOksigen?: number;
  skalaNyeri?: number;

  // Step 2: Triage
  kategoriTriage?: string;
  jalanNapas?: string;
  sirkulasi?: string;
  kesadaran?: string;

  // Step 3: PTM & Faktor Risiko
  riwayatKeluarga?: string[];
  merokok?: string;
  lamaMerokok?: string;
  jumlahBatang?: string;
  alkohol?: string;
  narkoba?: string;
  aktivitasFisik?: string;
  polaMakan?: string;
  konsumsiBuah?: string;
  konsumsiSayur?: string;
  konsumsiGaram?: string;
  konsumsiGula?: string;
  tidur?: string;
  faktorRisikoLain?: string[];
  ptmJantung?: string[];
  ptmStroke?: string[];
  ptmKanker?: string[];
  gulaDarahSewaktu?: number;
  catatanPenyakitKeluarga?: string;
  catatanGayaHidup?: string;
  catatanRisikoLain?: string;
  catatanPtmKhusus?: string;
  catatanPengukuran?: string;

  // Step 4: TB & Jiwa
  gejalaTB?: string[];
  kontakTB?: string;
  riwayatTB?: string[];
  faktorRisikoTB?: string[];
  hasilTB?: string;
  jiwaEmosional?: string[];
  jiwaSosial?: string[];
  jiwaPsikologis?: string[];
  jiwaBunuhDiri?: string[];
  jiwaZat?: string[];
  jiwaRiwayat?: string[];
  catatanSkriningTB?: string;
  catatanKesehatanJiwa?: string;

  // Step 5: Hasil
  statusKesehatan?: string;
  prioritasPelayanan?: string;
  tindakLanjut?: string[];
  catatanPetugas?: string;
}

/** Response standar API */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
