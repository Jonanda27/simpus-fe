import React, { Dispatch, SetStateAction } from 'react';
import { Pill } from 'lucide-react';

interface TabResepProps {
  obatQuery: string;
  setObatQuery: Dispatch<SetStateAction<string>>;
  selectedObat: any[];
  setSelectedObat: Dispatch<SetStateAction<any[]>>;
}

export default function TabResep({
  obatQuery,
  setObatQuery,
  selectedObat,
  setSelectedObat
}: TabResepProps) {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center border-b pb-3 mb-6">
        <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <Pill className="w-6 h-6 text-blue-600" />
          Resep Obat (e-Resep)
        </h3>
      </div>

      {/* Search Obat */}
      <div className="bg-blue-50/30 p-5 border border-blue-100 rounded-none mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">Cari Obat</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={obatQuery}
            onChange={e => setObatQuery(e.target.value)}
            placeholder="Ketik nama obat (misal: Paracetamol)..." 
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
          />
          <button 
            onClick={() => {
              // MOCKUP: Menambahkan obat dummy karena belum ada API backend
              if (obatQuery) {
                setSelectedObat([...selectedObat, { id: Date.now(), namaObat: obatQuery, qty: 1, signa: '3 x 1' }]);
                setObatQuery('');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-bold text-sm"
          >
            Tambah
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">*Catatan: Ini masih mockup tampilan, ketik apa saja lalu klik Tambah.</p>
      </div>

      {/* Selected Obat Table */}
      <div className="border border-gray-200 rounded-none overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/2">Nama Obat</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Jumlah</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aturan Pakai (Signa)</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm bg-white">
            {selectedObat.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">Belum ada obat yang diresepkan.</td>
              </tr>
            ) : (
              selectedObat.map((o, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 font-bold text-slate-800">{o.namaObat}</td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="number" 
                      min="1"
                      className="w-16 bg-white border border-gray-300 text-sm py-1.5 px-2 text-center focus:ring-2 focus:ring-blue-500" 
                      value={o.qty} 
                      onChange={(e) => { const newO = [...selectedObat]; newO[idx].qty = parseInt(e.target.value); setSelectedObat(newO); }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder="Contoh: 3 x 1 sesudah makan"
                      className="w-full bg-white border border-gray-300 text-sm py-1.5 px-3 focus:ring-2 focus:ring-blue-500" 
                      value={o.signa} 
                      onChange={(e) => { const newO = [...selectedObat]; newO[idx].signa = e.target.value; setSelectedObat(newO); }}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setSelectedObat(selectedObat.filter((_, i) => i !== idx))} className="text-red-600 font-bold hover:underline">Hapus</button>
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
