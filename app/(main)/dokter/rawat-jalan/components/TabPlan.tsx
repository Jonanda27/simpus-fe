import React, { Dispatch, SetStateAction } from 'react';
import { FileText } from 'lucide-react';
import { SOAPPayload } from '@/types/rawatJalan.types';

interface TabPlanProps {
  soapData: SOAPPayload;
  setSoapData: Dispatch<SetStateAction<SOAPPayload>>;
  setActiveTab: (tab: string) => void;
}

export default function TabPlan({
  soapData,
  setSoapData,
  setActiveTab
}: TabPlanProps) {
  return (
    <div className="p-8 space-y-6">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
        <FileText className="w-6 h-6 text-blue-600" />
        P - Plan (Rencana Tindak Lanjut)
      </h3>
      <div className="bg-blue-50/30 p-6 border border-blue-100 rounded-none">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Rencana Terapi / Tindakan (Medis & Operatif)</label>
            <textarea rows={4} value={soapData.rencanaTerapi || ''} onChange={e => setSoapData({...soapData, rencanaTerapi: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Contoh: Trepanasi, Devitalisasi pulpa..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Instruksi Medis / Edukasi Pasien</label>
            <textarea rows={3} value={soapData.instruksiMedis || ''} onChange={e => setSoapData({...soapData, instruksiMedis: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Contoh: Jangan makan makanan keras di sisi yang sakit..." />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button onClick={() => { setActiveTab('DIAGNOSA'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-none transition-colors shadow-sm text-sm">
          Lanjut ke Diagnosa &rarr;
        </button>
      </div>
    </div>
  );
}
