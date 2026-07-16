"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Activity, 
  FileText, 
  Pill, 
  AlertCircle,
  Syringe,
  ClipboardList,
  ArrowUpRight
} from 'lucide-react';
import { rawatJalanService } from '@/services/rawatJalan.service';
import { AntrianDokter } from '@/types/rawatJalan.types';
import { useAuthStore } from '@/store/auth.store';

// ─────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────
const dummyStats = {
  totalHariIni: 47,
  menunggu: 12,
  sedangDilayani: 5,
  selesai: 30,
};

const dummyAntrian: AntrianDokter[] = [
  { id: '1', pasienId: 'p1', noAntrian: 'A-001', jamRegistrasi: '08:05', pasien: { id: 'p1', namaLengkap: 'Budi Santoso', noRM: 'RM-2024-0091', tanggalLahir: '1980-01-01', jenisKelamin: 'L' }, poliklinik: { id: 'poli1', namaPoli: 'Poli Umum' }, screening: { keluhanUtama: 'Sakit kepala dan demam sejak 2 hari yang lalu' } as any, statusKunjungan: 'MENUNGGU_DOKTER', tanggalRegistrasi: '2024-05-15', jenisPelayanan: 'Rawat Jalan', statusPasien: 'Lama', prioritas: 'Umum' },
  { id: '2', pasienId: 'p2', noAntrian: 'A-002', jamRegistrasi: '08:12', pasien: { id: 'p2', namaLengkap: 'Siti Aminah', noRM: 'RM-2024-0154', tanggalLahir: '1990-01-01', jenisKelamin: 'P' }, poliklinik: { id: 'poli1', namaPoli: 'Poli Umum' }, screening: { keluhanUtama: 'Batuk berdahak dan pilek' } as any, statusKunjungan: 'SEDANG_DIPERIKSA', tanggalRegistrasi: '2024-05-15', jenisPelayanan: 'Rawat Jalan', statusPasien: 'Lama', prioritas: 'Umum' },
  { id: '3', pasienId: 'p3', noAntrian: 'A-003', jamRegistrasi: '08:31', pasien: { id: 'p3', namaLengkap: 'Dewi Rahayu', noRM: 'RM-2023-0501', tanggalLahir: '2000-01-01', jenisKelamin: 'P' }, poliklinik: { id: 'poli1', namaPoli: 'Poli Umum' }, screening: { keluhanUtama: 'Nyeri perut bagian bawah' } as any, statusKunjungan: 'MENUNGGU_DOKTER', tanggalRegistrasi: '2024-05-15', jenisPelayanan: 'Rawat Jalan', statusPasien: 'Lama', prioritas: 'Umum' },
  { id: '4', pasienId: 'p4', noAntrian: 'A-004', jamRegistrasi: '08:40', pasien: { id: 'p4', namaLengkap: 'Hendra Wijaya', noRM: 'RM-2022-0211', tanggalLahir: '1970-01-01', jenisKelamin: 'L' }, poliklinik: { id: 'poli1', namaPoli: 'Poli Umum' }, screening: null, statusKunjungan: 'MENUNGGU_DOKTER', tanggalRegistrasi: '2024-05-15', jenisPelayanan: 'Rawat Jalan', statusPasien: 'Lama', prioritas: 'Umum' },
  { id: '5', pasienId: 'p5', noAntrian: 'A-005', jamRegistrasi: '07:30', pasien: { id: 'p5', namaLengkap: 'Andi Mulyana', noRM: 'RM-2021-0088', tanggalLahir: '1985-05-10', jenisKelamin: 'L' }, poliklinik: { id: 'poli1', namaPoli: 'Poli Umum' }, screening: { keluhanUtama: 'Gatal-gatal di seluruh tubuh' } as any, statusKunjungan: 'SELESAI', tanggalRegistrasi: '2024-05-15', jenisPelayanan: 'Rawat Jalan', statusPasien: 'Lama', prioritas: 'Umum' },
  { id: '6', pasienId: 'p6', noAntrian: 'A-006', jamRegistrasi: '07:45', pasien: { id: 'p6', namaLengkap: 'Putri Larasati', noRM: 'RM-2024-0120', tanggalLahir: '1995-08-20', jenisKelamin: 'P' }, poliklinik: { id: 'poli1', namaPoli: 'Poli Umum' }, screening: { keluhanUtama: 'Mual dan muntah sejak semalam' } as any, statusKunjungan: 'MENUNGGU_FARMASI', tanggalRegistrasi: '2024-05-15', jenisPelayanan: 'Rawat Jalan', statusPasien: 'Lama', prioritas: 'Umum' },
];

export default function DokterDashboardPage() {
  const { user } = useAuthStore();
  const [antrian, setAntrian] = useState<AntrianDokter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Menggunakan dummy data
    setAntrian(dummyAntrian);
    setIsLoading(false);

    const tick = () => setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MENUNGGU_DOKTER':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-none bg-amber-100 text-amber-800 border border-amber-200">Menunggu</span>;
      case 'SEDANG_DIPERIKSA':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-none bg-blue-100 text-blue-800 border border-blue-200">Sedang Diperiksa</span>;
      case 'SELESAI':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-none bg-emerald-100 text-emerald-800 border border-emerald-200">Selesai</span>;
      case 'MENUNGGU_FARMASI':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-none bg-purple-100 text-purple-800 border border-purple-200">Di Farmasi</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-none bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  if (!isClient) return null;

  const totalPasien = antrian.length;
  const menunggu = antrian.filter(a => a.statusKunjungan === 'MENUNGGU_DOKTER').length;
  const selesai = antrian.filter(a => a.statusKunjungan === 'SELESAI' || a.statusKunjungan === 'MENUNGGU_FARMASI').length;

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
      {/* ── HERO HEADER ── */}
      <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-white rounded-full translate-y-1/2" />
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Dashboard Dokter</h1>
              <p className="text-indigo-100 text-sm mt-1 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                dr. {user?.nama_lengkap || user?.username} ({user?.poliklinik?.namaPoli || 'Poli Umum'})
                <span className="mx-1 text-indigo-300">•</span>
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                <span className="mx-1 text-indigo-300">•</span>
                <Clock className="w-4 h-4" />{currentTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            {/* Top Right Decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full translate-x-4 -translate-y-4"></div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total Kunjungan</p>
              <h3 className="text-4xl font-extrabold text-gray-900">{dummyStats.totalHariIni}</h3>
              <p className="text-sm text-gray-500 mt-1">Hari ini</p>
            </div>
            
            <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12% vs kemarin</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            {/* Top Right Icon */}
            <div className="absolute top-6 right-6 w-10 h-10 bg-amber-100 flex items-center justify-center rounded">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Antrian Aktif</p>
              <h3 className="text-4xl font-extrabold text-gray-900">{dummyStats.menunggu}</h3>
              <p className="text-sm text-gray-500 mt-1">Sedang menunggu poli</p>
            </div>
            
            <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span>{dummyStats.sedangDilayani} pasien sedang dilayani</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
            {/* Top Right Icon */}
            <div className="absolute top-6 right-6 w-10 h-10 bg-emerald-100 flex items-center justify-center rounded">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Selesai Hari Ini</p>
              <h3 className="text-4xl font-extrabold text-gray-900">{dummyStats.selesai}</h3>
              <p className="text-sm text-gray-500 mt-1">Sudah dilayani</p>
            </div>
            
            <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{Math.round((dummyStats.selesai / dummyStats.totalHariIni) * 100)}% dari total kunjungan</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN COLUMN - QUEUE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Antrian Pasien Poli
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Daftar pasien yang mendaftar ke poli Anda hari ini.</p>
                </div>
                <Link href="/dokter/rawat-jalan" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs font-medium text-gray-500 bg-white border-b border-gray-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">No. Antrian</th>
                      <th className="px-6 py-3">Pasien</th>
                      <th className="px-6 py-3">Keluhan Awal (Skrining)</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          Memuat antrian...
                        </td>
                      </tr>
                    ) : antrian.filter(a => a.statusKunjungan !== 'SELESAI' && a.statusKunjungan !== 'MENUNGGU_FARMASI').length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          Tidak ada pasien dalam antrian saat ini.
                        </td>
                      </tr>
                    ) : (
                      antrian
                        .filter(a => a.statusKunjungan !== 'SELESAI' && a.statusKunjungan !== 'MENUNGGU_FARMASI')
                        .map((item) => (
                        <tr key={item.id} className="hover:bg-indigo-50/50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1">{item.noAntrian}</span>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.jamRegistrasi}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{item.pasien.namaLengkap}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">RM: {item.pasien.noRM}</div>
                          </td>
                          <td className="px-6 py-4">
                            {item.screening?.keluhanUtama ? (
                              <p className="text-gray-700 max-w-xs truncate" title={item.screening.keluhanUtama}>
                                {item.screening.keluhanUtama}
                              </p>
                            ) : (
                              <span className="text-gray-400 text-xs italic">Belum diskrining</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(item.statusKunjungan)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {item.statusKunjungan === 'MENUNGGU_DOKTER' ? (
                              <Link 
                                href={`/dokter/rawat-jalan/pemeriksaan/${item.id}`}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-none hover:bg-indigo-700 transition-colors shadow-sm"
                              >
                                Mulai Pemeriksaan
                              </Link>
                            ) : (
                              <Link 
                                href={`/dokter/rawat-jalan/pemeriksaan/${item.id}`}
                                className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 font-medium text-xs rounded-none border border-indigo-200 hover:bg-indigo-50 transition-colors"
                              >
                                Lanjut / Detail
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SELESAI SECTION */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Pasien Selesai Pemeriksaan (Hari Ini)
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Daftar pasien yang sudah selesai diperiksa dan RME-nya terkunci.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs font-medium text-gray-500 bg-white border-b border-gray-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">No. Antrian</th>
                      <th className="px-6 py-3">Pasien</th>
                      <th className="px-6 py-3">Keluhan Awal</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          Memuat data...
                        </td>
                      </tr>
                    ) : antrian.filter(a => a.statusKunjungan === 'SELESAI' || a.statusKunjungan === 'MENUNGGU_FARMASI').length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          Belum ada pasien yang selesai hari ini.
                        </td>
                      </tr>
                    ) : (
                      antrian
                        .filter(a => a.statusKunjungan === 'SELESAI' || a.statusKunjungan === 'MENUNGGU_FARMASI')
                        .map((item) => (
                        <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-gray-500 bg-gray-100 px-2 py-1">{item.noAntrian}</span>
                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.jamRegistrasi}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-700">{item.pasien.namaLengkap}</div>
                            <div className="text-xs text-gray-400 font-mono mt-0.5">RM: {item.pasien.noRM}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {item.screening?.keluhanUtama ? (
                              <p className="max-w-xs truncate" title={item.screening.keluhanUtama}>
                                {item.screening.keluhanUtama}
                              </p>
                            ) : (
                              <span className="italic">Belum diskrining</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(item.statusKunjungan)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Link 
                              href={`/dokter/rme-dokter/${item.pasien.noRM}`}
                              className="inline-flex items-center px-4 py-2 bg-white text-emerald-600 font-medium text-xs rounded-none border border-emerald-200 hover:bg-emerald-50 transition-colors"
                            >
                              Lihat Riwayat RME
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

          {/* SIDE COLUMN - QUICK LINKS & NOTIFICATIONS */}
          <div className="space-y-6">
            
            {/* Quick Links */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-none">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900">Akses Cepat Modul Klinis</h2>
              </div>
              <div className="p-2 grid grid-cols-2 gap-2">
                <Link href="/dokter/rawat-jalan" className="p-3 border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 group flex flex-col items-center justify-center text-center transition-all h-24">
                  <ClipboardList className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">Rawat Jalan</span>
                </Link>
                <Link href="/dokter/rme-dokter" className="p-3 border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 group flex flex-col items-center justify-center text-center transition-all h-24">
                  <FileText className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">RME Riwayat</span>
                </Link>
                <div className="p-3 border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 group flex flex-col items-center justify-center text-center transition-all h-24 cursor-pointer">
                  <Pill className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">E-Prescribing</span>
                </div>
                <div className="p-3 border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 group flex flex-col items-center justify-center text-center transition-all h-24 cursor-pointer">
                  <Syringe className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">Order Lab</span>
                </div>
              </div>
            </div>

            {/* Notifications / Pending Lab */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-none">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">Notifikasi Penunjang</h2>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">0 Baru</span>
              </div>
              <div className="p-6 text-center">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Tidak ada hasil laboratorium atau radiologi baru yang menunggu review Anda.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
