"use client";

import React, { useState, useEffect } from 'react';
import {
  Users, Clock, CheckCircle2, Search, UserPlus, Volume2,
  ClipboardEdit, Activity, AlertTriangle, TrendingUp,
  Heart, Shield, Baby, ChevronRight, Calendar, Printer,
  BarChart2, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

import { kunjunganService } from '@/services/kunjungan.service';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHariIni: 0,
    totalBulanIni: 0,
    menunggu: 0,
    sedangDilayani: 0,
    selesai: 0,
    pembayaranList: [] as { label: string, value: number }[],
    prioritas: { lansia: 0, disabilitas: 0, hamilMenyusui: 0 }
  });
  const [antrean, setAntrean] = useState<any[]>([]);
  const [grafik, setGrafik] = useState<any[]>([]);
  const [poli, setPoli] = useState<any[]>([]);

  const fetchDashboardStats = async () => {
    try {
      const data = await kunjunganService.getDashboardStats();
      setStats(data.stats);
      setAntrean(data.antrean);
      setGrafik(data.grafik);
      setPoli(data.poli);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const getAge = (dob: string) => {
    if (!dob) return 0;
    const diff = new Date().getTime() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const mapStatus = (st: string) => {
    if (st === 'MENUNGGU' || st === 'MENUNGGU_DOKTER') return 'Menunggu';
    if (st === 'DIPROSES_SCREENING' || st === 'DIPERIKSA') return 'Dilayani';
    return 'Selesai';
  };

  const filtered = antrean.filter(p => {
    const nama = p.pasien?.namaLengkap || '';
    const noAntrian = p.noAntrian || '';
    const noRm = p.pasien?.noRM || '';
    const matchSearch = nama.toLowerCase().includes(search.toLowerCase()) || 
                        noAntrian.toLowerCase().includes(search.toLowerCase()) || 
                        noRm.toLowerCase().includes(search.toLowerCase());
    
    const mappedSt = mapStatus(p.statusKunjungan);
    const matchStatus = filterStatus === 'Semua' || mappedSt === filterStatus;
    
    return matchSearch && matchStatus;
  });

  if (!isClient) return null;

  const maxGrafik = Math.max(...grafik.map(g => g.jumlah), 1); // Avoid division by zero

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
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Kunjungan</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.totalHariIni}</p>
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
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Antrian Aktif</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.menunggu}</p>
                <p className="text-xs text-gray-500 mt-1">Menunggu panggilan poli</p>
              </div>
              <div className="p-2.5 bg-amber-100 text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-amber-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
              <span>{stats.sedangDilayani} pasien sedang dilayani</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Selesai Hari Ini</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.selesai}</p>
                <p className="text-xs text-gray-500 mt-1">Sudah dilayani</p>
              </div>
              <div className="p-2.5 bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{Math.round((stats.selesai / (stats.totalHariIni || 1)) * 100)}% dari total kunjungan</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prioritas Khusus</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.prioritas.lansia + stats.prioritas.disabilitas + stats.prioritas.hamilMenyusui}</p>
                <p className="text-xs text-gray-500 mt-1">Lansia, Hamil, Disabilitas</p>
              </div>
              <div className="p-2.5 bg-purple-100 text-purple-600">
                <Heart className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 font-medium">Lansia: {stats.prioritas.lansia}</span>
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 font-medium">Hamil: {stats.prioritas.hamilMenyusui}</span>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 font-medium">Disabilitas: {stats.prioritas.disabilitas}</span>
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
              </div>
            </div>

            {/* Chart Bars */}
            <div className="flex items-end gap-3 flex-1" style={{ minHeight: '120px' }}>
              {grafik.map((item, idx) => {
                const isToday = idx === grafik.length - 1;
                const barH = Math.round((item.jumlah / maxGrafik) * 120);
                const bpjsH = Math.round((item.bpjs / maxGrafik) * 120);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-0">
                    <span className={`text-xs font-bold mb-2 ${isToday ? 'text-blue-700' : 'text-gray-600'}`}>
                      {item.jumlah}
                    </span>
                    <div className="w-full flex justify-center items-end" style={{ height: '110px' }}>
                      <div
                        className={`w-5 sm:w-8 flex flex-col justify-end overflow-hidden rounded-t-sm ${isToday ? 'bg-blue-600' : 'bg-blue-300 hover:bg-blue-400'} transition-colors relative group/bar`}
                        style={{ height: `${barH}px` }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute opacity-0 group-hover/bar:opacity-100 bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none transition-opacity">
                          Total: {item.jumlah}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold mt-1 ${isToday ? 'text-blue-700' : 'text-gray-500'}`}>
                      {item.hari}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Stats */}
            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-extrabold text-gray-900">{stats.totalBulanIni.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500 mt-0.5">Total Bulan Ini</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-gray-900">{Math.round(stats.totalBulanIni / 26)}</p>
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

              {stats.pembayaranList.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Belum ada data pembayaran</p>
              ) : (
                stats.pembayaranList.map((item, idx) => {
                  const totalPembayaran = stats.pembayaranList.reduce((acc, curr) => acc + curr.value, 0);
                  const persen = totalPembayaran === 0 ? 0 : Math.round((item.value / totalPembayaran) * 100);
                  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500'];
                  const color = colors[idx % colors.length];
                  
                  return (
                    <div key={item.label} className="mb-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm font-bold text-gray-900">{item.value} <span className="text-gray-400 font-normal text-xs">({persen}%)</span></span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5">
                        <div className={`h-2.5 ${color} transition-all duration-700`} style={{ width: `${persen}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── ROW 3: STATUS POLI + TABEL ANTRIAN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* STATUS POLI */}
          <div className="bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Status Poli</h2>
            <div className="space-y-2.5">
              {poli.map((p, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 border ${p.status === 'Buka' ? 'border-gray-200 bg-white hover:bg-blue-50/50' : 'border-gray-100 bg-gray-50'} transition-colors`}>
                  <div>
                    <p className={`text-sm font-semibold ${p.status === 'Tutup' ? 'text-gray-400' : 'text-gray-800'}`}>{p.nama}</p>
                    <p className={`text-xs mt-0.5 ${p.status === 'Tutup' ? 'text-gray-400' : 'text-gray-500'}`}>{p.dokter}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-0.5 ${p.status === 'Buka' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{p.status}</span>
                    {p.status === 'Buka' && <span className="text-xs text-blue-600 font-bold">{p.jumlah} pasien</span>}
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
                          <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          {p.pasien?.namaLengkap}
                          {p.prioritas !== 'Umum' && (
                            <span className={`text-xs px-1.5 py-0.5 font-bold ${getPrioritasBadge(p.prioritas)}`}>{p.prioritas}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          <span>{getAge(p.pasien?.tanggalLahir)} th, {p.pasien?.jenisKelamin === 'Laki-Laki' ? 'L' : 'P'}</span>
                          <span className={`px-1.5 py-0.5 text-xs font-medium ${p.statusPasien === 'Baru' ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-600'}`}>
                            {p.statusPasien}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">{p.pasien?.noRM || 'Pasien Baru'}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-gray-700 font-medium text-sm">{p.poliklinik?.namaPoli || '-'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBayarStyle(p.pasien?.penjamin?.jenisPenjamin || 'Umum')}`}>
                          {p.pasien?.penjamin?.jenisPenjamin || 'Umum'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(mapStatus(p.statusKunjungan))}`}>
                          {mapStatus(p.statusKunjungan)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {mapStatus(p.statusKunjungan) === 'Menunggu' && (
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
                          {mapStatus(p.statusKunjungan) === 'Selesai' && (
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
              <span>Menampilkan <strong className="text-gray-700">{filtered.length}</strong> dari <strong className="text-gray-700">{antrean.length}</strong> antrean</span>
              <button onClick={fetchDashboardStats} className="flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700">
                <RefreshCw className="w-3.5 h-3.5" />Refresh Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
