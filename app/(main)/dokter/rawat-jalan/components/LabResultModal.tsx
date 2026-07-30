import React from 'react';
import { FileText, Printer, FileDown, Loader2, AlertTriangle } from 'lucide-react';
import { CetakHasilLab } from '@/components/laboratorium/CetakHasilLab';

interface LabResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  orderLabData: any;
  handlePrint: () => void;
  handleDownloadPdf: () => void;
  printRef: React.RefObject<HTMLDivElement | null>;
}

export default function LabResultModal({
  isOpen,
  onClose,
  isLoading,
  orderLabData,
  handlePrint,
  handleDownloadPdf,
  printRef,
}: LabResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-none shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-indigo-50">
          <h3 className="text-xl font-extrabold text-indigo-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Kertas Cetak Hasil Laboratorium
          </h3>
          <div className="flex items-center gap-3">
            <button onClick={handlePrint} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
              <Printer className="w-4 h-4" /> Cetak (Printer)
            </button>
            <button onClick={handleDownloadPdf} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
              <FileDown className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-gray-200 flex justify-center">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="font-medium">Memuat data laboratorium...</p>
            </div>
          ) : orderLabData ? (
            <div className="shadow-2xl overflow-hidden bg-white max-w-full" style={{ width: '210mm', minHeight: '297mm' }}>
              <CetakHasilLab ref={printRef} data={orderLabData} />
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center text-gray-500">
              <AlertTriangle className="w-12 h-12 mb-4 text-orange-400" />
              <p className="font-bold text-lg text-gray-700 mb-1">Belum ada hasil laboratorium</p>
              <p className="text-sm">Pasien ini belum memiliki order lab atau hasilnya belum diinput oleh pihak Laboratorium.</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-800 text-white font-bold rounded-none hover:bg-gray-900 shadow-sm transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
