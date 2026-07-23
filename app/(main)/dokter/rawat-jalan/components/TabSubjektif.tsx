import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { FileText, Plus, X, AlertCircle } from 'lucide-react';
import { SOAPPayload, AlergiItem } from '@/types/rawatJalan.types';
import { masterService } from '@/services/master.service';

interface TabSubjektifProps {
  soapData: SOAPPayload;
  setSoapData: Dispatch<SetStateAction<SOAPPayload>>;
  setActiveTab: (tab: string) => void;
}

const MANIFESTASI_OPTIONS = [
  { kode: '126485001', nama: 'Urticaria (Gatal-gatal)' },
  { kode: '271807003', nama: 'Ruam Kulit (Eruption of skin)' },
  { kode: '267036007', nama: 'Sesak Napas (Dyspnea)' },
  { kode: '39579001',  nama: 'Syok Anafilaktik (Anaphylaxis)' },
  { kode: '419076005', nama: 'Reaksi Alergi Ringan (Allergic reaction)' },
  { kode: '422587007', nama: 'Mual (Nausea)' },
  { kode: '422400008', nama: 'Muntah (Vomiting)' }
];

export default function TabSubjektif({
  soapData,
  setSoapData,
  setActiveTab
}: TabSubjektifProps) {
  const [masterAlergis, setMasterAlergis] = useState<any[]>([]);
  const [selectedAlergenId, setSelectedAlergenId] = useState('');
  const [selectedManifestasiKode, setSelectedManifestasiKode] = useState('');

  useEffect(() => {
    masterService.getAlergi().then(res => {
      if (Array.isArray(res)) {
        setMasterAlergis(res);
      } else if (res.success) {
        setMasterAlergis(res.data);
      }
    }).catch(console.error);
  }, []);

  const handleAddAlergi = () => {
    if (!selectedAlergenId || !selectedManifestasiKode) return;

    const alergen = masterAlergis.find(a => a.id_alergi === selectedAlergenId);
    const manifestasi = MANIFESTASI_OPTIONS.find(m => m.kode === selectedManifestasiKode);

    if (!alergen || !manifestasi) return;

    const newItem: AlergiItem = {
      alergiId: alergen.id_alergi,
      nama_alergi: alergen.nama_alergi,
      manifestasiKode: manifestasi.kode,
      manifestasiNama: manifestasi.nama,
      tingkatKeparahan: 'low'
    };

    setSoapData(prev => ({
      ...prev,
      alergiArr: [...(prev.alergiArr || []), newItem]
    }));

    setSelectedAlergenId('');
    setSelectedManifestasiKode('');
  };

  const handleRemoveAlergi = (index: number) => {
    setSoapData(prev => {
      const arr = [...(prev.alergiArr || [])];
      arr.splice(index, 1);
      return { ...prev, alergiArr: arr };
    });
  };

  return (
    <div className="p-8 space-y-6">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
        <FileText className="w-6 h-6 text-blue-600" />
        S - Subjektif (Anamnesis)
      </h3>
      <div className="bg-blue-50/30 p-6 border border-blue-100 rounded-none">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Keluhan Utama</label>
            <textarea rows={3} value={soapData.keluhanUtama || ''} onChange={e => setSoapData({...soapData, keluhanUtama: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Contoh: Nyeri gigi geraham bawah kanan..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Riwayat Penyakit Sekarang (RPS)</label>
            <textarea rows={3} value={soapData.riwayatPenyakitSekarang || ''} onChange={e => setSoapData({...soapData, riwayatPenyakitSekarang: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Penjabaran lebih lanjut dari keluhan utama..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={!soapData.riwayatAlergi ? "col-span-2" : ""}>
              <label className="block text-sm font-bold text-gray-700 mb-1">Riwayat Penyakit Dahulu (RPD)</label>
              <input type="text" value={soapData.riwayatPenyakitDahulu || ''} onChange={e => setSoapData({...soapData, riwayatPenyakitDahulu: e.target.value})} className="w-full px-4 py-2 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-900" placeholder="Contoh: Hipertensi, DM..." />
            </div>
            {soapData.riwayatAlergi && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Catatan Bebas Alergi (Lama)</label>
                <input type="text" value={soapData.riwayatAlergi} className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-none shadow-sm text-gray-500 font-medium text-sm" readOnly title="Data historis alergi dari sistem lama" />
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-blue-100 pt-6">
            <h4 className="text-md font-bold text-red-600 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Pencatatan Alergi (Standar SATUSEHAT)
            </h4>
            
            <div className="flex gap-2 items-end mb-4 bg-red-50/50 p-4 border border-red-100">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Zat / Alergen (Wajib)</label>
                <select 
                  value={selectedAlergenId} 
                  onChange={e => setSelectedAlergenId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-red-200 rounded-none text-sm focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Pilih Alergen --</option>
                  {masterAlergis.map(m => (
                    <option key={m.id_alergi} value={m.id_alergi}>{m.nama_alergi} ({m.kategori})</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Gejala Reaksi (Wajib)</label>
                <select 
                  value={selectedManifestasiKode} 
                  onChange={e => setSelectedManifestasiKode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-red-200 rounded-none text-sm focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Pilih Reaksi --</option>
                  {MANIFESTASI_OPTIONS.map(m => (
                    <option key={m.kode} value={m.kode}>{m.nama}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleAddAlergi}
                disabled={!selectedAlergenId || !selectedManifestasiKode}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-none h-[38px] flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>

            {/* List Alergi Terpilih */}
            {soapData.alergiArr && soapData.alergiArr.length > 0 && (
              <div className="space-y-2">
                {soapData.alergiArr.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-3 border border-red-200 border-l-4 border-l-red-500 shadow-sm">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{item.nama_alergi}</p>
                      <p className="text-xs text-red-600">Reaksi: {item.manifestasiNama} (Keparahan: {item.tingkatKeparahan})</p>
                    </div>
                    <button onClick={() => handleRemoveAlergi(idx)} className="text-gray-400 hover:text-red-600 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {(!soapData.alergiArr || soapData.alergiArr.length === 0) && (
              <p className="text-sm text-gray-500 italic">Belum ada alergi yang ditambahkan untuk kunjungan ini.</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button onClick={() => { setActiveTab('SOAP_O'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-none transition-colors shadow-sm text-sm">
          Lanjut ke O (Objektif) &rarr;
        </button>
      </div>
    </div>
  );
}
