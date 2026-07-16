import { z } from 'zod';

// Helper to preprocess optional numbers (handles "", NaN, undefined)
const optionalNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null || isNaN(val as any) ? undefined : Number(val)),
  z.number().optional()
);

// Helper to preprocess arrays (handles false, undefined, empty string by turning them into [])
const checkboxArray = z.preprocess(
  (val) => (Array.isArray(val) ? val : []),
  z.array(z.string()).optional()
);

export const screeningSchema = z.object({
  // STEP 1: UMUM
  nomorRegistrasi: z.string().min(1, 'Nomor Registrasi wajib diisi'),
  jenisKedatangan: z.enum(['IGD', 'Poli', 'Lainnya']),
  usia: z.number().min(0, 'Usia tidak valid'),
  
  // Keluhan Utama Lengkap
  keluhanUtama: z.string().min(1, 'Keluhan utama wajib diisi'),
  lamaKeluhan: z.string().optional(),
  riwayatPenyakitSekarang: z.string().optional(),
  riwayatPenyakitDahulu: z.string().optional(),
  riwayatAlergi: z.string().optional(),
  riwayatOperasi: z.string().optional(),
  riwayatRawatInap: z.string().optional(),
  riwayatTransfusi: z.string().optional(),
  
  // Tanda Vital Lengkap (Wajib)
  tinggiBadan: z.number().min(1, 'Tinggi badan wajib diisi'),
  beratBadan: z.number().min(1, 'Berat badan wajib diisi'),
  lingkarPerut: optionalNumber,
  imt: optionalNumber,
  tekananDarahSistolik: z.number().min(1, 'Sistolik wajib diisi'),
  tekananDarahDiastolik: z.number().min(1, 'Diastolik wajib diisi'),
  suhuTubuh: z.number().min(30, 'Suhu tubuh wajib diisi'),
  nadi: z.number().min(1, 'Nadi wajib diisi'),
  pernapasan: z.number().min(1, 'Pernapasan wajib diisi'),
  saturasiOksigen: optionalNumber,
  skalaNyeri: optionalNumber,

  // STEP 2: TRIAGE (Conditional for IGD)
  kategoriTriage: z.enum(['Merah', 'Kuning', 'Hijau', 'Hitam', '']).optional(),
  jalanNapas: z.string().optional(),
  sirkulasi: z.string().optional(),
  kesadaran: z.string().optional(), // AVPU/GCS untuk Triage

  // STEP 3: PTM & FAKTOR RISIKO (Conditional for Usia >= 15)
  riwayatKeluarga: checkboxArray,
  
  // Gaya Hidup
  merokok: z.enum(['Ya', 'Tidak', 'Mantan', '']).optional(),
  lamaMerokok: z.string().optional(),
  jumlahBatang: z.string().optional(),
  alkohol: z.enum(['Ya', 'Tidak', '']).optional(),
  narkoba: z.enum(['Ya', 'Tidak', '']).optional(),
  aktivitasFisik: z.enum(['Kurang', 'Cukup', 'Baik', '']).optional(),
  polaMakan: z.enum(['Sehat', 'Tidak Sehat', '']).optional(),
  text: z.string().optional(),
  konsumsiBuah: z.enum(['Cukup', 'Kurang', '']).optional(),
  konsumsiSayur: z.enum(['Cukup', 'Kurang', '']).optional(),
  konsumsiGaram: z.enum(['Tinggi', 'Normal', 'Rendah', '']).optional(),
  konsumsiGula: z.enum(['Tinggi', 'Normal', 'Rendah', '']).optional(),
  tidur: z.enum(['Cukup', 'Kurang', '']).optional(),

  // Faktor Risiko Lain
  faktorRisikoLain: checkboxArray,

  // PTM Lanjutan (Jantung, Stroke, Kanker)
  ptmJantung: checkboxArray,
  ptmStroke: checkboxArray,
  ptmKanker: checkboxArray,

  gulaDarahSewaktu: optionalNumber,

  // STEP 4: TB & JIWA
  gejalaTB: checkboxArray,
  kontakTB: z.enum(['Ya', 'Tidak', 'Tidak Tahu', '']).optional(),
  riwayatTB: checkboxArray,
  faktorRisikoTB: checkboxArray,
  hasilTB: z.enum(['Suspek TB', 'Bukan Suspek', 'Perlu Pemeriksaan Dahak', 'Perlu Foto Thoraks', '']).optional(),
  
  // Jiwa
  jiwaEmosional: checkboxArray,
  jiwaSosial: checkboxArray,
  jiwaPsikologis: checkboxArray,
  jiwaBunuhDiri: checkboxArray,
  jiwaZat: checkboxArray,
  jiwaRiwayat: checkboxArray,

  // CATATAN OBSERVASI (STEP 3 & 4)
  catatanPenyakitKeluarga: z.string().optional(),
  catatanGayaHidup: z.string().optional(),
  catatanRisikoLain: z.string().optional(),
  catatanPtmKhusus: z.string().optional(),
  catatanPengukuran: z.string().optional(),
  catatanSkriningTB: z.string().optional(),
  catatanKesehatanJiwa: z.string().optional(),

  // STEP 5: HASIL
  statusKesehatan: z.enum(['Rendah', 'Sedang', 'Tinggi', '']).optional(),
  prioritasPelayanan: z.enum(['Rutin', 'Penting', 'Gawat Darurat', '']).optional(),
  tindakLanjut: checkboxArray,
  catatanPetugas: z.string().optional(),
});

export type ScreeningFormData = z.infer<typeof screeningSchema>;
