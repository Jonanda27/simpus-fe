'use client';

import { useEffect, useState } from 'react';
import { useLaboratoriumStore } from '@/store/laboratorium.store';
import { 
  Users, 
  RefreshCw, 
  Loader2, 
  CheckCircle2, 
  TestTubes, 
  ClipboardList,
  AlertTriangle,
  Save
} from 'lucide-react';

export default function LaboratoriumDashboard() {
  const { antrian, isLoadingAntrian, selectedOrder, fetchAntrian, pilihOrder, clearSelection, simpanHasil } = useLaboratoriumStore();
  const [sidebarWidth, setSidebarWidth] = useState(384);
  const [hasilData, setHasilData] = useState<Record<string, { hasil: string, satuan: string, nilaiRujukan: string, kritis: boolean }>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAntrian();
  }, [fetchAntrian]);

  // Sync state dengan selectedOrder
  useEffect(() => {
    if (selectedOrder) {
      const initialData: any = {};
      selectedOrder.details.forEach((d: any) => {
        initialData[d.id] = {
          hasil: d.hasil || '',
          satuan: d.satuan || '',
          nilaiRujukan: d.nilaiRujukan || '',
          kritis: d.kritis || false
        };
      });
      setHasilData(initialData);
    } else {
      setHasilData({});
    }
  }, [selectedOrder]);

  const handleKirimHasil = async () => {
    if (!selectedOrder) return;
    
    setIsSaving(true);
    
    // Format payload
    const details = Object.entries(hasilData).map(([id, data]) => ({
      id,
      ...data
    }));

    const res = await simpanHasil(selectedOrder.id, details);
    
    if (res.success) {
      alert('Hasil lab berhasil dikirim ke dokter!');
    } else {
      alert(res.message || 'Gagal mengirim hasil');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR ANTREAN */}
      <div 
        style={{ width: sidebarWidth }} 
        className="flex flex-col bg-white border-r border-gray-200 shadow-sm relative flex-shrink-0 z-20"
      >
        {/* Resizer */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1.5 hover:bg-indigo-300 cursor-col-resize z-30 transition-colors"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = sidebarWidth;
            
            const doDrag = (dragEvent: MouseEvent) => {
              let newWidth = startWidth + (dragEvent.clientX - startX);
              if (newWidth > 500) newWidth = 500; 
              if (newWidth < 250) newWidth = 250; 
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

        {/* Header Sidebar */}
        <div className="p-4 border-b border-gray-200 bg-indigo-50/50">
          <h2 className="text-lg font-bold text-indigo-800 flex items-center">
            <TestTubes className="w-5 h-5 mr-2 text-indigo-600" />
            Antrean Laboratorium
          </h2>
          <div className="mt-3 flex flex-wrap justify-between items-center text-xs text-gray-500 gap-2">
            <span className="truncate flex-1 min-w-[120px]">Menunggu Sampel / Diproses</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">Total: {antrian.length}</span>
              <button onClick={() => fetchAntrian()} className="p-1 hover:bg-indigo-100 rounded transition-colors" title="Refresh">
                <RefreshCw className={`w-4 h-4 text-indigo-600 ${isLoadingAntrian ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* List Antrean */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {isLoadingAntrian && antrian.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm font-medium">Memuat antrean...</p>
            </div>
          ) : antrian.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <CheckCircle2 className="w-10 h-10 mb-3 text-green-300" />
              <p className="text-sm font-medium">Belum ada permintaan lab</p>
            </div>
          ) : (
            antrian.map((order) => (
              <div 
                key={order.id}
                onClick={() => pilihOrder(order)}
                className={`p-3 border-l-4 cursor-pointer transition-all ${
                  selectedOrder?.id === order.id 
                    ? 'border-l-indigo-600 bg-indigo-50 shadow-md border-y border-r border-indigo-200' 
                    : 'border-l-transparent border-y border-r border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-wrap justify-between items-start gap-1.5 mb-2">
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-500 break-all">
                    {order.kunjungan?.jamRegistrasi} • {order.pasien?.noRM}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 font-bold uppercase shadow-sm whitespace-nowrap rounded-sm bg-orange-100 text-orange-800`}>
                    {order.status === 'MENUNGGU_SAMPEL' ? 'MENUNGGU SAMPEL' : 'DIPROSES'}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-gray-900 truncate uppercase mb-1">
                      {order.pasien?.namaLengkap}
                    </h3>
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <p className="truncate">Dokter: {order.dokter?.namaLengkap}</p>
                      <p className="truncate">Total Tes: {order.details.length} Pemeriksaan</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {selectedOrder ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 shadow-sm z-10 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0">
                  {selectedOrder.pasien?.namaLengkap.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight truncate">
                    {selectedOrder.pasien?.namaLengkap}
                  </h1>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-3 gap-y-1 mt-1 font-medium">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono text-xs">{selectedOrder.pasien?.noRM}</span>
                    <span>•</span>
                    <span className="truncate">Dari: {selectedOrder.dokter?.namaLengkap}</span>
                    <span>•</span>
                    <span>{new Date(selectedOrder.tanggalOrder).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-6 pb-20">
                
                {/* Catatan Klinis */}
                {selectedOrder.catatanKlinis && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-yellow-800 text-sm mb-1">Catatan Klinis dari Dokter:</h4>
                      <p className="text-sm text-yellow-700">{selectedOrder.catatanKlinis}</p>
                    </div>
                  </div>
                )}

                {/* Form Input Hasil */}
                <div className="bg-white shadow-sm border border-gray-200 rounded">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-gray-800">Input Hasil Pemeriksaan</h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold border-y border-gray-200">
                          <tr>
                            <th className="px-4 py-3 min-w-[200px]">Pemeriksaan</th>
                            <th className="px-4 py-3 min-w-[150px]">Hasil</th>
                            <th className="px-4 py-3 min-w-[120px]">Satuan</th>
                            <th className="px-4 py-3 min-w-[150px]">Nilai Rujukan</th>
                            <th className="px-4 py-3 w-24 text-center">Abnormal?</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedOrder.details.map((detail: any) => (
                            <tr key={detail.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 py-3 font-medium text-gray-900">{detail.parameter}</td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={hasilData[detail.id]?.hasil || ''}
                                  onChange={(e) => setHasilData(prev => ({
                                    ...prev, 
                                    [detail.id]: { ...prev[detail.id], hasil: e.target.value }
                                  }))}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                                  placeholder="Angka/Teks"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={hasilData[detail.id]?.satuan || ''}
                                  onChange={(e) => setHasilData(prev => ({
                                    ...prev, 
                                    [detail.id]: { ...prev[detail.id], satuan: e.target.value }
                                  }))}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                                  placeholder="misal: g/dL"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={hasilData[detail.id]?.nilaiRujukan || ''}
                                  onChange={(e) => setHasilData(prev => ({
                                    ...prev, 
                                    [detail.id]: { ...prev[detail.id], nilaiRujukan: e.target.value }
                                  }))}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                                  placeholder="misal: 12-16"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={hasilData[detail.id]?.kritis || false}
                                  onChange={(e) => setHasilData(prev => ({
                                    ...prev, 
                                    [detail.id]: { ...prev[detail.id], kritis: e.target.checked }
                                  }))}
                                  className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="bg-white p-4 border-t border-gray-200 flex justify-end shadow-lg z-20 relative">
              <button 
                onClick={handleKirimHasil} 
                disabled={isSaving} 
                className="px-8 py-2.5 bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex items-center text-sm rounded-none shadow-sm disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Selesai & Kirim Hasil ke Dokter
              </button>
            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <TestTubes className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-semibold">Pilih permintaan lab dari daftar antrean sebelah kiri</p>
          </div>
        )}
      </div>
    </div>
  );
}
