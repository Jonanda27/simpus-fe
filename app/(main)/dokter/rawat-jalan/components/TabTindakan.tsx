import React, { Dispatch, SetStateAction } from 'react';
import { Syringe, Search, Loader2 } from 'lucide-react';

interface TabTindakanProps {
  isSearchingICD9: boolean;
  icd9Query: string;
  handleSearchICD9: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icd9Results: any[];
  handleSelectICD9: (icd: any) => void;
  selectedProsedur: any[];
  setSelectedProsedur: Dispatch<SetStateAction<any[]>>;
  handleRemoveProsedur: (kode: string) => void;
}

export default function TabTindakan({
  isSearchingICD9,
  icd9Query,
  handleSearchICD9,
  icd9Results,
  handleSelectICD9,
  selectedProsedur,
  setSelectedProsedur,
  handleRemoveProsedur
}: TabTindakanProps) {
  return (
    <div className="p-8">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
        <Syringe className="w-6 h-6 text-blue-500" />
        Tindakan Medis (ICD-9-CM)
      </h3>
      
      <div className="relative mb-6">
        {isSearchingICD9 ? <Loader2 className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 animate-spin" /> : <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />}
        <input type="text" value={icd9Query} onChange={handleSearchICD9} placeholder="Ketik minimal 3 huruf untuk mencari nama tindakan atau kode ICD-9-CM..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" />
        {icd9Results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
            {icd9Results.map((icd, idx) => (
              <div key={idx} onClick={() => handleSelectICD9(icd)} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-slate-800">{icd.nama_prosedur}</p>
                  <p className="text-xs text-slate-500">{icd.kategori}</p>
                </div>
                <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 text-xs font-bold">{icd.kode_icd9}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border border-gray-200 rounded-none overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kode ICD-9</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Tindakan</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pelaksana</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm bg-white">
            {selectedProsedur.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">Belum ada tindakan yang ditambahkan.</td>
              </tr>
            ) : (
              selectedProsedur.map((p, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">{p.kode_icd9}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{p.nama_prosedur}</td>
                  <td className="px-6 py-4 text-slate-800">
                    <select className="bg-white border border-gray-300 text-sm py-1.5 px-3 rounded-none focus:ring-2 focus:ring-blue-500" value={p.pelaksana} onChange={(e) => { const newP = [...selectedProsedur]; newP[idx].pelaksana = e.target.value; setSelectedProsedur(newP); }}>
                      <option value="Dokter">Dokter</option>
                      <option value="Perawat">Perawat</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleRemoveProsedur(p.kode_icd9)} className="text-red-600 font-bold hover:underline">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
