"use client";

import React, { useState } from 'react';
import { BedDouble, Stethoscope, Activity, ClipboardCheck, Clock, User, LogOut, CheckCircle, Save, Plus } from 'lucide-react';

// Mock Data untuk Kamar / Bed Management
const MOCK_WARDS = [
  { room: 'Melati 1 (Kelas 1)', beds: [
      { id: 'M1-B1', patient: 'Ahmad Dahlan', noRM: 'RM-00102', days: 3, status: 'occupied', diagnosis: 'Typhoid Fever' },
      { id: 'M1-B2', patient: null, noRM: null, days: 0, status: 'empty', diagnosis: null }
  ]},
  { room: 'Mawar 3 (Kelas 3)', beds: [
      { id: 'W3-B1', patient: 'Siti Aminah', noRM: 'RM-00215', days: 1, status: 'occupied', diagnosis: 'Dengue Hemorrhagic Fever' },
      { id: 'W3-B2', patient: 'Budi Santoso', noRM: 'RM-00344', days: 5, status: 'discharge_plan', diagnosis: 'Post-Op Appendicitis' },
      { id: 'W3-B3', patient: null, noRM: null, days: 0, status: 'empty', diagnosis: null },
      { id: 'W3-B4', patient: null, noRM: null, days: 0, status: 'empty', diagnosis: null }
  ]},
  { room: 'ICU / HCU', beds: [
      { id: 'ICU-B1', patient: 'Joko Anwar', noRM: 'RM-00991', days: 1, status: 'critical', diagnosis: 'STEMI' },
      { id: 'ICU-B2', patient: null, noRM: null, days: 0, status: 'empty', diagnosis: null }
  ]}
];

// Flat list of occupied beds for initial state
const OCCUPIED_BEDS = MOCK_WARDS.flatMap(w => w.beds).filter(b => b.status !== 'empty');

export default function RawatInapDashboard() {
  const [activeTab, setActiveTab] = useState<'admission' | 'visit' | 'askep' | 'discharge'>('admission');
  const [selectedBed, setSelectedBed] = useState<any>(OCCUPIED_BEDS[0]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* LEFT PANEL: WARD MANAGEMENT */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10">
        <div className="p-4 border-b border-gray-200 bg-teal-50/50">
          <h2 className="text-lg font-bold text-teal-800 flex items-center">
            <BedDouble className="w-5 h-5 mr-2 text-teal-600" />
            Manajemen Kamar & Bed
          </h2>
          <div className="mt-3 flex gap-2 text-xs font-medium text-gray-500">
            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-teal-500 mr-1"></div> Terisi</span>
            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div> Kritis</span>
            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-orange-400 mr-1"></div> Rencana Pulang</span>
            <span className="flex items-center"><div className="w-2 h-2 rounded-full border border-gray-300 mr-1"></div> Kosong</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {MOCK_WARDS.map((ward, wardIdx) => (
            <div key={wardIdx} className="border border-gray-200 shadow-sm">
              <div className="bg-gray-100 p-2 font-bold text-sm text-gray-700 border-b border-gray-200">
                {ward.room}
              </div>
              <div className="grid grid-cols-2 gap-px bg-gray-200">
                {ward.beds.map((bed) => {
                  const isSelected = selectedBed?.id === bed.id;
                  const isEmpty = bed.status === 'empty';
                  
                  let bgClass = "bg-white hover:bg-gray-50 cursor-pointer";
                  let borderClass = "border-transparent";
                  
                  if (isSelected) {
                    bgClass = "bg-teal-50";
                    borderClass = "border-teal-500 z-10 shadow-md";
                  } else if (isEmpty) {
                    bgClass = "bg-gray-50/50 cursor-default opacity-60";
                  }

                  let statusBadge = "";
                  if (bed.status === 'occupied') statusBadge = "bg-teal-500";
                  if (bed.status === 'critical') statusBadge = "bg-red-500 animate-pulse";
                  if (bed.status === 'discharge_plan') statusBadge = "bg-orange-400";
                  if (isEmpty) statusBadge = "border border-gray-300 bg-transparent";

                  return (
                    <div 
                      key={bed.id}
                      onClick={() => !isEmpty && setSelectedBed(bed)}
                      className={`p-3 border-2 transition-all relative h-24 flex flex-col justify-between ${bgClass} ${borderClass}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono font-bold text-gray-500">{bed.id}</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${statusBadge}`}></div>
                      </div>
                      
                      {isEmpty ? (
                        <div className="text-center text-xs text-gray-400 font-medium">Kosong</div>
                      ) : (
                        <div>
                          <div className="font-bold text-sm text-gray-900 truncate" title={bed.patient || undefined}>{bed.patient}</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] text-gray-500 font-mono">{bed.noRM}</span>
                            <span className="text-[10px] bg-white border border-gray-200 px-1 font-bold text-gray-600 shadow-sm">Hari {bed.days}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: MAIN FORM */}
      <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
        {selectedBed ? (
          <>
            {/* Header Pasien Inap */}
            <div className={`p-4 border-b border-gray-200 shadow-sm flex justify-between items-center text-white ${
              selectedBed.status === 'critical' ? 'bg-red-700' :
              selectedBed.status === 'discharge_plan' ? 'bg-orange-600' : 'bg-teal-700'
            }`}>
              <div className="flex items-center">
                <div className={`w-12 h-12 flex items-center justify-center font-bold text-2xl mr-4 border-2 border-white/30 bg-black/10`}>
                  {selectedBed.patient?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold mr-3">{selectedBed.patient}</h1>
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-none font-mono border border-white/30 shadow-sm">
                      {selectedBed.id}
                    </span>
                  </div>
                  <div className="text-sm opacity-90 flex items-center mt-1 font-medium">
                    <span className="font-mono bg-black/20 px-1.5 py-0.5 mr-2">{selectedBed.noRM}</span>
                    <span>34 Tahun</span>
                    <span className="mx-2">•</span>
                    <span className="font-bold">Perawatan Hari Ke-{selectedBed.days}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="text-sm font-bold opacity-80 uppercase tracking-wider mb-1">Diagnosa (ICD-10)</div>
                <div className="text-lg font-bold flex items-center">
                  <Activity className="w-4 h-4 mr-1 opacity-70" />
                  {selectedBed.diagnosis}
                </div>
              </div>
            </div>

            {/* Form Tabs */}
            <div className="flex border-b border-gray-200 bg-white shadow-sm z-10">
              <button 
                onClick={() => setActiveTab('admission')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'admission' ? 'border-teal-600 text-teal-700 bg-teal-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                1. Admission & Profil
              </button>
              <button 
                onClick={() => setActiveTab('visit')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'visit' ? 'border-blue-600 text-blue-700 bg-blue-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                2. Visit Dokter (CPPT)
              </button>
              <button 
                onClick={() => setActiveTab('askep')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'askep' ? 'border-indigo-500 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                3. Askep & Monitoring
              </button>
              <button 
                onClick={() => setActiveTab('discharge')}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'discharge' ? 'border-orange-500 text-orange-600 bg-orange-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                4. Rencana Pulang
              </button>
            </div>

            {/* Form Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
              
              {/* TAB 1: ADMISSION */}
              {activeTab === 'admission' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="bg-white p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b pb-3">
                      <User className="w-5 h-5 mr-2 text-teal-600" />
                      Ringkasan Masuk (Admission Summary)
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal Masuk (Admission Date)</label>
                          <div className="font-medium text-gray-800">12 Oktober 2023, 14:30 WIB</div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Asal Masuk</label>
                          <div className="font-medium text-gray-800">IGD (Rujukan Internal)</div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dokter Penanggung Jawab Pelayanan (DPJP)</label>
                          <div className="font-bold text-teal-700">dr. Herman Susanto, Sp.PD</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Penjamin / Asuransi</label>
                          <div className="inline-block bg-green-100 text-green-800 px-2 py-1 text-sm font-bold border border-green-200">BPJS Kesehatan (Kelas 1)</div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">No. SEP (Surat Eligibilitas Peserta)</label>
                          <div className="font-mono text-gray-800 font-bold">098127391827391</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 border border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Alasan Dirawat (Indikasi Opname)</label>
                      <p className="text-gray-800 text-sm">Pasien rujukan dari IGD dengan observasi Febris H+5, trombosit turun (80.000), terdapat manifestasi pendarahan gusi dan petekie. Direncanakan rehidrasi IV dan pantau serial darah rutin.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VISIT DOKTER (CPPT) */}
              {activeTab === 'visit' && (
                <div className="space-y-6 max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
                  
                  {/* Left: Input SOAP Hari ini */}
                  <div className="flex-1 bg-white p-6 shadow-sm border border-gray-200 h-fit">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                      <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                      Visit Dokter Hari Ini (CPPT)
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subjektif (S)</label>
                        <textarea rows={2} className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black text-sm rounded-none p-3 placeholder:text-gray-400" placeholder="Keluhan pasien saat divisit..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objektif (O)</label>
                        <textarea rows={2} className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black text-sm rounded-none p-3 placeholder:text-gray-400" placeholder="Pemeriksaan fisik dan lab terakhir..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Asesmen (A)</label>
                        <textarea rows={2} className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black text-sm rounded-none p-3 placeholder:text-gray-400" placeholder="Kesimpulan medis hari ini..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Plan & Instruksi (P)</label>
                        <textarea rows={3} className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black text-sm rounded-none p-3 placeholder:text-gray-400" placeholder="Diet, terapi obat, rencana lab/radiologi..."></textarea>
                      </div>
                      
                      <button className="w-full py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex justify-center items-center text-sm shadow-sm">
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Catatan Visit
                      </button>
                    </div>
                  </div>
                  
                  {/* Right: History CPPT */}
                  <div className="lg:w-80 space-y-4">
                    <h4 className="font-bold text-gray-700 text-sm uppercase">Riwayat CPPT</h4>
                    
                    <div className="bg-white border-l-4 border-blue-500 shadow-sm p-3">
                      <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                        <span className="text-xs font-bold text-gray-500">Kemarin, 08:00</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 font-bold">dr. Herman S.</span>
                      </div>
                      <div className="text-xs text-gray-700 space-y-1">
                        <p><span className="font-bold text-gray-900">S:</span> Demam masih naik turun, mual (+)</p>
                        <p><span className="font-bold text-gray-900">O:</span> TD 110/70, Trombosit 95rb</p>
                        <p><span className="font-bold text-gray-900">A:</span> DHF grade I</p>
                        <p><span className="font-bold text-gray-900">P:</span> Lanjut IVFD RL 30tpm, cek UL</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border-l-4 border-gray-400 shadow-sm p-3 opacity-75">
                      <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                        <span className="text-xs font-bold text-gray-500">H-2, 14:30 (IGD)</span>
                        <span className="text-[10px] bg-red-100 text-red-800 px-1.5 font-bold">dr. Jaga IGD</span>
                      </div>
                      <div className="text-xs text-gray-700 space-y-1">
                        <p><span className="font-bold text-gray-900">S:</span> Demam 5 hari, lemas</p>
                        <p><span className="font-bold text-gray-900">O:</span> T 39C, RL tes (+)</p>
                        <p><span className="font-bold text-gray-900">A:</span> Obs. Febris ec susp DHF</p>
                        <p><span className="font-bold text-gray-900">P:</span> Pro Rawat Inap</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: ASKEP & MONITORING */}
              {activeTab === 'askep' && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  <div className="bg-white shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-indigo-50/50">
                      <h3 className="text-lg font-bold text-indigo-800 flex items-center">
                        <ClipboardCheck className="w-5 h-5 mr-2 text-indigo-600" />
                        Tabel Monitoring Harian (Shift Perawat)
                      </h3>
                      <button className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1.5 hover:bg-indigo-700 transition-colors font-bold shadow-sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Isi Tanda Vital Shift
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 font-bold border-b border-gray-300">
                          <tr>
                            <th className="px-4 py-3">Tgl & Shift</th>
                            <th className="px-4 py-3">Tensi (TD)</th>
                            <th className="px-4 py-3">Nadi (HR)</th>
                            <th className="px-4 py-3">Suhu</th>
                            <th className="px-4 py-3">Intake (Cairan)</th>
                            <th className="px-4 py-3">Output (Urine)</th>
                            <th className="px-4 py-3">Perawat</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-bold text-gray-900">Hari ini</div>
                              <div className="text-xs text-gray-500 font-mono">Pagi (07:00)</div>
                            </td>
                            <td className="px-4 py-3 text-gray-800">110/70</td>
                            <td className="px-4 py-3 text-gray-800">88 x/m</td>
                            <td className="px-4 py-3 text-gray-800">37.2 °C</td>
                            <td className="px-4 py-3 text-gray-800">500 cc (Oral+IV)</td>
                            <td className="px-4 py-3 text-gray-800">400 cc</td>
                            <td className="px-4 py-3 text-gray-700 font-medium">Ns. Siska</td>
                          </tr>
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-bold text-gray-900">Kemarin</div>
                              <div className="text-xs text-gray-500 font-mono">Malam (22:00)</div>
                            </td>
                            <td className="px-4 py-3 text-gray-800">115/75</td>
                            <td className="px-4 py-3 text-gray-800">92 x/m</td>
                            <td className="px-4 py-3 text-red-600 font-bold">38.5 °C</td>
                            <td className="px-4 py-3 text-gray-800">400 cc</td>
                            <td className="px-4 py-3 text-gray-800">200 cc</td>
                            <td className="px-4 py-3 text-gray-700 font-medium">Ns. Budi</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Catatan Obat */}
                  <div className="bg-white shadow-sm border border-gray-200 p-6">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">Ceklis Pemberian Terapi Obat</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 border-gray-300 rounded" />
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Paracetamol Infus 1000mg / 8 Jam</div>
                          <div className="text-xs text-gray-500">Jadwal: 08:00 WIB</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 border-gray-300 rounded" defaultChecked />
                        <div>
                          <div className="font-bold text-gray-900 text-sm line-through">Pantoprazole IV 40mg</div>
                          <div className="text-xs text-green-600 font-bold">Diberikan pada 07:15 oleh Ns. Siska</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DISCHARGE */}
              {activeTab === 'discharge' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="bg-white p-6 shadow-sm border border-gray-200 border-t-4 border-t-orange-500">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b pb-2">
                      <LogOut className="w-5 h-5 mr-2 text-orange-600" />
                      Rencana Pulang (Discharge Planning)
                    </h3>
                    
                    <div className="mb-6 bg-orange-50 border border-orange-200 p-4">
                      <p className="text-sm text-orange-800 font-medium flex items-start">
                        <Activity className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        Formulir ini diisi jika DPJP telah mengizinkan pasien pulang. Aksi ini akan mengosongkan status tempat tidur (Bed) pada sistem dan merubah tagihan menjadi final di bagian Kasir.
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Keadaan Keluar</label>
                        <div className="grid grid-cols-3 gap-3">
                          <label className="border border-blue-500 bg-blue-50 p-3 flex flex-col items-center justify-center cursor-pointer shadow-sm text-center">
                            <input type="radio" name="discharge" defaultChecked className="w-4 h-4 text-blue-600 focus:ring-blue-500 mb-1" />
                            <span className="font-bold text-sm text-blue-800">Sembuh / Perbaikan</span>
                          </label>
                          <label className="border border-gray-300 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all text-center">
                            <input type="radio" name="discharge" className="w-4 h-4 text-gray-600 focus:ring-gray-500 mb-1" />
                            <span className="font-bold text-sm text-gray-800">Pulang Atas Permintaan Sendiri</span>
                          </label>
                          <label className="border border-gray-300 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all text-center">
                            <input type="radio" name="discharge" className="w-4 h-4 text-gray-600 focus:ring-gray-500 mb-1" />
                            <span className="font-bold text-sm text-gray-800">Meninggal Dunia</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Edukasi & Obat Pulang</label>
                        <textarea rows={3} className="w-full border-gray-300 p-3 text-sm rounded-none text-black placeholder:text-gray-400" placeholder="Instruksi perawatan di rumah dan resep obat jalan..."></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Rencana Kontrol Poliklinik</label>
                        <input type="date" className="w-full border-gray-300 p-3 text-sm rounded-none text-black" />
                      </div>
                    </div>

                    <button className="w-full py-4 bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 transition-colors flex justify-center items-center shadow-md">
                      <CheckCircle className="w-6 h-6 mr-2" />
                      Finalisasi & Pulangkan Pasien (Discharge)
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <BedDouble className="w-20 h-20 mb-4 text-gray-200" />
            <p className="text-xl font-bold text-gray-400">Silakan pilih Bed yang terisi di panel sebelah kiri</p>
            <p className="text-sm mt-2">Pilih kasur dengan indikator warna biru, merah, atau oranye</p>
          </div>
        )}
      </div>

    </div>
  );
}
