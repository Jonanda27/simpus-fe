"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Package, ArrowLeft, Loader2, Plus, X, MapPin } from 'lucide-react';
import { asetService } from '@/services/aset.service';
import { masterService } from '@/services/master.service';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';

interface SearchableSelectProps {
  options: { value: string; label: string; subLabel?: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  emptyMessage?: string;
}

function SearchableSelect({ options, value, onChange, placeholder, emptyMessage = 'Tidak ada pilihan ditemukan' }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    (opt.subLabel && opt.subLabel.toLowerCase().includes(search.toLowerCase()))
  );
  
  const selectRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
        className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white text-left flex justify-between items-center cursor-pointer"
      >
        <span className={selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-gray-400 text-[10px]">▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200 bg-gray-50 sticky top-0">
            <input
              type="text"
              placeholder="Ketik untuk menyaring..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-2 text-xs border border-gray-300 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              autoFocus
            />
          </div>
          <ul className="py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-xs text-gray-500 italic">{emptyMessage}</li>
            ) : (
              filteredOptions.map(opt => (
                <li
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer flex flex-col ${
                    value === opt.value ? 'bg-blue-50/50 font-semibold text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.subLabel && <span className="text-[10px] text-gray-400 font-normal">{opt.subLabel}</span>}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function EditAsetFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams ? searchParams.get('id') : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Master Data
  const [obatList, setObatList] = useState<any[]>([]);
  const [ruanganList, setRuanganList] = useState<any[]>([]);
  const [ruanganId, setRuanganId] = useState('');
  
  // Modal Ruangan State
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState({ namaRuangan: '', lokasi: '' });
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Modal Obat State
  const [isObatModalOpen, setIsObatModalOpen] = useState(false);
  const [newObatData, setNewObatData] = useState({
    kodeObat: '',
    namaObat: '',
    kategori: 'Obat Bebas',
    sediaan: 'Tablet',
    harga: 0,
    stok: 0,
  });
  const [isCreatingObat, setIsCreatingObat] = useState(false);


  // Form State
  const [kategori, setKategori] = useState('LOGISTIK_MEDIS');
  const [baseForm, setBaseForm] = useState({
    kodeAset: '',
    namaAset: '',
    status: 'AKTIF',
    deskripsi: '',
  });
  
  // Specific Form States
  const [logistikForm, setLogistikForm] = useState({
    subKategori: 'OBAT',
    masterObatId: '',
    nomorBatch: '',
    tanggalExpired: '',
    hargaBeli: 0,
    stok: 0,
    stokMinimum: 10,
    sediaan: 'Tablet',
    supplier: '',
    lokasiSpesifik: 'Gudang Farmasi',
  });

  const [alkesForm, setAlkesForm] = useState({
    merk: '',
    nomorSeri: '',
    tanggalPembelian: '',
    hargaPerolehan: 0,
    wajibKalibrasi: false,
    noSertifikatKalibrasi: '',
    tanggalKalibrasiTerakhir: '',
    intervalKalibrasi: 12,
    intervalMaintenance: 3,
    kondisi: 'BAIK',
  });

  const [kendaraanForm, setKendaraanForm] = useState({
    nomorPolisi: '',
    jenisKendaraan: 'AMBULANS_TRANSPORT',
    merk: '',
    nomorRangka: '',
    nomorMesin: '',
    tanggalPajak: '',
    idGps: '',
    intervalMaintenance: 6,
    pic: '',
    kondisi: 'STANDBY',
  });

  const [inventarisForm, setInventarisForm] = useState({
    subKategori: 'ELEKTRONIK',
    tanggalPembelian: '',
    nilaiBeli: 0,
    masaPakai: 5,
    pic: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch Master Data
  const fetchMasterData = async () => {
    try {
      const obatRes = await masterService.getObat();
      if (obatRes.success) {
        setObatList(obatRes.data);
      }
      
      const ruanganRes = await asetService.getRuangan();
      if (ruanganRes.success) {
        setRuanganList(ruanganRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch master data', err);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  // Load asset details if in Edit Mode
  useEffect(() => {
    if (editId) {
      const fetchAssetDetails = async () => {
        try {
          const res = await asetService.getAsetById(editId);
          if (res.success) {
            const asset = res.data;
            setKategori(asset.kategori);
            setRuanganId(asset.ruanganId || '');
            setBaseForm({
              kodeAset: asset.kodeAset,
              namaAset: asset.namaAset,
              status: asset.status,
              deskripsi: asset.deskripsi || '',
            });
            
            if ((asset.kategori === 'LOGISTIK_MEDIS' || asset.kategori === 'LOGISTIK_UMUM') && asset.logistik) {
              setLogistikForm({
                subKategori: asset.logistik.subKategori || 'OBAT',
                masterObatId: asset.logistik.masterObatId || '',
                nomorBatch: asset.logistik.nomorBatch || '',
                tanggalExpired: asset.logistik.tanggalExpired ? asset.logistik.tanggalExpired.substring(0, 10) : '',
                hargaBeli: asset.logistik.hargaBeli || 0,
                stok: asset.logistik.masterObat?.stok ?? asset.logistik.stok ?? 0,
                stokMinimum: asset.logistik.stokMinimum || 0,
                sediaan: asset.logistik.sediaan || 'Tablet',
                supplier: asset.logistik.supplier || '',
                lokasiSpesifik: asset.logistik.lokasiSpesifik || 'Gudang Farmasi',
              });
            } else if (asset.kategori === 'ALKES' && asset.alkes) {
              setAlkesForm({
                merk: asset.alkes.merk || '',
                nomorSeri: asset.alkes.nomorSeri || '',
                tanggalPembelian: asset.alkes.tanggalPembelian ? asset.alkes.tanggalPembelian.substring(0, 10) : '',
                hargaPerolehan: asset.alkes.hargaPerolehan || 0,
                wajibKalibrasi: asset.alkes.wajibKalibrasi || false,
                noSertifikatKalibrasi: asset.alkes.noSertifikatKalibrasi || '',
                tanggalKalibrasiTerakhir: asset.alkes.tanggalKalibrasiTerakhir ? asset.alkes.tanggalKalibrasiTerakhir.substring(0, 10) : '',
                intervalKalibrasi: asset.alkes.intervalKalibrasi || 12,
                intervalMaintenance: asset.alkes.intervalMaintenance || 3,
                kondisi: asset.alkes.kondisi || 'BAIK',
              });
            } else if (asset.kategori === 'KENDARAAN' && asset.kendaraan) {
              setKendaraanForm({
                nomorPolisi: asset.kendaraan.nomorPolisi || '',
                jenisKendaraan: asset.kendaraan.jenisKendaraan || 'AMBULANS_TRANSPORT',
                merk: asset.kendaraan.merk || '',
                nomorRangka: asset.kendaraan.nomorRangka || '',
                nomorMesin: asset.kendaraan.nomorMesin || '',
                tanggalPajak: asset.kendaraan.tanggalPajak ? asset.kendaraan.tanggalPajak.substring(0, 10) : '',
                idGps: asset.kendaraan.idGps || '',
                intervalMaintenance: asset.kendaraan.intervalMaintenance || 6,
                pic: asset.kendaraan.pic || '',
                kondisi: asset.kendaraan.kondisi || 'STANDBY',
              });
            } else if (asset.kategori === 'INVENTARIS' && asset.inventaris) {
              setInventarisForm({
                subKategori: asset.inventaris.subKategori || 'ELEKTRONIK',
                tanggalPembelian: asset.inventaris.tanggalPembelian ? asset.inventaris.tanggalPembelian.substring(0, 10) : '',
                nilaiBeli: asset.inventaris.nilaiBeli || 0,
                masaPakai: asset.inventaris.masaPakai || 5,
                pic: asset.inventaris.pic || '',
              });
            }
            
            if (asset.gambarUrl) {
              setPreviewUrl(asset.gambarUrl);
            }
          }
        } catch (err) {
          console.error('Failed to load asset details', err);
          Swal.fire('Error', 'Gagal memuat detail data aset', 'error');
        }
      };
      fetchAssetDetails();
    }
  }, [editId, obatList]);

  // Adjust default subCategory and values when main Category changes
  useEffect(() => {
    if (!editId) {
      if (kategori === 'LOGISTIK_MEDIS') {
        setLogistikForm(prev => ({ ...prev, subKategori: 'OBAT', lokasiSpesifik: 'Gudang Farmasi' }));
      } else if (kategori === 'LOGISTIK_UMUM') {
        setLogistikForm(prev => ({ ...prev, subKategori: 'ATK', lokasiSpesifik: 'Gudang ATK/Logistik' }));
      }
    }
  }, [kategori, editId]);

  // When master obat is selected in Logistik Medis, sync fields
  const handleObatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setLogistikForm(prev => ({ ...prev, masterObatId: selectedId }));
    
    if (selectedId) {
      const obat = obatList.find(o => o.id === selectedId);
      if (obat) {
        setBaseForm(prev => ({
          ...prev,
          namaAset: obat.namaObat,
        }));
        
        const inferredSub = obat.kategori?.toUpperCase().includes('VAKSIN') ? 'VAKSIN' : (obat.kategori?.toUpperCase().includes('BHP') ? 'BHP_MEDIS' : 'OBAT');
        const inferredStorage = inferredSub === 'VAKSIN' ? 'Gudang Vaksin / Kulkas Suhu Dingin' : 'Gudang Farmasi';

        setLogistikForm(prev => ({
          ...prev,
          masterObatId: selectedId,
          subKategori: inferredSub,
          sediaan: obat.sediaan || 'Tablet',
          hargaBeli: obat.harga || 0,
          stok: obat.stok || 0,
          lokasiSpesifik: inferredStorage,
        }));
      }
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomData.namaRuangan) return;
    
    setIsCreatingRoom(true);
    try {
      const res = await asetService.createRuangan(newRoomData);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Ruangan baru ditambahkan!', timer: 1500, showConfirmButton: false });
        setIsRoomModalOpen(false);
        setNewRoomData({ namaRuangan: '', lokasi: '' });
        
        // Refresh ruangan list and select the newly created room
        const ruanganRes = await asetService.getRuangan();
        if (ruanganRes.success) {
          setRuanganList(ruanganRes.data);
          setRuanganId(res.data.id);
        }
      }
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Gagal menambahkan ruangan', 'error');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleCreateObat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObatData.kodeObat || !newObatData.namaObat) return;

    setIsCreatingObat(true);
    try {
      const formData = new FormData();
      formData.append('kodeObat', newObatData.kodeObat);
      formData.append('namaObat', newObatData.namaObat);
      formData.append('kategori', newObatData.kategori);
      formData.append('sediaan', newObatData.sediaan);
      formData.append('harga', newObatData.harga.toString());
      formData.append('stok', newObatData.stok.toString());

      const res = await masterService.createObat(formData);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Obat baru ditambahkan ke katalog master!', timer: 1500, showConfirmButton: false });
        setIsObatModalOpen(false);
        setNewObatData({
          kodeObat: '',
          namaObat: '',
          kategori: 'Obat Bebas',
          sediaan: 'Tablet',
          harga: 0,
          stok: 0,
        });

        // Refresh obat list and auto-select the newly created obat
        const obatRes = await masterService.getObat();
        if (obatRes.success) {
          setObatList(obatRes.data);
          
          // Trigger obat selection sync
          const newObat = obatRes.data.find((o: any) => o.id === res.data.id || o.kodeObat === res.data.kodeObat);
          if (newObat) {
            setBaseForm(prev => ({
              ...prev,
              namaAset: newObat.namaObat,
            }));
            const inferredSub = newObat.kategori?.toUpperCase().includes('VAKSIN') ? 'VAKSIN' : (newObat.kategori?.toUpperCase().includes('BHP') ? 'BHP_MEDIS' : 'OBAT');
            const inferredStorage = inferredSub === 'VAKSIN' ? 'Gudang Vaksin / Kulkas Suhu Dingin' : 'Gudang Farmasi';
            
            setLogistikForm(prev => ({
              ...prev,
              masterObatId: newObat.id,
              subKategori: inferredSub,
              sediaan: newObat.sediaan || 'Tablet',
              hargaBeli: newObat.harga || 0,
              stok: newObat.stok || 0,
              lokasiSpesifik: inferredStorage,
            }));
          }
        }
      }
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Gagal menambahkan obat ke katalog master', 'error');
    } finally {
      setIsCreatingObat(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    // Append base fields
    formData.append('kodeAset', baseForm.kodeAset);
    formData.append('namaAset', baseForm.namaAset);
    formData.append('kategori', kategori);
    formData.append('status', baseForm.status);
    formData.append('deskripsi', baseForm.deskripsi);
    if (ruanganId) {
      formData.append('ruanganId', ruanganId);
    }
    
    if (imageFile) {
      formData.append('gambar', imageFile);
    }

    // Append category specific fields
    if (kategori === 'LOGISTIK_MEDIS' || kategori === 'LOGISTIK_UMUM') {
      formData.append('subKategori', logistikForm.subKategori);
      formData.append('sediaan', logistikForm.sediaan);
      formData.append('hargaBeli', logistikForm.hargaBeli.toString());
      formData.append('stok', logistikForm.stok.toString());
      formData.append('stokMinimum', logistikForm.stokMinimum.toString());
      formData.append('supplier', logistikForm.supplier);
      formData.append('lokasiSpesifik', logistikForm.lokasiSpesifik);
      
      if (kategori === 'LOGISTIK_MEDIS') {
        formData.append('nomorBatch', logistikForm.nomorBatch);
        formData.append('tanggalExpired', logistikForm.tanggalExpired);
        if (logistikForm.masterObatId) {
          formData.append('masterObatId', logistikForm.masterObatId);
        }
      }
    } else if (kategori === 'ALKES') {
      formData.append('merk', alkesForm.merk);
      formData.append('nomorSeri', alkesForm.nomorSeri);
      formData.append('tanggalPembelian', alkesForm.tanggalPembelian);
      formData.append('hargaPerolehan', alkesForm.hargaPerolehan.toString());
      formData.append('wajibKalibrasi', alkesForm.wajibKalibrasi.toString());
      formData.append('kondisi', alkesForm.kondisi);
      formData.append('intervalMaintenance', alkesForm.intervalMaintenance.toString());
      if (alkesForm.wajibKalibrasi) {
        formData.append('noSertifikatKalibrasi', alkesForm.noSertifikatKalibrasi);
        formData.append('tanggalKalibrasiTerakhir', alkesForm.tanggalKalibrasiTerakhir);
        formData.append('intervalKalibrasi', alkesForm.intervalKalibrasi.toString());
      }
    } else if (kategori === 'KENDARAAN') {
      formData.append('nomorPolisi', kendaraanForm.nomorPolisi);
      formData.append('jenisKendaraan', kendaraanForm.jenisKendaraan);
      formData.append('merk', kendaraanForm.merk);
      formData.append('nomorRangka', kendaraanForm.nomorRangka);
      formData.append('nomorMesin', kendaraanForm.nomorMesin);
      formData.append('tanggalPajak', kendaraanForm.tanggalPajak);
      formData.append('idGps', kendaraanForm.idGps);
      formData.append('intervalMaintenance', kendaraanForm.intervalMaintenance.toString());
      formData.append('pic', kendaraanForm.pic);
      formData.append('kondisi', kendaraanForm.kondisi);
    } else if (kategori === 'INVENTARIS') {
      formData.append('subKategori', inventarisForm.subKategori);
      formData.append('tanggalPembelian', inventarisForm.tanggalPembelian);
      formData.append('nilaiBeli', inventarisForm.nilaiBeli.toString());
      formData.append('masaPakai', inventarisForm.masaPakai.toString());
      formData.append('pic', inventarisForm.pic);
    }

    try {
      let res;
      if (editId && !editId.startsWith('virtual-')) {
        res = await asetService.updateAset(editId, formData);
      } else {
        res = await asetService.createAset(formData);
      }
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: editId && !editId.startsWith('virtual-') ? 'Data aset berhasil diubah!' : 'Aset baru berhasil didaftarkan!',
          timer: 2000,
          showConfirmButton: false
        });
        router.push('/admin/logistik');
      }
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Gagal menyimpan data aset', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2">
        <Link href="/admin/logistik" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Aset
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-950 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          {editId && !editId.startsWith('virtual-') ? 'Edit Data Aset' : 'Pendaftaran Aset Baru'}
        </h1>
        <p className="text-gray-500 mt-2">
          {editId && !editId.startsWith('virtual-')
            ? 'Ubah informasi detail logistik medis, logistik umum, alkes, kendaraan, atau inventaris.'
            : 'Daftarkan barang logistik medis, umum operasional, alkes, kendaraan, atau inventaris dengan formulir dinamis.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 p-6 shadow-sm">
        
        {/* Row 1: Kode, Nama, Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kode Aset / SKU <span className="text-red-500">*</span></label>
            <input
              required
              type="text"
              placeholder="Contoh: AST-2026-001"
              value={baseForm.kodeAset}
              onChange={e => setBaseForm({ ...baseForm, kodeAset: e.target.value })}
              className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kategori Aset <span className="text-red-500">*</span></label>
            <select
              value={kategori}
              onChange={e => setKategori(e.target.value)}
              disabled={!!editId && !editId.startsWith('virtual-')}
              className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer font-medium disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="LOGISTIK_MEDIS">Aset Logistik Medis (Habis Pakai)</option>
              <option value="LOGISTIK_UMUM">Aset Logistik Umum (ATK / Non-Medis)</option>
              <option value="ALKES">Alat Kesehatan (Alkes)</option>
              <option value="KENDARAAN">Kendaraan (Ambulans / Pusling)</option>
              <option value="INVENTARIS">Aset Tetap / Ruangan / Gedung</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status Awal <span className="text-red-500">*</span></label>
            <select
              value={baseForm.status}
              onChange={e => setBaseForm({ ...baseForm, status: e.target.value })}
              className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer font-medium"
            >
              <option value="AKTIF">Aktif / Berfungsi</option>
              <option value="MAINTENANCE">Sedang Maintenance</option>
              <option value="RUSAK">Rusak</option>
            </select>
          </div>
        </div>

        {/* Row 2: Nama Aset */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Aset / Barang <span className="text-red-500">*</span></label>
          <input
            required
            type="text"
            placeholder="Masukkan nama lengkap aset"
            value={baseForm.namaAset}
            onChange={e => setBaseForm({ ...baseForm, namaAset: e.target.value })}
            className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Dynamic Category Specific Form Section */}
        <div className="border-t border-b border-gray-100 py-6 my-6 bg-gray-50/50 -mx-6 px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Informasi Kategori: {kategori.replace('_', ' ')}
            </h2>
          </div>

          {/* DYNAMIC FIELDS: LOGISTIK MEDIS */}
          {kategori === 'LOGISTIK_MEDIS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Hubungkan dengan Master Obat <span className="text-gray-400 font-normal">(Opsional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsObatModalOpen(true)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Tambah Obat Ke Katalog
                  </button>
                </div>
                <SearchableSelect
                  options={obatList.map(o => ({
                    value: o.id,
                    label: `${o.namaObat} (${o.kodeObat})`,
                    subLabel: `Stok: ${o.stok} | Sediaan: ${o.sediaan || 'Tablet'}`
                  }))}
                  value={logistikForm.masterObatId}
                  onChange={(selectedId) => {
                    setLogistikForm(prev => ({ ...prev, masterObatId: selectedId }));
                    if (selectedId) {
                      const obat = obatList.find(o => o.id === selectedId);
                      if (obat) {
                        setBaseForm(prev => ({
                          ...prev,
                          namaAset: obat.namaObat,
                        }));
                        const inferredSub = obat.kategori?.toUpperCase().includes('VAKSIN') ? 'VAKSIN' : (obat.kategori?.toUpperCase().includes('BHP') ? 'BHP_MEDIS' : 'OBAT');
                        const inferredStorage = inferredSub === 'VAKSIN' ? 'Gudang Vaksin / Kulkas Suhu Dingin' : 'Gudang Farmasi';
                        setLogistikForm(prev => ({
                          ...prev,
                          masterObatId: selectedId,
                          subKategori: inferredSub,
                          sediaan: obat.sediaan || 'Tablet',
                          hargaBeli: obat.harga || 0,
                          stok: obat.stok || 0,
                          lokasiSpesifik: inferredStorage,
                        }));
                      }
                    }
                  }}
                  placeholder="-- Pilih Obat dari Farmasi (Jika Ada) --"
                />
                <p className="text-[11px] text-gray-400 mt-1">Mengaitkan akan menyinkronkan nama dan sediaan dari Farmasi.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kategori Medis <span className="text-red-500">*</span></label>
                <select
                  required
                  value={logistikForm.subKategori}
                  onChange={e => setLogistikForm({ ...logistikForm, subKategori: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="OBAT">Obat-obatan</option>
                  <option value="VAKSIN">Vaksin</option>
                  <option value="BHP_MEDIS">Bahan Habis Pakai Medis</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor Batch <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: BTH-9902A"
                  value={logistikForm.nomorBatch}
                  onChange={e => setLogistikForm({ ...logistikForm, nomorBatch: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tanggal Kedaluwarsa (Expired) <span className="text-red-500">*</span></label>
                <input
                  required
                  type="date"
                  value={logistikForm.tanggalExpired}
                  onChange={e => setLogistikForm({ ...logistikForm, tanggalExpired: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stok / Jumlah Masuk <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  value={logistikForm.stok}
                  onChange={e => setLogistikForm({ ...logistikForm, stok: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Harga Beli Satuan (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={logistikForm.hargaBeli}
                  onChange={e => setLogistikForm({ ...logistikForm, hargaBeli: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stok Minimum (Buffer Stock) <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  value={logistikForm.stokMinimum}
                  onChange={e => setLogistikForm({ ...logistikForm, stokMinimum: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bentuk Sediaan <span className="text-red-500">*</span></label>
                <select
                  required
                  value={logistikForm.sediaan}
                  onChange={e => setLogistikForm({ ...logistikForm, sediaan: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Kapsul">Kapsul</option>
                  <option value="Sirup">Sirup / Botol</option>
                  <option value="Ampul">Ampul</option>
                  <option value="Vial">Vial</option>
                  <option value="Box">Box</option>
                  <option value="Pcs">Pcs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Lokasi Penyimpanan Spesifik</label>
                <input
                  type="text"
                  placeholder="Gudang Farmasi, Suhu Kulkas, dll."
                  value={logistikForm.lokasiSpesifik}
                  onChange={e => setLogistikForm({ ...logistikForm, lokasiSpesifik: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vendor / Supplier</label>
                <input
                  type="text"
                  placeholder="Nama distributor penyuplai"
                  value={logistikForm.supplier}
                  onChange={e => setLogistikForm({ ...logistikForm, supplier: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* DYNAMIC FIELDS: LOGISTIK UMUM */}
          {kategori === 'LOGISTIK_UMUM' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kategori Logistik <span className="text-red-500">*</span></label>
                <select
                  required
                  value={logistikForm.subKategori}
                  onChange={e => setLogistikForm({ ...logistikForm, subKategori: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="ATK">Alat Tulis Kantor (ATK)</option>
                  <option value="KEBERSIHAN">Logistik Kebersihan</option>
                  <option value="CETAKAN">Barang Cetakan (Kertas Resep, dll)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Jumlah Stok <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  value={logistikForm.stok}
                  onChange={e => setLogistikForm({ ...logistikForm, stok: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Harga Beli Satuan (Rp) <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  value={logistikForm.hargaBeli}
                  onChange={e => setLogistikForm({ ...logistikForm, hargaBeli: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stok Minimum (Buffer Stock) <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  value={logistikForm.stokMinimum}
                  onChange={e => setLogistikForm({ ...logistikForm, stokMinimum: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Satuan <span className="text-red-500">*</span></label>
                <select
                  required
                  value={logistikForm.sediaan}
                  onChange={e => setLogistikForm({ ...logistikForm, sediaan: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Rim">Rim</option>
                  <option value="Botol">Botol</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Box">Box</option>
                  <option value="Pack">Pack</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vendor / Supplier</label>
                <input
                  type="text"
                  placeholder="Nama distributor penyuplai"
                  value={logistikForm.supplier}
                  onChange={e => setLogistikForm({ ...logistikForm, supplier: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* DYNAMIC FIELDS: ALKES */}
          {kategori === 'ALKES' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Merk / Tipe / Model</label>
                  <input
                    type="text"
                    placeholder="Contoh: Omron, Mindray"
                    value={alkesForm.merk}
                    onChange={e => setAlkesForm({ ...alkesForm, merk: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor Seri (Serial Number)</label>
                  <input
                    type="text"
                    placeholder="Masukkan serial number fisik"
                    value={alkesForm.nomorSeri}
                    onChange={e => setAlkesForm({ ...alkesForm, nomorSeri: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Lokasi Penempatan <span className="text-red-500">*</span></label>
                    <button
                      type="button"
                      onClick={() => setIsRoomModalOpen(true)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Tambah Ruangan
                    </button>
                  </div>
                  <SearchableSelect
                    options={ruanganList.map(r => ({
                      value: r.id,
                      label: r.namaRuangan,
                      subLabel: r.lokasi ? `Lokasi: ${r.lokasi}` : undefined
                    }))}
                    value={ruanganId}
                    onChange={(val) => setRuanganId(val)}
                    placeholder="-- Pilih Lokasi Ruangan --"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kondisi Alat <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={alkesForm.kondisi}
                    onChange={e => setAlkesForm({ ...alkesForm, kondisi: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="BAIK">Baik / Siap Pakai</option>
                    <option value="RUSAK_RINGAN">Rusak Ringan</option>
                    <option value="RUSAK_BERAT">Rusak Berat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tanggal Pembelian</label>
                  <input
                    type="date"
                    value={alkesForm.tanggalPembelian}
                    onChange={e => setAlkesForm({ ...alkesForm, tanggalPembelian: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Harga Perolehan / Nilai Beli (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={alkesForm.hargaPerolehan}
                    onChange={e => setAlkesForm({ ...alkesForm, hargaPerolehan: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Interval Pemeliharaan Rutin (Bulan)</label>
                  <input
                    type="number"
                    min="1"
                    value={alkesForm.intervalMaintenance}
                    onChange={e => setAlkesForm({ ...alkesForm, intervalMaintenance: parseInt(e.target.value) || 3 })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="wajibKalibrasi"
                    checked={alkesForm.wajibKalibrasi}
                    onChange={e => setAlkesForm({ ...alkesForm, wajibKalibrasi: e.target.checked })}
                    className="w-4.5 h-4.5 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="wajibKalibrasi" className="text-xs font-bold text-gray-700 uppercase cursor-pointer">
                    Alat ini wajib dikalibrasi secara rutin?
                  </label>
                </div>

                {alkesForm.wajibKalibrasi && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 animate-in fade-in duration-300">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">No. Sertifikat Kalibrasi Awal</label>
                      <input
                        type="text"
                        placeholder="Contoh: CERT-2026-88"
                        value={alkesForm.noSertifikatKalibrasi}
                        onChange={e => setAlkesForm({ ...alkesForm, noSertifikatKalibrasi: e.target.value })}
                        className="w-full border border-gray-300 p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tanggal Kalibrasi Terakhir</label>
                      <input
                        type="date"
                        value={alkesForm.tanggalKalibrasiTerakhir}
                        onChange={e => setAlkesForm({ ...alkesForm, tanggalKalibrasiTerakhir: e.target.value })}
                        className="w-full border border-gray-300 p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Interval Kalibrasi (Bulan)</label>
                      <input
                        type="number"
                        min="1"
                        value={alkesForm.intervalKalibrasi}
                        onChange={e => setAlkesForm({ ...alkesForm, intervalKalibrasi: parseInt(e.target.value) || 12 })}
                        className="w-full border border-gray-300 p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DYNAMIC FIELDS: KENDARAAN */}
          {kategori === 'KENDARAAN' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor Polisi (Plat Nomor) <span className="text-red-500">*</span></label>
                <input
                  required={kategori === 'KENDARAAN'}
                  type="text"
                  placeholder="Contoh: B 1234 PUS"
                  value={kendaraanForm.nomorPolisi}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, nomorPolisi: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Jenis Kendaraan <span className="text-red-500">*</span></label>
                <select
                  required={kategori === 'KENDARAAN'}
                  value={kendaraanForm.jenisKendaraan}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, jenisKendaraan: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="AMBULANS_TRANSPORT">Ambulans Transport</option>
                  <option value="AMBULANS_IGD">Ambulans Gawat Darurat (IGD)</option>
                  <option value="MOTOR_PUSLING">Motor Puskesmas Keliling (Pusling)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Merk / Tipe & Tahun Pembuatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Toyota Hiace 2023"
                  value={kendaraanForm.merk}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, merk: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor Rangka Kendaraan</label>
                <input
                  type="text"
                  placeholder="Masukkan nomor rangka STNK"
                  value={kendaraanForm.nomorRangka}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, nomorRangka: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor Mesin Kendaraan</label>
                <input
                  type="text"
                  placeholder="Masukkan nomor mesin fisik"
                  value={kendaraanForm.nomorMesin}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, nomorMesin: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tanggal Jatuh Tempo Pajak</label>
                <input
                  type="date"
                  value={kendaraanForm.tanggalPajak}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, tanggalPajak: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">ID GPS Tracker <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <input
                  type="text"
                  placeholder="ID perangkat pelacak GPS"
                  value={kendaraanForm.idGps}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, idGps: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Interval Rutin Maintenance (Bulan)</label>
                <input
                  required={kategori === 'KENDARAAN'}
                  type="number"
                  min="1"
                  value={kendaraanForm.intervalMaintenance}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, intervalMaintenance: parseInt(e.target.value) || 6 })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pegawai PIC / Supir Utama</label>
                <input
                  type="text"
                  placeholder="Nama supir penanggung jawab"
                  value={kendaraanForm.pic}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, pic: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kondisi Kendaraan <span className="text-red-500">*</span></label>
                <select
                  required={kategori === 'KENDARAAN'}
                  value={kendaraanForm.kondisi}
                  onChange={e => setKendaraanForm({ ...kendaraanForm, kondisi: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="STANDBY">Standby / Siap Digunakan</option>
                  <option value="BERTUGAS">Sedang Bertugas / Jalan</option>
                  <option value="BENGKEL">Masuk Bengkel</option>
                </select>
              </div>
            </div>
          )}

          {/* DYNAMIC FIELDS: INVENTARIS */}
          {kategori === 'INVENTARIS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kategori Inventaris <span className="text-red-500">*</span></label>
                <select
                  required
                  value={inventarisForm.subKategori}
                  onChange={e => setInventarisForm({ ...inventarisForm, subKategori: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="ELEKTRONIK">Elektronik (Komputer, AC, dll)</option>
                  <option value="MEBEL">Mebel / Furnitur (Meja, Kursi)</option>
                  <option value="BANGUNAN">Bangunan / Gedung Fisik</option>
                  <option value="MESIN">Mesin Operasional Gedung</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase">Lokasi Penempatan <span className="text-red-500">*</span></label>
                  <button
                    type="button"
                    onClick={() => setIsRoomModalOpen(true)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Tambah Ruangan
                  </button>
                </div>
                <SearchableSelect
                  options={ruanganList.map(r => ({
                    value: r.id,
                    label: r.namaRuangan,
                    subLabel: r.lokasi ? `Lokasi: ${r.lokasi}` : undefined
                  }))}
                  value={ruanganId}
                  onChange={(val) => setRuanganId(val)}
                  placeholder="-- Pilih Lokasi Ruangan --"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Harga Beli / Nilai Aset (Rp) <span className="text-red-500">*</span></label>
                <input
                  required={kategori === 'INVENTARIS'}
                  type="number"
                  min="0"
                  value={inventarisForm.nilaiBeli}
                  onChange={e => setInventarisForm({ ...inventarisForm, nilaiBeli: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tanggal Pembelian <span className="text-red-500">*</span></label>
                <input
                  required={kategori === 'INVENTARIS'}
                  type="date"
                  value={inventarisForm.tanggalPembelian}
                  onChange={e => setInventarisForm({ ...inventarisForm, tanggalPembelian: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Umur Ekonomis / Masa Pakai (Tahun) <span className="text-red-500">*</span></label>
                <input
                  required={kategori === 'INVENTARIS'}
                  type="number"
                  min="1"
                  value={inventarisForm.masaPakai}
                  onChange={e => setInventarisForm({ ...inventarisForm, masaPakai: parseInt(e.target.value) || 5 })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Staf Penanggung Jawab (PIC)</label>
                <input
                  type="text"
                  placeholder="Nama staf PIC penanggung jawab"
                  value={inventarisForm.pic}
                  onChange={e => setInventarisForm({ ...inventarisForm, pic: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Row 4: Deskripsi & Gambar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Deskripsi Aset / Keterangan</label>
            <textarea
              placeholder="Masukkan spesifikasi barang, nomor inventaris internal puskesmas, atau keterangan tambahan"
              value={baseForm.deskripsi}
              onChange={e => setBaseForm({ ...baseForm, deskripsi: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gambar / Foto Fisik Aset</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="w-full border border-gray-300 p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white file:mr-4 file:py-1 file:px-3 file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {previewUrl && (
              <div className="mt-3 w-28 h-28 border border-gray-200 bg-gray-50 flex items-center justify-center p-1">
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Submit / Action Buttons */}
        <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-200">
          <Link href="/admin/logistik" className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-bold transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {editId && !editId.startsWith('virtual-') ? 'Simpan Perubahan' : 'Daftarkan Aset'}
          </button>
        </div>
      </form>

      {/* MODAL: TAMBAH RUANGAN BARU */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm" onClick={() => setIsRoomModalOpen(false)}></div>
          <div className="relative bg-white shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Tambah Master Ruangan</h3>
              <button onClick={() => setIsRoomModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Ruangan <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Poli Umum, Ruang IGD, Gudang Farmasi"
                  value={newRoomData.namaRuangan}
                  onChange={e => setNewRoomData({ ...newRoomData, namaRuangan: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Lokasi / Lantai</label>
                <input
                  type="text"
                  placeholder="Contoh: Lantai 1, Gedung B"
                  value={newRoomData.lokasi}
                  onChange={e => setNewRoomData({ ...newRoomData, lokasi: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingRoom}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {isCreatingRoom && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Simpan Ruangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH MASTER OBAT BARU */}
      {isObatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm" onClick={() => setIsObatModalOpen(false)}></div>
          <div className="relative bg-white shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Tambah Master Obat & BHP</h3>
              <button onClick={() => setIsObatModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateObat} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kode Obat <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: KOD-9820, PCT-500"
                  value={newObatData.kodeObat}
                  onChange={e => setNewObatData({ ...newObatData, kodeObat: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Obat / Barang <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Paracetamol 500mg, Spuit 3cc"
                  value={newObatData.namaObat}
                  onChange={e => setNewObatData({ ...newObatData, namaObat: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kategori <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={newObatData.kategori}
                    onChange={e => setNewObatData({ ...newObatData, kategori: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="Obat Bebas">Obat Bebas</option>
                    <option value="Obat Keras">Obat Keras</option>
                    <option value="Obat Bebas Terbatas">Obat Bebas Terbatas</option>
                    <option value="Narkotika">Narkotika</option>
                    <option value="Psikotropika">Psikotropika</option>
                    <option value="Vaksin">Vaksin</option>
                    <option value="BHP Medis">BHP Medis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sediaan <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={newObatData.sediaan}
                    onChange={e => setNewObatData({ ...newObatData, sediaan: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Kapsul">Kapsul</option>
                    <option value="Sirup">Sirup</option>
                    <option value="Ampul">Ampul</option>
                    <option value="Vial">Vial</option>
                    <option value="Box">Box</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Harga Beli Dasar (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={newObatData.harga}
                    onChange={e => setNewObatData({ ...newObatData, harga: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stok Awal</label>
                  <input
                    type="number"
                    min="0"
                    value={newObatData.stok}
                    onChange={e => setNewObatData({ ...newObatData, stok: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsObatModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingObat}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {isCreatingObat && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Simpan Obat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AddAsetPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <EditAsetFormContent />
    </Suspense>
  );
}
