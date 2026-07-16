"use client";

import React, { useState } from 'react';
import { Printer, Save } from 'lucide-react';

export default function SuratSakitPage() {
  const [formData, setFormData] = useState({
    namaPasien: '',
    umur: '',
    pekerjaan: '',
    alamat: '',
    lamaIstirahat: '1',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date().toISOString().split('T')[0],
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto flex gap-6">
        
        {/* Panel Form Editor (Sembunyi saat print) */}
        <div className="w-1/3 bg-white p-6 shadow-sm border border-gray-200 print:hidden">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Form Surat Sakit</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nama Pasien</label>
              <input type="text" className="w-full border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                value={formData.namaPasien} onChange={e => setFormData({...formData, namaPasien: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Umur (Tahun)</label>
              <input type="text" className="w-full border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                value={formData.umur} onChange={e => setFormData({...formData, umur: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Pekerjaan</label>
              <input type="text" className="w-full border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                value={formData.pekerjaan} onChange={e => setFormData({...formData, pekerjaan: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Alamat</label>
              <textarea className="w-full border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" rows={3}
                value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lama Istirahat (Hari)</label>
                <input type="number" className="w-full border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                  value={formData.lamaIstirahat} onChange={e => setFormData({...formData, lamaIstirahat: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dari Tanggal</label>
                <input type="date" className="w-full border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                  value={formData.tanggalMulai} onChange={e => setFormData({...formData, tanggalMulai: e.target.value})} />
              </div>
            </div>
            
            <button onClick={handlePrint} className="w-full bg-blue-600 text-white font-bold py-2 mt-4 flex items-center justify-center gap-2 hover:bg-blue-700">
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
            <h2 className="text-xl font-bold text-gray-900 underline underline-offset-4 mb-1">SURAT KETERANGAN SAKIT</h2>
            <p className="text-sm text-gray-800">Nomor: SKS/{new Date().getFullYear()}/{(new Date().getMonth()+1).toString().padStart(2, '0')}/001</p>
          </div>

          {/* Isi Surat */}
          <div className="text-base text-gray-900 leading-relaxed space-y-6">
            <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
            
            <table className="w-full ml-4">
              <tbody>
                <tr>
                  <td className="w-1/4 py-1">Nama</td>
                  <td className="w-4 py-1">:</td>
                  <td className="font-bold">{formData.namaPasien || '...................................................'}</td>
                </tr>
                <tr>
                  <td className="py-1">Umur</td>
                  <td className="py-1">:</td>
                  <td>{formData.umur ? `${formData.umur} Tahun` : '...................................................'}</td>
                </tr>
                <tr>
                  <td className="py-1">Pekerjaan</td>
                  <td className="py-1">:</td>
                  <td>{formData.pekerjaan || '...................................................'}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Alamat</td>
                  <td className="py-1 align-top">:</td>
                  <td>{formData.alamat || '...................................................'}</td>
                </tr>
              </tbody>
            </table>

            <p className="text-justify">
              Berdasarkan hasil pemeriksaan medis, pasien tersebut di atas dinyatakan <strong>SAKIT</strong> dan memerlukan istirahat selama <strong>{formData.lamaIstirahat} ({formData.lamaIstirahat ? Number(formData.lamaIstirahat).toLocaleString('id-ID') : '...'})</strong> hari, 
              terhitung mulai tanggal <strong>{formData.tanggalMulai ? new Date(formData.tanggalMulai).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}) : '..................'}</strong> s/d <strong>{formData.tanggalSelesai ? new Date(formData.tanggalSelesai).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}) : '..................'}</strong>.
            </p>

            <p>Demikian surat keterangan ini dibuat untuk diketahui dan dapat dipergunakan sebagaimana mestinya.</p>
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
