import React from 'react';
import Link from 'next/link';
import { ArrowLeft, History, ShieldCheck, CheckCircle2, Printer } from 'lucide-react';

interface HeaderBannerProps {
  viewMode: 'TIMELINE' | 'DETAIL';
  setViewMode: (mode: 'TIMELINE' | 'DETAIL') => void;
  pasienData: any;
  selectedVisit: any;
  formatDate: (date: string) => string;
  handlePrintRME: () => void;
}

export function HeaderBanner({
  viewMode,
  setViewMode,
  pasienData,
  selectedVisit,
  formatDate,
  handlePrintRME
}: HeaderBannerProps) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white pt-8 pb-16 px-6 lg:px-8 shadow-inner relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {viewMode === 'TIMELINE' ? (
            <Link href="/dokter/rme-dokter" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors text-sm font-medium print:hidden">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pasien
            </Link>
          ) : (
            <button onClick={() => setViewMode('TIMELINE')} className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors text-sm font-medium print:hidden">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Timeline Riwayat
            </button>
          )}
          
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-none border border-white/20 backdrop-blur-sm">
              {viewMode === 'TIMELINE' ? <History className="w-8 h-8 text-blue-300" /> : <ShieldCheck className="w-8 h-8 text-emerald-300" />}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {viewMode === 'TIMELINE' ? 'Timeline Riwayat Medis Pasien' : 'Dokumen Rekam Medis'}
              </h1>
              <p className="text-slate-300 mt-1 text-sm font-medium">
                {viewMode === 'TIMELINE' 
                  ? `${pasienData?.namaLengkap} • ${pasienData?.noRM}` 
                  : `Arsip Final Kunjungan • ${formatDate(selectedVisit?.tanggalRegistrasi)}`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
          {viewMode === 'DETAIL' && (
            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-none px-4 py-2 flex items-center gap-2 mb-2 print:border-emerald-500 print:text-emerald-700 print:bg-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-mono text-sm font-bold tracking-wide">STATUS: {selectedVisit?.statusKunjungan || 'SELESAI'}</span>
            </div>
          )}
          <button onClick={handlePrintRME} className="flex items-center gap-2 text-slate-300 hover:text-white text-sm bg-white/5 px-3 py-1.5 rounded border border-white/10 transition-colors print:hidden">
            <Printer className="w-4 h-4" /> {viewMode === 'TIMELINE' ? 'Cetak Seluruh Riwayat' : 'Cetak Dokumen Ini'}
          </button>
        </div>
      </div>
    </div>
  );
}
