import React from 'react';

interface OralFindingsFormProps {
  findings: Record<string, string>;
  handleFindingChange: (field: string, val: string) => void;
}

export default function OralFindingsForm({ findings, handleFindingChange }: OralFindingsFormProps) {
  return (
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
          <label className="block text-xs font-bold text-gray-700 mb-1">Torus Mandibularis (SNOMED 37320007)</label>
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
          <label className="block text-xs font-bold text-gray-700 mb-1">Palatum (SNOMED 71543003)</label>
          <select
            value={findings.palatum || ''}
            onChange={(e) => handleFindingChange('palatum', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-bold"
          >
            <option value="">-- Pilih Palatum --</option>
            <option value="Dalam">Dalam</option>
            <option value="Sedang">Sedang</option>
            <option value="Datar">Datar</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Diastema (SNOMED 66547005)</label>
          <input
            type="text"
            placeholder="Contoh: Ada Antara 11-21"
            value={findings.diastema || ''}
            onChange={(e) => handleFindingChange('diastema', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Gigi Anomali (SNOMED 300318002)</label>
          <input
            type="text"
            placeholder="Contoh: Peg shaped 12"
            value={findings.gigiAnomali || ''}
            onChange={(e) => handleFindingChange('gigiAnomali', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-bold"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">Kondisi Lain / Catatan Tambahan Mulut</label>
        <textarea
          rows={2}
          placeholder="Tuliskan catatan tambahan mengenai kebersihan mulut (OHIS), plak, kalkulus, atau temuan mukosa mulut..."
          value={findings.kondisiLain || ''}
          onChange={(e) => handleFindingChange('kondisiLain', e.target.value)}
          className="w-full p-2.5 bg-white border border-gray-300 rounded-none text-xs text-gray-900 font-medium"
        />
      </div>
    </div>
  );
}
