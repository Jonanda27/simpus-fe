import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormReset } from 'react-hook-form';
import { Search, ShieldCheck, Loader2, UserPlus, History, Baby } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RegistrationFormData } from '../schema';
import { pasienService } from '@/services/pasien.service';
import { satusehatService } from '@/services/satusehat.service';

interface Step1Props {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
  watch: UseFormWatch<RegistrationFormData>;
  setValue: UseFormSetValue<RegistrationFormData>;
  reset: UseFormReset<RegistrationFormData>;
}

export default function Step1Identitas({ register, errors, watch, setValue, reset }: Step1Props) {
  const isBayi = watch('isBayi');
  const statusPasien = watch('statusPasien');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // By default, if nothing is selected, we assume 'Baru'
  const currentSkenario = isBayi ? 'Bayi' : (statusPasien === 'Lama' ? 'Lama' : 'Baru');

  // Ensure default state on mount if not set
  useEffect(() => {
    if (!statusPasien) {
      setValue('statusPasien', 'Baru');
    }
  }, [statusPasien, setValue]);

  const setSkenario = (type: 'Baru' | 'Lama' | 'Bayi') => {
    // Reset seluruh field terlebih dahulu agar bersih
    reset();

    // Kembalikan nilai skenario karena reset() menghapus semuanya
    if (type === 'Bayi') {
      setValue('statusPasien', 'Baru'); // Technically a new patient
      setValue('isBayi', true);
    } else {
      setValue('statusPasien', type);
      setValue('isBayi', false);
    }
  };

  const handleSearchPasienLama = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await pasienService.searchPasien(searchQuery);
      if (res.success && res.data) {
        const p = res.data;
        setValue('namaLengkap', p.namaLengkap);
        setValue('nik', p.nik);
        setValue('noRekamMedis', p.noRM);
        setValue('noIHS', p.noIHS || '');
        setValue('tempatLahir', p.tempatLahir);
        if (p.tanggalLahir) {
          setValue('tanggalLahir', new Date(p.tanggalLahir).toISOString().split('T')[0]);
        }
        setValue('jenisKelamin', p.jenisKelamin);
        setValue('agama', p.agama);
        setValue('pekerjaan', p.pekerjaan || '');
        setValue('statusPerkawinan', p.statusPerkawinan);
        setValue('kewarganegaraan', p.kewarganegaraan);
        
        // Missing fields
        setValue('noKk', p.noKk || '');
        setValue('pendidikan', p.pendidikan || '');
        setValue('golonganDarah', p.golonganDarah || '');
        setValue('rhesus', p.rhesus || '');
        
        if (p.alamat) {
          const a = p.alamat;
          setValue('alamatKtp', a.alamatKtp || '');
          setValue('alamatDomisili', a.alamatDomisili || '');
          setValue('rtRw', a.rtRw || '');
          setValue('desaKelurahan', a.desaKelurahan || '');
          setValue('kecamatan', a.kecamatan || '');
          setValue('kabupatenKota', a.kabupatenKota || '');
          setValue('provinsi', a.provinsi || '');
          setValue('kodePos', a.kodePos || '');
          setValue('titikGps', a.titikGps || '');
        }

        if (p.kontak) {
          setValue('noHp', p.kontak.noHp || '');
          setValue('email', p.kontak.email || '');
          setValue('kontakDarurat', p.kontak.kontakDarurat || '');
          setValue('hubunganKontakDarurat', p.kontak.hubunganKontakDarurat || '');
          setValue('noHpDarurat', p.kontak.noHpDarurat || '');
        }

        if (p.penjamin) {
          setValue('jenisPenjamin', p.penjamin.jenisPenjamin || 'Umum');
          setValue('noBpjs', p.penjamin.noBpjs || '');
          setValue('statusKepesertaan', p.penjamin.statusKepesertaan || '');
          setValue('faskesTingkat1', p.penjamin.faskesTingkat1 || '');
          setValue('kelasRawat', p.penjamin.kelasRawat || '');
          setValue('namaAsuransi', p.penjamin.namaAsuransi || '');
          setValue('nomorPolis', p.penjamin.nomorPolis || '');
          setValue('masaBerlakuAsuransi', p.penjamin.masaBerlakuAsuransi || '');
        }
      } else {
        alert('Pasien tidak ditemukan');
      }
    } catch (e: any) {
      alert(e.message || 'Terjadi kesalahan saat mencari pasien');
    } finally {
      setIsSearching(false);
    }
  };

  const handleValidasiSatusehat = async () => {
    const nik = watch('nik');
    if (!nik || nik.length !== 16) {
      alert("Masukkan 16 digit NIK terlebih dahulu");
      return;
    }
    
    setIsValidating(true);
    try {
      const response = await satusehatService.checkPatientNIK(nik);
      if (response.success && response.data) {
        // Generate No RM if empty
        const currentRm = watch('noRekamMedis');
        if (!currentRm) {
          setValue('noRekamMedis', 'RM-' + Math.floor(Math.random() * 1000000));
        }
        
        setValue('noIHS', response.data.ihsNumber || '');
        if (response.data.pasienName) setValue('namaLengkap', response.data.pasienName);
        if (response.data.gender) setValue('jenisKelamin', response.data.gender === 'male' ? 'Laki-laki' : 'Perempuan');
        if (response.data.birthDate) setValue('tanggalLahir', response.data.birthDate);
        
        alert("Data Kemenkes berhasil ditemukan dan diisikan otomatis!");
      }
    } catch (error: any) {
      alert(error.message || "Gagal menarik data dari SATUSEHAT");
    } finally {
      setIsValidating(false);
    }
  };

  const formatPascalCase = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    return e;
  };

  const { onChange: onNamaChange, ...namaRest } = register('namaLengkap');
  const { onChange: onTempatChange, ...tempatRest } = register('tempatLahir');
  const { onChange: onKerjaChange, ...kerjaRest } = register('pekerjaan');
  
  const { onChange: onNamaIbuChange, ...namaIbuRest } = register('namaIbu');
  const { onChange: onNamaAyahChange, ...namaAyahRest } = register('namaAyah');
  const { onChange: onJenisPersalinanChange, ...jenisPersalinanRest } = register('jenisPersalinan');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER & SCENARIO SELECTION */}
      <div className="pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tipe Pendaftaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => setSkenario('Baru')}
            className={`cursor-pointer p-4 border-2 rounded-none transition-all duration-200 ${currentSkenario === 'Baru' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-none ${currentSkenario === 'Baru' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Pasien Baru</div>
                <div className="text-xs text-gray-500 mt-1">Belum pernah berobat</div>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setSkenario('Lama')}
            className={`cursor-pointer p-4 border-2 rounded-none transition-all duration-200 ${currentSkenario === 'Lama' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-none ${currentSkenario === 'Lama' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Pasien Lama</div>
                <div className="text-xs text-gray-500 mt-1">Sudah memiliki No. RM</div>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setSkenario('Bayi')}
            className={`cursor-pointer p-4 border-2 rounded-none transition-all duration-200 ${currentSkenario === 'Bayi' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-none ${currentSkenario === 'Bayi' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Bayi Baru Lahir</div>
                <div className="text-xs text-gray-500 mt-1">Kasus belum punya NIK</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC TOP SECTION */}
      {currentSkenario === 'Lama' && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">Pencarian Data Pasien Lama</h3>
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Input 
                label="Masukkan NIK atau Nomor RM"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Contoh: 3171... atau RM-2023..." 
                maxLength={16}
              />
            </div>
            <button 
              type="button" 
              onClick={handleSearchPasienLama}
              disabled={isSearching}
              className="h-10 px-8 w-full md:w-auto bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors rounded-none"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Cari & Tarik Data
            </button>
          </div>
        </div>
      )}

      {currentSkenario === 'Bayi' && (
        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-none animate-in fade-in slide-in-from-top-2">
          <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2"><Baby className="w-5 h-5 text-blue-600" /> Data Khusus Bayi & Orang Tua</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nama Ibu *" placeholder="Nama kandung ibu" {...namaIbuRest} onChange={(e) => onNamaIbuChange(formatPascalCase(e))} error={errors.namaIbu?.message} />
            <Input label="NIK Ibu *" placeholder="16 digit NIK ibu" {...register('nikIbu')} error={errors.nikIbu?.message} />
            <Input label="Nama Ayah *" placeholder="Nama ayah kandung" {...namaAyahRest} onChange={(e) => onNamaAyahChange(formatPascalCase(e))} error={errors.namaAyah?.message} />
            <Input label="Jenis Persalinan" placeholder="Normal / Caesar..." {...jenisPersalinanRest} onChange={(e) => onJenisPersalinanChange(formatPascalCase(e))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Berat Lahir (gram)" placeholder="Misal: 3200" {...register('beratLahir')} />
              <Input label="Panjang Lahir (cm)" placeholder="Misal: 50" {...register('panjangLahir')} />
            </div>
            <Input label="Jam Lahir" type="time" {...register('jamLahir')} />
          </div>
        </div>
      )}

      {/* CORE IDENTITY FORM */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Data Identitas Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1 w-full">
              <Input label="NIK (Nomor Induk Kependudukan) *" placeholder="16 digit angka" maxLength={16} readOnly={currentSkenario === 'Lama'} className={currentSkenario === 'Lama' ? 'bg-gray-50' : ''} {...register('nik')} error={errors.nik?.message} />
            </div>
            {currentSkenario !== 'Lama' && (
              <button 
                type="button"
                onClick={handleValidasiSatusehat}
                disabled={isValidating}
                className="h-10 px-6 w-full md:w-auto bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors mt-[22px] rounded-none"
              >
                {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Validasi SATUSEHAT
              </button>
            )}
          </div>



          <Input label="Nomor KK (Opsional)" placeholder="16 digit angka" maxLength={16} readOnly={currentSkenario === 'Lama'} className={currentSkenario === 'Lama' ? 'bg-gray-50' : ''} {...register('noKk')} error={errors.noKk?.message} />
          <Input label="Nama Lengkap *" placeholder="Sesuai KTP" readOnly={currentSkenario === 'Lama'} className={currentSkenario === 'Lama' ? 'bg-gray-50' : ''} {...namaRest} onChange={(e) => onNamaChange(formatPascalCase(e))} error={errors.namaLengkap?.message} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tempat Lahir *" placeholder="Kota kelahiran" readOnly={currentSkenario === 'Lama'} className={currentSkenario === 'Lama' ? 'bg-gray-50' : ''} {...tempatRest} onChange={(e) => onTempatChange(formatPascalCase(e))} error={errors.tempatLahir?.message} />
            <Input label="Tanggal Lahir *" type="date" readOnly={currentSkenario === 'Lama'} className={currentSkenario === 'Lama' ? 'bg-gray-50' : ''} {...register('tanggalLahir')} error={errors.tanggalLahir?.message} />
          </div>
          
          <Select label="Jenis Kelamin *" disabled={currentSkenario === 'Lama'} className={currentSkenario === 'Lama' ? 'bg-gray-50 disabled:opacity-100 disabled:text-gray-900' : ''} {...register('jenisKelamin')} error={errors.jenisKelamin?.message} options={[{ label: 'Laki-laki', value: 'Laki-laki' }, { label: 'Perempuan', value: 'Perempuan' }]} />
          
          <div className="grid grid-cols-2 gap-4">
            <Select label="Golongan Darah" disabled={currentSkenario === 'Lama'} className={currentSkenario === 'Lama' ? 'bg-gray-50 disabled:opacity-100 disabled:text-gray-900' : ''} {...register('golonganDarah')} error={errors.golonganDarah?.message} options={[{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'AB', value: 'AB' }, { label: 'O', value: 'O' }]} />
            <Select label="Rhesus" disabled={currentSkenario === 'Lama'} className={currentSkenario === 'Lama' ? 'bg-gray-50 disabled:opacity-100 disabled:text-gray-900' : ''} {...register('rhesus')} error={errors.rhesus?.message} options={[{ label: 'Positif (+)', value: '+' }, { label: 'Negatif (-)', value: '-' }]} />
          </div>

          <Select label="Agama *" {...register('agama')} error={errors.agama?.message} options={[{ label: 'Islam', value: 'Islam' }, { label: 'Kristen', value: 'Kristen' }, { label: 'Katolik', value: 'Katolik' }, { label: 'Hindu', value: 'Hindu' }, { label: 'Buddha', value: 'Buddha' }, { label: 'Konghucu', value: 'Konghucu' }]} />
          
          <Input label="Nomor Rekam Medis (Otomatis) *" readOnly className="bg-gray-50 text-blue-700 font-mono" {...register('noRekamMedis')} error={errors.noRekamMedis?.message} />
          <Input label="Nomor SATUSEHAT / IHS *" readOnly className="bg-gray-50 text-blue-700 font-mono" {...register('noIHS')} error={errors.noIHS?.message} />
          <Select label="Pendidikan (Opsional)" {...register('pendidikan')} error={errors.pendidikan?.message} options={[{ label: 'Tidak Sekolah', value: 'Tidak Sekolah' }, { label: 'SD', value: 'SD' }, { label: 'SMP', value: 'SMP' }, { label: 'SMA/SMK', value: 'SMA/SMK' }, { label: 'D3', value: 'D3' }, { label: 'S1', value: 'S1' }, { label: 'S2', value: 'S2' }, { label: 'S3', value: 'S3' }]} />
          <Input label="Pekerjaan *" placeholder="Pekerjaan saat ini" {...kerjaRest} onChange={(e) => onKerjaChange(formatPascalCase(e))} error={errors.pekerjaan?.message} />
          <Select label="Status Perkawinan *" {...register('statusPerkawinan')} error={errors.statusPerkawinan?.message} options={[{ label: 'Belum Kawin', value: 'Belum Kawin' }, { label: 'Kawin', value: 'Kawin' }, { label: 'Cerai Hidup', value: 'Cerai Hidup' }, { label: 'Cerai Mati', value: 'Cerai Mati' }]} />
          <Select label="Kewarganegaraan *" {...register('kewarganegaraan')} error={errors.kewarganegaraan?.message} options={[{ label: 'WNI (Warga Negara Indonesia)', value: 'WNI' }, { label: 'WNA (Warga Negara Asing)', value: 'WNA' }]} />
        </div>
      </div>

    </div>
  );
}
