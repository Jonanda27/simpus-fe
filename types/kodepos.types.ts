export interface KodePosResult {
  code?: number | string;
  village?: string;
  district?: string;
  regency?: string;
  province?: string;
  kodepos?: string;
  postalcode?: string;
}

export interface KodePosResponse {
  success: boolean;
  kode_pos?: string;
  message?: string;
  data?: KodePosResult;
}
