import React from 'react';
import { FileText, Clock, CheckCircle2 } from 'lucide-react';

interface DoctorActionBarProps {
  fillDummyData: () => void;
  handleTundaPemeriksaan: () => void;
  handleSaveSOAP: () => void;
  handleSelesaikan: () => void;
  isSaving: boolean;
  isMenungguLab: boolean;
}

export default function DoctorActionBar({
  fillDummyData,
  handleTundaPemeriksaan,
  handleSaveSOAP,
  handleSelesaikan,
  isSaving,
  isMenungguLab,
}: DoctorActionBarProps) {
  return (
    <div className="bg-white p-4 border-t border-gray-200 flex justify-between shadow-lg z-20 relative">
      <div className="flex gap-2">
        <button 
          onClick={fillDummyData} 
          type="button" 
          className="px-5 py-2.5 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm rounded-none shadow-sm flex items-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          Isi Dummy Otomatis
        </button>
        <button 
          onClick={handleTundaPemeriksaan} 
          disabled={isSaving} 
          className="px-6 py-2.5 bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors text-sm rounded-none shadow-sm disabled:opacity-70 flex items-center"
        >
          <Clock className="w-4 h-4 mr-2" />
          Tunda Pemeriksaan
        </button>
        <button 
          onClick={handleSaveSOAP} 
          disabled={isSaving || isMenungguLab} 
          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm rounded-none shadow-sm disabled:opacity-70"
        >
          Simpan Draf (SOAP)
        </button>
      </div>
      <button 
        onClick={handleSelesaikan} 
        disabled={isSaving || isMenungguLab} 
        className="px-8 py-2.5 bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors text-sm rounded-none shadow-sm disabled:opacity-70 flex items-center"
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Selesaikan Pemeriksaan
      </button>
    </div>
  );
}
