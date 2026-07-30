import React, { Dispatch, SetStateAction } from 'react';
import { FileText, Stethoscope } from 'lucide-react';
import { SOAPPayload } from '@/types/rawatJalan.types';
import OdontogramChart from './OdontogramChart';

interface TabObjektifProps {
  soapData: SOAPPayload;
  setSoapData: Dispatch<SetStateAction<SOAPPayload>>;
  setActiveTab: (tab: string) => void;
  openLabModal: () => void;
  isPoliGigi?: boolean;
}

export default function TabObjektif({
  soapData,
  setSoapData,
  setActiveTab,
  openLabModal,
  isPoliGigi,
}: TabObjektifProps) {
  return (
    <div className="p-8 space-y-6">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
        <FileText className="w-6 h-6 text-blue-600" />
        O - Objektif (Pemeriksaan Fisik & Penunjang)
      </h3>

      {/* ODONTOGRAM CHART UNTUK POLI GIGI & MULUT */}
      {isPoliGigi && (
        <div className="mb-6">
          <OdontogramChart
            value={soapData.odontogram}
            oralFindings={soapData.oralFindings}
            onChange={(odontogramMap, dmft) => {
              setSoapData((prev) => ({
                ...prev,
                odontogram: odontogramMap,
                dmft: dmft,
              }));
            }}
            onOralFindingsChange={(findings) => {
              setSoapData((prev) => ({
                ...prev,
                oralFindings: findings,
              }));
            }}
          />
        </div>
      )}

      <div className="bg-blue-50/30 p-6 border border-blue-100 rounded-none">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Keadaan Umum</label>
              <select value={soapData.keadaanUmum || ''} onChange={e => setSoapData({...soapData, keadaanUmum: e.target.value})} className="w-full px-4 py-2 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900">
                <option>Tampak Sakit Ringan</option>
                <option>Tampak Sakit Sedang</option>
                <option>Tampak Sakit Berat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tingkat Kesadaran</label>
              <select value={soapData.kesadaran || ''} onChange={e => setSoapData({...soapData, kesadaran: e.target.value})} className="w-full px-4 py-2 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900">
                <option>Compos Mentis (Sadar Penuh)</option>
                <option>Apatis</option>
                <option>Somnolen</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Pemeriksaan Fisik Spesifik / Lokalis</label>
            <textarea rows={4} value={soapData.pemeriksaanFisik || ''} onChange={e => setSoapData({...soapData, pemeriksaanFisik: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Contoh: Gigi 46 karies profunda, perkusi (+), palpasi (+)..." />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700">Hasil Penunjang (Lab/Radiologi)</label>
              <button onClick={openLabModal} type="button" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline flex items-center gap-1">
                <FileText className="w-3 h-3" /> Lihat Kertas Hasil Lab
              </button>
            </div>
            <textarea rows={3} value={soapData.hasilPenunjang || ''} onChange={e => setSoapData({...soapData, hasilPenunjang: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Ketik jika ada hasil Rontgen atau Lab..." />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button onClick={() => { setActiveTab('SOAP_A'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-none transition-colors shadow-sm text-sm">
          Lanjut ke A (Asesmen) &rarr;
        </button>
      </div>
    </div>
  );
}
