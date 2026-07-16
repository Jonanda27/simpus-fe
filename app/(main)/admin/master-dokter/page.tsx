'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Edit, Trash2 } from 'lucide-react';
import { useDokterStore } from '@/store/dokter.store';
import { useKlinikStore } from '@/store/klinik.store';
import { Dokter } from '@/services/dokter.service';

export default function MasterDokterPage() {
  const { dokters, isLoading, fetchDokters, createDokter, updateDokter, deleteDokter } = useDokterStore();
  const { polikliniks, fetchPoliklinik } = useKlinikStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    namaLengkap: '',
    username: '',
    password: '',
    poliklinikId: ''
  });

  useEffect(() => {
    fetchDokters();
    fetchPoliklinik();
  }, [fetchDokters, fetchPoliklinik]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setFormData({
      namaLengkap: '',
      username: '',
      password: '',
      poliklinikId: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dokter: Dokter) => {
    setIsEditMode(true);
    setSelectedId(dokter.id);
    setFormData({
      namaLengkap: dokter.namaLengkap || '',
      username: dokter.username,
      password: '', // Leave blank unless they want to change it
      poliklinikId: dokter.poliklinikId || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedId) {
        await updateDokter(selectedId, {
          namaLengkap: formData.namaLengkap,
          username: formData.username,
          password: formData.password ? formData.password : undefined,
          poliklinikId: formData.poliklinikId
        });
      } else {
        await createDokter(formData);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      alert(error.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus dokter ini?')) {
      try {
        await deleteDokter(id);
      } catch (error: any) {
        alert(error.message || 'Gagal menghapus dokter');
      }
    }
  };

  const filteredDokters = dokters.filter(d => 
    d.namaLengkap?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Master Dokter
          </h1>
          <p className="text-gray-500 mt-2">Kelola data dokter, akses login, dan penugasan ke poliklinik.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari dokter..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-none hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Dokter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-sm font-medium text-gray-600 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Lengkap & Gelar</th>
                <th className="px-6 py-4 font-semibold">Username Login</th>
                <th className="px-6 py-4 font-semibold">Poliklinik Penugasan</th>
                <th className="px-6 py-4 font-semibold text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && dokters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Memuat data dokter...
                  </td>
                </tr>
              ) : filteredDokters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada dokter yang cocok dengan pencarian.' : 'Belum ada data dokter.'}
                  </td>
                </tr>
              ) : (
                filteredDokters.map((dokter) => (
                  <tr key={dokter.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{dokter.namaLengkap || '-'}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{dokter.username}</td>
                    <td className="px-6 py-4">
                      {dokter.poliklinik ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-blue-100 text-blue-800">
                          {dokter.poliklinik.namaPoli}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-gray-100 text-gray-800">
                          Belum Ditugaskan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(dokter)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs rounded-none transition-colors"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(dokter.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-xs rounded-none transition-colors"
                          title="Hapus"
                        >
                          Hapus
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-none shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {isEditMode ? 'Edit Dokter' : 'Tambah Dokter Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  name="namaLengkap"
                  required
                  value={formData.namaLengkap}
                  onChange={handleInputChange}
                  placeholder="Contoh: dr. Budi Santoso, Sp.A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username Login *</label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Contoh: dr.budi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Login {isEditMode ? '(Kosongkan jika tidak diubah)' : '* (Akan di-set ke "dokter123" jika kosong)'}
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isEditMode ? "Tulis password baru" : "dokter123"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tugaskan ke Poliklinik</label>
                <select
                  name="poliklinikId"
                  value={formData.poliklinikId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Tidak Ditugaskan / Bebas --</option>
                  {polikliniks.map(poli => (
                    <option key={poli.id} value={poli.id}>{poli.namaPoli}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-none hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-none hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
