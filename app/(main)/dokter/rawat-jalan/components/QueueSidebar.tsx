import React, { Dispatch, SetStateAction } from 'react';
import { Users, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';

interface QueueSidebarProps {
  sidebarWidth: number;
  setSidebarWidth: Dispatch<SetStateAction<number>>;
  antrian: any[];
  fetchAntrian: () => void;
  isLoadingAntrian: boolean;
  selectedKunjungan: any;
  pilihPasien: (k: any) => void;
  getAge: (dob: string) => number;
}

export default function QueueSidebar({
  sidebarWidth,
  setSidebarWidth,
  antrian,
  fetchAntrian,
  isLoadingAntrian,
  selectedKunjungan,
  pilihPasien,
  getAge
}: QueueSidebarProps) {
  return (
    <div 
      className="bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10 relative flex-shrink-0 max-w-sm"
      style={{ width: sidebarWidth }}
    >
      {/* RESIZER HANDLE */}
      <div 
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-300 active:bg-indigo-500 z-50 transition-colors"
        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
          const startX = e.clientX;
          const startWidth = sidebarWidth;
          
          const doDrag = (dragEvent: MouseEvent) => {
            let newWidth = startWidth + (dragEvent.clientX - startX);
            if (newWidth > 384) newWidth = 384; 
            if (newWidth < 200) newWidth = 200; 
            setSidebarWidth(newWidth);
          };
          
          const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
          };
          
          document.addEventListener('mousemove', doDrag);
          document.addEventListener('mouseup', stopDrag);
        }}
      />
      <div className="p-4 border-b border-gray-200 bg-indigo-50/50">
        <h2 className="text-lg font-bold text-indigo-800 flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-600" />
          Antrian Rawat Jalan
        </h2>
        <div className="mt-3 flex flex-wrap justify-between items-center text-xs text-gray-500 gap-2">
          <span className="truncate flex-1 min-w-[120px]">Pasien menunggu</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">Total: {antrian.length}</span>
            <button onClick={() => fetchAntrian()} className="p-1 hover:bg-indigo-100 rounded transition-colors" title="Refresh">
              <RefreshCw className={`w-4 h-4 text-indigo-600 ${isLoadingAntrian ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {isLoadingAntrian && antrian.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm font-medium">Memuat antrian...</p>
          </div>
        ) : antrian.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <CheckCircle2 className="w-10 h-10 mb-3 text-green-300" />
            <p className="text-sm font-medium">Belum ada pasien dalam antrian</p>
          </div>
        ) : (
          antrian.map((k) => (
            <div 
              key={k.id}
              onClick={() => pilihPasien(k)}
              className={`p-3 border-l-4 cursor-pointer transition-all ${
                selectedKunjungan?.id === k.id 
                  ? 'border-l-indigo-600 bg-indigo-50 shadow-md border-y border-r border-indigo-200' 
                  : 'border-l-transparent border-y border-r border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-wrap justify-between items-start gap-1.5 mb-2">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-500 break-all">{k.jamRegistrasi} • {k.pasien.noRM}</span>
                <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 font-bold uppercase shadow-sm whitespace-nowrap rounded-sm ${
                  k.statusKunjungan === 'DIPERIKSA' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : k.statusKunjungan === 'MENUNGGU_LAB'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {k.statusKunjungan === 'DIPERIKSA' 
                    ? 'SEDANG DIPERIKSA' 
                    : k.statusKunjungan === 'MENUNGGU_LAB'
                      ? 'MENUNGGU LAB'
                      : 'MENUNGGU'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex flex-shrink-0 items-center justify-center text-xs mt-0.5">
                  {k.noAntrian.split('-').pop()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 leading-tight truncate" title={k.pasien.namaLengkap}>{k.pasien.namaLengkap}</h3>
                  <div className="text-[10px] sm:text-xs text-gray-600 flex flex-wrap items-center gap-x-1 mt-0.5">
                    <span>{getAge(k.pasien.tanggalLahir)} Tahun</span>
                    <span>•</span>
                    <span>{k.pasien.jenisKelamin}</span>
                    {k.poliklinik && (
                      <>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <span className="text-indigo-600 font-semibold truncate">{k.poliklinik.namaPoli}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
