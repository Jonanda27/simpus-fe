import React, { Dispatch, SetStateAction } from 'react';
import { FileText } from 'lucide-react';
import { SOAPPayload } from '@/types/rawatJalan.types';

interface TabSubjektifProps {
  soapData: SOAPPayload;
  setSoapData: Dispatch<SetStateAction<SOAPPayload>>;
  setActiveTab: (tab: string) => void;
}

export default function TabSubjektif({
  soapData,
  setSoapData,
  setActiveTab
}: TabSubjektifProps) {
  return (
    <div className="p-8 space-y-6">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
        <FileText className="w-6 h-6 text-blue-600" />
        S - Subjektif (Anamnesis)
      </h3>
      <div className="bg-blue-50/30 p-6 border border-blue-100 rounded-none">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Keluhan Utama</label>
            <textarea rows={3} value={soapData.keluhanUtama || ''} onChange={e => setSoapData({...soapData, keluhanUtama: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Contoh: Nyeri gigi geraham bawah kanan..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Riwayat Penyakit Sekarang (RPS)</label>
            <textarea rows={3} value={soapData.riwayatPenyakitSekarang || ''} onChange={e => setSoapData({...soapData, riwayatPenyakitSekarang: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Penjabaran lebih lanjut dari keluhan utama..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Riwayat Penyakit Dahulu (RPD)</label>
              <input type="text" value={soapData.riwayatPenyakitDahulu || ''} onChange={e => setSoapData({...soapData, riwayatPenyakitDahulu: e.target.value})} className="w-full px-4 py-2 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Contoh: Hipertensi, DM..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Riwayat Alergi</label>
              <input type="text" value={soapData.riwayatAlergi || ''} onChange={e => setSoapData({...soapData, riwayatAlergi: e.target.value})} className="w-full px-4 py-2 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-red-600 font-medium text-sm" placeholder="Contoh: Alergi Amoxicillin..." />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button onClick={() => { setActiveTab('SOAP_O'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-none transition-colors shadow-sm text-sm">
          Lanjut ke O (Objektif) &rarr;
        </button>
      </div>
    </div>
  );
}
