"use client";

import React, { useState, useEffect } from 'react';
import { Coins, Search, Plus, Loader2, Edit2, Trash2, Check, X, ShieldAlert, Award, FileText } from 'lucide-react';
import { keuanganService } from '@/services/keuangan.service';

export default function KeuanganMasterPage() {
  const [activeTab, setActiveTab] = useState<'pelayanan' | 'farmasi'>('pelayanan');
  const [searchQuery, setSearchQuery] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  
  // Data States
  const [tarifPelayananList, setTarifPelayananList] = useState<any[]>([]);
  const [tarifFarmasiList, setTarifFarmasiList] = useState<any[]>([]);
  const [masterIcd9, setMasterIcd9] = useState<any[]>([]);
  const [masterLab, setMasterLab] = useState<any[]>([]);
  
  // Loading & Action states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modals
  const [showPelayananModal, setShowPelayananModal] = useState(false);
  const [showFarmasiModal, setShowFarmasiModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Pelayanan Form Fields
  const [formPelayanan, setFormPelayanan] = useState({
    kodeTarif: '',
    namaTarif: '',
    kategori: 'PENDAFTARAN',
    tarif: 0,
    deskripsi: '',
    statusAktif: true,
    icd9Id: '',
    labId: ''
  });

  // Farmasi Form Fields
  const [formFarmasi, setFormFarmasi] = useState({
    kategoriObat: '',
    marginPersen: 0,
    tuslah: 0,
    deskripsi: '',
    statusAktif: true
  });

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'pelayanan') {
        const res = await keuanganService.getTarifPelayanan(searchQuery, kategoriFilter);
        if (res.success) {
          setTarifPelayananList(res.data);
        }
      } else {
        const res = await keuanganService.getTarifFarmasi(searchQuery);
        if (res.success) {
          setTarifFarmasiList(res.data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch master helpers for dropdowns once modal is open
  const fetchDropdownMasters = async () => {
    try {
      const [resIcd, resLab] = await Promise.all([
        keuanganService.getMasterICD9(),
        keuanganService.getMasterLab()
      ]);
      if (resIcd.success) setMasterIcd9(resIcd.data);
      if (resLab.success) setMasterLab(resLab.data);
    } catch (e) {
      console.error('Gagal mengambil data master pendukung', e);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, kategoriFilter, activeTab]);

  useEffect(() => {
    if (showPelayananModal) {
      fetchDropdownMasters();
    }
  }, [showPelayananModal]);

  // Format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Pelayanan Actions
  const handleOpenPelayananModal = (item: any = null) => {
    setErrorMessage('');
    if (item) {
      setEditingItem(item);
      setFormPelayanan({
        kodeTarif: item.kodeTarif,
        namaTarif: item.namaTarif,
        kategori: item.kategori,
        tarif: item.tarif,
        deskripsi: item.deskripsi || '',
        statusAktif: item.statusAktif,
        icd9Id: item.icd9Id || '',
        labId: item.labId || ''
      });
    } else {
      setEditingItem(null);
      setFormPelayanan({
        kodeTarif: '',
        namaTarif: '',
        kategori: 'PENDAFTARAN',
        tarif: 0,
        deskripsi: '',
        statusAktif: true,
        icd9Id: '',
        labId: ''
      });
    }
    setShowPelayananModal(true);
  };

  const handleOpenFarmasiModal = (item: any = null) => {
    setErrorMessage('');
    if (item) {
      setEditingItem(item);
      setFormFarmasi({
        kategoriObat: item.kategoriObat,
        marginPersen: item.marginPersen,
        tuslah: item.tuslah,
        deskripsi: item.deskripsi || '',
        statusAktif: item.statusAktif
      });
    } else {
      setEditingItem(null);
      setFormFarmasi({
        kategoriObat: '',
        marginPersen: 0,
        tuslah: 0,
        deskripsi: '',
        statusAktif: true
      });
    }
    setShowFarmasiModal(true);
  };

  const handleSubmitPelayanan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const payload = { ...formPelayanan };
      if (payload.kategori !== 'TINDAKAN') payload.icd9Id = '';
      if (payload.kategori !== 'LABORATORIUM') payload.labId = '';

      let res;
      if (editingItem) {
        res = await keuanganService.updateTarifPelayanan(editingItem.id, payload);
      } else {
        res = await keuanganService.createTarifPelayanan(payload);
      }

      if (res.success) {
        setShowPelayananModal(false);
        fetchData();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFarmasi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      let res;
      if (editingItem) {
        res = await keuanganService.updateTarifFarmasi(editingItem.id, formFarmasi);
      } else {
        res = await keuanganService.createTarifFarmasi(formFarmasi);
      }

      if (res.success) {
        setShowFarmasiModal(false);
        fetchData();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePelayanan = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tarif pelayanan ini?')) {
      try {
        const res = await keuanganService.deleteTarifPelayanan(id);
        if (res.success) fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteFarmasi = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus aturan tarif farmasi ini?')) {
      try {
        const res = await keuanganService.deleteTarifFarmasi(id);
        if (res.success) fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getKategoriBadge = (kategori: string) => {
    switch (kategori) {
      case 'PENDAFTARAN':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">PENDAFTARAN</span>;
      case 'TINDAKAN':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">TINDAKAN</span>;
      case 'RAWAT_INAP':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">RAWAT INAP</span>;
      case 'ALAT_MEDIS':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">ALAT MEDIS</span>;
      case 'LABORATORIUM':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-800 border border-pink-200">LABORATORIUM</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-800 border border-gray-200">{kategori}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <Coins className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Master Tarif & Keuangan</h1>
              <p className="text-gray-500 text-sm mt-0.5">Kelola tarif pelayanan medis (Perda) dan margin penjualan farmasi secara terpusat</p>
            </div>
          </div>
        </div>
        
        {/* Tab Toggle buttons */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200 shadow-inner">
          <button
            onClick={() => { setActiveTab('pelayanan'); setSearchQuery(''); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'pelayanan' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Tarif Pelayanan (Perda)
          </button>
          <button
            onClick={() => { setActiveTab('farmasi'); setSearchQuery(''); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'farmasi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Tarif Farmasi (Margin)
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'pelayanan' ? "Cari nama tarif atau kode..." : "Cari kategori obat..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>

        {activeTab === 'pelayanan' && (
          <div className="w-full md:w-56">
            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
            >
              <option value="">Semua Kategori</option>
              <option value="PENDAFTARAN">Pendaftaran</option>
              <option value="TINDAKAN">Tindakan</option>
              <option value="RAWAT_INAP">Rawat Inap</option>
              <option value="ALAT_MEDIS">Alat Medis</option>
              <option value="LABORATORIUM">Laboratorium</option>
              <option value="OPERASIONAL">Operasional</option>
            </select>
          </div>
        )}

        <button
          onClick={() => activeTab === 'pelayanan' ? handleOpenPelayananModal() : handleOpenFarmasiModal()}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 text-sm whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          {activeTab === 'pelayanan' ? 'Tambah Tarif Pelayanan' : 'Tambah Tarif Farmasi'}
        </button>
      </div>

      {/* Main Table / Data List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
            <span className="text-sm font-medium">Memuat data tarif...</span>
          </div>
        ) : activeTab === 'pelayanan' ? (
          /* ================== PELAYANAN TABLE ================== */
          tarifPelayananList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 mb-4">
                <FileText className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Tarif Pelayanan Kosong</h3>
              <p className="text-gray-500 text-sm max-w-sm mt-1">Belum ada data tarif pelayanan Perda yang disimpan. Klik "Tambah Tarif Pelayanan" untuk membuatnya.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-semibold text-xs border-b border-gray-100">
                    <th className="px-6 py-4">KODE</th>
                    <th className="px-6 py-4">NAMA TARIF / LAYANAN</th>
                    <th className="px-6 py-4">KATEGORI</th>
                    <th className="px-6 py-4">BESARAN TARIF</th>
                    <th className="px-6 py-4">PEMETAAN KLINIS</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {tarifPelayananList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">{item.kodeTarif}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{item.namaTarif}</div>
                        {item.deskripsi && <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.deskripsi}</div>}
                      </td>
                      <td className="px-6 py-4">{getKategoriBadge(item.kategori)}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{formatIDR(item.tarif)}</td>
                      <td className="px-6 py-4">
                        {item.kategori === 'TINDAKAN' && item.icd9 ? (
                          <div className="text-xs text-gray-600 bg-purple-50 px-2 py-1 border border-purple-100 rounded">
                            <span className="font-bold text-purple-700">[{item.icd9.kode_icd9}]</span> {item.icd9.nama_prosedur}
                          </div>
                        ) : item.kategori === 'LABORATORIUM' && item.lab ? (
                          <div className="text-xs text-gray-600 bg-pink-50 px-2 py-1 border border-pink-100 rounded">
                            <span className="font-bold text-pink-700">Lab:</span> {item.lab.parameter}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.statusAktif ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 border border-green-200 rounded">
                            <Check className="w-3 h-3" /> AKTIF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 border border-gray-200 rounded">
                            <X className="w-3 h-3" /> NON-AKTIF
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenPelayananModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePelayanan(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* ================== FARMASI TABLE ================== */
          tarifFarmasiList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 mb-4">
                <Award className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Aturan Margin Farmasi Kosong</h3>
              <p className="text-gray-500 text-sm max-w-sm mt-1">Belum ada aturan margin keuntungan obat yang dibuat. Klik "Tambah Tarif Farmasi" untuk mendaftarkannya.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-semibold text-xs border-b border-gray-100">
                    <th className="px-6 py-4">KATEGORI OBAT / BHP</th>
                    <th className="px-6 py-4">MARGIN KEUNTUNGAN (%)</th>
                    <th className="px-6 py-4">TUSLAH / BIAYA PELAYANAN</th>
                    <th className="px-6 py-4">KETERANGAN</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {tarifFarmasiList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 font-bold text-gray-900">{item.kategoriObat}</td>
                      <td className="px-6 py-4 font-mono font-bold text-blue-700 text-base">{item.marginPersen}%</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{formatIDR(item.tuslah)}</td>
                      <td className="px-6 py-4 text-gray-500">{item.deskripsi || '-'}</td>
                      <td className="px-6 py-4">
                        {item.statusAktif ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 border border-green-200 rounded">
                            <Check className="w-3 h-3" /> AKTIF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 border border-gray-200 rounded">
                            <X className="w-3 h-3" /> NON-AKTIF
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenFarmasiModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFarmasi(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* ==================== MODAL TARIF PELAYANAN ==================== */}
      {showPelayananModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingItem ? 'Edit Tarif Pelayanan' : 'Tambah Tarif Pelayanan Baru'}</h3>
              <button onClick={() => setShowPelayananModal(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitPelayanan} className="p-6 overflow-y-auto flex-1 space-y-4">
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kode Tarif *</label>
                  <input
                    type="text"
                    required
                    disabled={editingItem ? true : false}
                    value={formPelayanan.kodeTarif}
                    onChange={(e) => setFormPelayanan({ ...formPelayanan, kodeTarif: e.target.value })}
                    placeholder="Contoh: TRF-ADM-01"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kategori Pelayanan *</label>
                  <select
                    value={formPelayanan.kategori}
                    onChange={(e) => setFormPelayanan({ ...formPelayanan, kategori: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="PENDAFTARAN">Pendaftaran</option>
                    <option value="TINDAKAN">Tindakan</option>
                    <option value="RAWAT_INAP">Rawat Inap</option>
                    <option value="ALAT_MEDIS">Alat Medis</option>
                    <option value="LABORATORIUM">Laboratorium</option>
                    <option value="OPERASIONAL">Operasional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Tarif/Layanan *</label>
                <input
                  type="text"
                  required
                  value={formPelayanan.namaTarif}
                  onChange={(e) => setFormPelayanan({ ...formPelayanan, namaTarif: e.target.value })}
                  placeholder="Contoh: Karcis Rawat Inap Kelas 1"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Besaran Tarif (Rp) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formPelayanan.tarif}
                  onChange={(e) => setFormPelayanan({ ...formPelayanan, tarif: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                />
              </div>

              {/* Conditional dropdown depending on Kategori */}
              {formPelayanan.kategori === 'TINDAKAN' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hubungkan ke Tindakan ICD-9 (Opsional)</label>
                  <select
                    value={formPelayanan.icd9Id}
                    onChange={(e) => setFormPelayanan({ ...formPelayanan, icd9Id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="">-- Tidak Ada --</option>
                    {masterIcd9.map((item) => (
                      <option key={item.id_icd9} value={item.id_icd9}>
                        [{item.kode_icd9}] {item.nama_prosedur}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formPelayanan.kategori === 'LABORATORIUM' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Hubungkan ke Pemeriksaan Lab (Opsional)</label>
                  <select
                    value={formPelayanan.labId}
                    onChange={(e) => setFormPelayanan({ ...formPelayanan, labId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="">-- Tidak Ada --</option>
                    {masterLab.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.parameter}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deskripsi / Catatan Perda</label>
                <textarea
                  value={formPelayanan.deskripsi}
                  onChange={(e) => setFormPelayanan({ ...formPelayanan, deskripsi: e.target.value })}
                  placeholder="Keterangan pendukung atau rujukan Perda/Perkada..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="statusAktifPel"
                  checked={formPelayanan.statusAktif}
                  onChange={(e) => setFormPelayanan({ ...formPelayanan, statusAktif: e.target.checked })}
                  className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="statusAktifPel" className="text-sm font-semibold text-gray-700 select-none">Tarif ini Aktif & Dapat Digunakan</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPelayananModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 text-sm"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Tarif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL ATURAN FARMASI ==================== */}
      {showFarmasiModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingItem ? 'Edit Aturan Margin Farmasi' : 'Tambah Aturan Margin Baru'}</h3>
              <button onClick={() => setShowFarmasiModal(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitFarmasi} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kategori Obat / BHP *</label>
                <input
                  type="text"
                  required
                  disabled={editingItem ? true : false}
                  value={formFarmasi.kategoriObat}
                  onChange={(e) => setFormFarmasi({ ...formFarmasi, kategoriObat: e.target.value })}
                  placeholder="Contoh: Obat Bebas, Obat Keras, Vaksin"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Margin Keuntungan (%) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="any"
                  value={formFarmasi.marginPersen}
                  onChange={(e) => setFormFarmasi({ ...formFarmasi, marginPersen: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tuslah / Biaya Pelayanan (Rp) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formFarmasi.tuslah}
                  onChange={(e) => setFormFarmasi({ ...formFarmasi, tuslah: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deskripsi / Keterangan</label>
                <textarea
                  value={formFarmasi.deskripsi}
                  onChange={(e) => setFormFarmasi({ ...formFarmasi, deskripsi: e.target.value })}
                  placeholder="Keterangan singkat mengenai aturan ini..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="statusAktifFar"
                  checked={formFarmasi.statusAktif}
                  onChange={(e) => setFormFarmasi({ ...formFarmasi, statusAktif: e.target.checked })}
                  className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="statusAktifFar" className="text-sm font-semibold text-gray-700 select-none">Aturan ini Aktif & Diterapkan</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowFarmasiModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 text-sm"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Aturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
