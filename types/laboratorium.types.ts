export interface OrderLaboratoriumPayload {
  kunjunganId: string;
  pasienId: string;
  dokterId?: string;
  catatanKlinis: string;
  tests: string[];
}

export interface OrderLaboratoriumDetail {
  id: string;
  orderId: string;
  parameter: string;
  hasil?: string;
  satuan?: string;
  nilaiRujukan?: string;
  kritis: boolean;
}

export interface OrderLaboratorium {
  id: string;
  kunjunganId: string;
  pasienId: string;
  dokterId: string;
  status: string;
  catatanKlinis?: string;
  tanggalOrder: string;
  details: OrderLaboratoriumDetail[];
}
