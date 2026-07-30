import React from 'react';
import { Loader2, TestTubes, Radio } from 'lucide-react';

interface SupportOverlayBannerProps {
  isLoadingRekamMedis: boolean;
  selectedKunjungan: any;
  isViewingLabOverlay: boolean;
  setIsViewingLabOverlay: (show: boolean) => void;
  fetchAntrian: () => void;
}

export default function SupportOverlayBanner({
  isLoadingRekamMedis,
  selectedKunjungan,
  isViewingLabOverlay,
  setIsViewingLabOverlay,
  fetchAntrian,
}: SupportOverlayBannerProps) {
  if (isLoadingRekamMedis) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500 font-medium text-xs">Memuat rekam medis...</p>
        </div>
      </div>
    );
  }

  const isMenungguPenunjang = selectedKunjungan?.statusKunjungan === 'MENUNGGU_LAB' || selectedKunjungan?.statusKunjungan === 'MENUNGGU_RADIOLOGI';

  if (isMenungguPenunjang && isViewingLabOverlay) {
    const isRadiologi = selectedKunjungan?.statusKunjungan === 'MENUNGGU_RADIOLOGI';

    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50/80 p-8 overflow-y-auto">
        <div className="bg-white p-8 shadow-md text-center max-w-lg border-t-4 border-blue-600 rounded-none border border-gray-200 my-auto">
          {isRadiologi ? (
            <Radio className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          ) : (
            <TestTubes className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
          )}
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isRadiologi ? 'Pasien Sedang Di Unit Radiologi' : 'Pasien Sedang Di laboratorium'}
          </h2>
          
          <p className="text-gray-600 text-xs mb-6 leading-relaxed">
            Pasien <strong className="text-gray-900">{selectedKunjungan.pasien?.namaLengkap}</strong> sedang menjalani proses pemeriksaan {isRadiologi ? 'Foto Rontgen/USG Radiologi' : 'Uji Laboratorium'}. Data SOAP dapat Anda tinjau kembali sambil menunggu hasil dikirimkan.
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsViewingLabOverlay(false)}
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold py-2.5 px-4 rounded-none text-xs transition-colors"
            >
              Buka Draf Rekam Medis
            </button>
            <button 
              onClick={() => fetchAntrian()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-none text-xs transition-colors shadow-sm"
            >
              Cek Update Hasil 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
