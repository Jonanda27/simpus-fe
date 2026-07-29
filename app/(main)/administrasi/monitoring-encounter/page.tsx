'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  FileCode, 
  XCircle, 
  Copy, 
  Building2, 
  User, 
  Calendar, 
  Stethoscope,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { satusehatService } from '@/services/satusehat.service';

export default function MonitoringEncounterPage() {
  const [monitoringList, setMonitoringList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(null);
  const [activeTabResource, setActiveTabResource] = useState<string>('Encounter');
  const [encounterDetail, setEncounterDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [syncRetryId, setSyncRetryId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollTabHeader = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleRetrySync = async (kunjunganId: string) => {
    try {
      setSyncRetryId(kunjunganId);
      const res = await satusehatService.retrySyncEncounter(kunjunganId);
      if (res.success) {
        alert('Sync Bundle SATUSEHAT Berhasil!');
        fetchMonitoringList();
      } else {
        alert(`Gagal Sync: ${res.message || 'Error tidak diketahui'}`);
      }
    } catch (err: any) {
      alert(`Gagal Sync: ${err?.message || err?.error || 'Terjadi kesalahan saat menembak Bundle SATUSEHAT'}`);
    } finally {
      setSyncRetryId(null);
    }
  };

  useEffect(() => {
    fetchMonitoringList();
  }, []);

  const fetchMonitoringList = async () => {
    try {
      setLoading(true);
      const res = await satusehatService.getMonitoringEncounters();
      if (res.success) {
        setMonitoringList(res.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch monitoring encounters', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectEncounter = async (encounterId: string) => {
    setSelectedEncounterId(encounterId);
    setActiveTabResource('Encounter');
    fetchResourceData('Encounter', encounterId);
  };

  const fetchResourceData = async (resourceType: string, encounterId: string) => {
    try {
      setLoadingDetail(true);
      setDetailError(null);
      setEncounterDetail(null);

      if (resourceType === 'Encounter') {
        const res = await satusehatService.getEncounterDetail(encounterId);
        if (res.success) {
          setEncounterDetail(res.data);
        } else {
          setDetailError(res.message || 'Gagal mengambil detail Encounter dari Kemenkes.');
        }
      } else {
        const res = await satusehatService.getResourceByEncounter(resourceType, encounterId);
        if (res.success) {
          setEncounterDetail(res.data);
        } else {
          setDetailError(res.message || `Gagal mengambil resource ${resourceType} dari Kemenkes.`);
        }
      }
    } catch (err: any) {
      setDetailError(err?.message || err?.error || `Terjadi kesalahan saat memanggil API SATUSEHAT for ${resourceType}`);
    } fontFinally: {
      setLoadingDetail(false);
    }
  };

  const handleTabChange = (resourceType: string) => {
    if (!selectedEncounterId) return;
    setActiveTabResource(resourceType);
    fetchResourceData(resourceType, selectedEncounterId);
  };

  const handleCopyJson = () => {
    if (!encounterDetail) return;
    navigator.clipboard.writeText(JSON.stringify(encounterDetail, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredList = monitoringList.filter((item) => {
    const encId = item.satusehat_encounter_id || item.satusehatId || item.encounterId || '';
    const pasienName = item.pasien?.namaLengkap || '';
    const noRM = item.pasien?.noRM || '';
    const nik = item.pasien?.nik || '';

    const matchesSearch = 
      encId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pasienName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noRM.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nik.toLowerCase().includes(searchTerm.toLowerCase());

    const syncStatus = item.satusehat_sync_status || 'PENDING';
    const matchesStatus = statusFilter === 'ALL' || syncStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-none shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              <Activity className="w-7 h-7 text-blue-600" />
              Monitoring Interoperabilitas SATUSEHAT (FHIR R4)
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Inspeksi real-time transaksi Encounter, Observation, Condition, ClinicalImpression & Goal ke Kemenkes RI Sandbox
            </p>
          </div>
          <button
            onClick={fetchMonitoringList}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none text-xs transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-none shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari NIK / No. RM / Nama Pasien / Encounter ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-none text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-gray-600 whitespace-nowrap">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-none text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Status Sync</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        {/* Encounter Table */}
        <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/80 border-b border-gray-200 font-extrabold text-gray-700">
                  <th className="px-6 py-4">Pasien</th>
                  <th className="px-6 py-4">Poliklinik & Dokter</th>
                  <th className="px-6 py-4">Waktu Registrasi</th>
                  <th className="px-6 py-4">Encounter ID (SATUSEHAT)</th>
                  <th className="px-6 py-4">Status Sync</th>
                  <th className="px-6 py-4 text-center">Aksi / Inspeksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                      Memuat data encounter...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      Tidak ada data kunjungan yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => {
                    const encounterId = item.encounterId;
                    const isSuccess = item.satusehat_sync_status === 'SUCCESS';
                    const isFailed = item.satusehat_sync_status === 'FAILED';

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Pasien Info */}
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-gray-900">{item.pasien?.namaLengkap || '-'}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">
                            RM: {item.pasien?.noRM || '-'} | NIK: {item.pasien?.nik || '-'}
                          </div>
                        </td>

                        {/* Poli & Dokter */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-bold text-gray-800 text-xs">
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            {item.poliklinik?.namaPoli || 'Poli Umum'}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                            <Stethoscope className="w-3.5 h-3.5 text-gray-400" />
                            {item.dokterTujuan?.namaLengkap || '-'}
                          </div>
                        </td>

                        {/* Waktu Registrasi */}
                        <td className="px-6 py-4 text-xs text-gray-600 font-mono">
                          <div className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {item.tanggalRegistrasi ? new Date(item.tanggalRegistrasi).toLocaleDateString('id-ID') : '-'}
                          </div>
                          <div className="text-gray-400 mt-0.5">{item.jamRegistrasi || '-'} WIB</div>
                        </td>

                        {/* Encounter ID */}
                        <td className="px-6 py-4 font-mono text-xs">
                          {encounterId ? (
                            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-none border border-blue-200 font-bold inline-block">
                              {encounterId}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Belum Diterbitkan</span>
                          )}
                        </td>

                        {/* Status Sync */}
                        <td className="px-6 py-4">
                          {isSuccess ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                            </span>
                          ) : isFailed ? (
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs font-extrabold bg-red-100 text-red-800 border border-red-200">
                                <AlertTriangle className="w-3.5 h-3.5" /> FAILED
                              </span>
                              {item.satusehat_last_error && (
                                <span className="text-[10px] text-red-600 line-clamp-1 max-w-[200px]" title={item.satusehat_last_error}>
                                  {item.satusehat_last_error}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5" /> {item.satusehat_sync_status || 'PENDING'}
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {isFailed && (
                              <button
                                onClick={() => handleRetrySync(item.id)}
                                disabled={syncRetryId === item.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-none transition-all shadow-sm disabled:opacity-50"
                                title="Sync Ulang Bundle SATUSEHAT"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${syncRetryId === item.id ? 'animate-spin' : ''}`} />
                                {syncRetryId === item.id ? 'Syncing...' : 'Sync Ulang'}
                              </button>
                            )}

                            {encounterId ? (
                              <button
                                onClick={() => handleInspectEncounter(encounterId)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-none transition-all shadow-sm"
                              >
                                <Eye className="w-3.5 h-3.5" /> Lihat Live FHIR
                              </button>
                            ) : !isFailed ? (
                              <span className="text-gray-400 text-xs italic">Menunggu Selesai</span>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal Live Inspection FHIR (Full Screen & Sharp Edges - Rounded 0) */}
      {selectedEncounterId && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col w-screen h-screen animate-in fade-in duration-150">
          <div className="bg-slate-900 text-slate-100 rounded-none w-full h-full flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 rounded-none">
              <div className="flex items-center gap-3.5">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-none border border-blue-500/20 shadow-inner">
                  <FileCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-white tracking-wide">Live FHIR Resource Inspector</h3>
                    <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded-none border border-blue-500/30">SATUSEHAT v1.0</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <span className="text-slate-500">Encounter ID:</span> 
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-none font-bold">{selectedEncounterId}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEncounterId(null)}
                className="text-slate-400 hover:text-white p-2 rounded-none hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Resource Navigation Tabs - Interactive Scrollable Bar */}
            <div className="relative flex items-center border-b border-slate-800 bg-slate-950/80 px-2 py-1">
              {/* Left Scroll Arrow Button */}
              <button
                type="button"
                onClick={() => scrollTabHeader('left')}
                className="z-10 p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 shadow-md transition-colors flex-shrink-0"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Scrollable Tab Container */}
              <div 
                ref={tabsRef}
                onWheel={(e) => {
                  if (tabsRef.current) {
                    tabsRef.current.scrollLeft += e.deltaY;
                  }
                }}
                className="flex-1 flex gap-2 overflow-x-auto py-1 px-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {[
                  { id: 'Encounter', num: '01', label: 'Encounter' },
                  { id: 'Observation', num: '02', label: 'Observation (TTV/Fisik)' },
                  { id: 'Condition', num: '03', label: 'Condition (Diagnosa)' },
                  { id: 'ClinicalImpression', num: '04', label: 'ClinicalImpression' },
                  { id: 'Goal', num: '05', label: 'Goal (Tujuan)' },
                  { id: 'MedicationStatement', num: '06', label: 'MedicationStatement' },
                  { id: 'FamilyMemberHistory', num: '07', label: 'FamilyMemberHistory' },
                  { id: 'MedicationRequest', num: '08', label: 'MedicationRequest' },
                  { id: 'Composition', num: '09', label: 'Composition' },
                  { id: 'Medication', num: '10', label: 'Medication' },
                ].map((tab) => {
                  const isActive = activeTabResource === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`px-3.5 py-2 text-xs font-bold transition-all rounded-none flex items-center gap-2 flex-shrink-0 whitespace-nowrap border ${
                        isActive 
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20' 
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-none font-mono ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {tab.num}
                      </span>
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Right Scroll Arrow Button */}
              <button
                type="button"
                onClick={() => scrollTabHeader('right')}
                className="z-10 p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 shadow-md transition-colors flex-shrink-0"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Full Screen Content) */}
            <div className="p-6 flex-1 overflow-y-auto font-mono text-xs leading-relaxed custom-scrollbar">
              {loadingDetail ? (
                <div className="py-32 text-center text-slate-400 space-y-4">
                  <div className="relative inline-flex">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-200">Mengambil Resource FHIR dari Kemenkes RI...</p>
                    <p className="text-xs text-slate-500 font-mono">GET /{activeTabResource} (Search Param Query)</p>
                  </div>
                </div>
              ) : detailError ? (
                <div className="bg-red-950/40 border border-red-800/60 p-6 rounded-none text-red-300 space-y-3 font-sans">
                  <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm">
                    <XCircle className="w-5 h-5" /> Gagal Memuat Data Resource
                  </div>
                  <p className="text-xs text-red-200/80 leading-relaxed bg-red-950/60 p-3.5 rounded-none border border-red-900/50 font-mono">{detailError}</p>
                </div>
              ) : encounterDetail ? (
                <div className="space-y-5 h-full flex flex-col">
                  {/* Quick Metadata Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 font-sans text-slate-300">
                    <div className="bg-slate-950/60 p-3.5 rounded-none border border-slate-800/80 shadow-sm">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">ResourceType</div>
                      <div className="text-sm font-black text-blue-400 mt-1">{encounterDetail.resourceType || activeTabResource}</div>
                    </div>
                    <div className="bg-slate-950/60 p-3.5 rounded-none border border-slate-800/80 shadow-sm">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total / Status</div>
                      <div className="text-sm font-black text-emerald-400 uppercase mt-1">
                        {encounterDetail.total !== undefined ? `${encounterDetail.total} Entries` : (encounterDetail.status || 'Active')}
                      </div>
                    </div>
                    <div className="bg-slate-950/60 p-3.5 rounded-none border border-slate-800/80 shadow-sm">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Search Param</div>
                      <div className="text-xs font-bold text-amber-400 truncate mt-1">encounter={selectedEncounterId}</div>
                    </div>
                    <div className="bg-slate-950/60 p-3.5 rounded-none border border-slate-800/80 shadow-sm">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">API Environment</div>
                      <div className="text-xs font-bold text-blue-300 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Sandbox Kemenkes
                      </div>
                    </div>
                  </div>

                  {/* JSON Code Editor / Viewer (Expanded Full Height) */}
                  <div className="relative flex-1 rounded-none overflow-hidden border border-slate-800 shadow-2xl flex flex-col min-h-[500px]">
                    <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                        <span className="text-xs text-slate-400 font-mono ml-2">payload.json</span>
                      </div>
                      <button
                        onClick={handleCopyJson}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-none border border-slate-700 text-xs transition-all font-bold shadow-sm"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-400" />
                        {copied ? 'Copied to Clipboard!' : 'Copy JSON'}
                      </button>
                    </div>
                    <pre className="bg-slate-950 p-5 text-emerald-400 overflow-auto flex-1 text-[12px] leading-relaxed selection:bg-blue-500 selection:text-white [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
                      {JSON.stringify(encounterDetail, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-6 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-400 font-sans">
              <span className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Source API: Sandbox SATUSEHAT Kemenkes RI
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
