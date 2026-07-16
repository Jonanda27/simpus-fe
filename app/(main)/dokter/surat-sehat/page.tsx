"use client";

import React, { useState } from 'react';
import { Printer } from 'lucide-react';

export default function SuratSehatPage() {
  const [formData, setFormData] = useState({
    namaPasien: '',
    umur: '',
    jenisKelamin: 'Laki-laki',
    pekerjaan: '',
    alamat: '',
    tinggiBadan: '',
    beratBadan: '',
    golonganDarah: '',
    tekananDarah: '',
    keperluan: '',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto flex gap-6">
        
        {/* Panel Form Editor (Sembunyi saat print) */}
        <div className="w-1/3 bg-white p-6 shadow-sm border border-gray-200 print:hidden h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Form Surat Sehat</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nama Pasien</label>
              <input type="text" className="w-full border border-gray-300 p-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" 
                value={formData.namaPasien} onChange={e => setFormData({...formData, namaPasien: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Umur</label>
                <input type="text" className="w-full border border-gray-300 p-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" 
                  value={formData.umur} onChange={e => setFormData({...formData, umur: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Jenis Kelamin</label>
                <select className="w-full border border-gray-300 p-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white" 
                  value={formData.jenisKelamin} onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}>
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Alamat</label>
              <textarea className="w-full border border-gray-300 p-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" rows={2}
                value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tinggi Badan (cm)</label>
                <input type="text" className="w-full border border-gray-300 p-2 text-sm outline-none" 
                  value={formData.tinggiBadan} onChange={e => setFormData({...formData, tinggiBadan: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Berat Badan (kg)</label>
                <input type="text" className="w-full border border-gray-300 p-2 text-sm outline-none" 
                  value={formData.beratBadan} onChange={e => setFormData({...formData, beratBadan: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Golongan Darah</label>
                <input type="text" className="w-full border border-gray-300 p-2 text-sm outline-none" 
                  value={formData.golonganDarah} onChange={e => setFormData({...formData, golonganDarah: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tekanan Darah</label>
                <input type="text" placeholder="120/80" className="w-full border border-gray-300 p-2 text-sm outline-none" 
                  value={formData.tekananDarah} onChange={e => setFormData({...formData, tekananDarah: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Keperluan</label>
              <input type="text" placeholder="Melamar Pekerjaan" className="w-full border border-gray-300 p-2 text-sm focus:border-green-500 outline-none" 
                value={formData.keperluan} onChange={e => setFormData({...formData, keperluan: e.target.value})} />
            </div>
            
            <button onClick={handlePrint} className="w-full bg-green-600 text-white font-bold py-2 mt-4 flex items-center justify-center gap-2 hover:bg-green-700">
              <Printer className="w-4 h-4" /> Cetak Surat
            </button>
          </div>
        </div>

        {/* Panel Kertas Surat (Print Area) */}
        <div className="w-2/3 bg-white shadow-lg p-12 min-h-[297mm] print:w-full print:shadow-none print:p-0 print:m-0 text-gray-900">
          {/* Kop Surat */}
          <div className="border-b-4 border-double border-gray-900 pb-4 mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide uppercase">Klinik Kesehatan Prima</h1>
            <p className="text-sm text-gray-700">Jl. Jendral Sudirman No. 123, Jakarta Pusat</p>
            <p className="text-sm text-gray-700">Telp: (021) 1234567 | Email: info@klinikprima.com</p>
          </div>

          {/* Judul Surat */}
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-gray-900 underline underline-offset-4 mb-1">SURAT KETERANGAN SEHAT</h2>
            <p className="text-sm text-gray-800">Nomor: SKSH/{new Date().getFullYear()}/{(new Date().getMonth()+1).toString().padStart(2, '0')}/002</p>
          </div>

          {/* Isi Surat */}
          <div className="text-base text-gray-900 leading-relaxed space-y-6">
            <p>Yang bertanda tangan di bawah ini, Dokter Pemeriksa pada Klinik Kesehatan Prima menerangkan bahwa:</p>
            
            <table className="w-full ml-4">
              <tbody>
                <tr>
                  <td className="w-1/4 py-1">Nama Lengkap</td>
                  <td className="w-4 py-1">:</td>
                  <td className="font-bold">{formData.namaPasien || '...................................................'}</td>
                </tr>
                <tr>
                  <td className="py-1">Umur</td>
                  <td className="py-1">:</td>
                  <td>{formData.umur ? `${formData.umur} Tahun` : '...................................................'}</td>
                </tr>
                <tr>
                  <td className="py-1">Jenis Kelamin</td>
                  <td className="py-1">:</td>
                  <td>{formData.jenisKelamin}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Alamat</td>
                  <td className="py-1 align-top">:</td>
                  <td>{formData.alamat || '.........................................................................'}</td>
                </tr>
              </tbody>
            </table>

            <p className="text-justify">
              Berdasarkan hasil pemeriksaan fisik yang telah dilakukan pada hari ini, pasien tersebut di atas dinyatakan dalam keadaan <strong>SEHAT / TIDAK SEHAT</strong> (*) dengan hasil pemeriksaan sebagai berikut:
            </p>

            <table className="w-3/4 ml-4">
              <tbody>
                <tr>
                  <td className="w-1/2 py-1">Tinggi Badan</td>
                  <td className="w-4 py-1">:</td>
                  <td>{formData.tinggiBadan ? `${formData.tinggiBadan} cm` : '......... cm'}</td>
                </tr>
                <tr>
                  <td className="py-1">Berat Badan</td>
                  <td className="py-1">:</td>
                  <td>{formData.beratBadan ? `${formData.beratBadan} kg` : '......... kg'}</td>
                </tr>
                <tr>
                  <td className="py-1">Golongan Darah</td>
                  <td className="py-1">:</td>
                  <td>{formData.golonganDarah || '.........'}</td>
                </tr>
                <tr>
                  <td className="py-1">Tekanan Darah</td>
                  <td className="py-1">:</td>
                  <td>{formData.tekananDarah ? `${formData.tekananDarah} mmHg` : '......... mmHg'}</td>
                </tr>
              </tbody>
            </table>
            
            <p className="text-sm italic text-gray-600 mt-2">* Coret yang tidak perlu</p>

            <p className="text-justify">
              Surat keterangan ini diberikan untuk keperluan: <strong>{formData.keperluan || '........................................................................'}</strong>
            </p>
            <p>Demikian surat keterangan sehat ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
          </div>

          {/* Tanda Tangan */}
          <div className="mt-16 flex justify-end text-gray-900 text-center">
            <div>
              <p className="mb-16">Jakarta, {new Date().toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}<br/>Dokter Pemeriksa,</p>
              <p className="font-bold underline underline-offset-4">dr. Nama Dokter Anda</p>
              <p className="text-sm mt-1">SIP. 123.456.789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
