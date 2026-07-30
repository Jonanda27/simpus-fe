import Swal from 'sweetalert2';

export const fillDokterDummyDataHelper = (setSoapData: React.Dispatch<React.SetStateAction<any>>) => {
  setSoapData({
    keluhanUtama: 'Pasien mengeluh demam tinggi sejak 3 hari yang lalu, disertai pusing, mual, dan badan terasa lemas.',
    riwayatPenyakitSekarang: 'Demam meningkat di sore dan malam hari. Pasien mengaku nafsu makan menurun dan sempat muntah 1x tadi pagi.',
    riwayatPenyakitDahulu: 'Riwayat Maag / Gastritis 1 tahun lalu. Tidak ada riwayat hipertensi atau diabetes.',
    riwayatAlergi: 'Tidak ada alergi obat maupun makanan.',
    keadaanUmum: 'Tampak Sakit Sedang',
    kesadaran: 'Compos Mentis (Sadar Penuh)',
    pemeriksaanFisik: 'Kepala: Normocephal, Mata: Anemis (-/-), Ikterik (-/-). Leher: Pembesaran KGB (-). Thorax: Vesikuler (+/+), Rhonchi (-/-), Wheezing (-/-). Abdomen: Supel, Nyeri tekan epigastrium (+), Bising usus normal. Ekstremitas: Akral hangat, CRT < 2d.',
    hasilPenunjang: 'Laboratorium: Hb 13.5 g/dL, Leukosit 8.400 /uL, Trombosit 210.000 /uL, Widal Typhi O 1/160.',
    diagnosisKlinis: 'Febris ec Susp. Fever / Demam Dengue + Gastritis Akut',
    rencanaTerapi: '1. Istirahat cukup (Bed rest)\n2. Minum air putih 2-3 Liter/hari\n3. Paracetamol 500mg 3x1 tablet bila demam\n4. Antasida Doen 3x1 tablet sebelum makan\n5. Evaluasi darah rutin ulang bila demam > 3 hari',
    instruksiMedis: 'Edukasi tanda bahaya perdarahan (mimisan, gusi berdarah). Segera ke UGD jika lemas berat atau muntah terus menerus.',
    tujuanPerawatan: 'Pemulihan kondisi suhu tubuh normal dan eliminasi keluhan mual/nyeri ulu hati pasien',
    prognosisKode: '170968001',
    prognosisDisplay: 'Sanam / Baik (Bonam)',
    diagnosisArr: [
      {
        icd10Id: 'A90',
        kode_icd10: 'A90',
        nama_diagnosis: 'Dengue fever [classical dengue]',
        jenisDiagnosis: 'UTAMA'
      },
      {
        icd10Id: 'K29.7',
        kode_icd10: 'K29.7',
        nama_diagnosis: 'Gastritis, unspecified',
        jenisDiagnosis: 'SEKUNDER'
      }
    ]
  });

  Swal.fire({
    icon: 'success',
    title: 'Data Dummy Dokter Terisi 100%!',
    text: 'Semua field SOAP (Subjektif, Objektif, Asesmen, Plan/Rencana), Diagnosa ICD-10, & Tujuan Perawatan terisi otomatis.',
    timer: 2000,
    showConfirmButton: false,
  });
};

export const AVAILABLE_LAB_TESTS = [
  { category: 'HEMATOLOGI', defaultOpen: true, tests: ['Hematologi Rutin/CBC', 'Hematologi Lengkap (CBC, LED, Hitung Jenis)', 'Hemoglobin', 'LED', 'Eritrosit', 'Leukosit', 'Trombosit', 'Hematokrit', 'Golongan Darah A,B,O & Rh', 'Gambaran Darah Tepi'] },
  { category: 'URINALISA & FAECES', defaultOpen: true, tests: ['Urine Rutin', 'Protein Total (Urine 24 jam)', 'Faeces Rutin', 'Darah Samar (FIT)'] },
  { category: 'KIMIA DARAH DASAR', defaultOpen: true, tests: ['Glukosa Puasa', 'Glukosa 2 Jam PP', 'Glukosa Sewaktu', 'Ureum', 'Kreatinin', 'Cholesterol Total', 'Trigliserida', 'SGOT', 'SGPT'] },
  { category: 'ANEMIA', defaultOpen: false, tests: ['Hematologi Rutin + Retikulosit', 'Retikulosit', 'Besi', 'UIBC Direk', 'TIBC', 'Ferritin', 'Transferrin'] },
  { category: 'FAAL HEMOSTASIS', defaultOpen: false, tests: ['Waktu Perdarahan', 'Waktu Pembekuan', 'Waktu Protrombin', 'Waktu Trombin', 'APTT', 'Fibrinogen', 'D-Dimer', 'AT III'] },
  { category: 'FAAL HATI (Lanjutan)', defaultOpen: false, tests: ['Gamma GT', 'Fosfatase Alkali', 'CHE', 'Bilirubin Total', 'Bilirubin Direk', 'Protein Total', 'Albumin', 'Globulin'] },
  { category: 'DIABETES (Lanjutan)', defaultOpen: false, tests: ['TTGO', 'HbA1c', 'Insulin'] },
  { category: 'LEMAK (Lanjutan)', defaultOpen: false, tests: ['Cholesterol LDL Direk', 'Cholesterol HDL', 'Apo A1', 'Apo B'] },
  { category: 'JANTUNG', defaultOpen: false, tests: ['CK', 'CK-MB', 'Troponin I', 'hs-Troponin I Kuantitatif', 'LDH', 'NT-Pro BNP'] },
  { category: 'GINJAL - HIPERTENSI (Lanjutan)', defaultOpen: false, tests: ['Asam Urat', 'Cystatin-C', 'Albumin Urine Kuantitatif', 'Rasio Albumin-Kreatinin', 'Renin (PRA)', 'Aldosteron'] },
  { category: 'ELEKTROLIT - GAS DARAH', defaultOpen: false, tests: ['Na, K, Cl', 'Kalsium', 'Fosfor Anorganik', 'Magnesium', 'Analisis Gas Darah'] },
  { category: 'INFEKSI & HEPATITIS', defaultOpen: false, tests: ['HBsAg', 'Anti-HBs', 'Anti-HCV', 'Anti-HAV IgM', 'Widal', 'Dengue NS1 Antigen', 'Anti-Dengue IgG & IgM', 'Malaria (Mikroskopik)', 'Anti-HIV', 'VDRL/RPR'] },
  { category: 'TIROID', defaultOpen: false, tests: ['FT3', 'FT4', 'TSHs', 'T3 (Total)', 'T4 (Total)'] },
  { category: 'TUMOR MARKER', defaultOpen: false, tests: ['AFP', 'CEA', 'PSA', 'CA 125', 'CA 15-3', 'CA 19-9'] },
  { category: 'IMUNOLOGI', defaultOpen: false, tests: ['ASTO', 'RF', 'CRP Kualitatif', 'hs-CRP', 'ANA (IF)', 'Anti-dsDNA'] }
];
