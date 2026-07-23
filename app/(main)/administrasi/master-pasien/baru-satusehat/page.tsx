'use client';

import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, ArrowLeft, Baby, User, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { pasienService } from '@/services/pasien.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PendaftaranSatusehatPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBayi, setIsBayi] = useState(false);
  const [isValidatingNik, setIsValidatingNik] = useState(false);
  const [validationMessage, setValidationMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [formData, setFormData] = useState({
    nik: '',
    nikIbu: '',
    namaIbu: '',
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    agama: 'Islam',
    kewarganegaraan: 'WNI',
    statusPerkawinan: 'Belum Kawin',
    pekerjaan: '',
    noHp: '',
    alamatLengkap: '',
    provinsi: '',
    kabupatenKota: '',
    kecamatan: '',
    desaKelurahan: '',
    kodePos: '',
    rtRw: '',
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);
  
  const API_BASE = 'https://ibnux.github.io/data-indonesia';

  useEffect(() => {
    fetch(`${API_BASE}/provinsi.json`)
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (formData.provinsi) {
      const prov = provinces.find(p => p.nama === formData.provinsi);
      if (prov) {
        fetch(`${API_BASE}/kabupaten/${prov.id}.json`)
          .then(res => res.json())
          .then(data => {
            setRegencies(data);
            if (formData.kabupatenKota && !data.find((d: any) => d.nama === formData.kabupatenKota)) {
              setFormData(prev => ({ ...prev, kabupatenKota: '', kecamatan: '', desaKelurahan: '' }));
            }
          })
          .catch(err => console.error(err));
      }
    } else {
      setRegencies([]);
    }
  }, [formData.provinsi, provinces, formData.kabupatenKota]);

  useEffect(() => {
    if (formData.kabupatenKota) {
      const reg = regencies.find(r => r.nama === formData.kabupatenKota);
      if (reg) {
        fetch(`${API_BASE}/kecamatan/${reg.id}.json`)
          .then(res => res.json())
          .then(data => {
            setDistricts(data);
            if (formData.kecamatan && !data.find((d: any) => d.nama === formData.kecamatan)) {
              setFormData(prev => ({ ...prev, kecamatan: '', desaKelurahan: '' }));
            }
          })
          .catch(err => console.error(err));
      }
    } else {
      setDistricts([]);
    }
  }, [formData.kabupatenKota, regencies, formData.kecamatan]);

  useEffect(() => {
    if (formData.kecamatan) {
      const dist = districts.find(d => d.nama === formData.kecamatan);
      if (dist) {
        fetch(`${API_BASE}/kelurahan/${dist.id}.json`)
          .then(res => res.json())
          .then(data => {
            setVillages(data);
            if (formData.desaKelurahan && !data.find((d: any) => d.nama === formData.desaKelurahan)) {
              setFormData(prev => ({ ...prev, desaKelurahan: '' }));
            }
          })
          .catch(err => console.error(err));
      }
    } else {
      setVillages([]);
    }
  }, [formData.kecamatan, districts, formData.desaKelurahan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckNikIbu = async () => {
    if (formData.nikIbu.length !== 16) {
      setValidationMessage({ type: 'error', text: 'NIK Ibu harus 16 digit' });
      return;
    }
    setIsValidatingNik(true);
    setValidationMessage(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/satusehat/pasien/nik/${formData.nikIbu}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setValidationMessage({ type: 'success', text: `Tervalidasi (IHS: ${data.data.ihsNumber})` });
        let updates: any = {};
        // 1. Coba Autofill dari Database Lokal Klinik (Jika Ibu Kandung sudah pernah berobat)
        if (data.data.localPasien) {
          const lp = data.data.localPasien;
          if (lp.namaLengkap) updates.namaIbu = lp.namaLengkap;
          if (lp.pekerjaan && lp.pekerjaan !== '-') updates.pekerjaan = lp.pekerjaan;
          
          if (lp.kontak) {
            if (lp.kontak.noHp && lp.kontak.noHp !== '-') updates.noHp = lp.kontak.noHp;
          }
          
          if (lp.alamat) {
            if (lp.alamat.alamatKtp) updates.alamatLengkap = lp.alamat.alamatKtp;
            if (lp.alamat.rtRw && lp.alamat.rtRw !== '00/00') updates.rtRw = lp.alamat.rtRw;
            if (lp.alamat.kodePos) updates.kodePos = lp.alamat.kodePos;
            if (lp.alamat.provinsi) updates.provinsi = lp.alamat.provinsi;
            if (lp.alamat.kabupatenKota) updates.kabupatenKota = lp.alamat.kabupatenKota;
            if (lp.alamat.kecamatan) updates.kecamatan = lp.alamat.kecamatan;
            if (lp.alamat.desaKelurahan) updates.desaKelurahan = lp.alamat.desaKelurahan;
          }
        } else {
          // 2. Fallback: Autofill dari data SATUSEHAT Kemenkes (Seringkali kosong jika menggunakan NIK Testing Sandbox)
          if (data.data.pasienName) updates.namaIbu = data.data.pasienName;
          
          if (data.data.telecom && data.data.telecom.length > 0) {
            const hp = data.data.telecom.find((t: any) => t.system === 'phone');
            if (hp) updates.noHp = hp.value;
          }

          if (data.data.address && data.data.address.length > 0) {
            const addr = data.data.address[0];
            if (addr.line && addr.line.length > 0) {
              const cleanLine = addr.line[0].split(/RT\/RW|Kel\.|Kec\./i)[0].trim();
              updates.alamatLengkap = cleanLine || addr.line[0];
            }
            if (addr.postalCode) updates.kodePos = addr.postalCode;
            
            if (addr.extension) {
              const adminCodeExt = addr.extension.find((e: any) => e.url === "https://fhir.kemkes.go.id/r4/StructureDefinition/administrativeCode");
              if (adminCodeExt && adminCodeExt.extension) {
                 const rtNode = adminCodeExt.extension.find((e: any) => e.url === "rt");
                 const rwNode = adminCodeExt.extension.find((e: any) => e.url === "rw");
                 if (rtNode || rwNode) {
                   updates.rtRw = `${rtNode?.valueCode || '001'}/${rwNode?.valueCode || '001'}`;
                 }
              }
            }
          }
        }
        
        if (Object.keys(updates).length > 0) {
          setFormData(prev => ({ ...prev, ...updates }));
        }
      } else {
        setValidationMessage({ type: 'error', text: data.message || 'NIK Ibu tidak ditemukan di SATUSEHAT' });
      }
    } catch (err) {
      setValidationMessage({ type: 'error', text: 'Gagal menghubungi server SATUSEHAT' });
    } finally {
      setIsValidatingNik(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const prov = provinces.find(p => p.nama === formData.provinsi);
      const reg = regencies.find(r => r.nama === formData.kabupatenKota);
      const dist = districts.find(d => d.nama === formData.kecamatan);
      const vil = villages.find(v => v.nama === formData.desaKelurahan);

      const [rt, rw] = formData.rtRw.includes('/') ? formData.rtRw.split('/') : [formData.rtRw, formData.rtRw];

      const payload = {
        ...formData,
        isBayi,
        nik: isBayi ? `${formData.nikIbu.substring(0, 12)}0001` : formData.nik, 
        noRekamMedis: 'RM-' + Math.floor(Math.random() * 1000000), 
        alamatKtp: formData.alamatLengkap,
        alamatDomisili: formData.alamatLengkap,
        rtRw: formData.rtRw || '00/00',
        kodeProvinsi: prov?.id || '',
        kodeKabupaten: reg?.id || '',
        kodeKecamatan: dist?.id || '',
        kodeDesa: vil?.id || '',
        rt: rt || '001',
        rw: rw || '001',
        kontakDarurat: '-',
        hubunganKontakDarurat: '-',
        noHpDarurat: '-',
        golonganDarah: '-',
        rhesus: '-',
        jenisPenjamin: 'Umum',
      };

      await pasienService.register(payload as any);
      alert('Pasien berhasil didaftarkan ke Sistem dan SATUSEHAT!');
      router.push('/administrasi/master-pasien');
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat menyimpan pasien');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:h-20 gap-4">
            <div className="flex items-center gap-4">
              <Link href="/administrasi/master-pasien" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-none transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-blue-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">Pendaftaran Pasien SATUSEHAT</h1>
                  <p className="text-sm text-slate-500">Registrasi terintegrasi langsung dengan Kemenkes RI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Toggle Mode */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div 
            onClick={() => setIsBayi(false)}
            className={`cursor-pointer p-5 rounded-none border-2 transition-all duration-200 ${!isBayi ? 'border-blue-500 bg-blue-50 shadow-md transform -translate-y-1' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}`}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-3 rounded-none ${!isBayi ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${!isBayi ? 'text-blue-900' : 'text-slate-700'}`}>Pasien Dewasa</h3>
                <p className="text-sm text-slate-500 mt-0.5">Sudah memiliki NIK KTP / KK</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => { setIsBayi(true); setValidationMessage(null); }}
            className={`cursor-pointer p-5 rounded-none border-2 transition-all duration-200 ${isBayi ? 'border-amber-500 bg-amber-50 shadow-md transform -translate-y-1' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}`}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-3 rounded-none ${isBayi ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isBayi ? 'text-amber-900' : 'text-slate-700'}`}>Bayi Baru Lahir</h3>
                <p className="text-sm text-slate-500 mt-0.5">Menumpang NIK Ibu Kandung</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Identitas */}
            <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <span className="w-8 h-8 rounded-none bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                  Data Identitas
                </h2>
              </div>
              <div className="p-6 space-y-6">
                
                {isBayi ? (
                  <>
                    <div className="space-y-5 p-5 bg-white border border-slate-200 shadow-sm rounded-none mb-6">
                      <h3 className="font-bold text-slate-700 border-b border-slate-100 pb-2">Data Ibu Kandung (Wali)</h3>
                      <div className="flex flex-col relative">
                        <Input label="NIK Ibu Kandung (16 Digit) *" name="nikIbu" value={formData.nikIbu} onChange={handleChange} required maxLength={16} minLength={16} />
                        <button 
                          type="button" 
                          onClick={handleCheckNikIbu}
                          disabled={isValidatingNik || formData.nikIbu.length !== 16}
                          className="absolute right-0 bottom-0 mb-0 px-4 py-[9px] bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 text-sm rounded-none transition-colors shadow-sm"
                        >
                          {isValidatingNik ? 'Mengecek...' : 'Cek SATUSEHAT'}
                        </button>
                      </div>
                      {validationMessage && (
                        <div className={`flex items-start gap-2 p-3 rounded-none text-sm ${validationMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                          {validationMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                          <span className="font-medium leading-relaxed">{validationMessage.text}</span>
                        </div>
                      )}
                      <Input label="Nama Ibu Kandung *" name="namaIbu" value={formData.namaIbu} onChange={handleChange} required />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                        <Input label="No Handphone Orang Tua *" name="noHp" value={formData.noHp} onChange={handleChange} required />
                        <Input label="Pekerjaan Orang Tua *" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} required />
                      </div>
                    </div>

                    <div className="space-y-5 p-5 bg-blue-50/50 border border-blue-200 shadow-sm rounded-none">
                      <h3 className="font-bold text-blue-900 border-b border-blue-100 pb-2">Data Fisik Bayi Baru Lahir</h3>
                      <Input label="Nama Bayi *" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} required />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input label="Tempat Lahir *" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required />
                        <Input label="Tanggal Lahir *" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={handleChange} required />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Select 
                          label="Jenis Kelamin *" 
                          name="jenisKelamin" 
                          value={formData.jenisKelamin} 
                          onChange={handleChange} 
                          options={[
                            { label: 'Pilih...', value: '' },
                            { label: 'Laki-laki', value: 'Laki-laki' },
                            { label: 'Perempuan', value: 'Perempuan' }
                          ]} 
                          required 
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Input label="NIK (16 Digit) *" name="nik" value={formData.nik} onChange={handleChange} required maxLength={16} minLength={16} />
                    <Input label="Nama Lengkap Pasien *" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} required />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="Tempat Lahir *" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required />
                      <Input label="Tanggal Lahir *" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={handleChange} required />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Select 
                        label="Jenis Kelamin *" 
                        name="jenisKelamin" 
                        value={formData.jenisKelamin} 
                        onChange={handleChange} 
                        options={[
                          { label: 'Pilih...', value: '' },
                          { label: 'Laki-laki', value: 'Laki-laki' },
                          { label: 'Perempuan', value: 'Perempuan' }
                        ]} 
                        required 
                      />
                      <Select 
                        label="Status Perkawinan *" 
                        name="statusPerkawinan" 
                        value={formData.statusPerkawinan} 
                        onChange={handleChange} 
                        options={[
                          { label: 'Belum Kawin', value: 'Belum Kawin' }, 
                          { label: 'Kawin', value: 'Kawin' }, 
                          { label: 'Cerai Hidup', value: 'Cerai Hidup' }, 
                          { label: 'Cerai Mati', value: 'Cerai Mati' }
                        ]} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="No Handphone *" name="noHp" value={formData.noHp} onChange={handleChange} required />
                      <Input label="Pekerjaan *" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} required />
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* Right Column: Alamat */}
            <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <span className="w-8 h-8 rounded-none bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
                  Alamat Lengkap & Wilayah
                </h2>
              </div>
              <div className="p-6 space-y-6 flex-grow">
                
                <Input label="Alamat Jalan *" name="alamatLengkap" value={formData.alamatLengkap} onChange={handleChange} required placeholder="Contoh: Jl. Sudirman No 1" />
                
                <div className="grid grid-cols-2 gap-5">
                  <Input label="RT/RW *" name="rtRw" value={formData.rtRw} onChange={handleChange} required placeholder="Contoh: 001/002" />
                  <Input label="Kode Pos *" name="kodePos" value={formData.kodePos} onChange={handleChange} required placeholder="Contoh: 12345" />
                </div>
                
                <div className="space-y-5">
                  <Select 
                    label="Provinsi *" 
                    name="provinsi" 
                    value={formData.provinsi} 
                    onChange={handleChange} 
                    options={[{ label: 'Pilih Provinsi...', value: '' }, ...provinces.map(p => ({ label: p.nama, value: p.nama }))]} 
                    required 
                  />
                  <Select 
                    label="Kabupaten / Kota *" 
                    name="kabupatenKota" 
                    value={formData.kabupatenKota} 
                    onChange={handleChange} 
                    options={[{ label: 'Pilih Kabupaten/Kota...', value: '' }, ...regencies.map(r => ({ label: r.nama, value: r.nama }))]} 
                    required 
                    disabled={!formData.provinsi}
                  />
                  <Select 
                    label="Kecamatan *" 
                    name="kecamatan" 
                    value={formData.kecamatan} 
                    onChange={handleChange} 
                    options={[{ label: 'Pilih Kecamatan...', value: '' }, ...districts.map(d => ({ label: d.nama, value: d.nama }))]} 
                    required 
                    disabled={!formData.kabupatenKota}
                  />
                  <Select 
                    label="Desa / Kelurahan *" 
                    name="desaKelurahan" 
                    value={formData.desaKelurahan} 
                    onChange={handleChange} 
                    options={[{ label: 'Pilih Kelurahan/Desa...', value: '' }, ...villages.map(v => ({ label: v.nama, value: v.nama }))]} 
                    required 
                    disabled={!formData.kecamatan}
                  />
                </div>

              </div>
              
              {/* Action Button inside the Right Column Card */}
              <div className="px-6 py-5 border-t border-slate-200 bg-slate-100 flex flex-col sm:flex-row justify-end items-center gap-4">
                <p className="text-xs text-slate-500 text-right">
                  Pastikan semua data sudah benar<br/>sebelum mengirim ke Kemenkes
                </p>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-none font-bold text-sm transition-all disabled:opacity-70 shadow-sm"
                >
                  {isSubmitting ? 'Menyimpan...' : (
                    <>
                      <Save className="w-5 h-5" />
                      Simpan Pendaftaran
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>


        </form>
      </div>
    </div>
  );
}
