"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Stethoscope, Pill, CheckCircle, Loader2, AlertTriangle, FileText } from 'lucide-react';
import { farmasiService, ResepData } from '@/services/farmasi.service';

export default function ProsesResepPage() {
  const { id } = useParams();
  const router = useRouter();
  const [resep, setResep] = useState<ResepData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchResep();
  }, [id]);

  const fetchResep = async () => {
    try {
      const data = await farmasiService.getResepById(id as string);
      setResep(data);
    } catch (err: any) {
      console.error(err);
      setError('Gagal memuat data resep. Resep mungkin tidak ditemukan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProses = async () => {
    if (!confirm('Apakah Anda yakin obat sudah disiapkan dengan benar? Stok akan terpotong secara otomatis.')) {
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      await farmasiService.prosesResep(id as string);
      alert('Resep berhasil diproses! Pasien diarahkan ke Kasir.');
      router.push('/apoteker/antrian');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal memproses resep. Pastikan stok obat mencukupi.');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500">Memuat detail resep...</p>
      </div>
    );
  }

  if (!resep || error) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <div className="bg-red-50 text-red-600 p-6 border border-red-200 text-center rounded-none shadow-sm">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Terjadi Kesalahan</h3>
          <p>{error}</p>
          <Link href="/apoteker/antrian" className="mt-4 inline-block px-4 py-2 bg-white border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors">
            Kembali ke Antrian
          </Link>
        </div>
      </div>
    );
  }

  // Hitung apakah ada obat yang stoknya kurang
  const hasInsufficientStock = resep.details.some(d => d.obat.stok < d.jumlah);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto p-8 pb-20">
      <Link href="/apoteker/antrian" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 group">
        <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Kembali ke Daftar Antrian
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Kolom Kiri: Data Pasien & Dokter */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-none">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <User className="w-4 h-4 text-blue-600" /> Identitas Pasien
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">No. Rekam Medis</p>
                <p className="text-sm font-mono font-bold text-gray-900">{resep.pasien.noRM}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Nama Lengkap</p>
                <p className="text-base font-bold text-gray-900">{resep.pasien.namaLengkap}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Jenis Kelamin</p>
                  <p className="text-sm text-gray-900">{resep.pasien.jenisKelamin}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Tanggal Lahir</p>
                  <p className="text-sm text-gray-900">{new Date(resep.pasien.tanggalLahir).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-none">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Stethoscope className="w-4 h-4 text-purple-600" /> Dokter Perujuk
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">Nama Dokter</p>
                <p className="text-sm font-bold text-gray-900">
                  {resep.kunjungan.jenisPelayanan === 'UKM' ? 'Petugas UKM: ' : 'Dr. '}
                  {resep.dokter?.namaLengkap || 'Sistem'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Asal Poliklinik</p>
                <p className="text-sm text-gray-900">{resep.kunjungan.poliklinik.namaPoli}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Waktu Resep Dibuat</p>
                <p className="text-sm text-gray-900">{new Date(resep.tanggalResep).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Obat */}
        <div className="md:w-2/3">
          <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Rincian Resep Obat
              </h2>
              <p className="text-sm text-gray-500 mt-1">Harap siapkan obat sesuai dengan daftar berikut ini.</p>
            </div>

            <div className="p-6 flex-1 overflow-auto">
              {hasInsufficientStock && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700 font-bold">
                      Peringatan: Terdapat obat dengan stok tidak mencukupi. Anda tidak dapat menyelesaikan resep ini.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {resep.details.map((detail, index) => {
                  const isStockSufficient = detail.obat.stok >= detail.jumlah;
                  
                  return (
                    <div key={detail.id} className={`p-4 border ${isStockSufficient ? 'border-gray-200 bg-white' : 'border-red-300 bg-red-50'} shadow-sm relative overflow-hidden`}>
                      {/* Badge Number */}
                      <div className="absolute top-0 left-0 bg-blue-600 text-white w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="ml-4 pl-2 flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{detail.obat.namaObat}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-gray-500">{detail.obat.kodeObat}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-xs text-gray-600">{detail.obat.sediaan}</span>
                          </div>
                          
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 inline-block">
                            <p className="text-xs font-bold text-blue-800 uppercase mb-1">Aturan Pakai:</p>
                            <p className="text-sm text-blue-900 font-medium">{detail.aturanPakai}</p>
                            {detail.catatan && (
                              <p className="text-sm text-blue-700 mt-1 border-t border-blue-200 pt-1">Catatan: {detail.catatan}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-500 font-medium mb-1">Jumlah Disiapkan</div>
                          <div className="text-3xl font-black text-blue-600">{detail.jumlah}</div>
                          
                          <div className={`mt-3 text-xs font-medium px-2 py-1 inline-block border ${isStockSufficient ? 'text-gray-600 border-gray-200 bg-gray-50' : 'text-red-700 border-red-300 bg-red-100'}`}>
                            Stok Master: {detail.obat.stok}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Item Obat: <span className="font-bold text-gray-900">{resep.details.length}</span></p>
                <p className="text-xs text-gray-500 mt-1">Klik Selesai jika fisik obat sudah siap diberikan ke pasien.</p>
              </div>
              
              <button
                onClick={handleProses}
                disabled={isProcessing || hasInsufficientStock}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" /> Selesai Siapkan Obat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
