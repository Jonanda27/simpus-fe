"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Stethoscope, ShieldCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      
      // Ambil user dari store setelah berhasil login
      const user = useAuthStore.getState().user;
      
      if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (user?.role === 'ADMINISTRASI') {
        router.push('/administrasi');
      } else if (user?.role === 'PERAWAT') {
        router.push('/perawat');
      } else if (user?.role === 'DOKTER') {
        router.push('/dokter');
      } else if (user?.role === 'APOTEKER') {
        router.push('/apoteker');
      } else if (user?.role === 'LABORATORIUM') {
        router.push('/laboratorium');
      } else if (user?.role === 'KASIR') {
        router.push('/kasir');
      } else if (user?.role === 'PETUGAS_UKM') {
        router.push('/ukm');
      } else {
        router.push('/administrasi');
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Kembali ke Beranda
        </Link>
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-none flex items-center justify-center shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Portal Petugas
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistem Informasi Pelayanan Kesehatan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-12 px-6 shadow-xl border border-gray-100 rounded-none sm:px-10 flex flex-col items-center">
          
          <div className="mb-8 flex items-center justify-center bg-blue-50 py-2 px-3 border border-blue-100 rounded-none w-full">
            <ShieldCheck className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Akses Internal Puskesmas</span>
          </div>

          {error && (
            <div className="mb-4 w-full bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-none shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-200 w-full">
            <p className="text-xs text-center text-gray-400">
              Sistem Pendaftaran Pasien & Rekam Medis Elektronik.<br/>
              Hanya untuk petugas medis yang berwenang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
