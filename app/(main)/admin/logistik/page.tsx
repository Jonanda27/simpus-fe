"use client";

import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Loader2, Calendar, Shield, MapPin, Truck, AlertTriangle, User } from 'lucide-react';
import { asetService } from '@/services/aset.service';
import Link from 'next/link';

export default function AsetListPage() {
  const [asetList, setAsetList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState(''); // '' means semua
  const [isLoading, setIsLoading] = useState(true);

  const fetchAsets = async () => {
    setIsLoading(true);
    try {
      const res = await asetService.getAsets(searchQuery, kategoriFilter);
      if (res.success) {
        setAsetList(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAsets();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, kategoriFilter]);

  const getCategoryBadge = (kategori: string) => {
    switch (kategori) {
      case 'LOGISTIK_MEDIS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Package className="w-3.5 h-3.5" /> LOGISTIK MEDIS
          </span>
        );
      case 'LOGISTIK_UMUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Package className="w-3.5 h-3.5" /> LOGISTIK UMUM
          </span>
        );
      case 'ALKES':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Shield className="w-3.5 h-3.5" /> ALAT KESEHATAN
          </span>
        );
      case 'KENDARAAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3.5 h-3.5" /> KENDARAAN
          </span>
        );
      case 'INVENTARIS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <MapPin className="w-3.5 h-3.5" /> INVENTARIS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200">
            {kategori}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AKTIF':
        return <span className="inline-block text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 border border-green-200">AKTIF</span>;
      case 'MAINTENANCE':
        return <span className="inline-block text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 border border-yellow-200">MAINTENANCE</span>;
      case 'RUSAK':
        return <span className="inline-block text-xs font-bold bg-red-100 text-red-800 px-2 py-0.5 border border-red-200">RUSAK</span>;
      case 'DISPOSED':
        return <span className="inline-block text-xs font-bold bg-gray-200 text-gray-800 px-2 py-0.5 border border-gray-300">DISPOSED</span>;
      default:
        return <span className="inline-block text-xs font-bold bg-gray-100 text-gray-800 px-2 py-0.5">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            Logistik & Inventaris Aset
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola data logistik medis, logistik umum operasional, alat kesehatan (alkes), kendaraan, dan inventaris puskesmas.
          </p>
        </div>
        <div>
          <Link
            href="/admin/logistik/tambah"
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Aset Baru
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-gray-200 p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Semua Aset', value: '' },
            { label: 'Logistik Medis', value: 'LOGISTIK_MEDIS' },
            { label: 'Logistik Umum', value: 'LOGISTIK_UMUM' },
            { label: 'Alat Kesehatan (Alkes)', value: 'ALKES' },
            { label: 'Kendaraan / Ambulans', value: 'KENDARAAN' },
            { label: 'Inventaris Tetap', value: 'INVENTARIS' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setKategoriFilter(tab.value)}
              className={`px-3 py-1.5 text-xs font-bold transition-all border ${
                kategoriFilter === tab.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau kode aset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs font-bold text-gray-600 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-20">Gambar</th>
                <th className="px-6 py-4">Aset & Kode</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Informasi Detail Spesifik</th>
                <th className="px-6 py-4 w-32">Status</th>
                <th className="px-6 py-4 w-32 text-center">Tanggal Input</th>
                <th className="px-6 py-4 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-500 font-medium">Memuat data aset...</span>
                    </div>
                  </td>
                </tr>
              ) : asetList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <AlertTriangle className="w-10 h-10 text-gray-400" />
                      <p className="font-bold text-gray-700">Tidak ada aset ditemukan</p>
                      <p className="text-xs text-gray-400">Silakan buat baru atau ubah filter pencarian Anda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                asetList.map((aset) => (
                  <tr key={aset.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {aset.gambarUrl ? (
                          <img src={aset.gambarUrl} alt={aset.namaAset} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{aset.namaAset}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{aset.kodeAset}</div>
                      {aset.deskripsi && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-1 italic">{aset.deskripsi}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 vertical-align-middle">
                      {getCategoryBadge(aset.kategori)}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      
                      {/* Logistik Medis Specific Details */}
                      {aset.kategori === 'LOGISTIK_MEDIS' && aset.logistik && (
                        <div className="space-y-1">
                          <div>
                            <span className="font-semibold text-gray-800">Jenis:</span>{' '}
                            <span className="font-bold uppercase text-emerald-700 bg-emerald-50 px-1 border border-emerald-100">{aset.logistik.subKategori}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Batch:</span> {aset.logistik.nomorBatch || '-'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Exp Date:</span>{' '}
                            <span className={`font-bold ${aset.logistik.tanggalExpired && new Date(aset.logistik.tanggalExpired) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
                              {aset.logistik.tanggalExpired ? formatDate(aset.logistik.tanggalExpired) : 'Belum Diatur'}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Stok:</span>{' '}
                            <span className={`font-bold ${(aset.logistik.masterObat?.stok ?? aset.logistik.stok) <= aset.logistik.stokMinimum ? 'text-amber-600' : 'text-gray-900'}`}>
                              {aset.logistik.masterObat?.stok ?? aset.logistik.stok} {aset.logistik.sediaan || 'Pcs'}
                            </span>{' '}
                            <span className="text-gray-400 text-[10px]">(Min: {aset.logistik.stokMinimum})</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Harga Beli:</span> Rp {(aset.logistik.hargaBeli || 0).toLocaleString('id-ID')}
                          </div>
                          {aset.logistik.lokasiSpesifik && (
                            <div>
                              <span className="font-semibold text-gray-800">Penyimpanan:</span> {aset.logistik.lokasiSpesifik}
                            </div>
                          )}
                          {aset.logistik.supplier && (
                            <div>
                              <span className="font-semibold text-gray-800">Vendor:</span> {aset.logistik.supplier}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Logistik Umum Specific Details */}
                      {aset.kategori === 'LOGISTIK_UMUM' && aset.logistik && (
                        <div className="space-y-1">
                          <div>
                            <span className="font-semibold text-gray-800">Jenis:</span>{' '}
                            <span className="font-bold uppercase text-teal-700 bg-teal-50 px-1 border border-teal-100">{aset.logistik.subKategori}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Stok:</span>{' '}
                            <span className={`font-bold ${aset.logistik.stok <= aset.logistik.stokMinimum ? 'text-amber-600' : 'text-gray-900'}`}>
                              {aset.logistik.stok} {aset.logistik.sediaan || 'Pcs'}
                            </span>{' '}
                            <span className="text-gray-400 text-[10px]">(Min: {aset.logistik.stokMinimum})</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Harga Beli:</span> Rp {(aset.logistik.hargaBeli || 0).toLocaleString('id-ID')}
                          </div>
                          {aset.logistik.supplier && (
                            <div>
                              <span className="font-semibold text-gray-800">Vendor:</span> {aset.logistik.supplier}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Alkes Specific Details */}
                      {aset.kategori === 'ALKES' && aset.alkes && (
                        <div className="space-y-1">
                          {aset.alkes.merk && (
                            <div>
                              <span className="font-semibold text-gray-800">Merk:</span> {aset.alkes.merk}
                            </div>
                          )}
                          {aset.alkes.nomorSeri && (
                            <div>
                              <span className="font-semibold text-gray-800">S/N:</span> {aset.alkes.nomorSeri}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-gray-800">Lokasi:</span> {aset.ruangan?.namaRuangan || 'Belum Diatur'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Kondisi:</span>{' '}
                            <span className={`font-bold ${aset.alkes.kondisi === 'BAIK' ? 'text-green-600' : 'text-red-500'}`}>
                              {aset.alkes.kondisi}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Harga Perolehan:</span> Rp {(aset.alkes.hargaPerolehan || 0).toLocaleString('id-ID')}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Wajib Kalibrasi:</span>{' '}
                            {aset.alkes.wajibKalibrasi ? 'Ya' : 'Tidak'}
                          </div>
                          {aset.alkes.wajibKalibrasi && (
                            <>
                              {aset.alkes.noSertifikatKalibrasi && (
                                <div>
                                  <span className="font-semibold text-gray-800">No. Sertifikat:</span> {aset.alkes.noSertifikatKalibrasi}
                                </div>
                              )}
                              {aset.alkes.tanggalKalibrasiTerakhir && (
                                <div>
                                  <span className="font-semibold text-gray-800">Terakhir Kalibrasi:</span> {formatDate(aset.alkes.tanggalKalibrasiTerakhir)}
                                </div>
                              )}
                              {aset.alkes.intervalKalibrasi && (
                                <div>
                                  <span className="font-semibold text-gray-800">Jadwal Kalibrasi:</span> {aset.alkes.intervalKalibrasi} Bulan Sekali
                                </div>
                              )}
                            </>
                          )}
                          {aset.alkes.intervalMaintenance && (
                            <div>
                              <span className="font-semibold text-gray-800">Jadwal Servis:</span> {aset.alkes.intervalMaintenance} Bulan Sekali
                            </div>
                          )}
                        </div>
                      )}

                      {/* Inventaris Specific Details */}
                      {aset.kategori === 'INVENTARIS' && aset.inventaris && (
                        <div className="space-y-1">
                          <div>
                            <span className="font-semibold text-gray-800">Jenis:</span> {aset.inventaris.subKategori}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Lokasi:</span> {aset.ruangan?.namaRuangan || 'Belum Diatur'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Harga Beli:</span> Rp {aset.inventaris.nilaiBeli.toLocaleString('id-ID')}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Tanggal Beli:</span> {formatDate(aset.inventaris.tanggalPembelian)}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Umur Ekonomis:</span> {aset.inventaris.masaPakai} Tahun
                          </div>
                          {aset.inventaris.pic && (
                            <div className="flex items-center gap-1 text-gray-700">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span>PIC: {aset.inventaris.pic}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Kendaraan Specific Details */}
                      {aset.kategori === 'KENDARAAN' && aset.kendaraan && (
                        <div className="space-y-1">
                          <div className="font-bold text-gray-900 uppercase">
                            Plat: {aset.kendaraan.nomorPolisi}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Jenis:</span> {aset.kendaraan.jenisKendaraan}
                          </div>
                          {aset.kendaraan.merk && (
                            <div>
                              <span className="font-semibold text-gray-800">Merk/Model:</span> {aset.kendaraan.merk}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-gray-800">Kondisi:</span>{' '}
                            <span className="font-bold text-blue-700 uppercase bg-blue-50 px-1 border border-blue-100">{aset.kendaraan.kondisi}</span>
                          </div>
                          {aset.kendaraan.tanggalPajak && (
                            <div>
                              <span className="font-semibold text-gray-800">Pajak Tahunan:</span> {formatDate(aset.kendaraan.tanggalPajak)}
                            </div>
                          )}
                          {aset.kendaraan.idGps && (
                            <div>
                              <span className="font-semibold text-gray-800">ID GPS:</span> <span className="font-mono bg-gray-100 px-1 border border-gray-200">{aset.kendaraan.idGps}</span>
                            </div>
                          )}
                          {aset.kendaraan.intervalMaintenance && (
                            <div>
                              <span className="font-semibold text-gray-800">Jadwal Servis:</span> {aset.kendaraan.intervalMaintenance} Bulan Sekali
                            </div>
                          )}
                          {aset.kendaraan.pic && (
                            <div className="flex items-center gap-1 text-gray-700">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span>Sopir/PIC: {aset.kendaraan.pic}</span>
                            </div>
                          )}
                        </div>
                      )}

                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(aset.status)}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-gray-500">
                      {formatDate(aset.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/logistik/tambah?id=${aset.id}`}
                        className="inline-block px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
