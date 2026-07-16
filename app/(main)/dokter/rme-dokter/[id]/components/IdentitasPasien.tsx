import React from 'react';
import { User, Calendar, Clock, Stethoscope } from 'lucide-react';

interface IdentitasPasienProps {
  viewMode: 'TIMELINE' | 'DETAIL';
  pasienData: any;
  selectedVisit: any;
  calculateAge: (dob: string) => string;
  formatDate: (date: string) => string;
}

export function IdentitasPasien({
  viewMode,
  pasienData,
  selectedVisit,
  calculateAge,
  formatDate
}: IdentitasPasienProps) {
  return (
    <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-300 p-0 flex flex-col md:flex-row relative overflow-hidden">
      <div className="p-6 flex items-center gap-5 flex-1 border-r border-slate-200 relative bg-white">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 border border-slate-300 shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">{pasienData?.namaLengkap}</h2>
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 border border-gray-300 uppercase">
              {pasienData?.jenisPenjamin || 'Umum'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-700 mt-2">
            <div className="bg-blue-50 text-blue-800 px-2 py-0.5 border border-blue-200 font-mono">
              {pasienData?.noRM}
            </div>
            <span>Usia: {calculateAge(pasienData?.tanggalLahir)}</span>
            <span>L/P: {pasienData?.jenisKelamin}</span>
            <span>Gol Darah: {pasienData?.golonganDarah || '-'}</span>
          </div>
        </div>
      </div>
      
      {viewMode === 'DETAIL' && selectedVisit && (
        <div className="p-6 flex-1 bg-slate-50 flex flex-col justify-center border-l border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Waktu Kunjungan</p>
                <p className="font-bold text-gray-900 flex items-center gap-1.5 truncate">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" /> {formatDate(selectedVisit.tanggalRegistrasi)}
                </p>
                <p className="font-semibold text-gray-700 mt-1 ml-5 flex items-center gap-1.5 text-xs">
                  <Clock className="w-3 h-3 flex-shrink-0" /> {selectedVisit.jamRegistrasi} WIB
                </p>
              </div>
              <div className="bg-white p-3 border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Poliklinik & Dokter</p>
                <p className="font-bold text-gray-900 flex items-center gap-1.5 truncate">
                  <Stethoscope className="w-4 h-4 text-blue-600 flex-shrink-0" /> {selectedVisit.poliklinik?.namaPoli || 'Poli'}
                </p>
                <p className="font-semibold text-gray-700 mt-1 ml-5 text-xs truncate">{selectedVisit.dokterTujuan?.namaLengkap || '-'}</p>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
