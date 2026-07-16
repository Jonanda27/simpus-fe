"use client";

import React, { useState } from 'react';
import { Printer } from 'lucide-react';

export default function SuratRujukanPage() {
  const [formData, setFormData] = useState({
    tujuanRS: '',
    tujuanPoli: '',
    tujuanDokter: '',
    namaPasien: '',
    umur: '',
    jenisKelamin: 'Laki-laki',
    alamat: '',
    anamnesa: '',
    pemeriksaanFisik: '',
    diagnosaSementara: '',
    terapi: '',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto flex gap-6">
        
        {/* Panel Form Editor (Sembunyi saat print) */}
        <div className="w-1/3 bg-white p-6 shadow-sm border border-gray-200 print:hidden h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Form Surat Rujukan</h2>
          
          <div className="space-y-3 h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="p-3 bg-blue-50 border border-blue-100 mb-2">
              <label className="block text-xs font-bold text-blue-800 mb-1">Kepada Yth. Teman Sejawat (TS)</label>
              <input type="text" placeholder="dr. Spesialis / Nama RS" className="w-full border border-blue-200 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none mb-2" 
                value={formData.tujuanDokter} onChange={e => setFormData({...formData, tujuanDokter: e.target.value})} />
              
              <label className="block text-xs font-bold text-blue-800 mb-1">Di Poliklinik / Bagian</label>
              <input type="text" placeholder="Poli Penyakit Dalam" className="w-full border border-blue-200 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none mb-2" 
                value={formData.tujuanPoli} onChange={e => setFormData({...formData, tujuanPoli: e.target.value})} />
                
              <label className="block text-xs font-bold text-blue-800 mb-1">Rumah Sakit Tujuan</label>
              <input type="text" placeholder="RSUD Kota / RS Siloam" className="w-full border border-blue-200 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none" 
                value={formData.tujuanRS} onChange={e => setFormData({...formData, tujuanRS: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nama Pasien</label>
              <input type="text" className="w-full border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none" 
                value={formData.namaPasien} onChange={e => setFormData({...formData, namaPasien: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Umur</label>
                <input type="text" className="w-full border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none" 
                  value={formData.umur} onChange={e => setFormData({...formData, umur: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Jenis Kelamin</label>
                <select className="w-full border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none bg-white" 
                  value={formData.jenisKelamin} onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}>
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Alamat</label>
              <textarea className="w-full border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none" rows={2}
                value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} />
            </div>
            
            <div className="pt-2 border-t border-gray-200 mt-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Anamnesa Singkat</label>
              <textarea className="w-full border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none" rows={2}
                value={formData.anamnesa} onChange={e => setFormData({...formData, anamnesa: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hasil Pemeriksaan Fisik</label>
              <textarea className="w-full border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none" rows={2}
                value={formData.pemeriksaanFisik} onChange={e => setFormData({...formData, pemeriksaanFisik: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-red-700 mb-1">Diagnosa Sementara (ICD-10)</label>
              <input type="text" className="w-full border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none" 
                value={formData.diagnosaSementara} onChange={e => setFormData({...formData, diagnosaSementara: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Terapi / Tindakan yang Diberikan</label>
              <textarea className="w-full border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 outline-none" rows={2}
                value={formData.terapi} onChange={e => setFormData({...formData, terapi: e.target.value})} />
            </div>
            
            <button onClick={handlePrint} className="w-full bg-blue-600 text-white font-bold py-3 mt-4 flex items-center justify-center gap-2 hover:bg-blue-700 sticky bottom-0">
              <Printer className="w-5 h-5" /> Cetak Surat Rujukan
            </button>
          </div>
        </div>

        {/* Panel Kertas Surat (Print Area) */}
        <div className="w-2/3 bg-white shadow-lg p-12 min-h-[297mm] print:w-full print:shadow-none print:p-0 print:m-0 text-gray-900">
          {/* Kop Surat */}
          <div className="border-b-4 border-double border-gray-900 pb-4 mb-6 text-center">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide uppercase">Klinik Kesehatan Prima</h1>
            <p className="text-sm text-gray-700">Jl. Jendral Sudirman No. 123, Jakarta Pusat</p>
            <p className="text-sm text-gray-700">Telp: (021) 1234567 | Email: info@klinikprima.com</p>
          </div>

          <div className="flex justify-between items-start mb-8 text-base">
            <div>
              <p>Nomor : SR/{new Date().getFullYear()}/{(new Date().getMonth()+1).toString().padStart(2, '0')}/003</p>
              <p>Lamp. : -</p>
              <p>Hal : <strong>Rujukan Pasien</strong></p>
            </div>
            <div className="text-right">
              <p>Jakarta, {new Date().toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-1">Kepada Yth. Teman Sejawat,</p>
            <p className="font-bold">{formData.tujuanDokter || 'dr. .................................................'}</p>
            <p>Di Poliklinik: {formData.tujuanPoli || '...........................................'}</p>
            <p>Rumah Sakit: {formData.tujuanRS || '...........................................'}</p>
          </div>

          {/* Isi Surat */}
          <div className="text-base text-gray-900 leading-relaxed space-y-4">
            <p>Dengan hormat,</p>
            <p>Mohon bantuan pemeriksaan dan penanganan lebih lanjut terhadap penderita:</p>
            
            <table className="w-full ml-4 mb-4">
              <tbody>
                <tr>
                  <td className="w-1/4 py-1">Nama Pasien</td>
                  <td className="w-4 py-1">:</td>
                  <td className="font-bold">{formData.namaPasien || '...................................................'}</td>
                </tr>
                <tr>
                  <td className="py-1">Umur / JK</td>
                  <td className="py-1">:</td>
                  <td>{formData.umur ? `${formData.umur} Tahun` : '......'} / {formData.jenisKelamin}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Alamat</td>
                  <td className="py-1 align-top">:</td>
                  <td>{formData.alamat || '.........................................................................'}</td>
                </tr>
              </tbody>
            </table>

            <p>Berdasarkan pemeriksaan kami, didapatkan temuan klinis sebagai berikut:</p>
            <table className="w-full ml-4">
              <tbody>
                <tr>
                  <td className="w-1/3 py-1 align-top font-semibold">Anamnesa Singkat</td>
                  <td className="w-4 py-1 align-top">:</td>
                  <td className="py-1 align-top min-h-12 border-b border-dotted border-gray-400">{formData.anamnesa}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top font-semibold">Pemeriksaan Fisik</td>
                  <td className="py-1 align-top">:</td>
                  <td className="py-1 align-top min-h-12 border-b border-dotted border-gray-400">{formData.pemeriksaanFisik}</td>
                </tr>
                <tr>
                  <td className="py-2 align-top font-semibold">Diagnosa Sementara</td>
                  <td className="py-2 align-top">:</td>
                  <td className="py-2 align-top font-bold">{formData.diagnosaSementara}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top font-semibold">Terapi Diberikan</td>
                  <td className="py-1 align-top">:</td>
                  <td className="py-1 align-top min-h-12 border-b border-dotted border-gray-400">{formData.terapi}</td>
                </tr>
              </tbody>
            </table>

            <p className="mt-8">
              Demikian surat rujukan ini kami sampaikan, atas bantuan dan kerja sama teman sejawat kami ucapkan terima kasih.
            </p>
          </div>

          {/* Tanda Tangan */}
          <div className="mt-16 flex justify-end text-gray-900 text-center">
            <div>
              <p className="mb-16">Salam Sejawat,</p>
              <p className="font-bold underline underline-offset-4">dr. Nama Dokter Anda</p>
              <p className="text-sm mt-1">SIP. 123.456.789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
