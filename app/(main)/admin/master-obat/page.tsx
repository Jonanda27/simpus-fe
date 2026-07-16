"use client";

import React, { useState, useEffect } from 'react';
import { Pill, Search, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { masterService } from '@/services/master.service';
import Swal from 'sweetalert2';

export default function MasterObatPage() {
  const [obatList, setObatList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kodeObat: '',
    namaObat: '',
    kategori: 'Obat Bebas',
    sediaan: 'Tablet',
    harga: 0,
    stok: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchObat = async () => {
    setIsLoading(true);
    try {
      const res = await masterService.getObat(searchQuery);
      if (res.success) {
        setObatList(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchObat();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleOpenModal = (obat?: any) => {
    if (obat) {
      setEditingId(obat.id);
      setFormData({
        kodeObat: obat.kodeObat,
        namaObat: obat.namaObat,
        kategori: obat.kategori,
        sediaan: obat.sediaan,
        harga: obat.harga,
        stok: obat.stok,
      });
      setPreviewUrl(obat.gambarUrl || null);
    } else {
      setEditingId(null);
      setFormData({
        kodeObat: '',
        namaObat: '',
        kategori: 'Obat Bebas',
        sediaan: 'Tablet',
        harga: 0,
        stok: 0,
      });
      setPreviewUrl(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = new FormData();
    payload.append('kodeObat', formData.kodeObat);
    payload.append('namaObat', formData.namaObat);
    payload.append('kategori', formData.kategori);
    payload.append('sediaan', formData.sediaan);
    payload.append('harga', formData.harga.toString());
    payload.append('stok', formData.stok.toString());
    if (imageFile) {
      payload.append('gambar', imageFile);
    }

    try {
      if (editingId) {
        await masterService.updateObat(editingId, payload as any);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data obat diubah!', timer: 1500, showConfirmButton: false });
      } else {
        await masterService.createObat(payload as any);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Obat baru ditambahkan!', timer: 1500, showConfirmButton: false });
      }
      setIsModalOpen(false);
      fetchObat();
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Gagal menyimpan data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    const confirm = await Swal.fire({
      title: 'Hapus Obat?',
      text: `Yakin ingin menghapus ${nama}? Data ini mungkin terkait dengan resep yang sudah ada.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      confirmButtonColor: '#ef4444'
    });

    if (confirm.isConfirmed) {
      try {
        await masterService.deleteObat(id);
        Swal.fire({ icon: 'success', title: 'Terhapus', timer: 1000, showConfirmButton: false });
        fetchObat();
      } catch (err: any) {
        Swal.fire('Error', err?.response?.data?.message || 'Gagal menghapus data', 'error');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Pill className="w-8 h-8 text-blue-600" />
            Master Obat
          </h1>
          <p className="text-gray-500 mt-2">Kelola data master obat dan sediaan farmasi.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari obat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-none hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Obat
          </button>
        </div>
      </div>

      <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-sm font-medium text-gray-600 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold w-16">Gambar</th>
                <th className="px-6 py-4 font-semibold">Obat & Kategori</th>
                <th className="px-6 py-4 font-semibold">Sediaan</th>
                <th className="px-6 py-4 font-semibold">Stok & Satuan</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
                  </td>
                </tr>
              ) : obatList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data obat.
                  </td>
                </tr>
              ) : (
                obatList.map((obat) => (
                  <tr key={obat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-none bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {obat.gambarUrl ? (
                          <img src={obat.gambarUrl} alt={obat.namaObat} className="w-full h-full object-cover" />
                        ) : (
                          <Pill className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{obat.namaObat}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{obat.kodeObat}</div>
                      <span className="inline-block mt-1 text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 uppercase border border-blue-200">{obat.kategori}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{obat.sediaan || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{obat.stok}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-gray-900 font-medium">Rp {obat.harga.toLocaleString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(obat)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs rounded-none transition-colors">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-none shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Obat' : 'Tambah Obat Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kode Obat</label>
                <input required type="text" value={formData.kodeObat} onChange={e => setFormData({...formData, kodeObat: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-pink-500 rounded-none" placeholder="Misal: OBT-001" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Obat</label>
                <input required type="text" value={formData.namaObat} onChange={e => setFormData({...formData, namaObat: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-pink-500 rounded-none" placeholder="Misal: Paracetamol 500mg" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                  <select required value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-pink-500 rounded-none bg-white">
                    <option>Obat Bebas</option>
                    <option>Obat Keras</option>
                    <option>Obat Herbal</option>
                    <option>Alkes / BHP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sediaan</label>
                  <select required value={formData.sediaan} onChange={e => setFormData({...formData, sediaan: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-pink-500 rounded-none bg-white">
                    <option>Tablet</option>
                    <option>Kapsul</option>
                    <option>Sirup</option>
                    <option>Salep</option>
                    <option>Injeksi</option>
                    <option>Botol</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Harga (Rp)</label>
                  <input required type="number" value={formData.harga} onChange={e => setFormData({...formData, harga: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-pink-500 rounded-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stok Awal</label>
                  <input required type="number" value={formData.stok} onChange={e => setFormData({...formData, stok: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-pink-500 rounded-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Gambar Obat</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }} 
                  className="w-full border border-gray-300 p-2 text-sm outline-none focus:ring-1 focus:ring-pink-500 rounded-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer" 
                />
                {previewUrl && (
                  <div className="mt-3 w-24 h-24 border border-gray-200 bg-gray-50 flex items-center justify-center p-1">
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none font-bold text-sm transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white rounded-none font-bold text-sm transition-colors flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
