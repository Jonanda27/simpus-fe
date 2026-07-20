"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Loader2, HeartPulse } from 'lucide-react';
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
    <div className="h-screen w-full flex overflow-hidden font-sans bg-white">
      
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between relative overflow-hidden p-12">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "url('/doctor_hero_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-blue-400 hover:text-blue-300 group transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="relative z-10 mb-20">
          <div className="flex items-center gap-3 mb-8 text-white">
            <div className="w-14 h-14 bg-blue-500 flex items-center justify-center rounded-none shadow-lg border-2 border-blue-400">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-4xl font-black tracking-widest uppercase leading-none block">SIMPUS</span>
              <span className="text-xs font-bold tracking-[0.4em] text-blue-400 uppercase">HOSPITAL</span>
            </div>
          </div>
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
            Sistem Informasi <br/>Manajemen Puskesmas
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed max-w-md border-l-4 border-blue-500 pl-4">
            Platform digital terintegrasi untuk memberikan pelayanan kesehatan yang cepat, akurat, dan paperless kepada masyarakat.
          </p>
        </div>

        <div className="relative z-10 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
          © 2026 SIMPUS Hospital. Seluruh Hak Cipta Dilindungi.
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-8 sm:p-12 relative bg-slate-50">
        
        {/* Mobile Header (Shows only on small screens) */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-slate-900">
           <Link href="/" className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-500 uppercase tracking-widest">
             <ArrowLeft className="w-4 h-4 mr-1" /> Beranda
           </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-widest mb-4">Portal Petugas</h2>
            <div className="w-16 h-1.5 bg-blue-500 mb-4"></div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Silakan masuk menggunakan kredensial Anda untuk mengakses dasbor layanan.</p>
          </div>

          <div className="bg-white p-8 sm:p-10 border-t-4 border-t-blue-600 shadow-2xl rounded-none relative">
            
            <div className="mb-8 flex items-center justify-center bg-slate-50 py-3 px-4 border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Akses Internal Terbatas</span>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm font-bold text-red-700">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm text-slate-900 font-medium outline-none rounded-none"
                  placeholder="Masukkan username Anda"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-sm text-slate-900 font-medium outline-none rounded-none"
                  placeholder="Masukkan password Anda"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-widest transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed rounded-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      MEMPROSES...
                    </>
                  ) : (
                    'MASUK SEKARANG'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-relaxed">
              Sistem Manajemen Fasilitas Kesehatan Terpadu.<br/>
              Khusus untuk petugas medis dan admin berwenang.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
