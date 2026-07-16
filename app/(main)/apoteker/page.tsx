"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pill, Clock, CheckCircle, AlertCircle, ArrowRight, Loader2, ArrowUpRight, Calendar } from 'lucide-react';
import { farmasiService, ResepData } from '@/services/farmasi.service';

export default function ApotekerDashboard() {
  const [antrian, setAntrian] = useState<ResepData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchAntrian();
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
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

  const statCards = [
    {
      title: 'Antrian Resep',
      value: antrian.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
    },
    {
      title: 'Obat Kritis (Stok < 10)',
      value: '0',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
    },
    {
      title: 'Resep Selesai Hari Ini',
      value: '0',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    }
  ];

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
      {/* ── HERO HEADER ── */}
      <div className="relative bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-white rounded-full translate-y-1/2" />
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Dashboard Apoteker</h1>
              <p className="text-teal-100 text-sm mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                <span className="mx-1 text-teal-300">•</span>
                <Clock className="w-4 h-4" />{currentTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`bg-white rounded-none p-6 shadow-sm border ${stat.borderColor} relative overflow-hidden group hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-none flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${stat.bgColor} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
          </div>
        ))}
      </div>

      {/* Quick Access to Queue */}
      <div className="bg-white border border-gray-200 rounded-none shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              Antrian Resep Menunggu Disiapkan
            </h2>
            <p className="text-sm text-gray-500 mt-1">Daftar resep dari dokter yang belum diproses</p>
          </div>
          <Link href="/apoteker/antrian" className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center group">
            Lihat Semua Antrian
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : antrian.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Antrian Kosong</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">Tidak ada resep baru dari Poli. Anda bisa istirahat sejenak atau mengecek ketersediaan stok obat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Waktu Resep</th>
                    <th className="px-6 py-4">Poli / Dokter</th>
                    <th className="px-6 py-4">Pasien</th>
                    <th className="px-6 py-4">Item Obat</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {antrian.slice(0, 5).map((resep) => (
                    <tr key={resep.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-orange-600 font-medium">
                          <Clock className="w-4 h-4 mr-1.5" />
                          {new Date(resep.tanggalResep).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(resep.tanggalResep).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{resep.kunjungan.poliklinik.namaPoli}</div>
                        <div className="text-xs text-gray-500">
                          {resep.kunjungan.jenisPelayanan === 'UKM' ? 'Petugas UKM: ' : 'Dr. '}
                          {resep.dokter?.namaLengkap || 'Sistem'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{resep.pasien.namaLengkap}</div>
                        <div className="text-xs text-gray-500 font-mono">RM: {resep.pasien.noRM}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
                          {resep.details.length} Macam Obat
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/apoteker/antrian/${resep.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white font-medium text-sm rounded-none border border-teal-200 hover:border-teal-600 transition-colors"
                        >
                          Siapkan Obat
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {antrian.length > 5 && (
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Dan {antrian.length - 5} antrian lainnya...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
