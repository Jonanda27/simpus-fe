"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Stethoscope, User, FileText, Activity, Syringe, Pill, 
  ClipboardList, ShieldCheck, FileDown, CheckCircle2,
  Clock, AlertTriangle, Users, Search, Loader2, RefreshCw, TestTubes,
  ChevronDown, ChevronRight, Printer
} from 'lucide-react';
import { icd10Service } from '@/services/icd10.service';
import { icd9Service } from '@/services/icd9.service';
import { useRawatJalanStore } from '@/store/rawatJalan.store';
import { SOAPPayload } from '@/types/rawatJalan.types';
import Swal from 'sweetalert2';
import QueueSidebar from './components/QueueSidebar';
import PatientHeader from './components/PatientHeader';
import TabSubjektif from './components/TabSubjektif';
import TabObjektif from './components/TabObjektif';
import TabAsesmen from './components/TabAsesmen';
import TabPlan from './components/TabPlan';
import TabLaboratorium from './components/TabLaboratorium';
import TabTindakan from './components/TabTindakan';
import TabResep from './components/TabResep';
import TabRujukan from './components/TabRujukan';
import ScreeningModal from './components/ScreeningModal';
import RiwayatRMEModal from './components/RiwayatRMEModal';
import DischargePlanning from './components/DischargePlanning';
import { useReactToPrint } from 'react-to-print';
import { CetakHasilLab } from '@/components/laboratorium/CetakHasilLab';
import { laboratoriumService } from '@/services/laboratorium.service';

export default function DokterRawatJalanPage() {
  const [activeTab, setActiveTab] = useState('SOAP_S');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Store
  const {
    antrian, selectedKunjungan, rekamMedis, screeningData, diagnosaList, tindakanList, alergiList, fase,
    isLoadingAntrian, isLoadingRekamMedis, isSaving,
    fetchAntrian, pilihPasien, simpanSOAP, simpanDiagnosa, simpanTindakan, simpanOrderLab, simpanAlergi, selesaikanPemeriksaan, tundaPemeriksaan,
    setFase, simpanResep, simpanRujukan, pulang, clearSelection,
  } = useRawatJalanStore();

  // SOAP local form state
  const [soapData, setSoapData] = useState<SOAPPayload>({});

  // Removed separate ICD10 states since TabAsesmen handles it now
  
  // Tindakan (ICD-9) - Tab Tindakan/Prosedur
  const [icd9Query, setIcd9Query] = useState('');
  const [icd9Results, setIcd9Results] = useState<any[]>([]);
  const [isSearchingICD9, setIsSearchingICD9] = useState(false);
  const [selectedProsedur, setSelectedProsedur] = useState<any[]>([]);

  // Resep State (Frontend Only)
  const [obatQuery, setObatQuery] = useState('');
  const [obatResults, setObatResults] = useState<any[]>([]);
  const [selectedObat, setSelectedObat] = useState<any[]>([]);

  // Rujukan State (Frontend Only)
  const [rujukanData, setRujukanData] = useState({
    faskesTujuan: '',
    poliTujuan: '',
    alasanRujukan: '',
  });

  // Screening modal
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
  
  // Riwayat RME modal
  const [isRiwayatModalOpen, setIsRiwayatModalOpen] = useState(false);

  // Lab Modal & Print Ref
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [orderLabData, setOrderLabData] = useState<any>(null);
  const [isLoadingLab, setIsLoadingLab] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Hasil_Lab_${selectedKunjungan?.pasien?.namaLengkap || 'Pasien'}`,
  });

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = printRef.current;
      const opt = {
        margin: 0,
        filename: `Hasil_Lab_${selectedKunjungan?.pasien?.namaLengkap || 'Pasien'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4' as const, orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error('Failed to generate PDF', e);
    }
  };

  const openLabModal = async () => {
    if (!selectedKunjungan) return;
    setIsLabModalOpen(true);
    setIsLoadingLab(true);
    try {
      const res = await laboratoriumService.getOrderByKunjungan(selectedKunjungan.id);
      if (res.success && res.data) {
        setOrderLabData(res.data);
      } else {
        setOrderLabData(null);
      }
    } catch (error) {
      console.error('Failed to fetch order lab', error);
      setOrderLabData(null);
    } finally {
      setIsLoadingLab(false);
    }
  };

  // Menunggu Lab Read-Only state
  const [isViewingLabOverlay, setIsViewingLabOverlay] = useState(true);

  useEffect(() => {
    setIsViewingLabOverlay(true);
  }, [selectedKunjungan]);

  // Resizable sidebar
  const [sidebarWidth, setSidebarWidth] = useState(384);

  // Fetch antrian on mount
  useEffect(() => {
    fetchAntrian();
  }, [fetchAntrian]);

  // Order Lab State
  const [labOrders, setLabOrders] = useState<string[]>([]);
  const [labNote, setLabNote] = useState('');
  
  const handleToggleLab = (test: string) => {
    if (labOrders.includes(test)) {
      setLabOrders(labOrders.filter(t => t !== test));
    } else {
      setLabOrders([...labOrders, test]);
    }
  };

  const availableLabTests = [
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

  const [openLabCategories, setOpenLabCategories] = useState<string[]>(
    availableLabTests.filter(c => c.defaultOpen).map(c => c.category)
  );

  const handleToggleLabCategory = (category: string) => {
    if (openLabCategories.includes(category)) {
      setOpenLabCategories(openLabCategories.filter(c => c !== category));
    } else {
      setOpenLabCategories([...openLabCategories, category]);
    }
  };

  // Sync SOAP data when rekamMedis or screeningData is loaded
  useEffect(() => {
    if (rekamMedis || screeningData) {
      setSoapData(prev => ({
        ...prev,
        keluhanUtama: rekamMedis?.keluhanUtama || screeningData?.keluhanUtama || prev.keluhanUtama || '',
        riwayatPenyakitSekarang: rekamMedis?.riwayatPenyakitSekarang || screeningData?.dataTambahan?.riwayat?.riwayatPenyakitSekarang || prev.riwayatPenyakitSekarang || '',
        riwayatPenyakitDahulu: rekamMedis?.riwayatPenyakitDahulu || screeningData?.dataTambahan?.riwayat?.riwayatPenyakitDahulu || prev.riwayatPenyakitDahulu || '',
        riwayatAlergi: rekamMedis?.riwayatAlergi || screeningData?.dataTambahan?.riwayat?.riwayatAlergi || prev.riwayatAlergi || '',
        alergiArr: (alergiList && alergiList.length > 0) 
          ? alergiList.map(a => ({
              alergiId: a.alergiId,
              nama_alergi: a.alergiMaster?.nama_alergi || a.manifestasiNama,
              manifestasiKode: a.manifestasiKode,
              manifestasiNama: a.manifestasiNama,
              tingkatKeparahan: a.tingkatKeparahan
            }))
          : (prev.alergiArr || []),
        keadaanUmum: rekamMedis?.keadaanUmum || 'Tampak Sakit Ringan',
        kesadaran: rekamMedis?.kesadaran || screeningData?.dataTambahan?.triage?.kesadaran || 'Compos Mentis (Sadar Penuh)',
        pemeriksaanFisik: rekamMedis?.pemeriksaanFisik || prev.pemeriksaanFisik || '',
        hasilPenunjang: rekamMedis?.hasilPenunjang || prev.hasilPenunjang || '',
        diagnosisKlinis: rekamMedis?.diagnosisKlinis || prev.diagnosisKlinis || '',
        rencanaTerapi: rekamMedis?.rencanaTerapi || prev.rencanaTerapi || '',
        instruksiMedis: rekamMedis?.instruksiMedis || prev.instruksiMedis || '',
      }));
    }
  }, [rekamMedis, screeningData, alergiList]);

  // Sync order lab data when loaded
  useEffect(() => {
    if (selectedKunjungan?.orderLab) {
      setLabOrders(selectedKunjungan.orderLab.details.map((d: any) => d.parameter));
      setLabNote(selectedKunjungan.orderLab.catatanKlinis || '');
    } else {
      setLabOrders([]);
      setLabNote('');
    }
  }, [selectedKunjungan]);

  // Sync diagnosa from store when loaded (put it into soapData.diagnosisArr instead of selectedDiagnoses)
  useEffect(() => {
    if (diagnosaList.length > 0) {
      setSoapData(prev => ({
        ...prev,
        diagnosisArr: diagnosaList.map(d => ({
          icd10Id: d.icd10.id_icd10,
          kode_icd10: d.icd10.kode_icd10,
          nama_diagnosis: d.icd10.nama_diagnosis,
          jenisDiagnosis: d.jenisDiagnosis,
        }))
      }));
    }
  }, [diagnosaList]);

  // Sync tindakan from store when loaded
  useEffect(() => {
    if (tindakanList && tindakanList.length > 0) {
      setSelectedProsedur(tindakanList.map(t => ({
        icd9Id: t.icd9Id,
        kode_icd9: t.icd9.kode,
        nama_prosedur: t.icd9.deskripsi,
        pelaksana: t.pelaksanaTeks || 'Dokter',
        catatan: t.catatanTindakan || '',
      })));
    } else {
      setSelectedProsedur([]);
    }
  }, [tindakanList]);

  // Auto-scroll tab
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  const fillDokterDummyData = () => {
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

  // ─── Handlers ───
  const handlePilihPasien = (kunjungan: any) => {
    // 1. Cek apakah ada pasien lain yang sedang DIPERIKSA (kecuali diri sendiri)
    const isExaminingOther = selectedKunjungan && selectedKunjungan.id !== kunjungan.id;
    
    if (isExaminingOther) {
      Swal.fire({
        icon: 'warning',
        title: 'Beralih Pasien?',
        text: `Anda sedang memeriksa ${selectedKunjungan.pasien.namaLengkap}. Simpan sebagai draf dan alihkan ke ${kunjungan.pasien.namaLengkap}?`,
        showCancelButton: true,
        confirmButtonText: 'Ya, Alihkan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#f59e0b'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await tundaPemeriksaan(soapData);
            pilihPasien(kunjungan);
          } catch {
            Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menunda pemeriksaan pasien sebelumnya.' });
          }
        }
      });
      return;
    }

    // 2. Jika pasien baru (MENUNGGU_DOKTER), minta konfirmasi
    if (kunjungan.statusKunjungan === 'MENUNGGU_DOKTER' || kunjungan.statusKunjungan === 'MENUNGGU') {
      Swal.fire({
        title: 'Mulai Pemeriksaan?',
        text: `Anda akan memulai pemeriksaan untuk ${kunjungan.pasien.namaLengkap}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#d1d5db',
        confirmButtonText: 'Ya, Mulai',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          pilihPasien(kunjungan);
        }
      });
      return;
    }

    // 3. Bypass untuk pasien yang sudah pernah DIPERIKSA, MENUNGGU_LAB, dll
    pilihPasien(kunjungan);
  };

  const handleSearchICD9 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setIcd9Query(query);
    if (query.length > 2) {
      setIsSearchingICD9(true);
      try {
        const res = await icd9Service.search(query);
        if (res.status === 'success') setIcd9Results(res.data);
      } catch { /* ignore */ } finally { setIsSearchingICD9(false); }
    } else { setIcd9Results([]); }
  };

  const handleSelectICD9 = (icd: any) => {
    if (!selectedProsedur.find(p => p.kode_icd9 === icd.kode_icd9)) {
      setSelectedProsedur([...selectedProsedur, { ...icd, pelaksana: 'Dokter' }]);
    }
    setIcd9Query('');
    setIcd9Results([]);
  };

  const handleRemoveProsedur = (kode: string) => {
    setSelectedProsedur(selectedProsedur.filter(p => p.kode_icd9 !== kode));
  };

  const handleSaveSOAP = async () => {
    try {
      await simpanSOAP(soapData);
      Swal.fire({ icon: 'success', title: 'SOAP Disimpan!', timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan data SOAP' });
    }
  };

  const handleSaveDiagnosa = async () => {
    if (!soapData.diagnosisArr || soapData.diagnosisArr.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Pilih minimal satu diagnosa ICD-10.' });
      return;
    }
    try {
      const payload = soapData.diagnosisArr.map(d => ({
        icd10Id: d.icd10Id,
        kode_icd10: d.kode_icd10,
        nama_diagnosis: d.nama_diagnosis,
        jenisDiagnosis: d.jenisDiagnosis,
      }));
      await simpanDiagnosa(payload);
      Swal.fire({ icon: 'success', title: 'Diagnosa Disimpan!', timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan diagnosa' });
    }
  };

  const handleSelesaikan = async () => {
    const confirm = await Swal.fire({
      icon: 'question',
      title: 'Selesaikan Pemeriksaan?',
      text: 'Pastikan semua data SOAP dan diagnosa sudah lengkap.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Selesaikan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#4f46e5',
    });
    if (!confirm.isConfirmed) return;

    try {
      // Save SOAP terlebih dahulu
      await simpanSOAP(soapData);
      
      // Save alergi jika ada
      if (soapData.alergiArr) {
        await simpanAlergi(soapData.alergiArr);
      }

      // Save diagnosa jika ada
      if (soapData.diagnosisArr && soapData.diagnosisArr.length > 0) {
        const payload = soapData.diagnosisArr.map(d => ({
          icd10Id: d.icd10Id,
          kode_icd10: d.kode_icd10,
          nama_diagnosis: d.nama_diagnosis,
          jenisDiagnosis: d.jenisDiagnosis,
        }));
        await simpanDiagnosa(payload);
      }
      // Save tindakan jika ada
      if (selectedProsedur.length > 0) {
        const tPayload = selectedProsedur.map(p => ({
          icd9Id: p.id_icd9 || p.icd9Id, // bisa datang dari search (id_icd9) atau DB (icd9Id)
          pelaksana: p.pelaksana,
          catatan: p.catatan,
        }));
        await simpanTindakan(tPayload);
      }
      // Selesaikan
      await selesaikanPemeriksaan();
      setActiveTab('SOAP_S');
      Swal.fire({ icon: 'success', title: 'Pemeriksaan Berhasil Disimpan!', text: 'Data rekam medis tersimpan. Pasien diteruskan ke antrian Farmasi / Selesai.', timer: 2500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyelesaikan pemeriksaan' });
    }
  };

  const handleTundaPemeriksaan = async () => {
    Swal.fire({
      title: 'Tunda Pemeriksaan?',
      text: 'Rekam medis akan disimpan sebagai draf dan pasien akan dikembalikan ke antrean.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Tunda',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#f59e0b',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await tundaPemeriksaan(soapData);
          Swal.fire({ icon: 'success', title: 'Ditunda', text: 'Pemeriksaan berhasil ditunda.', timer: 1500, showConfirmButton: false });
        } catch {
          Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menunda pemeriksaan.' });
        }
      }
    });
  };

  // Hitung usia
  const getAge = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  };

  // ─── Tabs ───
  const tabs = [
    { id: 'SOAP_S', label: 'S (Subjektif)', icon: <User className="w-4 h-4 mr-2" /> },
    { id: 'SOAP_O', label: 'O (Objektif)', icon: <Stethoscope className="w-4 h-4 mr-2" /> },
    { id: 'SOAP_A', label: 'A (Asesmen & Diagnosa)', icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: 'SOAP_P', label: 'P (Plan)', icon: <ClipboardList className="w-4 h-4 mr-2" /> },
    { id: 'LABORATORIUM', label: 'Laboratorium', icon: <TestTubes className="w-4 h-4 mr-2" /> },
    { id: 'TINDAKAN', label: 'Tindakan Medis', icon: <Activity className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* LEFT PANEL: QUEUE */}
      <QueueSidebar 
        sidebarWidth={sidebarWidth} 
        setSidebarWidth={setSidebarWidth} 
        antrian={antrian} 
        fetchAntrian={fetchAntrian} 
        isLoadingAntrian={isLoadingAntrian} 
        selectedKunjungan={selectedKunjungan} 
        pilihPasien={handlePilihPasien} 
        getAge={getAge} 
      />

      {/* RIGHT PANEL: MAIN FORM */}
      <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden min-w-0">
        {selectedKunjungan ? (
          <>
            {/* Header Pasien */}
            <PatientHeader 
              selectedKunjungan={selectedKunjungan} 
              getAge={getAge} 
              setIsScreeningModalOpen={setIsScreeningModalOpen} 
              setIsRiwayatModalOpen={setIsRiwayatModalOpen}
            />

            {/* Loading Overlay */}
            {isLoadingRekamMedis && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Memuat rekam medis...</p>
                </div>
              </div>
            )}

            {!isLoadingRekamMedis && selectedKunjungan.statusKunjungan === 'MENUNGGU_LAB' && isViewingLabOverlay && (
              <div className="flex-1 flex items-center justify-center bg-gray-100/50 p-8">
                <div className="bg-white p-10 shadow-md text-center max-w-md border-t-[6px] border-yellow-400 rounded-sm">
                  <TestTubes className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-slate-800 mb-2">Menunggu Hasil Lab</h2>
                  <p className="text-slate-600 font-medium mb-8 text-sm leading-relaxed">
                    Pasien ini sedang diarahkan ke ruang Laboratorium. Semua pengisian SOAP, Diagnosa, dan Tindakan akan <b>dinonaktifkan sementara</b> hingga hasil laboratorium dikirimkan kembali ke Anda.
                  </p>
                  <button 
                    onClick={() => setIsViewingLabOverlay(false)}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-none shadow-sm transition-colors w-full"
                  >
                    Lihat Data Rekam Medis
                  </button>
                </div>
              </div>
            )}

            {!isLoadingRekamMedis && selectedKunjungan.statusKunjungan !== 'MENUNGGU_LAB' && fase === 2 && (
              <DischargePlanning />
            )}

            {!isLoadingRekamMedis && (selectedKunjungan.statusKunjungan !== 'MENUNGGU_LAB' || !isViewingLabOverlay) && fase === 1 && (
              <>
                {/* Form Tabs */}
                <div 
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto border-b border-gray-200 bg-white shadow-sm z-10 w-full scrollbar-hide" 
                  style={{scrollbarWidth: 'none'}}
                >
                  {tabs.map((tab) => (
                    <button 
                      key={tab.id}
                      data-active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex items-center px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                        activeTab === tab.id 
                          ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30' 
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <fieldset disabled={selectedKunjungan.statusKunjungan === 'MENUNGGU_LAB'} className="contents">
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <div className="max-w-5xl mx-auto bg-white shadow-sm border border-gray-200 rounded-none overflow-hidden">
                    
                    {/* TAB S: Subjektif */}
                    {activeTab === 'SOAP_S' && (
                      <TabSubjektif soapData={soapData} setSoapData={setSoapData} setActiveTab={setActiveTab} />
                    )}

                    {/* TAB O: Objektif */}
                    {activeTab === 'SOAP_O' && (
                      <TabObjektif soapData={soapData} setSoapData={setSoapData} setActiveTab={setActiveTab} openLabModal={openLabModal} />
                    )}

                    {/* TAB A: Asesmen */}
                    {activeTab === 'SOAP_A' && (
                      <TabAsesmen soapData={soapData} setSoapData={setSoapData} setActiveTab={setActiveTab} />
                    )}

                    {/* TAB P: Plan */}
                    {activeTab === 'SOAP_P' && (
                      <TabPlan soapData={soapData} setSoapData={setSoapData} setActiveTab={setActiveTab} />
                    )}

                    {/* Removed TabDiagnosa Component from here since it's merged into TabAsesmen */}

                    {/* TAB: Order Laboratorium */}
                    {activeTab === 'LABORATORIUM' && (
                      <TabLaboratorium 
                        availableLabTests={availableLabTests} 
                        openLabCategories={openLabCategories} 
                        handleToggleLabCategory={handleToggleLabCategory} 
                        labOrders={labOrders} 
                        handleToggleLab={handleToggleLab} 
                        labNote={labNote} 
                        setLabNote={setLabNote} 
                        isSaving={isSaving} 
                        selectedKunjungan={selectedKunjungan} 
                        simpanOrderLab={simpanOrderLab} 
                        clearSelection={clearSelection} 
                        fetchAntrian={fetchAntrian} 
                        setActiveTab={setActiveTab} 
                      />
                    )}

                    {/* TAB: Tindakan ICD-9 */}
                    {activeTab === 'TINDAKAN' && (
                      <TabTindakan 
                        isSearchingICD9={isSearchingICD9} 
                        icd9Query={icd9Query} 
                        handleSearchICD9={handleSearchICD9} 
                        icd9Results={icd9Results} 
                        handleSelectICD9={handleSelectICD9} 
                        selectedProsedur={selectedProsedur} 
                        setSelectedProsedur={setSelectedProsedur} 
                        handleRemoveProsedur={handleRemoveProsedur} 
                      />
                    )}

                    {/* TAB RESEP OBAT */}
                    {activeTab === 'RESEP' && (
                      <TabResep 
                        obatQuery={obatQuery} 
                        setObatQuery={setObatQuery} 
                        selectedObat={selectedObat} 
                        setSelectedObat={setSelectedObat} 
                      />
                    )}

                    {/* TAB RUJUKAN */}
                    {activeTab === 'RUJUKAN' && (
                      <TabRujukan rujukanData={rujukanData} setRujukanData={setRujukanData} />
                    )}

                  </div>
                </div>
              </fieldset>

                {/* Bottom Footer Actions */}
                <div className="bg-white p-4 border-t border-gray-200 flex justify-between shadow-lg z-20 relative">
                  <div className="flex gap-2">
                    <button onClick={fillDokterDummyData} type="button" className="px-5 py-2.5 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm rounded-none shadow-sm flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Isi Dummy Otomatis
                    </button>
                    <button onClick={handleTundaPemeriksaan} disabled={isSaving} className="px-6 py-2.5 bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors text-sm rounded-none shadow-sm disabled:opacity-70 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Tunda Pemeriksaan
                    </button>
                    <button onClick={handleSaveSOAP} disabled={isSaving || selectedKunjungan.statusKunjungan === 'MENUNGGU_LAB'} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm rounded-none shadow-sm disabled:opacity-70">
                      Simpan Draf (SOAP)
                    </button>
                  </div>
                  <button onClick={handleSelesaikan} disabled={isSaving || selectedKunjungan.statusKunjungan === 'MENUNGGU_LAB'} className="px-8 py-2.5 bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors text-sm rounded-none shadow-sm disabled:opacity-70 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Selesaikan Pemeriksaan
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Users className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-semibold">Pilih pasien dari daftar antrian sebelah kiri</p>
          </div>
        )}
      </div>

      {/* SCREENING MODAL */}
      <ScreeningModal 
        isScreeningModalOpen={isScreeningModalOpen} 
        setIsScreeningModalOpen={setIsScreeningModalOpen} 
        screeningData={screeningData} 
      />

      {/* RIWAYAT RME MODAL */}
      <RiwayatRMEModal
        isOpen={isRiwayatModalOpen}
        onClose={() => setIsRiwayatModalOpen(false)}
        noRM={selectedKunjungan?.pasien?.noRM || ''}
      />

      {/* LAB RESULT MODAL */}
      {isLabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-indigo-50">
              <h3 className="text-xl font-extrabold text-indigo-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                Kertas Cetak Hasil Laboratorium
              </h3>
              <div className="flex items-center gap-3">
                <button onClick={handlePrint} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                  <Printer className="w-4 h-4" /> Cetak (Printer)
                </button>
                <button onClick={handleDownloadPdf} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                  <FileDown className="w-4 h-4" /> Download PDF
                </button>
                <button onClick={() => setIsLabModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-gray-200 flex justify-center">
              {isLoadingLab ? (
                <div className="py-20 flex flex-col items-center text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="font-medium">Memuat data laboratorium...</p>
                </div>
              ) : orderLabData ? (
                <div className="shadow-2xl overflow-hidden bg-white max-w-full" style={{ width: '210mm', minHeight: '297mm' }}>
                   <CetakHasilLab ref={printRef} data={orderLabData} />
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center text-gray-500">
                  <AlertTriangle className="w-12 h-12 mb-4 text-orange-400" />
                  <p className="font-bold text-lg text-gray-700 mb-1">Belum ada hasil laboratorium</p>
                  <p className="text-sm">Pasien ini belum memiliki order lab atau hasilnya belum diinput oleh pihak Laboratorium.</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setIsLabModalOpen(false)} className="px-6 py-2 bg-gray-800 text-white font-bold rounded-none hover:bg-gray-900 shadow-sm transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
