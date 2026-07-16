import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { ScreeningFormData } from '../schema';
import { Activity, HeartPulse, Cigarette, Utensils, AlertCircle } from 'lucide-react';

interface Step3Props {
  register: UseFormRegister<ScreeningFormData>;
  errors: FieldErrors<ScreeningFormData>;
  watch: UseFormWatch<ScreeningFormData>;
}

export default function Step3RisikoPTM({ register, errors, watch }: Step3Props) {
  const isPerokok = watch('merokok');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* 1. Riwayat Penyakit Keluarga */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-none">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <HeartPulse className="w-5 h-5 mr-2 text-red-500" />
          1. Riwayat Penyakit Keluarga
        </h3>
        <p className="text-sm text-gray-500 mb-4">Centang penyakit yang pernah/sedang diderita oleh keluarga inti pasien.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Hipertensi', 'Diabetes Mellitus', 'Stroke', 'Penyakit Jantung', 'Kanker', 'Asma', 'TBC'].map((penyakit) => (
            <label key={penyakit} className="flex items-center space-x-3 p-3 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors rounded-none">
              <input 
                type="checkbox" 
                value={penyakit}
                {...register('riwayatKeluarga')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">{penyakit}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Observasi (Opsional)</label>
          <textarea {...register('catatanPenyakitKeluarga')} rows={2} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900" placeholder="Tambahkan catatan khusus terkait riwayat penyakit keluarga..."></textarea>
        </div>
      </div>

      {/* 2. Gaya Hidup & Konsumsi */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-none">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Utensils className="w-5 h-5 mr-2 text-emerald-600" />
          2. Gaya Hidup & Konsumsi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Baris 1: Rokok & Alkohol */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Cigarette className="w-4 h-4 mr-1 text-gray-500" /> Status Merokok
            </label>
            <select {...register('merokok')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Ya">Ya, perokok aktif</option>
              <option value="Mantan">Mantan perokok</option>
              <option value="Tidak">Tidak pernah merokok</option>
            </select>
          </div>
          
          {isPerokok === 'Ya' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lama Merokok (Thn)</label>
                <input type="text" {...register('lamaMerokok')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 placeholder-gray-400 text-gray-900" placeholder="Contoh: 5 Tahun" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jml Batang/Hari</label>
                <input type="text" {...register('jumlahBatang')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 placeholder-gray-400 text-gray-900" placeholder="Contoh: 12 Batang" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Konsumsi Alkohol</label>
            <select {...register('alkohol')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Penggunaan Narkoba</label>
            <select {...register('narkoba')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>

          <div className="md:col-span-3 border-t border-gray-100 my-2"></div>

          {/* Baris 2: Makanan & Aktivitas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Aktivitas Fisik (Olahraga)</label>
            <select {...register('aktivitasFisik')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Baik">&gt; 150 menit / minggu</option>
              <option value="Cukup">Kurang dari 150 mnt/mgg</option>
              <option value="Kurang">Tidak pernah / jarang</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kualitas Tidur</label>
            <select {...register('tidur')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Cukup">Cukup (6-8 jam)</option>
              <option value="Kurang">Kurang (&lt; 6 jam)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pola Makan Umum</label>
            <select {...register('polaMakan')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Sehat">Sehat & Teratur</option>
              <option value="Tidak Sehat">Kurang Sehat / Banyak Fastfood</option>
            </select>
          </div>

          {/* Konsumsi Detail */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Konsumsi Sayur</label>
            <select {...register('konsumsiSayur')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Cukup">Tiap Hari</option>
              <option value="Kurang">Jarang / Tidak Pernah</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Konsumsi Buah</label>
            <select {...register('konsumsiBuah')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Cukup">Tiap Hari</option>
              <option value="Kurang">Jarang / Tidak Pernah</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Konsumsi Gula</label>
            <select {...register('konsumsiGula')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Tinggi">Tinggi (&gt; 4 sdm/hari)</option>
              <option value="Normal">Normal</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Konsumsi Garam</label>
            <select {...register('konsumsiGaram')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih...</option>
              <option value="Tinggi">Sering Makanan Asin/Berpengawet</option>
              <option value="Normal">Normal</option>
              <option value="Rendah">Rendah Garam</option>
            </select>
          </div>

        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Observasi (Opsional)</label>
          <textarea {...register('catatanGayaHidup')} rows={2} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900" placeholder="Tambahkan catatan khusus terkait gaya hidup dan konsumsi..."></textarea>
        </div>
      </div>

      {/* 3. Faktor Risiko Lain */}
      <div className="bg-amber-50/50 p-6 border border-amber-200 shadow-sm rounded-none">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
          3. Faktor Risiko Lain & Kerentanan Khusus
        </h3>
        <p className="text-sm text-gray-500 mb-4">Centang jika pasien memiliki kerentanan khusus berikut ini.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'Obesitas', 'Hipertensi', 'Diabetes', 'Kolesterol Tinggi', 
            'Riwayat Jatuh', 'Disabilitas', 'Kehamilan', 'Lansia', 'Risiko Kekerasan'
          ].map((risiko) => (
            <label key={risiko} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors rounded-none">
              <input 
                type="checkbox" 
                value={risiko}
                {...register('faktorRisikoLain')}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700 font-medium">{risiko}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-amber-200/50">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Observasi (Opsional)</label>
          <textarea {...register('catatanRisikoLain')} rows={2} className="w-full px-4 py-2.5 rounded-none border border-amber-200 focus:ring-2 focus:ring-amber-500 placeholder-gray-400 text-gray-900" placeholder="Tambahkan catatan khusus terkait faktor risiko lain..."></textarea>
        </div>
      </div>

      {/* 4. Skrining PTM Khusus */}
      <div className="bg-red-50/30 p-6 border border-red-100 shadow-sm rounded-none">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <HeartPulse className="w-5 h-5 mr-2 text-red-600" />
          4. Skrining PTM Khusus (Gejala Klinis)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Penyakit Jantung */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Penyakit Jantung</h4>
            <div className="space-y-2">
              {['Nyeri dada', 'Sesak napas', 'Riwayat serangan jantung'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" value={item} {...register('ptmJantung')} className="w-4 h-4 text-red-600 rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Stroke */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Stroke</h4>
            <div className="space-y-2">
              {['Riwayat stroke', 'Kelemahan anggota gerak', 'Gangguan bicara / pelo'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" value={item} {...register('ptmStroke')} className="w-4 h-4 text-red-600 rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Kanker */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Kanker (Tumor)</h4>
            <div className="space-y-2">
              {['Benjolan abnormal', 'Penurunan BB drastis', 'Riwayat keluarga kanker'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" value={item} {...register('ptmKanker')} className="w-4 h-4 text-red-600 rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-red-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Observasi (Opsional)</label>
          <textarea {...register('catatanPtmKhusus')} rows={2} className="w-full px-4 py-2.5 rounded-none border border-red-200 focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-gray-900" placeholder="Tambahkan catatan khusus terkait gejala klinis PTM..."></textarea>
        </div>
      </div>

      {/* 5. Laboratorium Sederhana */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-none">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          5. Pengukuran Tambahan (Jika Ada)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="max-w-xs">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gula Darah Sewaktu (GDS) - mg/dL</label>
            <input 
              type="number" 
              {...register('gulaDarahSewaktu', { valueAsNumber: true })}
              className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900"
              placeholder="120"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Observasi (Opsional)</label>
            <textarea {...register('catatanPengukuran')} rows={2} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900" placeholder="Tambahkan catatan khusus..."></textarea>
          </div>
        </div>
      </div>
      
    </div>
  );
}
