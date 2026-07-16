import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { ArrowRight, Activity, CalendarCheck, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center relative overflow-hidden">
        {/* Background decorations for premium feel */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm mb-8">
              <span className="flex w-2 h-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              Sistem Terintegrasi SATUSEHAT
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Layanan Kesehatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Modern & Cepat</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Daftar antrian secara online, pantau rekam medis elektronik Anda, dan dapatkan pelayanan kesehatan terbaik tanpa perlu mengantri lama di ruang tunggu.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href="/pendaftaran" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-none hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
              >
                Daftar Pasien Baru
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-none hover:bg-gray-50 hover:shadow w-full sm:w-auto"
              >
                Cek Nomor Antrian
              </Link>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-none shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-none flex items-center justify-center mb-6 border border-blue-100">
                <CalendarCheck className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Antrian Online</h3>
              <p className="text-gray-500 leading-relaxed">Pesan jadwal kunjungan dari rumah dengan nomor antrian otomatis dan real-time.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-none shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 bg-emerald-50 rounded-none flex items-center justify-center mb-6 border border-emerald-100">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Terintegrasi BPJS</h3>
              <p className="text-gray-500 leading-relaxed">Mendukung pelayanan pasien mandiri, asuransi swasta, hingga BPJS Kesehatan.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-none shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 bg-purple-50 rounded-none flex items-center justify-center mb-6 border border-purple-100">
                <Activity className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rekam Medis Digital</h3>
              <p className="text-gray-500 leading-relaxed">Data riwayat penyakit Anda tersimpan aman dan mudah diakses kapan saja dibutuhkan.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
