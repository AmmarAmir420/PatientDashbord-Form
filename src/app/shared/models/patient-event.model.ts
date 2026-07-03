import { EventFormValue } from '../models';

export interface PatientEvent extends EventFormValue {
  id: string;
  createdAt: string;
}

export interface EventFormPrefill {
  fullName?: string;
  dateOfBirth?: string;
  patientId?: string;
  eventType?: string;
  visitReasons?: string;
}
