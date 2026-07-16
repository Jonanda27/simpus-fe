export interface Poliklinik {
  id: string;
  kodePoli: string;
  namaPoli: string;
  deskripsi?: string | null;
  statusAktif: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LayananKlinik {
  id: string;
  poliklinikId: string;
  kodeLayanan: string;
  namaLayanan: string;
  deskripsi?: string | null;
  tarifDasar: number;
  statusAktif: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PoliklinikPayload = Omit<Poliklinik, 'id' | 'createdAt' | 'updatedAt'>;
export type LayananKlinikPayload = Omit<LayananKlinik, 'id' | 'createdAt' | 'updatedAt'>;
