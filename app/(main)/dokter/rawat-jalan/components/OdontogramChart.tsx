import React, { useState } from 'react';
import { Activity, Info, RefreshCw, Check, X } from 'lucide-react';

export type ToothSurface = 'oklusal' | 'mesial' | 'distal' | 'bukal' | 'lingual';

export interface SurfaceData {
  condition: string;
}

export interface ToothCondition {
  number: number;
  condition?: string; // 'mis', 'non', 'une', 'abn' dll.
  surfaces?: Record<string, string>;
}

interface OdontogramChartProps {
  value?: Record<number, ToothCondition>;
  onChange?: (odontogram: Record<number, ToothCondition>, dmft: { d: number; m: number; f: number; total: number }) => void;
  oralFindings?: {
    occlusi?: string;
    torusPalatinus?: string;
    torusMandibularis?: string;
    palatum?: string;
    diastema?: string;
    gigiAnomali?: string;
    kondisiLain?: string;
  };
  onOralFindingsChange?: (findings: any) => void;
}

const CONDITION_OPTIONS = [
  { code: 'car', label: 'Karies / Berlubang (car)', color: 'bg-red-500 text-white border-red-600', fill: '#ef4444', stroke: '#b91c1c', dmf: 'D' },
  { code: 'amf', label: 'Tambalan Amalgam (amf)', color: 'bg-indigo-600 text-white border-indigo-700', fill: '#4f46e5', stroke: '#3730a3', dmf: 'F' },
  { code: 'cof', label: 'Tambalan Komposit (cof)', color: 'bg-blue-500 text-white border-blue-600', fill: '#3b82f6', stroke: '#1d4ed8', dmf: 'F' },
  { code: 'gif', label: 'Tambalan GIC (gif)', color: 'bg-cyan-600 text-white border-cyan-700', fill: '#0891b2', stroke: '#0e7490', dmf: 'F' },
  { code: 'rct', label: 'Perawatan Saluran Akar (rct)', color: 'bg-amber-500 text-white border-amber-600', fill: '#f59e0b', stroke: '#b45309', dmf: null },
  { code: 'cfr', label: 'Gigi Patah / Fraktur (cfr)', color: 'bg-orange-500 text-white border-orange-600', fill: '#f97316', stroke: '#c2410c', dmf: 'D' },
  { code: 'une', label: 'Impaksi / Erupsi Tidak Sempurna (une)', color: 'bg-purple-600 text-white border-purple-700', fill: '#9333ea', stroke: '#6b21a8', dmf: null },
  { code: 'non', label: 'Belum Erupsi / Non-Erupted (non)', color: 'bg-slate-500 text-white border-slate-600', fill: '#64748b', stroke: '#475569', dmf: null },
  { code: 'pfs', label: 'Pit & Fissure Sealant (pfs)', color: 'bg-emerald-600 text-white border-emerald-700', fill: '#059669', stroke: '#047857', dmf: null },
  { code: 'crw', label: 'Mahkota / Jaket Crown (crw)', color: 'bg-amber-700 text-white border-amber-800', fill: '#b45309', stroke: '#78350f', dmf: 'F' },
  { code: 'pon', label: 'Gigi Tiruan / Bridge Abutment (pon)', color: 'bg-teal-600 text-white border-teal-700', fill: '#0d9488', stroke: '#0f766e', dmf: null },
  { code: 'rrr', label: 'Sisa Akar / Radix (rrr)', color: 'bg-rose-700 text-white border-rose-800', fill: '#be123c', stroke: '#881337', dmf: 'D' },
];

export default function OdontogramChart({
  value = {},
  onChange,
  oralFindings = {},
  onOralFindingsChange,
}: OdontogramChartProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<ToothSurface | 'all'>('oklusal');
  const [teethMap, setTeethMap] = useState<Record<number, ToothCondition>>(value);
  const [findings, setFindings] = useState(oralFindings);

  // FDI Quadrants Definition
  const q1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const q2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const q5 = [55, 54, 53, 52, 51];
  const q6 = [61, 62, 63, 64, 65];

  const q8 = [85, 84, 83, 82, 81];
  const q7 = [71, 72, 73, 74, 75];
  const q4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const q3 = [31, 32, 33, 34, 35, 36, 37, 38];

  const calculateDmft = (currentMap: Record<number, ToothCondition>) => {
    let d = 0, m = 0, f = 0;
    Object.values(currentMap).forEach((item) => {
      if (item.condition === 'mis') {
        m++;
      } else if (item.surfaces) {
        let hasDecayed = false;
        let hasFilled = false;
        Object.values(item.surfaces).forEach((c) => {
          if (c === 'car' || c === 'cfr') hasDecayed = true;
          if (c === 'amf' || c === 'cof') hasFilled = true;
        });
        if (hasDecayed) d++;
        else if (hasFilled) f++;
      }
    });
    return { d, m, f, total: d + m + f };
  };

  const handleApplySurfaceCondition = (conditionCode: any) => {
    if (!selectedTooth) return;

    const currentTooth = teethMap[selectedTooth] || { number: selectedTooth, surfaces: {} };
    let updatedSurfaces = { ...(currentTooth.surfaces || {}) };

    if (selectedSurface === 'all') {
      updatedSurfaces = {
        oklusal: conditionCode,
        mesial: conditionCode,
        distal: conditionCode,
        bukal: conditionCode,
        lingual: conditionCode,
      };
    } else {
      updatedSurfaces[selectedSurface] = conditionCode;
    }

    const updatedMap = {
      ...teethMap,
      [selectedTooth]: {
        ...currentTooth,
        condition: undefined,
        surfaces: updatedSurfaces,
      },
    };

    setTeethMap(updatedMap);
    const dmft = calculateDmft(updatedMap);
    if (onChange) onChange(updatedMap, dmft);
  };

  const handleMarkMissingTooth = () => {
    if (!selectedTooth) return;
    const updatedMap = {
      ...teethMap,
      [selectedTooth]: {
        number: selectedTooth,
        condition: 'mis',
        surfaces: {},
      },
    };
    setTeethMap(updatedMap);
    const dmft = calculateDmft(updatedMap);
    if (onChange) onChange(updatedMap, dmft);
    setSelectedTooth(null);
  };

  const handleResetTooth = (toothNum: number) => {
    const updatedMap = { ...teethMap };
    delete updatedMap[toothNum];
    setTeethMap(updatedMap);
    const dmft = calculateDmft(updatedMap);
    if (onChange) onChange(updatedMap, dmft);
  };

  const handleClearSurface = (surfaceName: ToothSurface) => {
    if (!selectedTooth || !teethMap[selectedTooth]?.surfaces) return;
    const currentSurfaces = { ...teethMap[selectedTooth].surfaces };
    delete currentSurfaces[surfaceName];

    const updatedMap = {
      ...teethMap,
      [selectedTooth]: {
        ...teethMap[selectedTooth],
        surfaces: currentSurfaces,
      },
    };
    setTeethMap(updatedMap);
    const dmft = calculateDmft(updatedMap);
    if (onChange) onChange(updatedMap, dmft);
  };

  const handleFindingChange = (field: string, val: string) => {
    const updated = { ...findings, [field]: val };
    setFindings(updated);
    if (onOralFindingsChange) onOralFindingsChange(updated);
  };

  const dmft = calculateDmft(teethMap);

  // Helper untuk mendapatkan warna per bidang permukaan (Top, Right, Bottom, Left, Center)
  const getSurfaceColor = (num: number, surfaceName: ToothSurface) => {
    const tooth = teethMap[num];
    if (!tooth || !tooth.surfaces) return { fill: '#ffffff', stroke: '#000000' };

    const condCode = tooth.surfaces[surfaceName];
    if (!condCode) return { fill: '#ffffff', stroke: '#000000' };

    const opt = CONDITION_OPTIONS.find((c) => c.code === condCode);
    return opt ? { fill: opt.fill, stroke: opt.stroke } : { fill: '#ffffff', stroke: '#000000' };
  };

  // Render SVG Geometric Tooth 5 Bidang Terpisah
  const renderToothGraphic = (num: number, numberPosition: 'top' | 'bottom') => {
    const tooth = teethMap[num];
    const isMissing = tooth?.condition === 'mis';
    const isSelected = selectedTooth === num;

    const bukal = getSurfaceColor(num, 'bukal');
    const distal = getSurfaceColor(num, 'distal');
    const lingual = getSurfaceColor(num, 'lingual');
    const mesial = getSurfaceColor(num, 'mesial');
    const oklusal = getSurfaceColor(num, 'oklusal');

    return (
      <div key={num} className="flex flex-col items-center select-none cursor-pointer group">
        {/* Label Nomor Gigi Atas */}
        {numberPosition === 'top' && (
          <span className={`text-[11px] font-mono font-bold mb-1 group-hover:text-blue-600 ${isSelected ? 'text-blue-600 scale-110' : 'text-gray-900'}`}>
            {num}
          </span>
        )}

        {/* Geometric Tooth Diagram SVG (36x36 px) */}
        <div
          onClick={() => setSelectedTooth(num)}
          className={`relative p-0.5 border transition-all ${
            isSelected ? 'border-blue-600 ring-2 ring-blue-400 bg-blue-50 scale-110 z-10' : 'border-transparent hover:scale-105'
          }`}
          title={`Gigi #${num} - Klik untuk edit bidang`}
        >
          <svg width="36" height="36" viewBox="0 0 100 100" className="drop-shadow-xs">
            {/* Outer Border */}
            <rect x="2" y="2" width="96" height="96" fill="white" stroke="#000000" strokeWidth="4" />

            {/* 1. PERMUKAAN ATAS (Bukal / Labial) */}
            <polygon
              points="2,2 98,2 72,28 28,28"
              fill={bukal.fill}
              stroke={bukal.stroke}
              strokeWidth="2.5"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTooth(num);
                setSelectedSurface('bukal');
              }}
              className="hover:opacity-80 transition-opacity"
            />

            {/* 2. PERMUKAAN KANAN (Distal) */}
            <polygon
              points="98,2 98,98 72,72 72,28"
              fill={distal.fill}
              stroke={distal.stroke}
              strokeWidth="2.5"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTooth(num);
                setSelectedSurface('distal');
              }}
              className="hover:opacity-80 transition-opacity"
            />

            {/* 3. PERMUKAAN BAWAH (Lingual / Palatal) */}
            <polygon
              points="2,98 98,98 72,72 28,72"
              fill={lingual.fill}
              stroke={lingual.stroke}
              strokeWidth="2.5"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTooth(num);
                setSelectedSurface('lingual');
              }}
              className="hover:opacity-80 transition-opacity"
            />

            {/* 4. PERMUKAAN KIRI (Mesial) */}
            <polygon
              points="2,2 2,98 28,72 28,28"
              fill={mesial.fill}
              stroke={mesial.stroke}
              strokeWidth="2.5"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTooth(num);
                setSelectedSurface('mesial');
              }}
              className="hover:opacity-80 transition-opacity"
            />

            {/* 5. PERMUKAAN TENGAH (Oklusal / Insisal) */}
            <rect
              x="28"
              y="28"
              width="44"
              height="44"
              fill={oklusal.fill}
              stroke={oklusal.stroke}
              strokeWidth="2.5"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTooth(num);
                setSelectedSurface('oklusal');
              }}
              className="hover:opacity-80 transition-opacity"
            />

            {/* Tanda Silang X Jika Gigi Dicabut/Missing Total */}
            {isMissing && (
              <g stroke="#111827" strokeWidth="12" strokeLinecap="round">
                <line x1="10" y1="10" x2="90" y2="90" />
                <line x1="90" y1="10" x2="10" y2="90" />
              </g>
            )}
          </svg>
        </div>

        {/* Label Nomor Gigi Bawah */}
        {numberPosition === 'bottom' && (
          <span className={`text-[11px] font-mono font-bold mt-1 group-hover:text-blue-600 ${isSelected ? 'text-blue-600 scale-110' : 'text-gray-900'}`}>
            {num}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-blue-200 p-6 rounded-none space-y-6 shadow-sm">
      {/* Header & DMF-T Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 gap-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Standard Multi-Surface Odontogram Chart (FDI 5-Bidang Terpisah)
          </h3>
          <p className="text-xs text-gray-500">Klik langsung pada bidang (Atas, Kiri, Kanan, Bawah, Tengah) untuk mewarnai bagian yang bermasalah.</p>
        </div>

        {/* DMF-T Score Badges */}
        <div className="flex items-center gap-2 bg-blue-50 p-2 border border-blue-200">
          <span className="text-xs font-bold text-blue-900 uppercase">Indeks DMF-T:</span>
          <span className="px-2 py-0.5 bg-red-600 text-white font-extrabold text-xs rounded-none">D: {dmft.d}</span>
          <span className="px-2 py-0.5 bg-gray-800 text-white font-extrabold text-xs rounded-none">M: {dmft.m}</span>
          <span className="px-2 py-0.5 bg-blue-600 text-white font-extrabold text-xs rounded-none">F: {dmft.f}</span>
          <span className="px-2.5 py-0.5 bg-emerald-700 text-white font-black text-xs rounded-none">
            TOTAL: {dmft.total}
          </span>
        </div>
      </div>

      {/* ANATOMICAL GEOMETRIC ODONTOGRAM CHART (PERSIS GAMBAR STANDAR PUSKESMAS) */}
      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 space-y-6 overflow-x-auto">
        {/* ROW 1: PERMANEN ATAS (18 - 28) */}
        <div className="flex flex-col items-center">
          <div className="flex gap-1.5 md:gap-2">
            <div className="flex gap-1 md:gap-1.5 border-r-2 border-gray-400 pr-2 md:pr-3">
              {q1.map((num) => renderToothGraphic(num, 'top'))}
            </div>
            <div className="flex gap-1 md:gap-1.5 pl-1 md:pl-2">
              {q2.map((num) => renderToothGraphic(num, 'top'))}
            </div>
          </div>
        </div>

        {/* ROW 2: DESIDUI / SUSU ATAS (55 - 65) */}
        <div className="flex flex-col items-center pt-2">
          <div className="flex gap-1.5 md:gap-2">
            <div className="flex gap-1 md:gap-1.5 border-r-2 border-gray-400 pr-2 md:pr-3">
              {q5.map((num) => renderToothGraphic(num, 'top'))}
            </div>
            <div className="flex gap-1 md:gap-1.5 pl-1 md:pl-2">
              {q6.map((num) => renderToothGraphic(num, 'top'))}
            </div>
          </div>
        </div>

        {/* ROW 3: DESIDUI / SUSU BAWAH (85 - 75) */}
        <div className="flex flex-col items-center pt-2">
          <div className="flex gap-1.5 md:gap-2">
            <div className="flex gap-1 md:gap-1.5 border-r-2 border-gray-400 pr-2 md:pr-3">
              {q8.map((num) => renderToothGraphic(num, 'bottom'))}
            </div>
            <div className="flex gap-1 md:gap-1.5 pl-1 md:pl-2">
              {q7.map((num) => renderToothGraphic(num, 'bottom'))}
            </div>
          </div>
        </div>

        {/* ROW 4: PERMANEN BAWAH (48 - 38) */}
        <div className="flex flex-col items-center pt-2">
          <div className="flex gap-1.5 md:gap-2">
            <div className="flex gap-1 md:gap-1.5 border-r-2 border-gray-400 pr-2 md:pr-3">
              {q4.map((num) => renderToothGraphic(num, 'bottom'))}
            </div>
            <div className="flex gap-1 md:gap-1.5 pl-1 md:pl-2">
              {q3.map((num) => renderToothGraphic(num, 'bottom'))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / SELECTION POPOVER UNTUK PENGISIAN PER-BIDANG */}
      {selectedTooth && (
        <div className="p-5 bg-slate-900 text-white rounded-none border border-slate-700 animate-in fade-in duration-200 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-700 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-yellow-400" />
              <h4 className="font-extrabold text-base">
                Pengisian Bidang Gigi <span className="text-yellow-400 font-mono text-lg">#{selectedTooth}</span>
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMarkMissingTooth}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-red-400 border border-red-500 font-extrabold text-xs rounded-none transition-colors"
              >
                ✖ Tandai Gigi Dicabut / Hilang (mis)
              </button>
              <button
                type="button"
                onClick={() => handleResetTooth(selectedTooth)}
                className="text-xs text-slate-300 hover:text-white underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Seluruh Gigi Ini
              </button>
              <button
                type="button"
                onClick={() => setSelectedTooth(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 rounded-none transition-colors ml-2"
                title="Tutup Panel Pengisian"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PILIHAN BIDANG GIGI (SURFACE SELECTOR) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Pilih Permukaan / Bidang Gigi yang Ingin Diwarnai:
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { code: 'oklusal', name: 'Tengah (Oklusal/Insisal)' },
                { code: 'bukal', name: 'Atas (Bukal/Labial)' },
                { code: 'lingual', name: 'Bawah (Lingual/Palatal)' },
                { code: 'mesial', name: 'Kiri (Mesial)' },
                { code: 'distal', name: 'Kanan (Distal)' },
                { code: 'all', name: 'Seluruh Bidang (1 Gigi Full)' },
              ].map((surf) => {
                const isCurrentSurf = selectedSurface === surf.code;
                const hasColor = surf.code !== 'all' && teethMap[selectedTooth]?.surfaces?.[surf.code as ToothSurface];

                return (
                  <button
                    key={surf.code}
                    type="button"
                    onClick={() => setSelectedSurface(surf.code as any)}
                    className={`px-3 py-2 text-xs font-bold border text-left flex items-center justify-between transition-all ${
                      isCurrentSurf
                        ? 'bg-blue-600 border-blue-400 text-white shadow-md ring-2 ring-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <span>{surf.name}</span>
                    {hasColor && <Check className="w-3.5 h-3.5 text-yellow-400 font-extrabold" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PILIHAN KONDISI / WARNA UNTUK BIDANG TERPILIH */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Pilih Kondisi Klinis untuk Bidang:{' '}
                <span className="text-yellow-400 font-extrabold uppercase">{selectedSurface}</span>
              </label>

              {selectedSurface !== 'all' && teethMap[selectedTooth]?.surfaces?.[selectedSurface as ToothSurface] && (
                <button
                  type="button"
                  onClick={() => handleClearSurface(selectedSurface as ToothSurface)}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  Hapus Warna Bidang Ini
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CONDITION_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleApplySurfaceCondition(opt.code)}
                  className={`px-3 py-2 text-xs font-bold text-left border rounded-none transition-all ${opt.color} hover:brightness-110`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PEMERIKSAAN LINGKUNGAN MULUT LAINNYA (SATUSEHAT USE CASE GIGI) */}
      <div className="bg-slate-50 p-4 border border-gray-200 rounded-none space-y-4">
        <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
          Pemeriksaan Tambahan Jaringan Lunak & Mulut (SATUSEHAT Observation)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Occlusi (SNOMED 25272006)</label>
            <select
              value={findings.occlusi || ''}
              onChange={(e) => handleFindingChange('occlusi', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-bold"
            >
              <option value="">-- Pilih Occlusi --</option>
              <option value="Normal Occlusion">Normal Occlusion</option>
              <option value="Crossbite">Crossbite</option>
              <option value="Steepbite">Steepbite</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Torus Palatinus (SNOMED 46752004)</label>
            <select
              value={findings.torusPalatinus || ''}
              onChange={(e) => handleFindingChange('torusPalatinus', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-bold"
            >
              <option value="">-- Pilih Torus Palatinus --</option>
              <option value="Tidak ada">Tidak Ada</option>
              <option value="Kecil">Kecil</option>
              <option value="Sedang">Sedang</option>
              <option value="Besar">Besar</option>
              <option value="Multiple">Multiple</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Torus Mandibularis (SNOMED 11625007)</label>
            <select
              value={findings.torusMandibularis || ''}
              onChange={(e) => handleFindingChange('torusMandibularis', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-bold"
            >
              <option value="">-- Pilih Torus Mandibularis --</option>
              <option value="Tidak ada">Tidak Ada</option>
              <option value="Sisi Kiri">Sisi Kiri</option>
              <option value="Sisi Kanan">Sisi Kanan</option>
              <option value="Kedua Sisi">Kedua Sisi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Palatum (LOINC 32460-8)</label>
            <select
              value={findings.palatum || ''}
              onChange={(e) => handleFindingChange('palatum', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-bold"
            >
              <option value="">-- Pilih Palatum --</option>
              <option value="Dalam">Dalam</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Diastema (SNOMED 734009000)</label>
            <select
              value={findings.diastema || ''}
              onChange={(e) => handleFindingChange('diastema', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-bold"
            >
              <option value="">-- Pilih Diastema --</option>
              <option value="Tidak Ada">Tidak Ada</option>
              <option value="Ada Diastema">Ada Diastema</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Gigi Anomali (SNOMED 81256000)</label>
            <select
              value={findings.gigiAnomali || ''}
              onChange={(e) => handleFindingChange('gigiAnomali', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-bold"
            >
              <option value="">-- Pilih Gigi Anomali --</option>
              <option value="Tidak Ada">Tidak Ada</option>
              <option value="Ada Gigi Anomali">Ada Gigi Anomali</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
