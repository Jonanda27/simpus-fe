import React from 'react';
import { ToothCondition, ToothSurface, getSurfaceColor } from './odontogram.types';

interface ToothItemProps {
  num: number;
  numberPosition: 'top' | 'bottom';
  isSelected: boolean;
  teethMap: Record<number, ToothCondition>;
  onSelectTooth: (num: number) => void;
  onSelectSurface?: (num: number, surface: ToothSurface) => void;
}

export default function ToothItem({
  num,
  numberPosition,
  isSelected,
  teethMap,
  onSelectTooth,
  onSelectSurface,
}: ToothItemProps) {
  const tooth = teethMap[num];
  const isMissing = tooth?.condition === 'mis';

  const bukal = getSurfaceColor(teethMap, num, 'bukal');
  const distal = getSurfaceColor(teethMap, num, 'distal');
  const lingual = getSurfaceColor(teethMap, num, 'lingual');
  const mesial = getSurfaceColor(teethMap, num, 'mesial');
  const oklusal = getSurfaceColor(teethMap, num, 'oklusal');

  return (
    <div className="flex flex-col items-center select-none cursor-pointer group">
      {/* Label Nomor Gigi Atas */}
      {numberPosition === 'top' && (
        <span className={`text-[11px] font-mono font-bold mb-1 group-hover:text-blue-600 ${isSelected ? 'text-blue-600 scale-110' : 'text-gray-900'}`}>
          {num}
        </span>
      )}

      {/* Geometric Tooth Diagram SVG (36x36 px) */}
      <div
        onClick={() => onSelectTooth(num)}
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
              onSelectTooth(num);
              if (onSelectSurface) onSelectSurface(num, 'bukal');
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
              onSelectTooth(num);
              if (onSelectSurface) onSelectSurface(num, 'distal');
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
              onSelectTooth(num);
              if (onSelectSurface) onSelectSurface(num, 'lingual');
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
              onSelectTooth(num);
              if (onSelectSurface) onSelectSurface(num, 'mesial');
            }}
            className="hover:opacity-80 transition-opacity"
          />

          {/* 5. PERMUKAAN TENGAH (Oklusal / Insisal) */}
          <polygon
            points="28,28 72,28 72,72 28,72"
            fill={oklusal.fill}
            stroke={oklusal.stroke}
            strokeWidth="2.5"
            onClick={(e) => {
              e.stopPropagation();
              onSelectTooth(num);
              if (onSelectSurface) onSelectSurface(num, 'oklusal');
            }}
            className="hover:opacity-80 transition-opacity"
          />

          {/* OVERLAY GIGI DICABUT / HILANG (TANDA SILANG 'X' MERAH NODA PRO) */}
          {isMissing && (
            <g>
              <line x1="0" y1="0" x2="100" y2="100" stroke="#dc2626" strokeWidth="12" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#dc2626" strokeWidth="12" />
            </g>
          )}
        </svg>

        {/* Indikator Status Tambahan Gigi */}
        {tooth?.condition && tooth.condition !== 'mis' && (
          <span className="absolute -bottom-2 font-mono text-[9px] font-black bg-purple-700 text-white px-1 uppercase rounded-none border border-purple-900">
            {tooth.condition}
          </span>
        )}
      </div>

      {/* Label Nomor Gigi Bawah */}
      {numberPosition === 'bottom' && (
        <span className={`text-[11px] font-mono font-bold mt-1 group-hover:text-blue-600 ${isSelected ? 'text-blue-600 scale-110' : 'text-gray-900'}`}>
          {num}
        </span>
      )}
    </div>
  );
}
