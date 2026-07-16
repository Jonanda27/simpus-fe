import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { ScreeningFormData } from '../schema';
import { FileCheck, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Step5Props {
  register: UseFormRegister<ScreeningFormData>;
  errors: FieldErrors<ScreeningFormData>;
  watch: UseFormWatch<ScreeningFormData>;
}

export default function Step5Hasil({ register, watch }: Step5Props) {
  const data = watch();

  // Auto Referral Logic based on New Detailed Data
  const getRekomendasiPoli = () => {
    const rekomendasi = [];

    // Triage UGD Priority
    if (data.jenisKedatangan === 'IGD') {
      if (data.kategoriTriage === 'Merah' || data.kategoriTriage === 'Kuning') {
        rekomendasi.push({ poli: 'Tindakan Medis UGD', reason: `Kategori Triage: ${data.kategoriTriage}` });
      }
    }

    // TB Suspect Logic
    if (data.hasilTB === 'Suspek TB' || (data.gejalaTB && data.gejalaTB.length >= 2)) {
      rekomendasi.push({ poli: 'Poli Paru / Poli DOTS (TB)', reason: 'Menunjukkan risiko/gejala Tuberkulosis' });
    }

    // Jiwa Logic
    if (data.jiwaBunuhDiri && data.jiwaBunuhDiri.length > 0) {
      rekomendasi.push({ poli: 'Poli Jiwa (URGENT)', reason: 'Risiko Bunuh Diri Terdeteksi!' });
    } else if (data.jiwaPsikologis && data.jiwaPsikologis.length > 0) {
      rekomendasi.push({ poli: 'Poli Kesehatan Jiwa / Psikologi', reason: 'Skrining Gangguan Psikologis positif' });
    }

    // PTM Logic
    const sistolik = data.tekananDarahSistolik || 0;
    const diastolik = data.tekananDarahDiastolik || 0;
    const gds = data.gulaDarahSewaktu || 0;

    if (sistolik >= 140 || diastolik >= 90 || gds >= 200) {
      rekomendasi.push({ poli: 'Poli Penyakit Dalam / Poli Umum', reason: 'Tanda vital / GDS melebihi batas normal (Risiko PTM Tinggi)' });
    }
    
    // PTM Khusus
    if (data.ptmJantung && data.ptmJantung.length > 0) {
      rekomendasi.push({ poli: 'Poli Jantung / Poli Dalam', reason: 'Skrining Penyakit Jantung Positif' });
    }
    if (data.ptmStroke && data.ptmStroke.length > 0) {
      rekomendasi.push({ poli: 'Poli Saraf / Neurologi', reason: 'Skrining Gejala Stroke Positif' });
    }

    if (rekomendasi.length === 0) {
      rekomendasi.push({ poli: 'Poli Umum', reason: 'Skrining dasar normal, dilanjutkan ke pemeriksaan dokter umum.' });
    }

    return rekomendasi;
  };

  const rekomendasiList = getRekomendasiPoli();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Rekomendasi Sistem (Read-Only) */}
      <div className="bg-emerald-50/50 p-6 border border-emerald-200 shadow-sm rounded-none">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
          Rekomendasi AI / Sistem (Otomatis)
        </h3>
        
        <div className="space-y-3">
          {rekomendasiList.map((rek, idx) => (
            <div key={idx} className="bg-white p-4 border border-emerald-100 flex items-start rounded-none">
              <ArrowRight className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Disarankan ke: {rek.poli}</p>
                <p className="text-sm text-gray-500 mt-1">{rek.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kesimpulan Akhir & Tindak Lanjut */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-none">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <FileCheck className="w-5 h-5 mr-2 text-blue-600" />
          Kesimpulan Akhir Skrining & Tindak Lanjut
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status Risiko Kesehatan</label>
            <select {...register('statusKesehatan')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih Status...</option>
              <option value="Rendah">Risiko Rendah (Aman)</option>
              <option value="Sedang">Risiko Sedang (Perlu Perhatian)</option>
              <option value="Tinggi">Risiko Tinggi (Bahaya / Urgent)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prioritas Pelayanan</label>
            <select {...register('prioritasPelayanan')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih Prioritas...</option>
              <option value="Rutin">Rutin (Antrian Biasa)</option>
              <option value="Penting">Penting (Dahulukan)</option>
              <option value="Gawat Darurat">Gawat Darurat (Langsung Masuk IGD)</option>
            </select>
          </div>

          <div className="md:col-span-2 mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Tambahan Petugas (Opsional)</label>
            <textarea 
              {...register('catatanPetugas')}
              rows={4}
              className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400 text-gray-900"
              placeholder="Tambahkan observasi khusus yang tidak tercakup dalam form di atas..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
