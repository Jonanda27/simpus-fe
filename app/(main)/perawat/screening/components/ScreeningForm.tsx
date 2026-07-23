'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { screeningSchema, type ScreeningFormData } from '../schema';

// Steps Components
import Step1Umum from './Step1Umum';
import Step2Triage from './Step2Triage';
import Step3RisikoPTM from './Step3RisikoPTM';
import Step4InfeksiJiwa from './Step4InfeksiJiwa';
import Step5Hasil from './Step5Hasil';

import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useScreeningStore } from '@/store/screening.store';
import { CreateScreeningPayload } from '@/types/screening.types';
import { Kunjungan } from '@/types/kunjungan.types';
import { rawatJalanService } from '@/services/rawatJalan.service';

export default function ScreeningForm({ kunjungan }: { kunjungan: Kunjungan }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const { createScreening, isSubmitting, error: storeError, clearError } = useScreeningStore();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(screeningSchema) as any,
    mode: 'onTouched',
    defaultValues: {
      nomorRegistrasi: kunjungan.noAntrian || '1',
      jenisKedatangan: 'Poli',
      usia: new Date().getFullYear() - new Date(kunjungan.pasien.tanggalLahir).getFullYear() || 30,
      riwayatKeluarga: [],
      faktorRisikoLain: [],
      ptmJantung: [],
      ptmStroke: [],
      ptmKanker: [],
      gejalaTB: [],
      riwayatTB: [],
      faktorRisikoTB: [],
      jiwaEmosional: [],
      jiwaSosial: [],
      jiwaPsikologis: [],
      jiwaBunuhDiri: [],
      jiwaZat: [],
      jiwaRiwayat: [],
      tindakLanjut: [],
      gulaDarahSewaktu: undefined,
    } as any
  });

  const jenisKedatangan = watch('jenisKedatangan');
  const usia = watch('usia');

  // Conditional Logic for Steps
  const shouldSkipTriage = false;
  const shouldSkipPTM = usia !== undefined && usia < 15;

  const stepsDef = [
    { id: 1, title: 'Umum & Vital', skipped: false },
    { id: 2, title: 'Triage Pasien', skipped: shouldSkipTriage },
    { id: 3, title: 'Risiko & PTM', skipped: shouldSkipPTM },
    { id: 4, title: 'Infeksi & Jiwa', skipped: false },
    { id: 5, title: 'Hasil & Rujukan', skipped: false },
  ];

  // Helper to find the next valid step
  const getNextStepId = (currentId: number) => {
    let nextId = currentId + 1;
    while (nextId <= 5 && stepsDef.find(s => s.id === nextId)?.skipped) {
      nextId++;
    }
    return Math.min(nextId, 5);
  };

  // Helper to find the previous valid step
  const getPrevStepId = (currentId: number) => {
    let prevId = currentId - 1;
    while (prevId >= 1 && stepsDef.find(s => s.id === prevId)?.skipped) {
      prevId--;
    }
    return Math.max(prevId, 1);
  };

  const nextStep = async () => {
    // Validasi sementara dimatikan untuk memudahkan pengetesan
    setCurrentStep(getNextStepId(currentStep));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(getPrevStepId(currentStep));
    window.scrollTo(0, 0);
  };


  const toTitleCase = (str: string | undefined | null): string | undefined => {
    if (!str) return undefined;
    return str.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  };

  const onSubmit = async (data: any) => {
    const payload: CreateScreeningPayload = {
      pasienId: kunjungan.pasienId,
      kunjunganId: kunjungan.id,
      // Step 1: Umum & Vital
      jenisKedatangan: data.jenisKedatangan,
      usia: data.usia,
      keluhanUtama: toTitleCase(data.keluhanUtama),
      lamaKeluhan: toTitleCase(data.lamaKeluhan),
      riwayatPenyakitSekarang: toTitleCase(data.riwayatPenyakitSekarang),
      riwayatPenyakitDahulu: toTitleCase(data.riwayatPenyakitDahulu),
      riwayatAlergi: toTitleCase(data.riwayatAlergi),
      riwayatOperasi: toTitleCase(data.riwayatOperasi),
      riwayatRawatInap: toTitleCase(data.riwayatRawatInap),
      riwayatTransfusi: toTitleCase(data.riwayatTransfusi),
      tinggiBadan: data.tinggiBadan,
      beratBadan: data.beratBadan,
      lingkarPerut: data.lingkarPerut,
      imt: data.imt,
      tekananDarahSistolik: data.tekananDarahSistolik,
      tekananDarahDiastolik: data.tekananDarahDiastolik,
      nadi: data.nadi,
      frekuensiNapas: data.pernapasan,
      suhuTubuh: data.suhuTubuh,
      saturasiOksigen: data.saturasiOksigen,
      skalaNyeri: data.skalaNyeri,
      // Step 2: Triage
      kategoriTriage: data.kategoriTriage || 'Hijau',
      jalanNapas: data.jalanNapas,
      sirkulasi: data.sirkulasi,
      kesadaran: data.kesadaran,
      // Step 3: PTM & Faktor Risiko
      riwayatKeluarga: data.riwayatKeluarga || [],
      merokok: data.merokok,
      lamaMerokok: data.lamaMerokok,
      jumlahBatang: data.jumlahBatang,
      alkohol: data.alkohol,
      narkoba: data.narkoba,
      aktivitasFisik: data.aktivitasFisik,
      polaMakan: data.polaMakan,
      konsumsiBuah: data.konsumsiBuah,
      konsumsiSayur: data.konsumsiSayur,
      konsumsiGaram: data.konsumsiGaram,
      konsumsiGula: data.konsumsiGula,
      tidur: data.tidur,
      faktorRisikoLain: data.faktorRisikoLain || [],
      ptmJantung: data.ptmJantung || [],
      ptmStroke: data.ptmStroke || [],
      ptmKanker: data.ptmKanker || [],
      gulaDarahSewaktu: data.gulaDarahSewaktu,
      catatanPenyakitKeluarga: toTitleCase(data.catatanPenyakitKeluarga),
      catatanGayaHidup: toTitleCase(data.catatanGayaHidup),
      catatanRisikoLain: toTitleCase(data.catatanRisikoLain),
      catatanPtmKhusus: toTitleCase(data.catatanPtmKhusus),
      catatanPengukuran: toTitleCase(data.catatanPengukuran),
      // Step 4: TB & Jiwa
      gejalaTB: data.gejalaTB || [],
      kontakTB: data.kontakTB,
      riwayatTB: data.riwayatTB || [],
      faktorRisikoTB: data.faktorRisikoTB || [],
      hasilTB: data.hasilTB,
      jiwaEmosional: data.jiwaEmosional || [],
      jiwaSosial: data.jiwaSosial || [],
      jiwaPsikologis: data.jiwaPsikologis || [],
      jiwaBunuhDiri: data.jiwaBunuhDiri || [],
      jiwaZat: data.jiwaZat || [],
      jiwaRiwayat: data.jiwaRiwayat || [],
      catatanSkriningTB: toTitleCase(data.catatanSkriningTB),
      catatanKesehatanJiwa: toTitleCase(data.catatanKesehatanJiwa),
      // Step 5: Hasil
      statusKesehatan: data.statusKesehatan,
      prioritasPelayanan: data.prioritasPelayanan,
      tindakLanjut: data.tindakLanjut || [],
      catatanPetugas: toTitleCase(data.catatanPetugas),
    };

    try {
      await createScreening(payload);
      
      // Save alergi if added
      if (data.alergiArr && data.alergiArr.length > 0) {
        await rawatJalanService.simpanAlergi(kunjungan.id, data.alergiArr);
      }

      setIsSuccess(true);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: err?.response?.data?.message || storeError || 'Terjadi kesalahan sistem',
      });
    }
  };


  const fillDummyData = () => {
    setValue('nomorRegistrasi', kunjungan.noAntrian || '1');
    setValue('jenisKedatangan', 'Poli');
    setValue('usia', new Date().getFullYear() - new Date(kunjungan.pasien.tanggalLahir).getFullYear() || 30);
    setValue('keluhanUtama', 'Demam tinggi naik turun sejak 3 hari yang lalu disertai flu berat.');
    setValue('lamaKeluhan', '3 hari');
    setValue('tinggiBadan', 170);
    setValue('beratBadan', 65);
    setValue('lingkarPerut', 80);
    setValue('tekananDarahSistolik', 120);
    setValue('tekananDarahDiastolik', 80);
    setValue('suhuTubuh', 37.2);
    setValue('nadi', 84);
    setValue('pernapasan', 20);
    setValue('saturasiOksigen', 98);
    setValue('skalaNyeri', 2);
    setValue('kategoriTriage', 'Hijau');
    setValue('jalanNapas', 'Bebas');
    setValue('sirkulasi', 'Nadi kuat, akral hangat');
    setValue('kesadaran', 'Compos Mentis');
    setValue('merokok', 'Tidak');
    setValue('statusKesehatan', 'Rendah');
    setValue('prioritasPelayanan', 'Rutin');
    
    Swal.fire({
      icon: 'success',
      title: 'Data Dummy Terisi!',
      text: 'Semua kolom wajib di seluruh step telah diisi dengan data dummy.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (isSuccess) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Screening Berhasil Disimpan!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Data klinis pasien telah di-input ke Rekam Medis Elektronik (RME) dan rujukan internal telah dikirimkan.
        </p>
        <button 
          onClick={() => router.push('/perawat/screening')}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
        >
          Screening Pasien Lain
        </button>
      </div>
    );
  }

  // Filter steps that are not skipped for the Stepper UI
  const visibleSteps = stepsDef;

  return (
    <div className="w-full">
      {/* Action Header for Testing */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 flex justify-between items-center rounded-none">
        <div className="text-sm text-blue-800">
          <strong>Mode Testing:</strong> Ingin mengisi form dengan cepat untuk pengetesan?
        </div>
        <button
          type="button"
          onClick={fillDummyData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors rounded-none"
        >
          Isi Data Dummy Otomatis
        </button>
      </div>

      {/* Stepper UI */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
          
          {visibleSteps.map((step) => {
            const isCurrent = currentStep === step.id;
            const isPast = currentStep > step.id;
            const isSkipped = step.skipped;
            
            let circleColor = 'bg-gray-100 border-gray-200 text-gray-400';
            if (isCurrent) circleColor = 'bg-blue-600 border-white text-white shadow-md ring-4 ring-blue-100';
            else if (isSkipped) circleColor = 'bg-gray-50 border-gray-200 text-gray-300 opacity-50 border-dashed';
            else if (isPast) circleColor = 'bg-blue-600 border-white text-white';

            return (
              <div key={step.id} className={`flex flex-col items-center ${isSkipped ? 'opacity-50' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all duration-300 ${circleColor}`}>
                  {isSkipped ? '-' : (isPast ? <CheckCircle2 className="w-5 h-5" /> : step.id)}
                </div>
                <span className={`mt-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-center hidden sm:block ${isCurrent || isPast ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step.title}
                </span>
                {isSkipped && <span className="text-[10px] text-gray-400 hidden sm:block italic">(Bypass)</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit(onSubmit, (err) => {
        console.error('Validation Errors keys:', Object.keys(err));
        console.error('Validation Errors detailed:', JSON.stringify(err, null, 2));
        Swal.fire({
          icon: 'warning',
          title: 'Form Belum Lengkap',
          html: `<div class="text-left"><p class="font-bold">Harap periksa kembali isian form Anda:</p><pre class="text-xs mt-2 bg-gray-100 p-2 max-h-40 overflow-y-auto">${JSON.stringify(err, null, 2)}</pre></div>`,
        });
      })}>
        <div className="min-h-[400px]">
          <div className={currentStep === 1 ? 'block' : 'hidden'}>
            <Step1Umum register={register} errors={errors} watch={watch} setValue={setValue} />
          </div>
          <div className={currentStep === 2 && !shouldSkipTriage ? 'block' : 'hidden'}>
            <Step2Triage register={register} errors={errors} watch={watch} setValue={setValue} />
          </div>
          <div className={currentStep === 3 && !shouldSkipPTM ? 'block' : 'hidden'}>
            <Step3RisikoPTM register={register} errors={errors} watch={watch} />
          </div>
          <div className={currentStep === 4 ? 'block' : 'hidden'}>
            <Step4InfeksiJiwa register={register} errors={errors} watch={watch} setValue={setValue} />
          </div>
          <div className={currentStep === 5 ? 'block' : 'hidden'}>
            <Step5Hasil register={register} errors={errors} watch={watch} />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className={`inline-flex items-center px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              currentStep === 1 
                ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Kembali
          </button>
          
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Selanjutnya
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-2.5 rounded-xl font-medium text-sm text-white bg-green-600 hover:bg-green-700 shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Hasil Screening'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
