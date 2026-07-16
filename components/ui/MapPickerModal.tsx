"use client";

import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { X, Search, MapPin } from 'lucide-react';

// Fix for default Leaflet icon in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function MapPickerModal({ isOpen, onClose, onSelectLocation, initialLat = -6.200000, initialLng = 106.816666 }: MapPickerModalProps) {
  const [position, setPosition] = useState<L.LatLng>(new L.LatLng(initialLat, initialLng));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<L.Map>(null);

  // Map Click Handler Component
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=id`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const newPos = new L.LatLng(lat, lon);
    setPosition(newPos);
    setSearchResults([]);
    if (mapRef.current) {
      mapRef.current.flyTo(newPos, 15);
    }
  };

  const handleConfirm = () => {
    onSelectLocation(position.lat, position.lng);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-0 sm:p-0">
      <div className="bg-white rounded-none shadow-xl w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="text-blue-600" />
            Pilih Lokasi di Peta
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 min-h-[500px]">
          {/* Map Area */}
          <div className="absolute inset-0 z-0">
            <MapContainer 
              center={position} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer name="OpenStreetMap (Standar)">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satelit (Esri)">
                  <TileLayer
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer checked name="Google Maps (Standar + POI)">
                  <TileLayer
                    attribution='&copy; <a href="https://maps.google.com/">Google Maps</a>'
                    url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0','mt1','mt2','mt3']}
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Peta Topografi">
                  <TileLayer
                    attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              <LocationMarker />
            </MapContainer>
          </div>

          {/* Floating Search Bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[500px] z-[1000] flex flex-col gap-2">
            <div className="relative bg-white rounded-none shadow-lg">
              <input
                type="text"
                placeholder="Cari nama jalan/tempat... (Tekan Enter)"
                className="w-full pl-10 pr-4 py-3 border-none rounded-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e as unknown as React.FormEvent);
                  }
                }}
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Floating Search Results */}
            {(isSearching || searchResults.length > 0) && (
              <div className="bg-white rounded-none shadow-lg max-h-60 overflow-y-auto border border-gray-100">
                {isSearching ? (
                  <p className="text-sm text-gray-500 text-center py-4 font-medium">Mencari lokasi...</p>
                ) : (
                  <div className="flex flex-col">
                    {searchResults.map((res, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => selectSearchResult(res)}
                        className="p-3 text-sm text-slate-800 font-medium border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors last:border-0"
                      >
                        {res.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Floating Confirm Button */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-3 w-full px-4">
            <div className="bg-white/95 backdrop-blur px-6 py-2 rounded-none shadow-lg border border-gray-200 text-sm font-bold text-slate-700 flex items-center gap-4">
              <span>Lat: {position.lat.toFixed(6)}</span>
              <span className="w-px h-4 bg-gray-300"></span>
              <span>Lng: {position.lng.toFixed(6)}</span>
            </div>
            <button 
              onClick={handleConfirm}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 shadow-xl text-white font-bold rounded-none transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Gunakan Lokasi Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
