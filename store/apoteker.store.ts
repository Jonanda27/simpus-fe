import { create } from 'zustand';
import { satusehatService } from '../services/satusehat.service';
import { QuestionnaireResponsePayload, MedicationDispensePayload } from '../types/apoteker.types';

interface ApotekerStoreState {
  isSubmittingSS: boolean;
  errorSS: string | null;
  submitTelaahDanDispense: (
    questionnaireData: QuestionnaireResponsePayload,
    dispenseItems: MedicationDispensePayload[]
  ) => Promise<boolean>;
}

export const useApotekerStore = create<ApotekerStoreState>((set) => ({
  isSubmittingSS: false,
  errorSS: null,

  submitTelaahDanDispense: async (questionnaireData, dispenseItems) => {
    set({ isSubmittingSS: true, errorSS: null });
    try {
      // 1. Kirim QuestionnaireResponse (Kajian Telaah Resep)
      console.log('[Apoteker Store] Mengirim QuestionnaireResponse...', questionnaireData);
      await satusehatService.sendQuestionnaireResponse(questionnaireData);

      // 2. Kirim seluruh item obat ke MedicationDispense (Penyerahan Obat) secara paralel/sekuensial
      console.log('[Apoteker Store] Mengirim MedicationDispense...', dispenseItems);
      const dispensePromises = dispenseItems.map((item) =>
        satusehatService.sendMedicationDispense(item)
      );
      await Promise.all(dispensePromises);

      set({ isSubmittingSS: false });
      return true;
    } catch (err: any) {
      console.error('[Apoteker Store] Error sync SATUSEHAT Apoteker:', err);
      set({
        isSubmittingSS: false,
        errorSS: err.message || 'Gagal mengirim data ke SATUSEHAT'
      });
      return false;
    }
  }
}));
