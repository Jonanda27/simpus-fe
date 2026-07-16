import React, { Dispatch, SetStateAction } from 'react';
import { Activity, Loader2, Search } from 'lucide-react';

interface TabDiagnosaProps {
  isSearchingICD: boolean;
  icd10Query: string;
  handleSearchICD10: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icd10Results: any[];
  handleSelectICD10: (icd: any) => void;
  selectedDiagnoses: any[];
  setSelectedDiagnoses: Dispatch<SetStateAction<any[]>>;
  handleRemoveDiagnosis: (kode: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function TabDiagnosa({
  isSearchingICD,
  icd10Query,
  handleSearchICD10,
  icd10Results,
  handleSelectICD10,
  selectedDiagnoses,
  setSelectedDiagnoses,
  handleRemoveDiagnosis,
  setActiveTab
}: TabDiagnosaProps) {
  return (
    <div className="p-8">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
        <Activity className="w-6 h-6 text-blue-600" />
        Diagnosa (ICD-10)
      </h3>
      
      <div className="relative mb-6">
        {isSearchingICD ? <Loader2 className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 animate-spin" /> : <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />}
        <input type="text" value={icd10Query} onChange={handleSearchICD10} placeholder="Ketik minimal 3 huruf untuk mencari penyakit atau kode ICD-10..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" />
        {icd10Results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
            {icd10Results.map((icd, idx) => (
              <div key={idx} onClick={() => handleSelectICD10(icd)} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-slate-800">{icd.nama_diagnosis}</p>
                  <p className="text-xs text-slate-500">{icd.kategori} - {icd.bab}</p>
                </div>
                <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 text-xs font-bold">{icd.kode_icd10}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border border-gray-200 rounded-none overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kode ICD-10</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Diagnosa</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jenis</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm bg-white">
            {selectedDiagnoses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">Belum ada diagnosa yang ditambahkan.</td>
              </tr>
            ) : (
              selectedDiagnoses.map((d, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">{d.kode_icd10}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{d.nama_diagnosis}</td>
                  <td className="px-6 py-4 text-slate-800">
                    <select className="bg-white border border-gray-300 text-sm py-1.5 px-3 rounded-none focus:ring-2 focus:ring-blue-500" value={d.jenis} onChange={(e) => { const newD = [...selectedDiagnoses]; newD[idx].jenis = e.target.value; setSelectedDiagnoses(newD); }}>
                      <option value="Utama">Utama</option>
                      <option value="Sekunder">Sekunder</option>
                      <option value="Komorbid">Komorbid</option>
                      <option value="Komplikasi">Komplikasi</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleRemoveDiagnosis(d.kode_icd10)} className="text-blue-600 font-bold hover:underline">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
        <button onClick={() => { setActiveTab('LABORATORIUM'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-none transition-colors shadow-sm text-sm">
          Lanjut ke Order Lab &rarr;
        </button>
      </div>
    </div>
  );
}
