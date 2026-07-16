import React, { Dispatch, SetStateAction } from 'react';
import { ClipboardList } from 'lucide-react';

interface TabRujukanProps {
  rujukanData: any;
  setRujukanData: Dispatch<SetStateAction<any>>;
}

export default function TabRujukan({
  rujukanData,
  setRujukanData
}: TabRujukanProps) {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center border-b pb-3 mb-6">
        <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-indigo-600" />
          Rujukan Pasien
        </h3>
      </div>

      <div className="bg-indigo-50/30 p-6 border border-indigo-100 rounded-none">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Faskes Tujuan (Rumah Sakit)</label>
              <input 
                type="text" 
                value={rujukanData.faskesTujuan}
                onChange={e => setRujukanData({...rujukanData, faskesTujuan: e.target.value})}
                className="w-full px-4 py-2 bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm" 
                placeholder="Contoh: RSUD Kota..." 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Poliklinik Tujuan</label>
              <input 
                type="text" 
                value={rujukanData.poliTujuan}
                onChange={e => setRujukanData({...rujukanData, poliTujuan: e.target.value})}
                className="w-full px-4 py-2 bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm" 
                placeholder="Contoh: Poli Penyakit Dalam" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Alasan Rujukan / Catatan Khusus</label>
            <textarea 
              rows={4} 
              value={rujukanData.alasanRujukan}
              onChange={e => setRujukanData({...rujukanData, alasanRujukan: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm" 
              placeholder="Contoh: Pasien memerlukan penanganan lebih lanjut terkait..." 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
