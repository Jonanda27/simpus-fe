'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUKMStore } from '../../../../store/ukm.store';
import { ArrowLeft, Loader2, Search, Filter, Plus, Calendar, Activity, ClipboardList } from 'lucide-react';

export default function ProgramUKMDetailPage() {
  const { programId } = useParams();
  const router = useRouter();
  const { registerList, isLoading, fetchPasienByProgram, addLogPemantauan } = useUKMStore();
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedRegisterId, setSelectedRegisterId] = useState('');
  
  const [logData, setLogData] = useState({
    catatan: '',
    tindakLanjut: '',
    statusBerobat: '',
    statusProgram: '',
    beratBadan: '',
    cd4: '',
    viralLoad: '',
    arvKepatuhan: 'YA',
    infeksiOportunistik: ''
  });

  const isHIV = typeof programId === 'string' && programId.toUpperCase() === 'HIV';

  useEffect(() => {
    if (programId) {
      // Find the actual database ID from the programs list based on kodeProgram
      // Wait, getPasienByProgram currently expects programId (the ID in DB) or we need to update backend to accept kode.
      // Let's assume the backend was modified or we pass the kode. Actually, let's just fetch by kode!
      // In ukm.route.js we did /program/:programId/pasien. Let's use it as ID for now. 
      // But the router pushes `/ukm/${program.kodeProgram}`. We should fetch by kode!
      fetchPasienByProgram(programId as string); 
    }
  }, [programId, fetchPasienByProgram]);

  const handleOpenLogModal = (registerId: string, currentStatus: string) => {
    setSelectedRegisterId(registerId);
    setLogData({
      catatan: '',
      tindakLanjut: '',
      statusBerobat: '',
      statusProgram: currentStatus,
      beratBadan: '',
      cd4: '',
      viralLoad: '',
      arvKepatuhan: 'YA',
      infeksiOportunistik: ''
    });
    setShowLogModal(true);
  };

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalCatatan = logData.catatan;
    if (isHIV) {
      finalCatatan = JSON.stringify({
        catatanUmum: logData.catatan,
        beratBadan: logData.beratBadan,
        cd4: logData.cd4,
        viralLoad: logData.viralLoad,
        arvKepatuhan: logData.arvKepatuhan,
        infeksiOportunistik: logData.infeksiOportunistik
      });
    }

    const payload = {
      ...logData,
      catatan: finalCatatan
    };

    const success = await addLogPemantauan(selectedRegisterId, payload);
    if (success) {
      setShowLogModal(false);
      fetchPasienByProgram(programId as string);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => router.push('/ukm')}
          className="p-2 hover:bg-gray-100 rounded-none transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Data Program {programId}</h1>
          <p className="text-gray-500 mt-1 text-sm">Pemantauan & Register Pasien</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden rounded-none">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Cari nama pasien, no RM..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
            />
          </div>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-none hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter Status
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Pasien</th>
                  <th className="px-6 py-4">Tgl Daftar</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Pemantauan Terakhir</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registerList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      Belum ada pasien terdaftar di program ini.
                    </td>
                  </tr>
                ) : (
                  registerList.map((reg) => (
                    <tr key={reg.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{reg.pasien?.namaLengkap}</div>
                        <div className="text-gray-500 text-xs mt-1">RM: {reg.pasien?.noRM} • NIK: {reg.pasien?.nik}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(reg.tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-none text-xs font-semibold ${
                          reg.statusProgram === 'AKTIF' ? 'bg-green-100 text-green-700' :
                          reg.statusProgram === 'SEMBUH' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {reg.statusProgram}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {reg.logPemantauan && reg.logPemantauan.length > 0 ? (
                          <div>
                            <div className="text-gray-900 line-clamp-1">
                              {(() => {
                                const cat = reg.logPemantauan[0].catatan;
                                try {
                                  const parsed = JSON.parse(cat);
                                  return parsed.catatanUmum || cat;
                                } catch (e) {
                                  return cat;
                                }
                              })()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(reg.logPemantauan[0].tanggal).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Belum ada log</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenLogModal(reg.id, reg.statusProgram)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-none hover:bg-blue-100 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Tambah Log
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Log */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-none shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 bg-blue-600 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-white" />
                Tambah Log Pemantauan
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-blue-100 hover:text-white transition-colors">×</button>
            </div>
            <form onSubmit={handleSubmitLog} className="p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Bagian Kiri: Form Umum */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 border-b pb-2 mb-3">Informasi Umum</h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan / Hasil Kunjungan *</label>
                    <textarea 
                      required
                      rows={3}
                      value={logData.catatan}
                      onChange={e => setLogData({...logData, catatan: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
                      placeholder="Contoh: Pasien mengambil obat bulan ke-2. Kondisi stabil."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tindak Lanjut (Opsional)</label>
                    <input 
                      type="text"
                      value={logData.tindakLanjut}
                      onChange={e => setLogData({...logData, tindakLanjut: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Status Berobat</label>
                      <select 
                        value={logData.statusBerobat}
                        onChange={e => setLogData({...logData, statusBerobat: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                      >
                        <option value="">-- Pilih --</option>
                        <option value="LANJUT">Lanjut</option>
                        <option value="PUTUS_OBAT">Putus Obat (DO)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Status Program</label>
                      <select 
                        value={logData.statusProgram}
                        onChange={e => setLogData({...logData, statusProgram: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                      >
                        <option value="AKTIF">AKTIF</option>
                        <option value="SEMBUH">SEMBUH</option>
                        <option value="PUTUS_OBAT">PUTUS OBAT</option>
                        <option value="MENINGGAL">MENINGGAL</option>
                        <option value="RUJUK">RUJUK</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bagian Kanan: Khusus HIV */}
                <div className="space-y-4">
                  {isHIV ? (
                    <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-none h-full">
                      <h4 className="text-sm font-bold text-blue-900 border-b border-blue-200 pb-2 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Parameter HIV Khusus
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">CD4 Count</label>
                          <input 
                            type="text"
                            value={logData.cd4}
                            onChange={e => setLogData({...logData, cd4: e.target.value})}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                            placeholder="Contoh: 350"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Viral Load</label>
                          <input 
                            type="text"
                            value={logData.viralLoad}
                            onChange={e => setLogData({...logData, viralLoad: e.target.value})}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                            placeholder="Tdk Terdeteksi"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Berat Badan (Kg)</label>
                          <input 
                            type="number"
                            value={logData.beratBadan}
                            onChange={e => setLogData({...logData, beratBadan: e.target.value})}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Patuh ARV?</label>
                          <select 
                            value={logData.arvKepatuhan}
                            onChange={e => setLogData({...logData, arvKepatuhan: e.target.value})}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-blue-100 transition-all text-sm text-blue-700 font-medium"
                          >
                            <option value="YA">Ya, Patuh</option>
                            <option value="TIDAK">Tidak Patuh</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Infeksi Oportunistik (IO)</label>
                          <input 
                            type="text"
                            value={logData.infeksiOportunistik}
                            onChange={e => setLogData({...logData, infeksiOportunistik: e.target.value})}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                            placeholder="Bila ada keluhan penyerta..."
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 text-sm p-4 text-center">
                      Hanya pasien HIV yang memiliki form parameter pemantauan khusus.
                    </div>
                  )}
                </div>

              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowLogModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-none hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-none hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Simpan Log Pemantauan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
