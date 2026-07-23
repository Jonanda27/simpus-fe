'use client';

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { 
  Activity, 
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Server,
  ActivitySquare
} from 'lucide-react';

interface SyncModule {
  name: string;
  status: 'SUCCESS' | 'PENDING' | 'ERROR';
  detail?: string | null;
}

interface MonitoringData {
  id: string;
  pasienName: string;
  noRm: string;
  dokterName: string;
  statusKunjungan: string;
  waktuDaftar: string;
  modules: SyncModule[];
}

export default function SatusehatMonitoringPage() {
  const [data, setData] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/satusehat-monitoring');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch monitoring data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Live refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-none shadow-sm border border-green-200">
            <CheckCircle2 className="w-3 h-3" /> Sukses
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-none shadow-sm border border-yellow-200">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-none shadow-sm border border-red-200">
            <AlertTriangle className="w-3 h-3" /> Gagal
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white pt-8 pb-16 px-6 lg:px-8 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Server className="w-8 h-8 text-blue-300" />
              Monitoring SATUSEHAT
            </h1>
            <p className="text-blue-100 mt-2 text-sm font-medium">Status sinkronisasi Rekam Medis Elektronik secara Live (Real-Time)</p>
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded px-5 py-2.5 flex items-center gap-2 transition-all font-bold"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Main Dashboard Card */}
        <div className="bg-white rounded-none shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 sticky left-0 bg-gray-50 z-10 border-r border-gray-200">Pasien & Info</th>
                  <th className="px-6 py-4 sticky left-[220px] bg-gray-50 z-10 border-r border-gray-200">Status Kunjungan</th>
                  {data.length > 0 && data[0].modules.map((m, i) => (
                    <th key={m.name} className="px-6 py-4">{i + 1}. {m.name}</th>
                  ))}
                  {data.length === 0 && (
                    <>
                      <th className="px-6 py-4">1. Encounter</th>
                      <th className="px-6 py-4">2. Observation</th>
                      <th className="px-6 py-4">3. Condition</th>
                      <th className="px-6 py-4">...16 Modul Lainnya</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && data.length === 0 ? (
                  <tr>
                    <td colSpan={21} className="px-6 py-12 text-center text-gray-500">
                      <ActivitySquare className="w-8 h-8 animate-bounce mx-auto text-blue-500 mb-3" />
                      Memuat data sinkronisasi...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={21} className="px-6 py-12 text-center text-gray-500 font-medium">
                      Tidak ada Kunjungan hari ini.
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 sticky left-0 bg-white border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                        <div className="font-bold text-gray-900 w-48 truncate">{row.pasienName}</div>
                        <div className="text-xs text-gray-500 mt-1">{row.noRm}</div>
                        <div className="text-xs text-blue-700 font-medium mt-1 truncate">Dokter: {row.dokterName}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{new Date(row.waktuDaftar).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                      </td>
                      <td className="px-6 py-4 sticky left-[220px] bg-white border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                        <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-none border border-gray-200">
                          {row.statusKunjungan}
                        </span>
                      </td>
                      
                      {row.modules.map((module) => (
                        <td key={module.name} className="px-6 py-4">
                          <div className="flex flex-col gap-1 items-start min-w-[120px]">
                            {getStatusBadge(module.status)}
                            <span className="text-[10px] text-gray-400 break-all max-w-[200px]">
                              {module.detail || '-'}
                            </span>
                          </div>
                        </td>
                      ))}

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
