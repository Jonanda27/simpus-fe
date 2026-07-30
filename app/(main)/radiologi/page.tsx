'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Search, RefreshCw, FileText, CheckCircle2, Clock, Eye } from 'lucide-react';
import { radiologiService } from '@/services/radiologi.service';
import FormEkspertiseModal from './components/FormEkspertiseModal';

export default function RadiologiDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderForInput, setSelectedOrderForInput] = useState<any | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await radiologiService.getOrders({
        status: filterStatus || undefined,
        search: searchQuery || undefined,
      });
      if (res.success) {
        setOrders(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch radiologi queue', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Radio className="w-7 h-7 text-purple-700" />
            Unit Radiologi & Pencitraan Medis (DICOM / LOINC Radiologi)
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Dashboard Antrean Order Foto Rontgen/USG, Input Ekspertise Dokter Radiologi, & Integrasi WADO NIDR SATUSEHAT.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-none shadow-sm flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Nama Pasien, No RM, atau ACSN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-none text-xs text-slate-900 font-bold focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-none hover:bg-slate-900"
          >
            Cari
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs font-bold text-slate-600 uppercase">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 text-xs font-bold text-slate-900 rounded-none"
          >
            <option value="">Semua Status Order</option>
            <option value="REQUESTED">REQUESTED (Menunggu Foto)</option>
            <option value="IN_PROGRESS">IN_PROGRESS (Diproses)</option>
            <option value="COMPLETED">COMPLETED (Selesai & Ekspertise)</option>
          </select>
        </div>
      </div>

      {/* TABEL ANTREAN RADIOLOGI */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-purple-900 text-white font-extrabold uppercase tracking-wider border-b border-purple-800">
                <th className="p-3.5">No. ACSN</th>
                <th className="p-3.5">Pasien & No. RM</th>
                <th className="p-3.5">Poli & Dokter Pengirim</th>
                <th className="p-3.5">Pemeriksaan Radiologi (LOINC)</th>
                <th className="p-3.5 text-center">Prioritas</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Aksi / Ekspertise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                    Memuat antrean radiologi...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="p-3.5 font-mono font-extrabold text-purple-900">{ord.acsn || ord.id}</td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-slate-900 block text-sm">{ord.pasien?.namaLengkap}</span>
                      <span className="font-mono text-[10px] text-slate-500">{ord.pasien?.noRM}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">
                        {ord.kunjungan?.poliklinik?.namaPoli || 'Poli Rawat Jalan'}
                      </span>
                      <span className="text-[11px] text-slate-500">{ord.dokter?.namaLengkap || 'Dokter Poli'}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-purple-950 block">
                        {ord.details?.map((d: any) => d.namaPemeriksaan).join(', ') || 'Radiologi'}
                      </span>
                      <span className="font-mono text-[10px] text-purple-700">
                        {ord.details?.map((d: any) => d.kodeLoinc).join(', ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-none ${
                          ord.prioritas === 'stat' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                        }`}
                      >
                        {ord.prioritas}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-black rounded-none border ${
                          ord.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForInput(ord)}
                        className={`px-3 py-1.5 font-extrabold text-xs rounded-none shadow-sm flex items-center gap-1 mx-auto transition-colors ${
                          ord.status === 'COMPLETED'
                            ? 'bg-slate-700 hover:bg-slate-800 text-white'
                            : 'bg-purple-700 hover:bg-purple-800 text-white'
                        }`}
                      >
                        {ord.status === 'COMPLETED' ? (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Edit Hasil
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5" /> Input Ekspertise
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                    Tidak ada antrean order radiologi yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INPUT EKSPERTISE HASIL RADIOLOGI */}
      {selectedOrderForInput && (
        <FormEkspertiseModal
          order={selectedOrderForInput}
          onClose={() => setSelectedOrderForInput(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
