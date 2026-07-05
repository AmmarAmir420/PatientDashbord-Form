import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { VisitStatus } from '../enums/visit-status.enum';
import { PatientVisitFormModel } from '../interfaces';
import { formatDisplayDate, formatDisplayDateTime } from './date-format.utils';

export type PatientVisitFormControls = {
  fullName: FormControl<string>;
  dateOfBirth: FormControl<Date | null>;
  patientId: FormControl<string>;
  eventType: FormControl<string>;
  visitReasons: FormControl<string>;
  status: FormControl<VisitStatus>;
  appointmentAt: FormControl<Date | null>;
  additionalNotes: FormControl<string>;
};

export type PatientVisitFormGroup = FormGroup<PatientVisitFormControls>;

export function createPatientVisitForm(fb: FormBuilder): PatientVisitFormGroup {
  return fb.group({
    fullName: fb.nonNullable.control('', Validators.required),
    dateOfBirth: fb.control<Date | null>(null),
    patientId: fb.nonNullable.control('', Validators.required),
    eventType: fb.nonNullable.control('', Validators.required),
    visitReasons: fb.nonNullable.control(''),
    status: fb.nonNullable.control(VisitStatus.Draft),
    appointmentAt: fb.control<Date | null>(null),
    additionalNotes: fb.nonNullable.control(''),
  });
}

export function getPatientVisitFormValue(form: PatientVisitFormGroup): PatientVisitFormModel {
  const value = form.getRawValue();

  return {
    fullName: value.fullName,
    dateOfBirth: formatDisplayDate(value.dateOfBirth),
    patientId: value.patientId,
    eventType: value.eventType,
    visitReasons: value.visitReasons,
    status: value.status,
    additionalNotes: value.additionalNotes,
    appointmentDateTime: formatDisplayDateTime(value.appointmentAt),
  };
}
