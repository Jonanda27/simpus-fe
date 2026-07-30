import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { ToothCondition, ToothSurface, CONDITION_OPTIONS } from './odontogram.types';
import ToothItem from './ToothItem';
import OdontogramEditorPanel from './OdontogramEditorPanel';
import OralFindingsForm from './OralFindingsForm';

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
        surfaces: undefined,
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

  const handleSelectTooth = (num: number) => {
    setSelectedTooth(num);
  };

  const handleSelectSurface = (num: number, surface: ToothSurface) => {
    setSelectedTooth(num);
    setSelectedSurface(surface);
  };

  const dmft = calculateDmft(teethMap);

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
              {q1.map((num) => (
                <ToothItem key={num} num={num} numberPosition="top" isSelected={selectedTooth === num} teethMap={teethMap} onSelectTooth={handleSelectTooth} onSelectSurface={handleSelectSurface} />
              ))}
            </div>
            <div className="flex gap-1 md:gap-1.5 pl-1 md:pl-2">
              {q2.map((num) => (
                <ToothItem key={num} num={num} numberPosition="top" isSelected={selectedTooth === num} teethMap={teethMap} onSelectTooth={handleSelectTooth} onSelectSurface={handleSelectSurface} />
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: DESIDUI / SUSU ATAS (55 - 65) */}
        <div className="flex flex-col items-center pt-2">
          <div className="flex gap-1.5 md:gap-2">
            <div className="flex gap-1 md:gap-1.5 border-r-2 border-gray-400 pr-2 md:pr-3">
              {q5.map((num) => (
                <ToothItem key={num} num={num} numberPosition="top" isSelected={selectedTooth === num} teethMap={teethMap} onSelectTooth={handleSelectTooth} onSelectSurface={handleSelectSurface} />
              ))}
            </div>
            <div className="flex gap-1 md:gap-1.5 pl-1 md:pl-2">
              {q6.map((num) => (
                <ToothItem key={num} num={num} numberPosition="top" isSelected={selectedTooth === num} teethMap={teethMap} onSelectTooth={handleSelectTooth} onSelectSurface={handleSelectSurface} />
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: DESIDUI / SUSU BAWAH (85 - 75) */}
        <div className="flex flex-col items-center pt-2">
          <div className="flex gap-1.5 md:gap-2">
            <div className="flex gap-1 md:gap-1.5 border-r-2 border-gray-400 pr-2 md:pr-3">
              {q8.map((num) => (
                <ToothItem key={num} num={num} numberPosition="bottom" isSelected={selectedTooth === num} teethMap={teethMap} onSelectTooth={handleSelectTooth} onSelectSurface={handleSelectSurface} />
              ))}
            </div>
            <div className="flex gap-1 md:gap-1.5 pl-1 md:pl-2">
              {q7.map((num) => (
                <ToothItem key={num} num={num} numberPosition="bottom" isSelected={selectedTooth === num} teethMap={teethMap} onSelectTooth={handleSelectTooth} onSelectSurface={handleSelectSurface} />
              ))}
            </div>
          </div>
        </div>

        {/* ROW 4: PERMANEN BAWAH (48 - 38) */}
        <div className="flex flex-col items-center pt-2">
          <div className="flex gap-1.5 md:gap-2">
            <div className="flex gap-1 md:gap-1.5 border-r-2 border-gray-400 pr-2 md:pr-3">
              {q4.map((num) => (
                <ToothItem key={num} num={num} numberPosition="bottom" isSelected={selectedTooth === num} teethMap={teethMap} onSelectTooth={handleSelectTooth} onSelectSurface={handleSelectSurface} />
              ))}
            </div>
            <div className="flex gap-1 md:gap-1.5 pl-1 md:pl-2">
              {q3.map((num) => (
                <ToothItem key={num} num={num} numberPosition="bottom" isSelected={selectedTooth === num} teethMap={teethMap} onSelectTooth={handleSelectTooth} onSelectSurface={handleSelectSurface} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / SELECTION POPOVER UNTUK PENGISIAN PER-BIDANG DENGAN LIVE ZOOMED PREVIEW 2X */}
      <OdontogramEditorPanel
        selectedTooth={selectedTooth}
        setSelectedTooth={setSelectedTooth}
        selectedSurface={selectedSurface}
        setSelectedSurface={setSelectedSurface}
        teethMap={teethMap}
        handleMarkMissingTooth={handleMarkMissingTooth}
        handleResetTooth={handleResetTooth}
        handleClearSurface={handleClearSurface}
        handleApplySurfaceCondition={handleApplySurfaceCondition}
      />

      {/* PEMERIKSAAN LINGKUNGAN MULUT LAINNYA (SATUSEHAT USE CASE GIGI) */}
      <OralFindingsForm findings={findings} handleFindingChange={handleFindingChange} />
    </div>
  );
}
