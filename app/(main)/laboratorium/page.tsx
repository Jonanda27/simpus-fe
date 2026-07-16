'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  TestTubes, 
  CheckCircle2, 
  Activity,
  ArrowRight,
  Clock,
  Calendar,
  ArrowUpRight,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function LaboratoriumDashboard() {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dummy data untuk statistik
  const dummyStats = {
    totalHariIni: 24,
    menunggu: 5,
    sedangDilayani: 2,
    selesai: 19,
  };

  // Dummy data untuk grafik (7 hari terakhir)
  const chartData = [
    { day: 'Sen', count: 18 },
    { day: 'Sel', count: 22 },
    { day: 'Rab', count: 25 },
    { day: 'Kam', count: 20 },
    { day: 'Jum', count: 30 },
    { day: 'Sab', count: 15 },
    { day: 'Min', count: 8 },
  ];
  
  const maxCount = Math.max(...chartData.map(d => d.count));

  if (!isClient) return null;

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
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Dashboard Laboratorium</h1>
              <p className="text-indigo-100 text-sm mt-1 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {user?.nama_lengkap || user?.username || 'Analis Laboratorium'}
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
          <div className="bg-white border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between rounded-none">
            {/* Top Right Icon */}
            <div className="absolute top-6 right-6 w-10 h-10 bg-indigo-100 flex items-center justify-center rounded-none">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            
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
          <div className="bg-white border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between rounded-none">
            {/* Top Right Icon */}
            <div className="absolute top-6 right-6 w-10 h-10 bg-amber-100 flex items-center justify-center rounded-none">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Antrean Aktif</p>
              <h3 className="text-4xl font-extrabold text-gray-900">{dummyStats.menunggu}</h3>
              <p className="text-sm text-gray-500 mt-1">Menunggu diambil sampel</p>
            </div>
            
            <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <div className="w-2 h-2 rounded-none bg-amber-400"></div>
              <span>{dummyStats.sedangDilayani} spesimen sedang diproses</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between rounded-none">
            {/* Top Right Icon */}
            <div className="absolute top-6 right-6 w-10 h-10 bg-emerald-100 flex items-center justify-center rounded-none">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Selesai Diuji</p>
              <h3 className="text-4xl font-extrabold text-gray-900">{dummyStats.selesai}</h3>
              <p className="text-sm text-gray-500 mt-1">Hasil dikirim ke dokter</p>
            </div>
            
            <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{Math.round((dummyStats.selesai / dummyStats.totalHariIni) * 100)}% dari total pemeriksaan</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* MAIN COLUMN - CHARTS & TABLE */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart Dummy */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Statistik Pemeriksaan (7 Hari Terakhir)
              </h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {chartData.map((d, i) => {
                  const heightPercentage = (d.count / maxCount) * 100;
                  return (
                    <div key={i} className="flex flex-col items-center flex-1 group h-full">
                      <div className="w-full relative flex justify-center h-full items-end pb-2">
                        {/* Value Label (Always Visible) */}
                        <div className="absolute -top-6 text-indigo-700 text-xs font-bold">
                          {d.count}
                        </div>
                        {/* Bar */}
                        <div 
                          className="w-full max-w-[40px] bg-indigo-500 group-hover:bg-indigo-600 rounded-none transition-colors duration-300"
                          style={{ height: `${heightPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase mt-2">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabel Ringkasan Terakhir */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    Pemeriksaan Selesai Terakhir
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Daftar spesimen yang baru saja selesai diuji.</p>
                </div>
                <Link href="/laboratorium/antrian" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  Lihat Antrean <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs font-medium text-gray-500 bg-white border-b border-gray-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Waktu Selesai</th>
                      <th className="px-6 py-3">Nama Pasien</th>
                      <th className="px-6 py-3">Dokter Pengirim</th>
                      <th className="px-6 py-3">Total Pemeriksaan</th>
                      <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-500 whitespace-nowrap">11:30 WIB</td>
                      <td className="px-6 py-4 font-bold text-gray-900">Budi Santoso</td>
                      <td className="px-6 py-4">Dr. Umum</td>
                      <td className="px-6 py-4">12 Pemeriksaan</td>
                      <td className="px-6 py-4 text-right"><span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-none text-xs font-bold">SELESAI</span></td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-500 whitespace-nowrap">11:15 WIB</td>
                      <td className="px-6 py-4 font-bold text-gray-900">Siti Aminah</td>
                      <td className="px-6 py-4">Dr. Penyakit Dalam</td>
                      <td className="px-6 py-4">5 Pemeriksaan</td>
                      <td className="px-6 py-4 text-right"><span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-none text-xs font-bold">SELESAI</span></td>
                    </tr>
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
                <h2 className="text-sm font-bold text-gray-900">Akses Cepat Laboratorium</h2>
              </div>
              <div className="p-2 grid grid-cols-2 gap-2">
                <Link href="/laboratorium/antrian" className="p-3 border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 group flex flex-col items-center justify-center text-center transition-all h-24 rounded-none">
                  <ClipboardList className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">Antrean Uji Lab</span>
                </Link>
                <div className="p-3 border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 group flex flex-col items-center justify-center text-center transition-all h-24 cursor-pointer rounded-none">
                  <TestTubes className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">Master Pemeriksaan</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-none">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">Peringatan Penting</h2>
                <span className="bg-red-100 border border-red-200 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-none">1 Peringatan</span>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-red-800">Reagen Hampir Habis</h4>
                    <p className="text-xs text-red-700 mt-1">Stok Reagen Kimia Darah (Glukosa) tersisa untuk kurang dari 20 pasien.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
