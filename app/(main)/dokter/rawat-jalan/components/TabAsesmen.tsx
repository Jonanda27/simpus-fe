import React, { Dispatch, SetStateAction, useState } from 'react';
import { FileText, Search, X, Plus } from 'lucide-react';
import { SOAPPayload, DiagnosaItem } from '@/types/rawatJalan.types';
import { masterService } from '@/services/master.service';

interface TabAsesmenProps {
  soapData: SOAPPayload;
  setSoapData: Dispatch<SetStateAction<SOAPPayload>>;
  setActiveTab: (tab: string) => void;
}

export default function TabAsesmen({
  soapData,
  setSoapData,
  setActiveTab
}: TabAsesmenProps) {
  const [icdSearchTerm, setIcdSearchTerm] = useState('');
  const [icdResults, setIcdResults] = useState<any[]>([]);
  const [isSearchingIcd, setIsSearchingIcd] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState('Utama');
  const [selectedStatusKlinis, setSelectedStatusKlinis] = useState('Aktif');
  const [selectedStatusVerifikasi, setSelectedStatusVerifikasi] = useState('Suspek');

  const handleSearchICD = async () => {
    if (icdSearchTerm.length < 3) {
      alert('Masukkan minimal 3 karakter untuk mencari ICD-10');
      return;
    }
    setIsSearchingIcd(true);
    try {
      const res = await masterService.getIcd10(icdSearchTerm);
      if (res && res.data) {
        setIcdResults(res.data);
      } else {
        setIcdResults([]);
      }
    } catch (err) {
      console.error('Error search ICD10:', err);
      setIcdResults([]);
    } finally {
      setIsSearchingIcd(false);
    }
  };

  const handleAddDiagnosis = (item: any) => {
    const currentArr = soapData.diagnosisArr || [];
    // Check if already exists
    if (currentArr.some(d => d.icd10Id === item.id_icd10)) {
      alert('Diagnosa ini sudah ditambahkan.');
      return;
    }

    const newItem: DiagnosaItem = {
      icd10Id: item.id_icd10,
      kode_icd10: item.kode_icd10,
      nama_diagnosis: item.nama_diagnosis,
      jenisDiagnosis: selectedJenis,
      statusKlinis: selectedStatusKlinis,
      statusVerifikasi: selectedStatusVerifikasi
    };

    setSoapData({
      ...soapData,
      diagnosisArr: [...currentArr, newItem]
    });

    setIcdSearchTerm('');
    setIcdResults([]);
  };

  const handleRemoveDiagnosis = (id: string) => {
    const currentArr = soapData.diagnosisArr || [];
    setSoapData({
      ...soapData,
      diagnosisArr: currentArr.filter(d => d.icd10Id !== id)
    });
  };

  const diagnosisArr = soapData.diagnosisArr || [];

  return (
    <div className="p-8 space-y-6">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
        <FileText className="w-6 h-6 text-blue-600" />
        A - Asesmen (Diagnosa Klinis)
      </h3>
      <div className="bg-blue-50/30 p-6 border border-blue-100 rounded-none">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Diagnosa Klinis / Asesmen Dokter (Teks Bebas)</label>
            <textarea rows={3} value={soapData.diagnosisKlinis || ''} onChange={e => setSoapData({...soapData, diagnosisKlinis: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold text-sm text-gray-900" placeholder="Contoh: Pulpitis Irreversibel pada gigi 46. Suspek periodontitis apikal kronis." />
          </div>

          <div className="border-t border-blue-100 pt-6">
            <h4 className="text-md font-bold text-gray-800 mb-4 text-red-600">Pencatatan Diagnosa ICD-10 (Standar SATUSEHAT)</h4>
            
            <div className="bg-white p-4 border border-blue-200 shadow-sm mb-4">
              <div className="flex flex-col md:flex-row gap-4 mb-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Cari Penyakit (Kode ICD-10 / Nama)</label>
                  <div className="flex">
                    <input 
                      type="text"
                      value={icdSearchTerm}
                      onChange={(e) => setIcdSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchICD())}
                      placeholder="Ketik min. 3 huruf lalu Enter..."
                      className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={handleSearchICD}
                      disabled={isSearchingIcd}
                      className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-1/4">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status Diagnosa</label>
                  <select
                    value={selectedJenis}
                    onChange={(e) => setSelectedJenis(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Utama">Utama</option>
                    <option value="Sekunder">Sekunder</option>
                    <option value="Komorbid">Komorbid</option>
                    <option value="Komplikasi">Komplikasi</option>
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status Klinis</label>
                  <select
                    value={selectedStatusKlinis}
                    onChange={(e) => setSelectedStatusKlinis(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Sembuh">Sembuh</option>
                    <option value="Kambuh">Kambuh</option>
                    <option value="Remisi">Remisi</option>
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status Verifikasi</label>
                  <select
                    value={selectedStatusVerifikasi}
                    onChange={(e) => setSelectedStatusVerifikasi(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Suspek">Suspek</option>
                    <option value="Kerja">Kerja</option>
                    <option value="Definitif">Definitif</option>
                    <option value="Menyingkirkan">Menyingkirkan (Rule Out)</option>
                  </select>
                </div>
              </div>

              {icdResults.length > 0 && (
                <div className="mt-2 border border-blue-200 bg-gray-50 max-h-60 overflow-y-auto">
                  {icdResults.map((res: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="p-3 border-b border-gray-200 hover:bg-blue-50 flex justify-between items-center group cursor-pointer"
                      onClick={() => handleAddDiagnosis(res)}
                    >
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{res.kode_icd10} - {res.nama_diagnosis}</div>
                        <div className="text-xs text-gray-500 mt-1">Kategori: {res.kategori || 'Unknown'} | Bab: {res.bab || 'Unknown'}</div>
                      </div>
                      <button 
                        type="button"
                        className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 p-1 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* List Diagnosa Terpilih */}
            {diagnosisArr.length === 0 ? (
              <div className="text-sm text-gray-500 italic p-4 bg-gray-50 border border-gray-200 text-center">
                Belum ada diagnosa ICD-10 yang dipilih.
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                <label className="block text-sm font-bold text-gray-700">Diagnosa Terpilih:</label>
                {diagnosisArr.map((diag, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white border border-green-200 rounded-none shadow-sm border-l-4 border-l-green-500">
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        {diag.kode_icd10} - {diag.nama_diagnosis}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        <span className="font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mr-2">
                          {diag.jenisDiagnosis}
                        </span>
                        <span className="font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full mr-2">
                          {diag.statusKlinis}
                        </span>
                        <span className="font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full mr-2">
                          {diag.statusVerifikasi}
                        </span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoveDiagnosis(diag.icd10Id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50"
                      title="Hapus"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button onClick={() => { setActiveTab('SOAP_P'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-none transition-colors shadow-sm text-sm">
          Lanjut ke P (Plan) &rarr;
        </button>
      </div>
    </div>
  );
}
