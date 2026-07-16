import React from 'react';
import { User } from 'lucide-react';

interface PatientHeaderProps {
  selectedKunjungan: any;
  getAge: (dob: string) => number;
  setIsScreeningModalOpen: (isOpen: boolean) => void;
}

export default function PatientHeader({
  selectedKunjungan,
  getAge,
  setIsScreeningModalOpen
}: PatientHeaderProps) {
  if (!selectedKunjungan) return null;
  
  return (
    <div className="p-4 border-b border-gray-200 shadow-sm flex justify-between items-center bg-white">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl mr-4 bg-indigo-100 text-indigo-700">
          {selectedKunjungan.pasien.namaLengkap.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{selectedKunjungan.pasien.namaLengkap}</h1>
            <button 
              onClick={() => setIsScreeningModalOpen(true)}
              className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 px-3 py-1 rounded-none font-bold text-xs flex items-center shadow-sm transition-colors"
            >
              <User className="w-3 h-3 mr-1.5" />
              Hasil Screening Perawat
            </button>
          </div>
          <div className="text-sm text-gray-600 flex items-center mt-1 font-medium">
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 mr-2 text-gray-800 rounded">{selectedKunjungan.pasien.noRM}</span>
            <span>{getAge(selectedKunjungan.pasien.tanggalLahir)} Tahun</span>
            <span className="mx-2">•</span>
            <span className="text-indigo-600 font-bold">{selectedKunjungan.jenisPelayanan}</span>
          </div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nomor Antrian</div>
        <div className="text-2xl font-mono font-bold text-gray-900">
          {selectedKunjungan.noAntrian}
        </div>
      </div>
    </div>
  );
}
