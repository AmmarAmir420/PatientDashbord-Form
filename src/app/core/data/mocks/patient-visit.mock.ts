import { VisitStatus } from '../../../shared/enums/visit-status.enum';
import { PatientVisitContext } from '../../../shared/interfaces';

export const PATIENT_VISIT_CONTEXT_MOCK: PatientVisitContext = {
  providerLine: 'Tuomas Veikko Kerola, Helsinki Hospital, Cardiology Department',
  timestamp: '29/10/2024 14:49',
  doctorName: 'Tuomas Veikko Kerola',
};

export const PATIENT_VISIT_DETAIL_DEFAULTS = {
  recent: {
    dateOfBirth: '15/03/1985',
    eventType: 'Follow-up visit',
    visitReasons: 'Routine check-up',
    status: VisitStatus.Ready,
    additionalNotes: 'Existing patient record loaded for review.',
  },
  worklist: {
    dateOfBirth: '15/03/1985',
    eventType: 'Follow-up visit',
    visitReasons: 'Routine check-up',
    status: VisitStatus.Approved,
    additionalNotes: 'Patient appointment scheduled on worklist.',
  },
} as const;
