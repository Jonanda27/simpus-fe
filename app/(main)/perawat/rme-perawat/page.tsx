"use client";

import React, { useState } from 'react';
import { 
  User, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Heart, 
  Thermometer, 
  Save, 
  FileText,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function RMEPerawatPage() {
  const [activeTab, setActiveTab] = useState('cppt');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white pt-8 pb-16 px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">RME Perawat (CPPT)</h1>
            <p className="text-blue-100 mt-2 text-sm font-medium">Asuhan Keperawatan & Catatan Perkembangan Terintegrasi</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-none px-4 py-2 flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-200" />
            <span className="font-mono text-sm">Shift Pagi • 08:45 WIB</span>
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
                <h2 className="text-2xl font-bold text-gray-900">Bapak Budi Santoso</h2>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
                  Rawat Inap
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  No RM: <span className="text-gray-900">RM-2023-8891</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Usia: <span className="text-gray-900">45 Tahun</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gray-400" />
                  Kamar: <span className="text-gray-900">Melati - 302</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-none p-4 flex items-start gap-3 md:max-w-xs">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-800">Peringatan Alergi!</h3>
              <p className="text-sm text-red-600 mt-0.5">Paracetamol, Amoxicillin. Reaksi: Gatal & Ruam Kulit parah.</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-none px-2 pt-2">
          <button 
            onClick={() => setActiveTab('cppt')}
            className={`px-6 py-3.5 text-sm font-bold transition-all border-b-2 ${activeTab === 'cppt' ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-none' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Form CPPT & Vital Sign
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3.5 text-sm font-bold transition-all border-b-2 ${activeTab === 'history' ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-none' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Riwayat Pemeriksaan (Log)
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === 'cppt' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Input CPPT */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Input Data Tanda Vital</h3>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Tensi (mmHg)</label>
                    <input type="text" placeholder="120/80" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Nadi (x/mnt)</label>
                    <input type="number" placeholder="80" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Suhu (°C)</label>
                    <input type="number" step="0.1" placeholder="36.5" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">SpO2 (%)</label>
                    <input type="number" placeholder="98" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 font-medium" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Catatan Keperawatan (SOAP)</h3>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <span className="w-6 h-6 rounded-none bg-blue-100 text-blue-700 flex items-center justify-center text-xs">S</span>
                      Subjektif (Keluhan Pasien)
                    </label>
                    <textarea rows={2} placeholder="Pasien mengeluhkan..." className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"></textarea>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <span className="w-6 h-6 rounded-none bg-blue-100 text-blue-700 flex items-center justify-center text-xs">O</span>
                      Objektif (Hasil Observasi Perawat)
                    </label>
                    <textarea rows={2} placeholder="Pasien tampak..." className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"></textarea>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <span className="w-6 h-6 rounded-none bg-blue-100 text-blue-700 flex items-center justify-center text-xs">A</span>
                      Asesmen Keperawatan
                    </label>
                    <input type="text" placeholder="Masalah keperawatan..." className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <span className="w-6 h-6 rounded-none bg-blue-100 text-blue-700 flex items-center justify-center text-xs">P</span>
                      Plan (Rencana / Implementasi)
                    </label>
                    <textarea rows={2} placeholder="Tindakan yang dilakukan..." className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"></textarea>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-none flex items-center gap-2 shadow-md shadow-blue-500/30 transition-all active:scale-95">
                    <Save className="w-5 h-5" />
                    Simpan CPPT
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Mini Log & Status */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-none shadow-lg border border-blue-800 p-6 text-white relative overflow-hidden">
                <Heart className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Status Pasien
                </h3>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-blue-200 text-sm">Kesadaran</span>
                    <span className="font-bold">Compos Mentis</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-blue-200 text-sm">Diet</span>
                    <span className="font-bold">Lunak (Nasi Tim)</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-blue-200 text-sm">Aktivitas</span>
                    <span className="font-bold">Tirah Baring</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-none shadow-sm border border-gray-200 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Log Terakhir (Shift Malam)</h3>
                <div className="border-l-2 border-blue-100 pl-4 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <p className="text-xs text-gray-500 font-bold mb-1">02:30 WIB • Ns. Siti</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-2.5 rounded-none border border-gray-100">Pasien terbangun, mengeluh nyeri perut skala 4. Telah diberikan antasida sesuai resep.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white"></div>
                    <p className="text-xs text-gray-500 font-bold mb-1">22:00 WIB • Ns. Budi</p>
                    <p className="text-sm text-gray-800 bg-gray-50 p-2.5 rounded-none border border-gray-100">Injeksi antibiotik ceftriaxone 1g IV masuk. Reaksi alergi negatif.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-none shadow-sm border border-gray-200 p-8 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Riwayat Belum Tersedia</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">Riwayat CPPT dan observasi sebelumnya akan ditampilkan di halaman ini dalam bentuk tabel *timeline* lengkap.</p>
          </div>
        )}

      </div>
    </div>
  );
}
