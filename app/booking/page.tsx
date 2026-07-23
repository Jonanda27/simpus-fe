"use client";

import React, { useState } from 'react';
import { 
  Building2, CalendarCheck, ChevronRight, 
  CreditCard, CheckCircle2, QrCode, AlertCircle, Clock, User, ShieldCheck, FileDown, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [nik, setNik] = useState('');
  const [tglLahir, setTglLahir] = useState('');
  const [poli, setPoli] = useState('');
  const [tanggalKunjungan, setTanggalKunjungan] = useState('');
  const [jenisPembayaran, setJenisPembayaran] = useState('Umum');

  // Dummy Patient Data after Verification
  const [pasienData, setPasienData] = useState<any>(null);

  const handleVerifikasi = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi API Call
    setTimeout(() => {
      setIsLoading(false);
      if (nik.length >= 16) {
        setPasienData({
          nama: 'Budi Santoso',
          noRM: 'RM-2026-00123',
          nik: nik
        });
        setStep(2);
      } else {
        alert('NIK harus 16 digit');
      }
    }, 1000);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[350px] z-0">
        <div className="absolute inset-0 bg-[url('/booking_header.png')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-blue-900/70"></div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 z-0 pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-2xl w-full mx-auto relative z-10">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-blue-100 hover:text-white mb-8 group transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-widest text-center">Booking Antrean</h1>
          <p className="text-blue-100 text-sm font-medium mt-2 text-center max-w-md">Sistem Pendaftaran Poliklinik Terpadu Puskesmas</p>
        </div>

        {/* Card Form */}
        <div className="bg-white shadow-2xl border border-slate-100 rounded-none relative overflow-hidden">
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
            <div 
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>

          <div className="p-8 sm:p-12">
            
            {/* STEP 1: VERIFIKASI NIK */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-none">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verifikasi Identitas</h2>
                    <p className="text-slate-500 text-sm font-medium">Khusus pasien lama (sudah memiliki rekam medis).</p>
                  </div>
                </div>

                <form onSubmit={handleVerifikasi} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                      Nomor Induk Kependudukan (NIK) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={nik}
                      onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-4 rounded-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none"
                      placeholder="Contoh: 3201xxxxxxxxxxxx"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      required
                      value={tglLahir}
                      onChange={(e) => setTglLahir(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-4 rounded-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-slate-900 outline-none"
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isLoading || !nik || !tglLahir}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-none transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transform disabled:transform-none"
                    >
                      {isLoading ? 'MENCARI DATA...' : 'CEK DATA PASIEN'} <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </form>

                <div className="mt-8 p-5 bg-blue-50 border border-blue-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    <strong className="block mb-1 text-sm uppercase tracking-wide">Pasien Baru?</strong> 
                    Jika Anda belum pernah berobat ke Puskesmas ini sebelumnya, silakan datang langsung ke loket pendaftaran di fasilitas kami.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: PILIH JADWAL & POLI */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-none">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pilih Layanan</h2>
                    <p className="text-slate-500 text-sm font-medium">Tentukan poli tujuan dan waktu kunjungan.</p>
                  </div>
                </div>

                {/* Data Pasien Card */}
                <div className="bg-slate-50 border border-slate-200 p-5 mb-8 relative border-l-4 border-l-blue-500">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest shadow-sm">
                    Tervalidasi
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identitas Pasien</div>
                  <div className="font-black text-slate-900 text-lg uppercase tracking-wide">{pasienData?.nama}</div>
                  <div className="text-xs text-slate-500 font-mono font-medium mt-1">RM: {pasienData?.noRM} • NIK: {pasienData?.nik}</div>
                </div>

                <form onSubmit={handleBooking} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                      Poliklinik Tujuan *
                    </label>
                    <select
                      required
                      value={poli}
                      onChange={(e) => setPoli(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-4 py-4 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-slate-900 outline-none font-medium"
                    >
                      <option value="">-- PILIH POLIKLINIK --</option>
                      <option value="UMUM">Poli Umum</option>
                      <option value="GIGI">Poli Gigi & Mulut</option>
                      <option value="KIA">Poli KIA & KB</option>
                      <option value="ANAK">Poli Anak / MTBS</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                      Tanggal Kunjungan *
                    </label>
                    <input
                      type="date"
                      required
                      value={tanggalKunjungan}
                      onChange={(e) => setTanggalKunjungan(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-4 py-4 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-slate-900 outline-none font-medium"
                    />
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Pendaftaran maksimal H+3 dari hari ini.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                      Jenis Pembayaran *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`border-2 p-5 cursor-pointer transition-all rounded-none ${jenisPembayaran === 'Umum' ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        <input type="radio" name="pembayaran" value="Umum" className="sr-only" checked={jenisPembayaran === 'Umum'} onChange={() => setJenisPembayaran('Umum')} />
                        <div className="flex flex-col items-center justify-center text-center gap-3">
                          <CreditCard className={`w-8 h-8 ${jenisPembayaran === 'Umum' ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-black uppercase tracking-widest">Pasien Umum</span>
                        </div>
                      </label>
                      <label className={`border-2 p-5 cursor-pointer transition-all rounded-none ${jenisPembayaran === 'BPJS' ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        <input type="radio" name="pembayaran" value="BPJS" className="sr-only" checked={jenisPembayaran === 'BPJS'} onChange={() => setJenisPembayaran('BPJS')} />
                        <div className="flex flex-col items-center justify-center text-center gap-3">
                          <ShieldCheck className={`w-8 h-8 ${jenisPembayaran === 'BPJS' ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-black uppercase tracking-widest">BPJS Kesehatan</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black uppercase tracking-widest rounded-none transition-colors text-sm"
                    >
                      KEMBALI
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !poli || !tanggalKunjungan}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-none transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:-translate-y-0.5 transform disabled:transform-none"
                    >
                      {isLoading ? 'MEMPROSES...' : 'AMBIL ANTRIAN'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: TIKET DIGITAL */}
            {step === 3 && (
              <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-500 text-white flex items-center justify-center rounded-full mb-6 shadow-xl border-4 border-green-100">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Booking Berhasil!</h2>
                <p className="text-slate-500 text-sm mb-10 font-medium max-w-sm mx-auto leading-relaxed">
                  Silakan simpan tiket digital di bawah ini atau tunjukkan saat datang ke Puskesmas.
                </p>

                {/* TIKET */}
                <div className="w-full bg-white border-2 border-slate-200 shadow-2xl relative overflow-hidden text-left mb-10">
                  <div className="bg-slate-900 p-6 text-white flex justify-between items-center border-b-4 border-blue-500">
                    <div>
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Tiket Antrean</div>
                      <div className="font-black text-xl tracking-wide">{poli === 'UMUM' ? 'Poli Umum' : poli === 'GIGI' ? 'Poli Gigi & Mulut' : poli === 'KIA' ? 'Poli KIA' : 'Poli Anak'}</div>
                    </div>
                    <div className="text-xs font-medium text-right text-slate-300 border-l border-slate-700 pl-5 py-1">
                      <span className="text-white font-bold text-sm tracking-widest block">{tanggalKunjungan}</span>Puskesmas ONE
                    </div>
                  </div>
                  
                  <div className="p-10 flex flex-col items-center border-b-2 border-dashed border-slate-200 bg-slate-50/50">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Nomor Antrean Anda</div>
                    <div className="text-8xl font-black text-slate-900 tracking-tighter mb-8 drop-shadow-sm">U-024</div>
                    <div className="flex items-center gap-2 text-slate-700 text-xs font-bold bg-white border border-slate-200 px-5 py-3 shadow-sm rounded-none tracking-widest uppercase">
                      <Clock className="w-5 h-5 text-blue-500" /> Estimasi Dipanggil: 09:30 WIB
                    </div>
                  </div>

                  <div className="p-8 flex items-center gap-8 bg-white">
                    <div className="w-28 h-28 bg-slate-50 flex items-center justify-center flex-shrink-0 border-2 border-slate-200 p-3">
                      <QrCode className="w-full h-full text-slate-800" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-slate-900 text-xl mb-2 truncate uppercase tracking-wide">{pasienData?.nama}</div>
                      <div className="text-sm text-slate-500 font-mono font-bold mb-1">RM: {pasienData?.noRM}</div>
                      <div className="text-sm text-slate-500 font-mono font-bold">Jalur: <span className="text-blue-600 uppercase bg-blue-50 px-2 py-0.5 ml-1">{jenisPembayaran}</span></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 w-full">
                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest py-4 rounded-none shadow-md transition-all flex items-center justify-center text-sm hover:-translate-y-0.5">
                    <FileDown className="w-5 h-5 mr-3" /> Unduh PDF Tiket
                  </button>
                  <Link href="/" className="w-full block bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-black uppercase tracking-widest py-4 rounded-none transition-colors text-center text-sm shadow-sm">
                    Selesai & Kembali ke Beranda
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
