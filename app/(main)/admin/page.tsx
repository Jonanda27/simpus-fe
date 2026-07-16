"use client";

import React from 'react';
import { LayoutDashboard, Users, Building, Activity, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
          Dashboard Admin
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Selamat datang di panel kontrol administrator.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/admin/master-dokter" className="bg-white p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Master Dokter</h3>
          <p className="text-xs text-gray-500">Kelola akun dan data dokter.</p>
        </Link>
        <Link href="/dashboard/admin/perusahaan" className="bg-white p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Master Perusahaan</h3>
          <p className="text-xs text-gray-500">Kelola data mitra kerja sama.</p>
        </Link>
        <Link href="/dashboard/admin/master-klinik" className="bg-white p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Master Klinik & Poli</h3>
          <p className="text-xs text-gray-500">Kelola struktur layanan medis.</p>
        </Link>
        <Link href="/dashboard/admin/icd10" className="bg-white p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Data ICD-10</h3>
          <p className="text-xs text-gray-500">Basis data diagnosa medis.</p>
        </Link>
      </div>
    </div>
  );
}
