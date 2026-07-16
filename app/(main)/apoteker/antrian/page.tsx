"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pill, Clock, Search, ArrowRight, Loader2, ArrowUpRight, ClipboardList } from 'lucide-react';
import { farmasiService, ResepData } from '@/services/farmasi.service';

export default function ApotekerAntrianPage() {
  const [antrian, setAntrian] = useState<ResepData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAntrian();
  }, []);

  const fetchAntrian = async () => {
    try {
      const data = await farmasiService.getAntrian();
      setAntrian(data);
    } catch (error) {
      console.error('Error fetching antrian:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAntrian = antrian.filter(resep => 
    resep.pasien.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resep.pasien.noRM.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-teal-600" />
            Antrian Resep
          </h1>
          <p className="text-gray-500 mt-2">Daftar pasien yang menunggu penyiapan obat.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama pasien atau No RM..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Waktu Resep Masuk</th>
                <th className="px-6 py-4 font-semibold">Data Pasien</th>
                <th className="px-6 py-4 font-semibold">Asal Poliklinik & Dokter</th>
                <th className="px-6 py-4 font-semibold text-center">Jumlah Item</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
                  </td>
                </tr>
              ) : filteredAntrian.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada antrian yang cocok dengan pencarian.' : 'Tidak ada antrian resep saat ini.'}
                  </td>
                </tr>
              ) : (
                filteredAntrian.map((resep) => (
                  <tr key={resep.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center text-orange-600 font-bold">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(resep.tanggalResep).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(resep.tanggalResep).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-base">{resep.pasien.namaLengkap}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">RM: {resep.pasien.noRM}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{resep.pasien.jenisKelamin}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{resep.kunjungan.poliklinik.namaPoli}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {resep.kunjungan.jenisPelayanan === 'UKM' ? 'Petugas UKM: ' : 'Dr. '}
                        {resep.dokter?.namaLengkap || 'Sistem'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-none text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                        {resep.details.length} Jenis Obat
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/apoteker/antrian/${resep.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 font-bold text-sm rounded-none shadow-sm transition-colors"
                      >
                        Proses Resep
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
