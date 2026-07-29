'use client';

import React from 'react';
import { Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';

interface StepHeadToToeProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

// 28 Organ Pemeriksaan Fisik Head to Toe SATUSEHAT v6.2
export const HEAD_TO_TOE_ORGANS = [
  { group: 'Kepala & Wajah', key: 'kepala', label: '1. Kepala', loinc: '10199-8' },
  { group: 'Kepala & Wajah', key: 'mata', label: '2. Mata', loinc: '10197-2' },
  { group: 'Kepala & Wajah', key: 'telinga', label: '3. Telinga', loinc: '10195-6' },
  { group: 'Kepala & Wajah', key: 'hidung', label: '4. Hidung', loinc: '10196-4' },
  { group: 'Kepala & Wajah', key: 'rambut', label: '5. Rambut', loinc: '10198-0' },
  { group: 'Kepala & Wajah', key: 'bibir', label: '6. Bibir', loinc: '10194-9' },
  { group: 'Kepala & Wajah', key: 'gigiGeligi', label: '7. Gigi Geligi', loinc: '10193-1' },
  { group: 'Kepala & Wajah', key: 'lidah', label: '8. Lidah', loinc: '10192-3' },
  { group: 'Kepala & Wajah', key: 'langitLangit', label: '9. Langit-langit', loinc: '10191-5' },
  
  { group: 'Leher & Tenggorokan', key: 'leher', label: '10. Leher', loinc: '10190-7' },
  { group: 'Leher & Tenggorokan', key: 'tenggorokan', label: '11. Tenggorokan', loinc: '10189-9' },
  { group: 'Leher & Tenggorokan', key: 'tonsil', label: '12. Tonsil', loinc: '10188-1' },
  
  { group: 'Dada & Punggung', key: 'dada', label: '13. Dada', loinc: '10187-3' },
  { group: 'Dada & Punggung', key: 'payudara', label: '14. Payudara', loinc: '10186-5' },
  { group: 'Dada & Punggung', key: 'punggung', label: '15. Punggung', loinc: '10185-7' },
  
  { group: 'Abdomen & Pelvis', key: 'perut', label: '16. Perut / Abdomen', loinc: '10184-0' },
  { group: 'Abdomen & Pelvis', key: 'genital', label: '17. Genital', loinc: '10183-2' },
  { group: 'Abdomen & Pelvis', key: 'anusDubur', label: '18. Anus / Dubur', loinc: '10182-4' },
  
  { group: 'Ekstremitas Atas', key: 'lenganAtas', label: '19. Lengan Atas', loinc: '10181-6' },
  { group: 'Ekstremitas Atas', key: 'lenganBawah', label: '20. Lengan Bawah', loinc: '10180-8' },
  { group: 'Ekstremitas Atas', key: 'jariTangan', label: '21. Jari Tangan', loinc: '10179-0' },
  { group: 'Ekstremitas Atas', key: 'kukuTangan', label: '22. Kuku Tangan', loinc: '10178-2' },
  { group: 'Ekstremitas Atas', key: 'persendianTangan', label: '23. Persendian Tangan', loinc: '10177-4' },
  
  { group: 'Ekstremitas Bawah', key: 'tungkaiAtas', label: '24. Tungkai Atas', loinc: '10176-6' },
  { group: 'Ekstremitas Bawah', key: 'tungkaiBawah', label: '25. Tungkai Bawah', loinc: '10175-8' },
  { group: 'Ekstremitas Bawah', key: 'jariKaki', label: '26. Jari Kaki', loinc: '10174-1' },
  { group: 'Ekstremitas Bawah', key: 'kukuKaki', label: '27. Kuku Kaki', loinc: '10173-3' },
  { group: 'Ekstremitas Bawah', key: 'persendianKaki', label: '28. Persendian Kaki', loinc: '10172-5' },
];

export default function StepHeadToToe({ register, watch, setValue }: StepHeadToToeProps) {
  // Group organs by body region
  const groupedOrgans = HEAD_TO_TOE_ORGANS.reduce((acc: any, organ) => {
    if (!acc[organ.group]) acc[organ.group] = [];
    acc[organ.group].push(organ);
    return acc;
  }, {});

  const setAllNormal = () => {
    HEAD_TO_TOE_ORGANS.forEach((organ) => {
      setValue(`headToToe.${organ.key}.status`, 'Normal');
      setValue(`headToToe.${organ.key}.catatan`, 'Tidak ada kelainan');
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Quick Action */}
      <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Pemeriksaan Fisik Head to Toe (28 Organ SATUSEHAT)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Pemeriksaan fisik terstruktur sesuai spesifikasi FHIR Observation Kemenkes RI v6.2
          </p>
        </div>
        <button
          type="button"
          onClick={setAllNormal}
          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-bold rounded-none flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Set Semua Normal (Tak Ada Kelainan)
        </button>
      </div>

      {/* Accordion / Grouped Organ Sections */}
      {Object.keys(groupedOrgans).map((groupName) => (
        <div key={groupName} className="bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-gray-100/70 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
              {groupName}
            </h4>
            <span className="text-xs text-gray-500 font-semibold">{groupedOrgans[groupName].length} Organ</span>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groupedOrgans[groupName].map((organ: any) => {
              const currentStatus = watch(`headToToe.${organ.key}.status`) || 'Normal';
              const isAbnormal = currentStatus === 'Abnormal';

              return (
                <div 
                  key={organ.key} 
                  className={`p-3.5 border transition-all ${
                    isAbnormal ? 'border-red-300 bg-red-50/40' : 'border-gray-200 bg-white hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-extrabold text-gray-900">{organ.label}</label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="radio"
                          value="Normal"
                          defaultChecked={true}
                          {...register(`headToToe.${organ.key}.status`)}
                          className="accent-emerald-600"
                        />
                        <span className={!isAbnormal ? 'font-bold text-emerald-700' : 'text-gray-500'}>Normal</span>
                      </label>
                      <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="radio"
                          value="Abnormal"
                          {...register(`headToToe.${organ.key}.status`)}
                          className="accent-red-600"
                        />
                        <span className={isAbnormal ? 'font-bold text-red-700' : 'text-gray-500'}>Abnormal</span>
                      </label>
                    </div>
                  </div>

                  {/* Textarea Catatan khusus jika abnormal / keterangan tambahan */}
                  <input
                    type="text"
                    placeholder={isAbnormal ? 'Tuliskan kelainan spesifik...' : 'Keterangan (Opsional)...'}
                    {...register(`headToToe.${organ.key}.catatan`)}
                    className={`w-full text-xs px-3 py-1.5 border ${
                      isAbnormal ? 'border-red-300 bg-white font-medium text-red-900' : 'border-gray-200 bg-gray-50 text-gray-800'
                    } rounded-none focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
