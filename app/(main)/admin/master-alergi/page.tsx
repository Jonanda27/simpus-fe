"use client";

import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

interface Alergi {
  id_alergi: string;
  kode_snomed: string;
  nama_alergi: string;
  kategori: string;
  status_aktif: boolean;
}

export default function MasterAlergiPage() {
  const [alergi, setAlergi] = useState<Alergi[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Alergi | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    kode_snomed: '',
    nama_alergi: '',
    kategori: 'food',
    status_aktif: true
  });

  // KFA Search State
  const [kfaSearchTerm, setKfaSearchTerm] = useState('');
  const [isSearchingKfa, setIsSearchingKfa] = useState(false);
  const [kfaResults, setKfaResults] = useState<any[]>([]);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAlergi();
  }, []);

  const fetchAlergi = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/master-alergi`);
      const data = await res.json();
      if(Array.isArray(data)) setAlergi(data);
    } catch (error) {
      console.error('Failed to fetch alergi', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingData 
        ? `${API_URL}/master-alergi/${editingData.id_alergi}` 
        : `${API_URL}/master-alergi`;
      const method = editingData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchAlergi();
        setFormData({ kode_snomed: '', nama_alergi: '', kategori: 'food', status_aktif: true });
        setEditingData(null);
      } else {
        const err = await res.json();
        alert(err.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Failed to save', error);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Hapus data master alergi ini?')) return;
    try {
      const res = await fetch(`${API_URL}/master-alergi/${id}`, { method: 'DELETE' });
      if(res.ok) fetchAlergi();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const openEdit = (data: Alergi) => {
    setEditingData(data);
    setFormData({
      kode_snomed: data.kode_snomed,
      nama_alergi: data.nama_alergi,
      kategori: data.kategori,
      status_aktif: data.status_aktif
    });
    setKfaSearchTerm('');
    setKfaResults([]);
    setIsModalOpen(true);
  };

  const handleSearchKFA = async () => {
    if (kfaSearchTerm.length < 3) {
      alert('Masukkan minimal 3 karakter');
      return;
    }
    setIsSearchingKfa(true);
    try {
      const res = await fetch(`${API_URL}/master-alergi/kfa?keyword=${kfaSearchTerm}`);
      const result = await res.json();
      if (result.success && result.data && result.data.items) {
        setKfaResults(result.data.items.data || result.data.items);
      } else {
        setKfaResults([]);
      }
    } catch (err) {
      console.error('Error search KFA:', err);
    } finally {
      setIsSearchingKfa(false);
    }
  };

  const selectKFA = (item: any) => {
    setFormData({
      ...formData,
      kode_snomed: item.kfa_code,
      nama_alergi: item.name,
      kategori: 'medication'
    });
    setKfaResults([]);
    setKfaSearchTerm('');
  };

  const filteredData = alergi.filter(a => 
    a.nama_alergi.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.kode_snomed.includes(searchTerm)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <AlertCircle className="w-8 h-8 mr-3 text-red-600" />
            Master Data Alergi
          </h1>
          <p className="text-gray-500 mt-2">Kelola master alergi berstandar SNOMED CT Kemenkes</p>
        </div>
        <button 
          onClick={() => {
            setEditingData(null);
            setFormData({ kode_snomed: '', nama_alergi: '', kategori: 'food', status_aktif: true });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 flex items-center rounded-none font-medium shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Alergi
        </button>
      </div>

      <div className="bg-white p-6 shadow-sm border border-gray-200">
        <div className="mb-6 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text"
              placeholder="Cari nama alergi atau kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="px-4 py-3 font-semibold text-gray-700">Kode SNOMED</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Nama Alergi / Zat</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Kategori</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Memuat data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Tidak ada data alergi</td></tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id_alergi} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm text-gray-600">{item.kode_snomed}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.nama_alergi}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.kategori === 'food' ? 'bg-orange-100 text-orange-800' :
                        item.kategori === 'medication' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.kategori.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium ${item.status_aktif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.status_aktif ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-3">
                      <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id_alergi)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-none shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">{editingData ? 'Edit Alergi' : 'Tambah Alergi'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select 
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="food">Food (Makanan)</option>
                  <option value="medication">Medication (Obat-obatan) - via KFA</option>
                  <option value="environment">Environment (Lingkungan)</option>
                  <option value="biologic">Biologic (Biologis)</option>
                </select>
              </div>

              {formData.kategori === 'medication' && !editingData && (
                <div className="bg-blue-50 p-4 border border-blue-200">
                  <label className="block text-sm font-bold text-blue-900 mb-2 flex items-center">
                    <Search className="w-4 h-4 mr-1" />
                    Cari Obat di SATUSEHAT (KFA)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={kfaSearchTerm}
                      onChange={(e) => setKfaSearchTerm(e.target.value)}
                      placeholder="Ketik nama obat (min 3 huruf)..."
                      className="flex-1 px-3 py-2 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchKFA())}
                    />
                    <button 
                      type="button" 
                      onClick={handleSearchKFA}
                      disabled={isSearchingKfa}
                      className="bg-blue-600 text-white px-3 py-2 text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {isSearchingKfa ? 'Mencari...' : 'Cari'}
                    </button>
                  </div>
                  
                  {kfaResults.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto bg-white border border-blue-200 shadow-sm">
                      {kfaResults.map((res: any, idx: number) => (
                        <div 
                          key={idx} 
                          onClick={() => selectKFA(res)}
                          className="p-2 border-b hover:bg-blue-50 cursor-pointer text-sm"
                        >
                          <div className="font-bold text-gray-900">{res.name}</div>
                          <div className="text-xs text-gray-500 font-mono">KFA: {res.kfa_code}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode SNOMED CT / KFA</label>
                <input 
                  type="text" 
                  required
                  value={formData.kode_snomed}
                  onChange={(e) => setFormData({...formData, kode_snomed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-gray-50"
                  placeholder="Contoh: 372687004"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Alergen (Zat)</label>
                <input 
                  type="text" 
                  required
                  value={formData.nama_alergi}
                  onChange={(e) => setFormData({...formData, nama_alergi: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  placeholder="Contoh: Amoxicillin"
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status_aktif"
                  checked={formData.status_aktif}
                  onChange={(e) => setFormData({...formData, status_aktif: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="status_aktif" className="ml-2 text-sm text-gray-700">Aktif</label>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
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
