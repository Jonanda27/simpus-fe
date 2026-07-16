"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Search, Plus, Loader2, X } from 'lucide-react';
import { icd10Service } from '@/services/icd10.service';
import Swal from 'sweetalert2';

export default function MasterICD10Page() {
  const [icdList, setIcdList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kode_icd10: '',
    nama_diagnosis: '',
    penyakit_menular: false,
    penyakit_kronis: false,
    wajib_lapor: false,
    kode_program: '',
    status_aktif: true,
  });

  const fetchICD = async () => {
    setIsLoading(true);
    try {
      const res = await icd10Service.search(searchQuery);
      if (res.status === 'success') {
        setIcdList(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchICD();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleOpenModal = (icd?: any) => {
    if (icd) {
      setEditingId(icd.id_icd10);
      setFormData({
        kode_icd10: icd.kode_icd10,
        nama_diagnosis: icd.nama_diagnosis,
        penyakit_menular: icd.penyakit_menular || false,
        penyakit_kronis: icd.penyakit_kronis || false,
        wajib_lapor: icd.wajib_lapor || false,
        kode_program: icd.kode_program || '',
        status_aktif: icd.status_aktif !== false, // default true
      });
    } else {
      setEditingId(null);
      setFormData({
        kode_icd10: '',
        nama_diagnosis: '',
        penyakit_menular: false,
        penyakit_kronis: false,
        wajib_lapor: false,
        kode_program: '',
        status_aktif: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await icd10Service.updateICD10(editingId, formData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data ICD-10 diubah!', timer: 1500, showConfirmButton: false });
      } else {
        await icd10Service.createICD10(formData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data ICD-10 ditambahkan!', timer: 1500, showConfirmButton: false });
      }
      setIsModalOpen(false);
      fetchICD();
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Gagal menyimpan data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, kode: string) => {
    const confirm = await Swal.fire({
      title: 'Hapus ICD-10?',
      text: `Yakin ingin menghapus ${kode}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      confirmButtonColor: '#ef4444'
    });

    if (confirm.isConfirmed) {
      try {
        await icd10Service.deleteICD10(id);
        Swal.fire({ icon: 'success', title: 'Terhapus', timer: 1000, showConfirmButton: false });
        fetchICD();
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
            <Activity className="w-8 h-8 text-blue-600" />
            Master Data ICD-10
          </h1>
          <p className="text-gray-500 mt-2">Kelola data master diagnosis penyakit.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari kode atau nama..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-none hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah ICD-10
          </button>
        </div>
      </div>

      <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-sm font-medium text-gray-600 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Kode ICD-10</th>
                <th className="px-6 py-4 font-semibold w-1/2">Diagnosis</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
                  </td>
                </tr>
              ) : icdList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data diagnosis.
                  </td>
                </tr>
              ) : (
                icdList.map((icd) => (
                  <tr key={icd.id_icd10} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-900 font-medium">{icd.kode_icd10}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{icd.nama_diagnosis}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium ${icd.status_aktif ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                        {icd.status_aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(icd)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs rounded-none transition-colors">
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-none shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit ICD-10' : 'Tambah ICD-10'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kode ICD-10</label>
                <input required type="text" value={formData.kode_icd10} onChange={e => setFormData({...formData, kode_icd10: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 rounded-none" placeholder="Misal: A00.0" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Diagnosis</label>
                <input required type="text" value={formData.nama_diagnosis} onChange={e => setFormData({...formData, nama_diagnosis: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 rounded-none" placeholder="Misal: Kolera" />
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-2">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Pengaturan Pelaporan & Status</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer border border-gray-200 p-3 bg-gray-50 hover:bg-red-50 transition-colors">
                    <input type="checkbox" checked={formData.penyakit_menular} onChange={e => setFormData({...formData, penyakit_menular: e.target.checked})} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer" />
                    <span className="text-xs font-bold text-gray-700">Penyakit Menular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer border border-gray-200 p-3 bg-gray-50 hover:bg-orange-50 transition-colors">
                    <input type="checkbox" checked={formData.penyakit_kronis} onChange={e => setFormData({...formData, penyakit_kronis: e.target.checked})} className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer" />
                    <span className="text-xs font-bold text-gray-700">Penyakit Kronis</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer border border-gray-200 p-3 bg-gray-50 hover:bg-purple-50 transition-colors">
                    <input type="checkbox" checked={formData.wajib_lapor} onChange={e => setFormData({...formData, wajib_lapor: e.target.checked})} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer" />
                    <span className="text-xs font-bold text-gray-700">Wabah / Wajib Lapor</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer border border-gray-200 p-3 bg-gray-50 hover:bg-emerald-50 transition-colors">
                    <input type="checkbox" checked={formData.status_aktif} onChange={e => setFormData({...formData, status_aktif: e.target.checked})} className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer" />
                    <span className="text-xs font-bold text-gray-700">Status Aktif</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kode Program Nasional (Opsional)</label>
                  <input type="text" value={formData.kode_program} onChange={e => setFormData({...formData, kode_program: e.target.value})} className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 rounded-none" placeholder="Misal: PRG-TB" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none font-bold text-sm transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-none font-bold text-sm transition-colors disabled:bg-blue-300 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
