'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { kunjunganService } from '@/services/kunjungan.service';
import { screeningService } from '@/services/screening.service';
import { CreateScreeningPayload } from '@/types/screening.types';
import { Kunjungan } from '@/types/kunjungan.types';
import Swal from 'sweetalert2';
import { 
  User, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Thermometer, 
  Save, 
  FileText,
  Calendar,
  Stethoscope
} from 'lucide-react';
import ScreeningForm from '../components/ScreeningForm';

export default function ScreeningFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [activeTab, setActiveTab] = useState('screening');
  const [kunjungan, setKunjungan] = useState<Kunjungan | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tinggiBadan: '',
    beratBadan: '',
    lingkarPerut: '',
    tekananDarahSistolik: '',
    tekananDarahDiastolik: '',
    nadi: '',
    frekuensiNapas: '',
    suhuTubuh: '',
    saturasiOksigen: '',
    skalaNyeri: '',
    kategoriTriage: 'HIJAU',
    keluhanUtama: '',
    riwayatKeluarga: '',
    merokok: 'Tidak',
  });

  useEffect(() => {
    fetchKunjungan();
  }, [id]);

  const fetchKunjungan = async () => {
    try {
      const data = await kunjunganService.getKunjunganById(id);
      setKunjungan(data);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: err?.response?.data?.message || 'Terjadi kesalahan'
      });
      router.push('/perawat/screening');
    } finally {
      setLoading(false);
    }
  };

  const calculateIMT = () => {
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Activity className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Memuat Data Pasien...</p>
      </div>
    );
  }

  if (!kunjungan) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white pt-8 pb-16 px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <button onClick={() => router.push('/perawat/screening')} className="hover:text-gray-200 transition-colors">
                ←
              </button>
              Screening & Triase
            </h1>
            <p className="text-blue-100 mt-2 text-sm font-medium">Pemeriksaan Awal Perawat Rawat Jalan</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-none px-4 py-2 flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-200" />
            <span className="font-mono text-sm">
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Patient Identity Card - Glassmorphism */}
        <div className="bg-white rounded-none shadow-xl shadow-blue-900/5 border border-gray-100 p-6 mb-6 flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-none bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-200 shadow-inner">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{kunjungan.pasien.namaLengkap}</h2>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-none border border-green-200">
                  {kunjungan.prioritas}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  No RM: <span className="text-gray-900">{kunjungan.pasien.noRM}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Usia: <span className="text-gray-900">{new Date().getFullYear() - new Date(kunjungan.pasien.tanggalLahir).getFullYear()} Tahun</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-gray-400" />
                  Tujuan: <span className="text-gray-900">{kunjungan.poliklinik.namaPoli}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-none p-4 flex items-start gap-3 md:max-w-xs">
            <Activity className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-blue-800">Antrean #{kunjungan.noAntrian}</h3>
              <p className="text-sm text-blue-600 mt-0.5">Waktu Kedatangan: {kunjungan.jamRegistrasi}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-none px-2 pt-2">
          <button 
            onClick={() => setActiveTab('screening')}
            className={`px-6 py-3.5 text-sm font-bold transition-all border-b-2 ${activeTab === 'screening' ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-none' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Form Screening
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3.5 text-sm font-bold transition-all border-b-2 ${activeTab === 'history' ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-none' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Riwayat Kedatangan
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === 'screening' && (
          <div className="bg-white p-6 md:p-8 rounded-none shadow-sm border border-gray-200">
            <ScreeningForm kunjungan={kunjungan} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-none shadow-sm border border-gray-200 p-8 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Riwayat Kedatangan</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">Riwayat kunjungan sebelumnya akan ditampilkan di halaman ini.</p>
          </div>
        )}

      </div>
    </div>
  );
}
