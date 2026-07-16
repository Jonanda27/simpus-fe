import React, { Dispatch, SetStateAction } from 'react';
import { FileText } from 'lucide-react';
import { SOAPPayload } from '@/types/rawatJalan.types';

interface TabAsesmenProps {
  soapData: SOAPPayload;
  setSoapData: Dispatch<SetStateAction<SOAPPayload>>;
  setActiveTab: (tab: string) => void;
}

export default function TabAsesmen({
  soapData,
  setSoapData,
  setActiveTab
}: TabAsesmenProps) {
  return (
    <div className="p-8 space-y-6">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
        <FileText className="w-6 h-6 text-blue-600" />
        A - Asesmen (Diagnosa Klinis)
      </h3>
      <div className="bg-blue-50/30 p-6 border border-blue-100 rounded-none">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Diagnosa Klinis / Asesmen Dokter</label>
            <textarea rows={4} value={soapData.diagnosisKlinis || ''} onChange={e => setSoapData({...soapData, diagnosisKlinis: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold text-sm text-gray-900" placeholder="Contoh: Pulpitis Irreversibel pada gigi 46. Suspek periodontitis apikal kronis." />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button onClick={() => { setActiveTab('SOAP_P'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-none transition-colors shadow-sm text-sm">
          Lanjut ke P (Plan) &rarr;
        </button>
      </div>
    </div>
  );
}
