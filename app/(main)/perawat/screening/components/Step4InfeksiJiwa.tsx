import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ScreeningFormData } from '../schema';
import { Stethoscope, BrainCircuit } from 'lucide-react';

interface Step4Props {
  register: UseFormRegister<ScreeningFormData>;
  errors: FieldErrors<ScreeningFormData>;
  watch: UseFormWatch<ScreeningFormData>;
  setValue: UseFormSetValue<ScreeningFormData>;
}

export default function Step4InfeksiJiwa({ register, watch, setValue }: Step4Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* 6. Skrining Tuberkulosis (TB) */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-none">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
            6. Skrining Tuberkulosis (TB)
          </h3>
        </div>
        
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gejala TB */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Gejala TB (Centang jika ada)</h4>
              <div className="space-y-2">
                {[
                  'Batuk ≥ 2 minggu', 
                  'Batuk berdarah', 
                  'Demam > 1 bulan', 
                  'Berkeringat malam (tanpa aktivitas)', 
                  'Berat badan turun drastis', 
                  'Nafsu makan turun', 
                  'Sesak napas / nyeri dada'
                ].map((item) => (
                  <label key={item} className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded transition-colors">
                    <input type="checkbox" value={item} {...register('gejalaTB')} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Riwayat & Faktor Risiko */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Riwayat TB</h4>
                <div className="space-y-2">
                  {[
                    'Pernah sakit TB sebelumnya', 
                    'Sedang dalam pengobatan TB', 
                    'Riwayat Putus Obat / MDR-TB'
                  ].map((item) => (
                    <label key={item} className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded transition-colors">
                      <input type="checkbox" value={item} {...register('riwayatTB')} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Faktor Risiko Khusus</h4>
                <div className="space-y-2">
                  {[
                    'Pasien HIV / AIDS', 
                    'Diabetes Mellitus', 
                    'Gizi Buruk / Malnutrisi',
                    'Lansia (> 60 Tahun)',
                    'Balita kontak erat dengan pasien TB'
                  ].map((item) => (
                    <label key={item} className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded transition-colors">
                      <input type="checkbox" value={item} {...register('faktorRisikoTB')} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kontak Erat dengan Pasien TB?</label>
              <select {...register('kontakTB')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
                <option value="">Pilih...</option>
                <option value="Ya">Ya, serumah / kontak erat</option>
                <option value="Tidak">Tidak ada</option>
                <option value="Tidak Tahu">Tidak Tahu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kesimpulan Skrining TB</label>
              <select {...register('hasilTB')} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black bg-blue-50/30">
                <option value="">Pilih Kesimpulan...</option>
                <option value="Bukan Suspek">Bukan Suspek TB</option>
                <option value="Suspek TB">Suspek TB (Risiko Tinggi)</option>
                <option value="Perlu Pemeriksaan Dahak">Rujuk Pemeriksaan Dahak (TCM)</option>
                <option value="Perlu Foto Thoraks">Rujuk Rontgen Thoraks</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Observasi TB (Opsional)</label>
            <textarea {...register('catatanSkriningTB')} rows={2} className="w-full px-4 py-2.5 rounded-none border border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-900" placeholder="Tambahkan catatan khusus terkait observasi TB..."></textarea>
          </div>
        </div>
      </div>

      {/* 7. Skrining Kesehatan Jiwa */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-none">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <BrainCircuit className="w-5 h-5 mr-2 text-purple-600" />
            7. Skrining Kesehatan Jiwa & Psikologi
          </h3>
          <p className="text-sm text-gray-500 mt-1 ml-7">Berdasarkan observasi atau pengakuan pasien dalam 30 hari terakhir.</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Kondisi Emosional</h4>
            <div className="space-y-2">
              {['Sedih berkepanjangan', 'Merasa cemas / khawatir', 'Sulit tidur nyenyak', 'Mudah marah / tersinggung', 'Tidak bersemangat'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-50 rounded">
                  <input type="checkbox" value={item} {...register('jiwaEmosional')} className="w-4 h-4 text-purple-600 rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Fungsi Sosial</h4>
            <div className="space-y-2">
              {['Menarik diri dari lingkungan', 'Gangguan aktivitas harian', 'Penurunan kinerja pekerjaan', 'Konflik dalam keluarga'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-50 rounded">
                  <input type="checkbox" value={item} {...register('jiwaSosial')} className="w-4 h-4 text-purple-600 rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-red-800 mb-3 border-b border-gray-200 pb-2">Risiko Berat & Bunuh Diri</h4>
            <div className="space-y-2 bg-red-50/50 p-2 rounded border border-red-100">
              {['Sering berpikir tentang kematian', 'Memiliki niat bunuh diri', 'Pernah percobaan bunuh diri'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-red-50 rounded">
                  <input type="checkbox" value={item} {...register('jiwaBunuhDiri')} className="w-4 h-4 text-red-600 rounded" />
                  <span className="text-sm font-medium text-red-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Gangguan Psikologis</h4>
            <div className="space-y-2">
              {['Mendengar suara bisikan (Halusinasi)', 'Pikiran tidak masuk akal (Waham)', 'Perilaku agresif / mengamuk', 'Sering kebingungan'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-50 rounded">
                  <input type="checkbox" value={item} {...register('jiwaPsikologis')} className="w-4 h-4 text-purple-600 rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Penggunaan Obat & Zat</h4>
            <div className="space-y-2">
              {['Konsumsi alkohol rutin', 'Penggunaan narkoba/NAPZA', 'Ketergantungan obat tidur'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-50 rounded">
                  <input type="checkbox" value={item} {...register('jiwaZat')} className="w-4 h-4 text-purple-600 rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Riwayat Penanganan</h4>
            <div className="space-y-2">
              {['Pernah didiagnosis gangguan jiwa', 'Sedang konsumsi obat psikiatri rutin', 'Riwayat dirawat di RS Jiwa'].map((item) => (
                <label key={item} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-50 rounded">
                  <input type="checkbox" value={item} {...register('jiwaRiwayat')} className="w-4 h-4 text-purple-600 rounded" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
          
        </div>

        <div className="p-6 pt-0 mt-2 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <label className="block text-sm font-bold text-purple-900 mb-1 mt-4">Status Psikologis Utama (FHIR SATUSEHAT 8693-4)</label>
            <select {...register('statusPsikologis')} className="w-full px-4 py-2.5 rounded-none border border-purple-300 focus:ring-2 focus:ring-purple-500 text-gray-900 bg-purple-50/40 font-semibold text-sm">
              <option value="Tenang / Normal">Tenang / Normal (Compos Mentis)</option>
              <option value="Cemas / Khawatir">Cemas / Khawatir / Gelisah</option>
              <option value="Sedih / Depresi">Sedih / Berduka / Depresi</option>
              <option value="Gelisah / Agresif">Gelisah / Agresif / Mengamuk</option>
              <option value="Kebingungan / Halusinasi">Kebingungan / Halusinasi / Disorientasi</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1 mt-4">Catatan Observasi Psikologis (Opsional)</label>
            <textarea {...register('catatanKesehatanJiwa')} rows={1} className="w-full px-4 py-2 rounded-none border border-gray-300 focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-900 text-sm" placeholder="Catatan khusus observasi kesehatan jiwa..."></textarea>
          </div>
        </div>
      </div>
      
    </div>
  );
}
