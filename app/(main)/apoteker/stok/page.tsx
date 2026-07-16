"use client";

import React, { useEffect, useState } from 'react';
import { Package, Search, AlertTriangle, Pill, Loader2, Info } from 'lucide-react';
import { masterService } from '@/services/master.service';

interface Obat {
  id: string;
  kodeObat: string;
  namaObat: string;
  kategori: string;
  sediaan: string;
  harga: number;
  stok: number;
  gambarUrl?: string;
}

export default function KatalogObatPage() {
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchObat();
  }, []);

  const fetchObat = async () => {
    try {
      setIsLoading(true);
      const res = await masterService.getObat();
      // Assume res.data contains the array
      setObatList(res.data || []);
    } catch (error) {
      console.error('Error fetching obat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredObat = obatList.filter(o => 
    o.namaObat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.kodeObat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-gray-200 shadow-sm rounded-none">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-teal-600" />
            Katalog & Stok Obat
          </h1>
          <p className="text-gray-500 mt-1">Pantau ketersediaan stok fisik obat di Apotek.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama, kode, atau kategori obat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full shadow-sm"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200">
          <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
          <p className="text-gray-500 font-medium">Memuat katalog obat...</p>
        </div>
      ) : filteredObat.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Obat Tidak Ditemukan</h3>
          <p className="text-gray-500 text-sm">Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredObat.map((obat) => {
            const isKritis = obat.stok < 10;
            const isHabis = obat.stok === 0;

            return (
              <div key={obat.id} className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col">
                {/* Image Area */}
                <div className="relative h-48 bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-center overflow-hidden">
                  {obat.gambarUrl ? (
                    <img 
                      src={obat.gambarUrl} 
                      alt={obat.namaObat} 
                      className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <Pill className="w-16 h-16 mb-2" />
                      <span className="text-xs uppercase tracking-widest font-bold">No Image</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {isHabis ? (
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 flex items-center gap-1 shadow-sm">
                        <AlertTriangle className="w-3 h-3" /> STOK HABIS
                      </span>
                    ) : isKritis ? (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 flex items-center gap-1 shadow-sm">
                        <AlertTriangle className="w-3 h-3" /> STOK KRITIS
                      </span>
                    ) : null}
                    <span className="bg-white text-teal-800 border border-teal-200 text-xs font-bold px-2 py-1 shadow-sm">
                      {obat.kategori}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5">{obat.kodeObat}</span>
                    <span className="text-xs text-gray-500 font-medium">{obat.sediaan}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 group-hover:text-teal-700 transition-colors">
                    {obat.namaObat}
                  </h3>

                  <div className="mt-auto space-y-3">
                    {/* Price and Stock Grid */}
                    <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Sisa Stok</p>
                        <p className={`text-xl font-black ${isHabis ? 'text-red-600' : isKritis ? 'text-orange-500' : 'text-teal-600'}`}>
                          {obat.stok}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-0.5">Harga Dasar</p>
                        <p className="text-lg font-bold text-gray-900">
                          Rp {obat.harga.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer Action (Optional info) */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center text-xs text-gray-500">
                  <Info className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                  Stok langsung terpotong saat resep diproses.
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
