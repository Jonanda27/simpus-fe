import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ScreeningFormData } from '../schema';
import { ShieldAlert, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Step2Props {
  register: UseFormRegister<ScreeningFormData>;
  errors: FieldErrors<ScreeningFormData>;
  watch: UseFormWatch<ScreeningFormData>;
  setValue: UseFormSetValue<ScreeningFormData>;
}

export default function Step2Triage({ register, errors, watch, setValue }: Step2Props) {
  const selectedTriage = watch('kategoriTriage');

  const triageOptions = [
    {
      value: 'Merah',
      label: 'MERAH (Resusitasi)',
      desc: 'Mengancam nyawa. Harus segera ditangani (0 menit).',
      icon: ShieldAlert,
      colorClass: 'bg-red-500 hover:bg-red-600 text-white border-red-600',
      activeClass: 'ring-4 ring-red-300 ring-offset-2',
      inactiveClass: 'opacity-70 grayscale',
    },
    {
      value: 'Kuning',
      label: 'KUNING (Urgensi)',
      desc: 'Serius tapi stabil. Tangani ≤ 30 menit.',
      icon: AlertCircle,
      colorClass: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600',
      activeClass: 'ring-4 ring-yellow-300 ring-offset-2',
      inactiveClass: 'opacity-70 grayscale',
    },
    {
      value: 'Hijau',
      label: 'HIJAU (Tidak Gawat)',
      desc: 'Cedera ringan. Dapat menunggu antrian.',
      icon: CheckCircle,
      colorClass: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600',
      activeClass: 'ring-4 ring-emerald-300 ring-offset-2',
      inactiveClass: 'opacity-70 grayscale',
    },
    {
      value: 'Hitam',
      label: 'HITAM (Meninggal)',
      desc: 'Cedera tidak dapat diselamatkan / DOA.',
      icon: XCircle,
      colorClass: 'bg-gray-800 hover:bg-gray-900 text-white border-gray-900',
      activeClass: 'ring-4 ring-gray-400 ring-offset-2',
      inactiveClass: 'opacity-70 grayscale',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Kategori Triage */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Kategori Triage</h3>
        <p className="text-sm text-gray-500 mb-6">Pilih prioritas penanganan gawat darurat berdasarkan kondisi klinis pasien saat ini.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {triageOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedTriage === opt.value;
            
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('kategoriTriage', opt.value as any, { shouldValidate: true })}
                className={`flex flex-col p-4 rounded-xl border text-left transition-all duration-300 ${opt.colorClass} ${
                  isSelected ? opt.activeClass : opt.inactiveClass
                }`}
              >
                <div className="flex items-center mb-3">
                  <Icon className="w-8 h-8 mr-2" />
                  <span className="font-extrabold tracking-wide">{opt.label}</span>
                </div>
                <p className="text-sm opacity-90">{opt.desc}</p>
              </button>
            );
          })}
        </div>
        {/* Hidden input to register the value to react-hook-form */}
        <input type="hidden" {...register('kategoriTriage')} />
      </div>

      {/* Primary Assessment */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Penilaian Primer (Primary Survey)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Airway (Jalan Napas)</label>
            <select {...register('jalanNapas')} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih kondisi...</option>
              <option value="Bebas">Bebas / Clear</option>
              <option value="Gargling">Gargling (Cairan)</option>
              <option value="Snoring">Snoring (Pangkal Lidah)</option>
              <option value="Stridor">Stridor (Sumbatan Laring)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Circulation (Sirkulasi)</label>
            <select {...register('sirkulasi')} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih kondisi...</option>
              <option value="Normal">Normal (CRT &lt; 2 dtk)</option>
              <option value="Pucat">Pucat / Akral Dingin</option>
              <option value="Perdarahan">Perdarahan Aktif Masif</option>
              <option value="Nadi Lemah">Nadi Lemah / Syok</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Disability (Kesadaran)</label>
            <select {...register('kesadaran')} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-black">
              <option value="">Pilih kondisi...</option>
              <option value="Alert">Alert (Sadar Penuh)</option>
              <option value="Verbal">Verbal (Respon Panggilan)</option>
              <option value="Pain">Pain (Respon Nyeri)</option>
              <option value="Unresponsive">Unresponsive (Koma)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
