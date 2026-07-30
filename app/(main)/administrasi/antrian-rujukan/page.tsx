'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Search, Printer, CheckCircle, Clock, Building2, User, RefreshCw } from 'lucide-react';
import { useRujukanStore } from '@/store/rujukan.store';

export default function AntrianRujukanPage() {
  const { antrianList, isLoading, fetchAntrian } = useRujukanStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAntrian();
  }, [fetchAntrian]);

  const filteredAntrian = antrianList.filter((item) => {
    const term = searchTerm.toLowerCase();
    const namaPasien = item.pasien?.namaLengkap?.toLowerCase() || '';
    const noRM = item.pasien?.noRM?.toLowerCase() || '';
    const faskes = item.faskesTujuan?.toLowerCase() || '';
    const poli = item.poliTujuan?.toLowerCase() || '';
    return namaPasien.includes(term) || noRM.includes(term) || faskes.includes(term) || poli.includes(term);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-none shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-7 h-7 text-blue-600" />
            Antrean Rujukan Keluar
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Daftar instruksi rujukan medis pasien dari Poliklinik untuk dicetak dan diserahkan di Loket Administrasi
          </p>
        </div>
        <button
          onClick={() => fetchAntrian()}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-none flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-none shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari pasien, no. RM, faskes tujuan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-none text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-gray-500">
          Total Rujukan: <strong className="text-gray-900">{filteredAntrian.length}</strong> Pasien
        </div>
      </div>

      {/* Tabel Antrean */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Tgl Rujukan</th>
                <th className="py-3 px-4">Pasien</th>
                <th className="py-3 px-4">Dokter Perujuk</th>
                <th className="py-3 px-4">Poli Asal</th>
                <th className="py-3 px-4">Faskes & Poli Tujuan</th>
                <th className="py-3 px-4 text-center">Status Kasir</th>
                <th className="py-3 px-4 text-center">Status SATUSEHAT</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Memuat antrean rujukan...
                  </td>
                </tr>
              ) : filteredAntrian.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Belum ada antrean rujukan keluar.
                  </td>
                </tr>
              ) : (
                filteredAntrian.map((item) => {
                  const tglStr = new Date(item.tanggalRujukan).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  const isLunas = item.isLunas || item.statusPembayaran === 'LUNAS' || item.kunjungan?.statusKunjungan === 'SELESAI';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {tglStr}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{item.pasien?.namaLengkap}</div>
                        <div className="text-xs text-gray-500 font-mono">RM: {item.pasien?.noRM}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs font-medium text-gray-800 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {item.dokter?.namaLengkap}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-none">
                          {item.kunjungan?.poliklinik?.namaPoli || 'Poli Umum'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-gray-500" />
                          {item.faskesTujuan}
                        </div>
                        <div className="text-xs text-gray-500">Poli: {item.poliTujuan}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isLunas ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-green-100 text-green-800 border border-green-200 rounded-none">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                            LUNAS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-red-100 text-red-800 border border-red-200 rounded-none" title="Pasien harus melunasi tagihan Kasir sebelum surat rujukan dapat dicetak">
                            <Clock className="w-3.5 h-3.5 text-red-600" />
                            BELUM BAYAR
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.satusehatId ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-green-100 text-green-800 border border-green-200">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              Terintegrasi
                            </span>
                            <span className="text-[9px] font-mono text-gray-400 mt-0.5">ID: {item.satusehatId.substring(0, 8)}...</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <Clock className="w-3 h-3 text-yellow-600" />
                            Pending Sync
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isLunas ? (
                          <Link
                            href={`/administrasi/antrian-rujukan/cetak?kunjunganId=${item.kunjunganId}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 rounded-none transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak Surat
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-400 text-xs font-bold cursor-not-allowed rounded-none"
                            title="Lunasi tagihan di Kasir untuk mencetak surat rujukan"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak Surat
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
