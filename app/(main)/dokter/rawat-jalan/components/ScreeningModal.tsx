import React from 'react';
import { User } from 'lucide-react';

interface ScreeningModalProps {
  isScreeningModalOpen: boolean;
  setIsScreeningModalOpen: (isOpen: boolean) => void;
  screeningData: any;
}

export default function ScreeningModal({
  isScreeningModalOpen,
  setIsScreeningModalOpen,
  screeningData
}: ScreeningModalProps) {
  if (!isScreeningModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-none shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-teal-600" />
            Hasil Screening Perawat
          </h3>
          <button onClick={() => setIsScreeningModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {screeningData ? (
            <>
              <div className="bg-teal-50/50 border border-teal-100 p-6 rounded-none mb-6 shadow-sm">
                <p className="text-xs font-bold text-teal-700 mb-4 uppercase tracking-wider">Tanda-Tanda Vital (TTV)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 border border-teal-100 rounded-none shadow-sm text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Tensi</span>
                    <span className="block text-lg font-extrabold text-gray-900">{screeningData.tekananDarahSistolik || '-'}/{screeningData.tekananDarahDiastolik || '-'} <span className="text-xs font-normal">mmHg</span></span>
                  </div>
                  <div className="bg-white p-3 border border-teal-100 rounded-none shadow-sm text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Nadi</span>
                    <span className="block text-lg font-extrabold text-gray-900">{screeningData.nadi || '-'} <span className="text-xs font-normal">x/m</span></span>
                  </div>
                  <div className="bg-white p-3 border border-teal-100 rounded-none shadow-sm text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Suhu</span>
                    <span className="block text-lg font-extrabold text-gray-900">{screeningData.suhuTubuh || '-'} <span className="text-xs font-normal">°C</span></span>
                  </div>
                  <div className="bg-white p-3 border border-teal-100 rounded-none shadow-sm text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">BB / TB</span>
                    <span className="block text-lg font-extrabold text-gray-900">{screeningData.beratBadan || '-'}<span className="text-xs font-normal">kg</span> / {screeningData.tinggiBadan || '-'}<span className="text-xs font-normal">cm</span></span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-white p-3 border border-teal-100 rounded-none shadow-sm text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">SpO2</span>
                    <span className="block text-lg font-extrabold text-gray-900">{screeningData.saturasiOksigen || '-'}<span className="text-xs font-normal">%</span></span>
                  </div>
                  <div className="bg-white p-3 border border-teal-100 rounded-none shadow-sm text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Napas</span>
                    <span className="block text-lg font-extrabold text-gray-900">{screeningData.frekuensiNapas || '-'}<span className="text-xs font-normal">x/m</span></span>
                  </div>
                  <div className="bg-white p-3 border border-teal-100 rounded-none shadow-sm text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Nyeri</span>
                    <span className="block text-lg font-extrabold text-gray-900">{screeningData.skalaNyeri ?? '-'}<span className="text-xs font-normal">/10</span></span>
                  </div>
                </div>
              </div>
              {/* Skrining Tambahan Poli Gigi (Jika ada) */}
              {screeningData.dataTambahan?.gigi && (
                <div className="bg-blue-50/60 border border-blue-200 p-5 rounded-none mb-6 shadow-sm space-y-4">
                  <p className="text-xs font-black text-blue-900 uppercase tracking-wider border-b border-blue-200 pb-2">
                    Skrining Khusus Poli Gigi & Mulut (Standar Kemenkes SATUSEHAT)
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-2.5 border border-blue-100 rounded-none text-center">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase">Gol. Darah / Rhesus</span>
                      <span className="block text-sm font-extrabold text-blue-900">
                        {screeningData.dataTambahan.gigi.golonganDarah || '-'} ({screeningData.dataTambahan.gigi.rhesus || '-'})
                      </span>
                    </div>

                    <div className="bg-white p-2.5 border border-blue-100 rounded-none text-center">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase">Status Kehamilan</span>
                      <span className="block text-sm font-extrabold text-blue-900">
                        {screeningData.dataTambahan.gigi.statusKehamilan || '-'}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 border border-blue-100 rounded-none text-center">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase">Skor & Interpretasi OHIS</span>
                      <span className="block text-sm font-extrabold text-blue-900">
                        {screeningData.dataTambahan.gigi.skorOhis !== null ? `${screeningData.dataTambahan.gigi.skorOhis} - ${screeningData.dataTambahan.gigi.interpretasiOhis || ''}` : '-'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2.5 border border-blue-100">
                      <span className="block font-bold text-gray-500 uppercase text-[10px]">Alergi Bius Lokal (Anestesi):</span>
                      <span className="font-extrabold text-slate-800">{screeningData.dataTambahan.gigi.riwayatAlergiAnestesi || 'Tidak Ada'}</span>
                    </div>
                    <div className="bg-white p-2.5 border border-blue-100">
                      <span className="block font-bold text-gray-500 uppercase text-[10px]">Obat Pengencer Darah:</span>
                      <span className="font-extrabold text-slate-800">{screeningData.dataTambahan.gigi.riwayatPengencerDarah || 'Tidak Ada'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Keluhan Utama (Anamnesis Perawat)</label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none text-gray-700 min-h-[60px] text-sm">
                  {screeningData.keluhanUtama || 'Tidak ada keluhan tercatat.'}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="font-medium">Data screening perawat tidak tersedia untuk kunjungan ini.</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={() => setIsScreeningModalOpen(false)} className="px-6 py-2 bg-gray-800 text-white font-bold rounded-none hover:bg-gray-900 shadow-sm transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
