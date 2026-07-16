'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUKMStore } from '../../../store/ukm.store';
import { Users, Activity, Loader2, ArrowRight, Calendar, Clock } from 'lucide-react';

export default function UKMDashboardPage() {
  const router = useRouter();
  const { programs, isLoading, fetchDashboardStats } = useUKMStore();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    fetchDashboardStats();
    
    // Setup clock
    setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, [fetchDashboardStats]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── HERO HEADER ── */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-white rounded-full translate-y-1/2" />
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Dashboard UKM</h1>
              <p className="text-blue-100 text-sm mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                <span className="mx-1 text-blue-300">•</span>
                <Clock className="w-4 h-4" />{currentTime}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div 
              key={program.id}
              onClick={() => router.push(`/ukm/${program.kodeProgram}`)}
              className="bg-white rounded-none p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-3 rounded-none group-hover:bg-blue-600 transition-colors">
                  <Activity className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              
              <h2 className="text-lg font-bold text-gray-900 mb-1">{program.namaProgram}</h2>
              <p className="text-gray-500 text-xs mb-6 line-clamp-2">Data rekapitulasi dan pemantauan pasien aktif {program.namaProgram}</p>
              
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-xs font-medium uppercase tracking-wider">Pasien Terdaftar</span>
                </div>
                <span className="text-lg font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-none">
                  {program._count?.registerPasien || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
