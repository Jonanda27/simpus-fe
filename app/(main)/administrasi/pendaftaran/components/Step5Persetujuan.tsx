import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Checkbox } from '@/components/ui/Checkbox';
import { SignaturePad } from '@/components/ui/SignaturePad';
import { WebcamCapture } from '@/components/ui/WebcamCapture';
import { RegistrationFormData } from '../schema';
import { AlertCircle, FileUp, Fingerprint } from 'lucide-react';

interface Step5Props {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
  setValue: UseFormSetValue<RegistrationFormData>;
  watch: UseFormWatch<RegistrationFormData>;
}

export default function Step5Persetujuan({ register, errors, setValue, watch }: Step5Props) {
  const metodePersetujuan = watch('metodePersetujuan') || 'Tanda Tangan';
  
  const handleCapJariUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('capJari', reader.result as string, { shouldValidate: true, shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Persetujuan & Sinkronisasi (Consent)</h2>
        <p className="text-sm text-gray-500 mt-1">Harap baca dan setujui ketentuan layanan kesehatan kami.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-none p-4 flex gap-3">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          Dengan menyetujui formulir ini, data identitas dan medis Anda akan dikelola dalam 
          Rekam Medis Elektronik (RME) yang aman.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <div className="bg-white border border-gray-200 rounded-none p-5 shadow-sm hover:border-blue-300 transition-colors">
          <Checkbox
            label="Persetujuan Pengobatan Umum (General Consent)"
            description="Saya menyetujui untuk dilakukan tindakan medis dasar dan perawatan di fasilitas kesehatan ini."
            {...register('persetujuanPengobatan')}
            error={errors.persetujuanPengobatan?.message}
          />
        </div>
        
        <div className="bg-white border border-gray-200 rounded-none p-5 shadow-sm hover:border-blue-300 transition-colors">
          <Checkbox
            label="Persetujuan Rekam Medis Elektronik"
            description="Saya menyetujui data kesehatan saya dicatat secara elektronik sesuai standar Kementerian Kesehatan."
            {...register('persetujuanRekamMedis')}
            error={errors.persetujuanRekamMedis?.message}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-none p-5 shadow-sm hover:border-blue-300 transition-colors">
          <Checkbox
            label="Integrasi SATUSEHAT"
            description="Saya menyetujui data kunjungan dan rekam medis saya dikirimkan ke platform SATUSEHAT Kemenkes RI."
            {...register('persetujuanSatusehat')}
            error={errors.persetujuanSatusehat?.message}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-none p-5 shadow-sm hover:border-blue-300 transition-colors">
          <Checkbox
            label="Persetujuan Pengingat via SMS/WhatsApp (Opsional)"
            description="Saya bersedia menerima notifikasi jadwal kunjungan, obat, atau informasi kesehatan lainnya via WhatsApp."
            {...register('persetujuanReminder')}
            error={errors.persetujuanReminder?.message}
          />
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Kamera Wajah */}
          <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm flex flex-col h-full">
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-1">Foto Wajah Pasien *</h3>
              <p className="text-sm text-gray-500 mb-6">
                Wajib melampirkan foto wajah pasien secara real-time untuk verifikasi kehadiran.
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <input type="hidden" {...register('fotoWajah')} />
              <div className="w-full max-w-sm">
                <WebcamCapture 
                  onCapture={(base64) => setValue('fotoWajah', base64 || '', { shouldValidate: true })}
                  error={errors.fotoWajah?.message}
                />
              </div>
            </div>
          </div>

          {/* Card Opsi Tanda Tangan / Cap Jari */}
          <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm flex flex-col h-full">
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-1">Bukti Persetujuan *</h3>
              <p className="text-sm text-gray-500 mb-4">
                Pilih metode persetujuan yang nyaman bagi pasien atau wali.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-none hover:bg-gray-100 transition-colors w-full sm:w-auto">
                  <input 
                    type="radio" 
                    value="Tanda Tangan" 
                    {...register('metodePersetujuan')} 
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                  />
                  Tanda Tangan Digital
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-none hover:bg-gray-100 transition-colors w-full sm:w-auto">
                  <input 
                    type="radio" 
                    value="Cap Jari" 
                    {...register('metodePersetujuan')} 
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                  />
                  Cap Jari
                </label>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-sm">
                {metodePersetujuan === 'Tanda Tangan' ? (
                  <>
                    <input type="hidden" {...register('tandaTangan')} />
                    <SignaturePad 
                      onEnd={(dataUrl) => {
                        setValue('tandaTangan', dataUrl, { shouldValidate: true, shouldDirty: true });
                      }}
                      error={errors.tandaTangan?.message}
                    />
                  </>
                ) : (
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex flex-row gap-4 w-full h-48">
                      <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-none p-4 flex flex-col items-center justify-center text-center transition-colors hover:bg-gray-100">
                        <Fingerprint className="w-10 h-10 text-blue-500 animate-pulse mb-2" />
                        <p className="text-sm font-semibold text-gray-700">Telunjuk Kanan</p>
                        <p className="text-xs text-gray-500 mb-4">Posisikan jari di alat scan</p>
                        <button type="button" className="bg-blue-600 text-white text-xs px-4 py-2 rounded-none hover:bg-blue-700 transition-colors shadow-sm">
                          Mulai Scan
                        </button>
                      </div>
                      <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-none p-4 flex flex-col items-center justify-center text-center transition-colors hover:bg-gray-100">
                        <Fingerprint className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm font-semibold text-gray-700">Telunjuk Kiri</p>
                        <p className="text-xs text-gray-500 mb-4">Scan opsional (cadangan)</p>
                        <button type="button" className="bg-gray-200 text-gray-600 text-xs px-4 py-2 rounded-none hover:bg-gray-300 transition-colors shadow-sm">
                          Mulai Scan
                        </button>
                      </div>
                    </div>
                    <input type="hidden" {...register('capJari')} value="scanned_mock" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-8 border-t border-gray-100">
        <h3 className="text-xs font-semibold text-gray-400 mb-2 tracking-wider uppercase">Metadata Sistem (Otomatis)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400 bg-gray-50 p-4 rounded-none">
          <div>
            <span className="block font-medium mb-1">User / Petugas:</span>
            <span>Self-Service (Pasien)</span>
          </div>
          <div>
            <span className="block font-medium mb-1">Loket:</span>
            <span>Pendaftaran Online</span>
          </div>
          <div>
            <span className="block font-medium mb-1">Device & IP:</span>
            <span>Recorded in system</span>
          </div>
          <div>
            <span className="block font-medium mb-1">Audit Trail:</span>
            <span>Created on submit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
