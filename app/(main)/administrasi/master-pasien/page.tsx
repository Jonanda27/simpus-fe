'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, FileText, CheckCircle, Trash2, Edit, RefreshCw } from 'lucide-react';
import { usePasienStore } from '@/store/pasien.store';
import Link from 'next/link';

export default function MasterPasienAdministrasiPage() {
  const { pasiens, isLoading, fetchPasiens, deletePasien, syncPasienIHS } = usePasienStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [syncingId, setSyncingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPasiens();
  }, [fetchPasiens]);

  const handleSyncIHS = async (id: number, nik: string | null) => {
    if (!nik) {
      alert('NIK pasien kosong, tidak bisa sinkronisasi dengan SATUSEHAT');
      return;
    }
    
    setSyncingId(id);
    try {
      await syncPasienIHS(nik);
      alert('Berhasil sinkronisasi IHS Number dengan SATUSEHAT');
    } catch (error: any) {
      alert(error.message || 'Gagal sinkronisasi dengan SATUSEHAT');
    } finally {
      setSyncingId(null);
    }
  };

  const filteredPasiens = pasiens.filter(p => 
    p.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.noRM.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.nik && p.nik.includes(searchQuery))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Master Data Pasien
          </h1>
          <p className="text-gray-500 mt-2">Kelola seluruh data rekam medis pasien klinik.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari No RM / Nama / NIK..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link 
            href="/administrasi/pendaftaran"
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-none shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Pasien Baru
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-medium border-b border-gray-200">
                <th className="py-4 px-6">No. RM & NIK</th>
                <th className="py-4 px-6">Nama Lengkap</th>
                <th className="py-4 px-6">Kontak</th>
                <th className="py-4 px-6">Tgl Lahir / Usia</th>
                <th className="py-4 px-6">Penjamin</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : filteredPasiens.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada pasien yang cocok dengan pencarian.' : 'Belum ada data pasien.'}
                  </td>
                </tr>
              ) : (
                filteredPasiens.map((p) => {
                  const kontakUtama = p.kontak ? p.kontak.noHp : '-';
                  const penjaminUtama = p.penjamin ? p.penjamin.jenisPenjamin : 'UMUM / MANDIRI';
                  
                  // Hitung usia
                  const birthDate = new Date(p.tanggalLahir);
                  const today = new Date();
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                  }

                  return (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 text-slate-800">
                      <td className="py-4 px-6">
                        <div className="font-bold text-blue-700">{p.noRM}</div>
                        <div className="text-xs text-gray-500">NIK: {p.nik || 'Kosong'}</div>
                        {p.noIHS ? (
                          <div className="text-xs text-emerald-600 font-medium flex items-center mt-1">
                            <CheckCircle className="w-3 h-3 mr-1" /> IHS: {p.noIHS}
                          </div>
                        ) : (
                          <div className="text-xs text-amber-600 mt-1 italic">Belum Sync IHS</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">{p.namaLengkap}</div>
                        <div className="text-xs text-gray-500">{p.jenisKelamin}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">{kontakUtama}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-700">{new Date(p.tanggalLahir).toLocaleDateString('id-ID')}</div>
                        <div className="text-xs text-gray-500">{age} Tahun</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-xs font-medium rounded-none ${penjaminUtama.includes('BPJS') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {penjaminUtama}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {!p.noIHS && p.nik && (
                          <button 
                            onClick={() => handleSyncIHS(p.id, p.nik)}
                            disabled={syncingId === p.id}
                            className={`px-3 py-1.5 ${syncingId === p.id ? 'bg-gray-100 text-gray-400' : 'bg-teal-50 text-teal-600 hover:bg-teal-100'} font-medium text-xs rounded-none transition-colors inline-flex items-center`}
                            title="Sync SATUSEHAT"
                          >
                            <RefreshCw className={`w-3 h-3 mr-1 ${syncingId === p.id ? 'animate-spin' : ''}`} />
                            Sync IHS
                          </button>
                        )}
                        <button className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs rounded-none transition-colors" title="Edit Data">
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
