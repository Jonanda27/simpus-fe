import React from 'react';

export type ToothSurface = 'oklusal' | 'mesial' | 'distal' | 'bukal' | 'lingual';

export interface ToothCondition {
  number: number;
  condition?: string; // 'mis', 'non', 'une', 'abn' dll.
  surfaces?: Record<string, string>;
}

export interface ConditionOption {
  code: string;
  label: string;
  color: string;
  fill: string;
  stroke: string;
  dmf: string | null;
}

export const CONDITION_OPTIONS: ConditionOption[] = [
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

export const getSurfaceColor = (teethMap: Record<number, ToothCondition>, num: number, surfaceName: ToothSurface) => {
  const tooth = teethMap[num];
  if (!tooth || !tooth.surfaces) return { fill: '#ffffff', stroke: '#000000' };

  const condCode = tooth.surfaces[surfaceName];
  if (!condCode) return { fill: '#ffffff', stroke: '#000000' };

  const opt = CONDITION_OPTIONS.find((c) => c.code === condCode);
  return opt ? { fill: opt.fill, stroke: opt.stroke } : { fill: '#ffffff', stroke: '#000000' };
};
