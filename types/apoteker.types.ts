export interface QuestionnaireResponseItem {
  linkId: string;
  text: string;
  answer: Array<{
    valueBoolean?: boolean;
    valueString?: string;
    valueCoding?: {
      system: string;
      code: string;
      display: string;
    };
  }>;
}

export interface QuestionnaireResponsePayload {
  pasienIhs: string;
  encounterId: string;
  practitionerIhs?: string;
  patientName?: string;
  practitionerName?: string;
  questionnaireUrl?: string;
  status?: string;
  items: QuestionnaireResponseItem[];
}

export interface MedicationDispensePayload {
  resepId: string;
  resepDetailId: string;
  kodeObat: string;
  pasienIhs: string;
  practitionerIhs: string;
  encounterId: string;
  namaObat: string;
  sediaan?: string;
  jumlah: number;
  aturanPakai: string;
}
