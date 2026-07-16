"use client";

import React, { useState, useEffect } from 'react';
import {
  Users, Clock, CheckCircle2, Search, UserPlus, Volume2,
  ClipboardEdit, Activity, AlertTriangle, TrendingUp,
  Heart, Shield, Baby, ChevronRight, Calendar, Printer,
  BarChart2, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

// ─────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────
const dummyStats = {
  totalHariIni: 47,
  totalBulanIni: 1243,
  menunggu: 12,
  sedangDilayani: 5,
  selesai: 30,
  bpjs: 31,
  umum: 11,
  asuransi: 5,
  prioritas: { lansia: 8, disabilitas: 2, hamilMenyusui: 3 },
};

const dummyAntrian = [
  { id: 1, noAntrian: 'A-001', noRm: 'RM-2024-0091', nama: 'Budi Santoso', jk: 'L', usia: 45, poli: 'Poli Umum', jenisKunjungan: 'Pasien Lama', jenisBayar: 'BPJS', status: 'Menunggu', waktu: '08:05', prioritas: 'Umum' },
  { id: 2, noAntrian: 'A-002', noRm: 'RM-2024-0154', nama: 'Siti Aminah', jk: 'P', usia: 65, poli: 'Poli KIA / KB', jenisKunjungan: 'Pasien Lama', jenisBayar: 'BPJS', status: 'Menunggu', waktu: '08:12', prioritas: 'Lansia' },
  { id: 3, noAntrian: 'B-001', noRm: '-', nama: 'Ahmad Dahlan', jk: 'L', usia: 28, poli: 'Poli Gigi', jenisKunjungan: 'Pasien Baru', jenisBayar: 'Umum', status: 'Dilayani', waktu: '08:20', prioritas: 'Umum' },
  { id: 4, noAntrian: 'A-003', noRm: 'RM-2023-0501', nama: 'Dewi Rahayu', jk: 'P', usia: 32, poli: 'Poli Umum', jenisKunjungan: 'Pasien Lama', jenisBayar: 'Asuransi', status: 'Menunggu', waktu: '08:31', prioritas: 'Hamil' },
  { id: 5, noAntrian: 'A-004', noRm: 'RM-2022-0211', nama: 'Hendra Wijaya', jk: 'L', usia: 52, poli: 'Poli Lansia', jenisKunjungan: 'Pasien Lama', jenisBayar: 'BPJS', status: 'Menunggu', waktu: '08:40', prioritas: 'Umum' },
  { id: 6, noAntrian: 'C-001', noRm: '-', nama: 'Ratna Sari', jk: 'P', usia: 24, poli: 'Poli Imunisasi', jenisKunjungan: 'Pasien Baru', jenisBayar: 'Umum', status: 'Selesai', waktu: '07:55', prioritas: 'Umum' },
  { id: 7, noAntrian: 'B-002', noRm: 'RM-2024-0003', nama: 'Agus Purnomo', jk: 'L', usia: 71, poli: 'Poli Gigi', jenisKunjungan: 'Pasien Lama', jenisBayar: 'BPJS', status: 'Selesai', waktu: '07:48', prioritas: 'Lansia' },
];

const dummyGrafik = [
  { hari: 'Sen', jumlah: 38, bpjs: 25 },
  { hari: 'Sel', jumlah: 52, bpjs: 34 },
  { hari: 'Rab', jumlah: 45, bpjs: 29 },
  { hari: 'Kam', jumlah: 61, bpjs: 40 },
  { hari: 'Jum', jumlah: 49, bpjs: 31 },
  { hari: 'Sab', jumlah: 33, bpjs: 20 },
  { hari: 'Ini', jumlah: 47, bpjs: 31 },
];

const maxGrafik = Math.max(...dummyGrafik.map(g => g.jumlah));

const dummyPoli = [
  { nama: 'Poli Umum', jumlah: 18, dokter: 'dr. Ahmad Fauzi', status: 'Buka' },
  { nama: 'Poli KIA / KB', jumlah: 9, dokter: 'dr. Sari Dewi', status: 'Buka' },
  { nama: 'Poli Gigi', jumlah: 7, dokter: 'drg. Hendra K.', status: 'Buka' },
  { nama: 'Poli Lansia', jumlah: 6, dokter: 'dr. Budi S.', status: 'Buka' },
  { nama: 'Poli Imunisasi', jumlah: 4, dokter: 'Ns. Ratna', status: 'Buka' },
  { nama: 'Poli Gizi', jumlah: 3, dokter: 'Ns. Eka R.', status: 'Tutup' },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Menunggu': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'Dilayani': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Selesai': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getPrioritasBadge = (prioritas: string) => {
  switch (prioritas) {
    case 'Lansia': return 'bg-purple-100 text-purple-700';
    case 'Hamil': return 'bg-pink-100 text-pink-700';
    case 'Disabilitas': return 'bg-orange-100 text-orange-700';
    default: return 'hidden';
  }
};

const getBayarStyle = (bayar: string) => {
  switch (bayar) {
    case 'BPJS': return 'bg-green-100 text-green-700';
    case 'Umum': return 'bg-blue-100 text-blue-700';
    case 'Asuransi': return 'bg-violet-100 text-violet-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setIsClient(true);
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = dummyAntrian.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase()) || p.noAntrian.toLowerCase().includes(search.toLowerCase()) || p.noRm.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (!isClient) return null;

  const persenBpjs = Math.round((dummyStats.bpjs / dummyStats.totalHariIni) * 100);
  const persenUmum = Math.round((dummyStats.umum / dummyStats.totalHariIni) * 100);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO HEADER ── */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-white rounded-full translate-y-1/2" />
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* LEFT: Info */}
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Dashboard Loket Pendaftaran</h1>
              <p className="text-blue-100 text-sm mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                <span className="mx-1 text-blue-300">•</span>
                <Clock className="w-4 h-4" />{currentTime}
              </p>
            </div>
          </div>

          {/* RIGHT: Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link href="/administrasi/pendaftaran"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-md">
              <UserPlus className="w-4 h-4" />
              Daftar Pasien Baru
            </Link>
            <Link href="/administrasi/master-pasien"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800/60 border border-blue-400 text-white font-bold text-sm hover:bg-blue-800/80 transition-colors">
              <ClipboardEdit className="w-4 h-4" />
              Master Pasien
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── ROW 1: STAT CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Kunjungan</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{dummyStats.totalHariIni}</p>
                <p className="text-xs text-gray-500 mt-1">Hari ini</p>
              </div>
              <div className="p-2.5 bg-blue-100 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12% vs kemarin</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Antrian Aktif</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{dummyStats.menunggu}</p>
                <p className="text-xs text-gray-500 mt-1">Sedang menunggu loket</p>
              </div>
              <div className="p-2.5 bg-amber-100 text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-amber-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
              <span>{dummyStats.sedangDilayani} pasien sedang dilayani</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Selesai Hari Ini</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{dummyStats.selesai}</p>
                <p className="text-xs text-gray-500 mt-1">Sudah dilayani</p>
              </div>
              <div className="p-2.5 bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{Math.round((dummyStats.selesai / dummyStats.totalHariIni) * 100)}% dari total kunjungan</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prioritas Khusus</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{dummyStats.prioritas.lansia + dummyStats.prioritas.disabilitas + dummyStats.prioritas.hamilMenyusui}</p>
                <p className="text-xs text-gray-500 mt-1">Lansia, Hamil, Disabilitas</p>
              </div>
              <div className="p-2.5 bg-purple-100 text-purple-600">
                <Heart className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 font-medium">Lansia: {dummyStats.prioritas.lansia}</span>
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 font-medium">Hamil: {dummyStats.prioritas.hamilMenyusui}</span>
            </div>
          </div>
        </div>

        {/* ── ROW 2: GRAFIK + KOMPOSISI BAYAR + STATUS POLI ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* GRAFIK KUNJUNGAN 7 HARI */}
          <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Tren Kunjungan Mingguan</h2>
                <p className="text-xs text-gray-500 mt-0.5">Jumlah pendaftaran 7 hari terakhir</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-blue-500 inline-block" />Total Kunjungan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-emerald-400 inline-block" />Pasien BPJS
                </span>
              </div>
            </div>

            {/* Chart Bars */}
            <div className="flex items-end gap-3 flex-1" style={{ minHeight: '120px' }}>
              {dummyGrafik.map((d, i) => {
                const isToday = i === dummyGrafik.length - 1;
                const barH = Math.round((d.jumlah / maxGrafik) * 120);
                const bpjsH = Math.round((d.bpjs / maxGrafik) * 120);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0">
                    {/* Total value label */}
                    <span className={`text-xs font-bold mb-1 ${isToday ? 'text-blue-700' : 'text-gray-600'}`}>
                      {d.jumlah}
                    </span>
                    {/* Two bars side by side */}
                    <div className="w-full flex gap-0.5 items-end" style={{ height: '110px' }}>
                      <div
                        className={`flex-1 ${isToday ? 'bg-blue-600' : 'bg-blue-300 hover:bg-blue-400'} transition-colors`}
                        style={{ height: `${barH}px` }}
                      />
                      <div
                        className={`flex-1 ${isToday ? 'bg-emerald-500' : 'bg-emerald-300 hover:bg-emerald-400'} transition-colors`}
                        style={{ height: `${bpjsH}px` }}
                      />
                    </div>
                    {/* Day label */}
                    <span className={`text-xs font-semibold mt-1 ${isToday ? 'text-blue-700' : 'text-gray-500'}`}>
                      {d.hari}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Stats */}
            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-extrabold text-gray-900">{dummyStats.totalBulanIni.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500 mt-0.5">Total Bulan Ini</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-gray-900">{Math.round(dummyStats.totalBulanIni / 26)}</p>
                <p className="text-xs text-gray-500 mt-0.5">Rata-rata / Hari</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-emerald-600">↑ 8%</p>
                <p className="text-xs text-gray-500 mt-0.5">vs Bulan Lalu</p>
              </div>
            </div>
          </div>

          {/* KOMPOSISI JENIS BAYAR */}
          <div className="bg-white border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Jenis Pembayaran</h2>
              <p className="text-xs text-gray-500 mb-5">Komposisi pasien hari ini</p>

              {[
                { label: 'BPJS Kesehatan', value: dummyStats.bpjs, total: dummyStats.totalHariIni, color: 'bg-green-500' },
                { label: 'Umum / Mandiri', value: dummyStats.umum, total: dummyStats.totalHariIni, color: 'bg-blue-500' },
                { label: 'Asuransi Swasta', value: dummyStats.asuransi, total: dummyStats.totalHariIni, color: 'bg-violet-500' },
              ].map((item) => {
                const persen = Math.round((item.value / item.total) * 100);
                return (
                  <div key={item.label} className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value} <span className="text-gray-400 font-normal text-xs">({persen}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5">
                      <div className={`h-2.5 ${item.color} transition-all duration-700`} style={{ width: `${persen}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Prioritas Khusus</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-purple-50 border border-purple-100 p-2">
                  <p className="text-xl font-extrabold text-purple-700">{dummyStats.prioritas.lansia}</p>
                  <p className="text-xs text-purple-600 font-medium mt-0.5">Lansia</p>
                </div>
                <div className="bg-pink-50 border border-pink-100 p-2">
                  <p className="text-xl font-extrabold text-pink-700">{dummyStats.prioritas.hamilMenyusui}</p>
                  <p className="text-xs text-pink-600 font-medium mt-0.5">Hamil</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 p-2">
                  <p className="text-xl font-extrabold text-orange-700">{dummyStats.prioritas.disabilitas}</p>
                  <p className="text-xs text-orange-600 font-medium mt-0.5">Disabilitas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 3: STATUS POLI + TABEL ANTRIAN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* STATUS POLI */}
          <div className="bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Status Poli</h2>
            <div className="space-y-2.5">
              {dummyPoli.map((poli) => (
                <div key={poli.nama} className={`flex items-center justify-between p-3 border ${poli.status === 'Buka' ? 'border-gray-200 bg-white hover:bg-blue-50/50' : 'border-gray-100 bg-gray-50'} transition-colors`}>
                  <div>
                    <p className={`text-sm font-semibold ${poli.status === 'Tutup' ? 'text-gray-400' : 'text-gray-800'}`}>{poli.nama}</p>
                    <p className={`text-xs mt-0.5 ${poli.status === 'Tutup' ? 'text-gray-400' : 'text-gray-500'}`}>{poli.dokter}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-0.5 ${poli.status === 'Buka' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{poli.status}</span>
                    {poli.status === 'Buka' && <span className="text-xs text-blue-600 font-bold">{poli.jumlah} pasien</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TABEL ANTRIAN */}
          <div className="lg:col-span-3 bg-white border border-gray-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Daftar Antrian Loket</h2>
                <p className="text-xs text-gray-500 mt-0.5">Pantau dan kelola antrian pasien</p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {/* Filter Status */}
                <div className="flex border border-gray-200 text-xs font-semibold">
                  {['Semua', 'Menunggu', 'Dilayani', 'Selesai'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input type="text" placeholder="Cari pasien / no antrian..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-52 text-gray-900" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">No. Antrian</th>
                    <th className="px-5 py-3">Pasien</th>
                    <th className="px-5 py-3">Poli Tujuan</th>
                    <th className="px-5 py-3">Pembayaran</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-800 text-sm">{p.noAntrian}</span>
                          <span className="text-xs text-gray-400">{p.waktu} WIB</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          {p.nama}
                          {p.prioritas !== 'Umum' && (
                            <span className={`text-xs px-1.5 py-0.5 font-bold ${getPrioritasBadge(p.prioritas)}`}>{p.prioritas}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          <span>{p.usia} th, {p.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                          <span className={`px-1.5 py-0.5 text-xs font-medium ${p.jenisKunjungan === 'Pasien Baru' ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-600'}`}>
                            {p.jenisKunjungan}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">{p.noRm !== '-' ? p.noRm : 'Pasien Baru'}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-gray-700 font-medium text-sm">{p.poli}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 font-bold ${getBayarStyle(p.jenisBayar)}`}>{p.jenisBayar}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 font-semibold flex items-center gap-1.5 w-fit ${getStatusStyle(p.status)}`}>
                          {p.status === 'Dilayani' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />}
                          {p.status === 'Menunggu' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />}
                          {p.status === 'Selesai' && <CheckCircle2 className="w-3 h-3" />}
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {p.status === 'Menunggu' && (
                            <>
                              <button className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors" title="Panggil Pasien">
                                <Volume2 className="w-4 h-4" />
                              </button>
                              <Link href="/administrasi/pendaftaran" className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm">
                                <ClipboardEdit className="w-3.5 h-3.5" />
                                Proses
                              </Link>
                            </>
                          )}
                          {p.status === 'Selesai' && (
                            <button className="p-2 text-gray-500 hover:bg-gray-100 transition-colors" title="Cetak Bukti">
                              <Printer className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Search className="w-8 h-8" />
                          <p className="font-medium">Tidak ada data yang ditemukan</p>
                          <p className="text-xs">Coba ubah kata kunci pencarian atau filter status</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Table */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Menampilkan <strong className="text-gray-700">{filtered.length}</strong> dari <strong className="text-gray-700">{dummyAntrian.length}</strong> antrian</span>
              <button className="flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700">
                <RefreshCw className="w-3.5 h-3.5" />Refresh Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
