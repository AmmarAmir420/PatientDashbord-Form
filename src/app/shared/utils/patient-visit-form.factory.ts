import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { VisitStatus } from '../enums/visit-status.enum';
import { PatientVisitFormModel } from '../models';

export type PatientVisitFormControls = {
  fullName: FormControl<string>;
  dateOfBirth: FormControl<string>;
  patientId: FormControl<string>;
  eventType: FormControl<string>;
  visitReasons: FormControl<string>;
  status: FormControl<VisitStatus>;
  additionalNotes: FormControl<string>;
};

export type PatientVisitFormGroup = FormGroup<PatientVisitFormControls>;

export function createPatientVisitForm(fb: FormBuilder): PatientVisitFormGroup {
  return fb.nonNullable.group({
    fullName: ['', Validators.required],
    dateOfBirth: [''],
    patientId: ['', Validators.required],
    eventType: ['', Validators.required],
    visitReasons: [''],
    status: [VisitStatus.Draft],
    additionalNotes: [''],
  });
}

export function getPatientVisitFormValue(form: PatientVisitFormGroup): PatientVisitFormModel {
  return form.getRawValue();
}
