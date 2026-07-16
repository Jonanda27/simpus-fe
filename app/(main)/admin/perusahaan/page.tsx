'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Building, FileText, CheckCircle, XCircle } from 'lucide-react';
import { usePerusahaanStore } from '@/store/perusahaan.store';

export default function MasterPerusahaanPage() {
  const { perusahaan, isLoading, fetchPerusahaan, createPerusahaan } = usePerusahaanStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    kodePerusahaan: '',
    namaPerusahaan: '',
    alamat: '',
    noTelepon: '',
    email: '',
    namaPic: '',
    noHpPic: '',
    noPks: '',
    tanggalMulai: '',
    tanggalBerakhir: '',
    statusKerjasama: 'AKTIF'
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPerusahaan();
  }, [fetchPerusahaan]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      if (file) {
        submitData.append('fileDokumenPks', file);
      }

      const success = await createPerusahaan(submitData);
      if (success) {
        alert('Perusahaan berhasil ditambahkan!');
        setIsModalOpen(false);
        fetchPerusahaan();
        // Reset form
        setFormData({
          kodePerusahaan: '', namaPerusahaan: '', alamat: '', noTelepon: '', email: '',
          namaPic: '', noHpPic: '', noPks: '', tanggalMulai: '', tanggalBerakhir: '', statusKerjasama: 'AKTIF'
        });
        setFile(null);
      } else {
        alert('Gagal menambahkan perusahaan');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan sistem');
    }
  };

  const filteredPerusahaan = perusahaan.filter(p => 
    p.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.kodePerusahaan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building className="w-8 h-8 text-blue-600" />
            Master Data Perusahaan
          </h1>
          <p className="text-gray-500 mt-2">Kelola data mitra kerja sama dan dokumen PKS.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari perusahaan..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-none shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Mitra
          </button>
        </div>
      </div>

      <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-medium border-b border-gray-200">
                <th className="py-4 px-6">Nama Perusahaan</th>
                <th className="py-4 px-6">PIC / Kontak</th>
                <th className="py-4 px-6">No PKS</th>
                <th className="py-4 px-6">Masa Berlaku</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : filteredPerusahaan.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada perusahaan yang cocok dengan pencarian.' : 'Belum ada data perusahaan.'}
                  </td>
                </tr>
              ) : (
                filteredPerusahaan.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 text-slate-800">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{p.namaPerusahaan}</div>
                      <div className="text-xs text-gray-500">Kode: {p.kodePerusahaan}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">{p.namaPic || '-'}</div>
                      <div className="text-xs text-gray-500">{p.noHpPic || p.noTelepon || '-'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-700">{p.noPks || '-'}</div>
                      {p.fileDokumenPks && (
                        <button 
                          onClick={() => setSelectedPdf(`http://localhost:5000${p.fileDokumenPks}`)} 
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <FileText className="w-3 h-3" /> Lihat PDF
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        {p.tanggalMulai ? new Date(p.tanggalMulai).toLocaleDateString('id-ID') : '-'}
                        {' s/d '}
                        {p.tanggalBerakhir ? new Date(p.tanggalBerakhir).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {p.statusKerjasama === 'AKTIF' ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-none text-xs font-semibold w-max block text-center">
                          Aktif
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-none text-xs font-semibold w-max block text-center">
                          Tidak Aktif
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs rounded-none transition-colors" title="Edit">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Perusahaan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Tambah Mitra Perusahaan</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6 text-slate-800">
              {/* Identitas Perusahaan */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Identitas Perusahaan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Perusahaan *</label>
                    <input type="text" name="namaPerusahaan" required placeholder="Contoh: PT. Maju Bersama" value={formData.namaPerusahaan} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kode Perusahaan *</label>
                    <input type="text" name="kodePerusahaan" required placeholder="Contoh: CORP-001" value={formData.kodePerusahaan} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">No Telepon Kantor</label>
                    <input type="text" name="noTelepon" placeholder="Contoh: (021) 1234567" value={formData.noTelepon} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Kantor</label>
                    <input type="email" name="email" placeholder="Contoh: info@majubersama.com" value={formData.email} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Alamat Lengkap</label>
                    <textarea name="alamat" rows={2} placeholder="Contoh: Jl. Jend. Sudirman No. 123, Jakarta Pusat" value={formData.alamat} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                </div>
              </div>

              {/* Data PIC */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Kontak PIC (Person In Charge)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama PIC</label>
                    <input type="text" name="namaPic" placeholder="Contoh: Budi Santoso" value={formData.namaPic} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">No HP / WA PIC</label>
                    <input type="text" name="noHpPic" placeholder="Contoh: 081234567890" value={formData.noHpPic} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Data PKS */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Dokumen PKS (Perjanjian Kerja Sama)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Nomor Kontrak PKS</label>
                    <input type="text" name="noPks" placeholder="Contoh: PKS/2026/07/001" value={formData.noPks} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Upload File PKS (PDF)</label>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full border rounded-none p-1.5 focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Tanggal Mulai Berlaku</label>
                    <input type="date" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Tanggal Berakhir Kontrak</label>
                    <input type="date" name="tanggalBerakhir" value={formData.tanggalBerakhir} onChange={handleInputChange} className="w-full border rounded-none p-2 focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-300 rounded-none text-gray-700 font-medium hover:bg-gray-50">
                  Batal
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-none font-medium hover:bg-blue-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal PDF Viewer */}
      {selectedPdf && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex flex-col p-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4 text-white">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Pratinjau Dokumen PKS
            </h2>
            <button 
              onClick={() => setSelectedPdf(null)}
              className="p-2 hover:bg-white/20 rounded-none transition-colors"
            >
              <XCircle className="w-8 h-8" />
            </button>
          </div>
          <div className="flex-1 bg-white rounded-none overflow-hidden shadow-2xl">
            <iframe 
              src={selectedPdf} 
              className="w-full h-full border-0"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
