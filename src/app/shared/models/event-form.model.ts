export type EventStatus = 'draft' | 'ready' | 'approved';

export interface EventFormContext {
  providerLine: string;
  timestamp: string;
  doctorName: string;
}

export interface EventFormValue {
  fullName: string;
  dateOfBirth: string;
  patientId: string;
  eventType: string;
  visitReasons: string;
  status: EventStatus;
  additionalNotes: string;
}
