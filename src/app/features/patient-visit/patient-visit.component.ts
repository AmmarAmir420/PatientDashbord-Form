import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { SNACKBAR_DURATION_MS, UI_COPY } from '../../core/constants';
import { HealthcareStoreService } from '../../core/services/healthcare-store.service';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { VisitStatus } from '../../shared/enums';
import { PATIENT_VISIT_CONTEXT_MOCK } from '../../core/data/mocks';
import {
  LabelValueRowComponent,
  PrimaryButtonComponent,
  SecondaryButtonComponent,
  UiCardComponent,
} from '../../layouts/ui';
import { PatientVisitFormModel } from '../../shared/interfaces';
import {
  applyTimeToDate,
  createPatientVisitForm,
  formatDisplayDateTime,
  getPatientVisitFormValue,
  parseDateTimeValue,
  parseDateValue,
  PatientVisitFormGroup,
  startOfToday,
  toTimeInputValue,
} from '../../shared/utils';

@Component({
  selector: 'app-patient-visit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MainLayoutComponent,
    LabelValueRowComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    UiCardComponent,
  ],
  templateUrl: './patient-visit.component.html',
})
export class PatientVisitComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(HealthcareStoreService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly copy = UI_COPY;
  readonly context = PATIENT_VISIT_CONTEXT_MOCK;
  readonly VisitStatus = VisitStatus;
  readonly submitted = signal(false);
  readonly isViewMode = signal(false);
  readonly isEditing = signal(false);
  readonly visitId = signal<string | null>(null);
  readonly maxBirthDate = startOfToday();

  readonly form: PatientVisitFormGroup = createPatientVisitForm(this.fb);

  readonly birthDateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    return date <= this.maxBirthDate;
  };

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const viewMode = params.get('mode') === 'view';
      this.isViewMode.set(viewMode);
      this.isEditing.set(false);
      this.visitId.set(params.get('visitId'));
      this.submitted.set(false);

      if (viewMode) {
        const patientId = params.get('patientId') ?? '';
        const fullName = params.get('fullName') ?? '';
        this.patchFormFromModel(this.store.getPatientVisitViewModel(patientId, fullName));
        this.setFormReadOnly(true);
        return;
      }

      this.patchFormFromModel({
        fullName: params.get('fullName') ?? '',
        dateOfBirth: params.get('dateOfBirth') ?? '',
        patientId: params.get('patientId') ?? '',
        eventType: params.get('eventType') ?? '',
        visitReasons: params.get('visitReasons') ?? '',
        status: VisitStatus.Draft,
        additionalNotes: '',
        appointmentDateTime: this.context.timestamp,
      });
      this.setFormReadOnly(false);
    });
  }

  isFormEditable(): boolean {
    return !this.isViewMode() || this.isEditing();
  }

  primaryActionLabel(): string {
    return this.isViewMode() ? this.copy.updateEvent : this.copy.createEvent;
  }

  private patchFormFromModel(model: PatientVisitFormModel): void {
    this.form.patchValue({
      fullName: model.fullName,
      dateOfBirth: parseDateValue(model.dateOfBirth),
      patientId: model.patientId,
      eventType: model.eventType,
      visitReasons: model.visitReasons,
      status: model.status,
      additionalNotes: model.additionalNotes,
      appointmentAt: parseDateTimeValue(model.appointmentDateTime || this.context.timestamp),
    });
  }

  private setFormReadOnly(readonly: boolean): void {
    if (readonly) {
      this.form.disable({ emitEvent: false });
      return;
    }

    this.form.enable({ emitEvent: false });
  }

  appointmentTimeValue(): string {
    return toTimeInputValue(this.form.controls.appointmentAt.value);
  }

  headerTimestamp(): string {
    return formatDisplayDateTime(this.form.controls.appointmentAt.value) || this.context.timestamp;
  }

  onAppointmentTimeChange(time: string): void {
    if (!this.isFormEditable()) {
      return;
    }

    const updated = applyTimeToDate(this.form.controls.appointmentAt.value, time);
    this.form.controls.appointmentAt.setValue(updated);
    this.form.controls.appointmentAt.markAsDirty();
  }

  isInvalid(controlName: keyof PatientVisitFormGroup['controls']): boolean {
    if (!this.isFormEditable()) {
      return false;
    }

    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  submitForm(): void {
    if (this.isViewMode() && !this.isEditing()) {
      this.isEditing.set(true);
      this.setFormReadOnly(false);
      return;
    }

    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Please complete the required fields.', 'Close', {
        duration: SNACKBAR_DURATION_MS,
      });
      return;
    }

    const value = getPatientVisitFormValue(this.form);

    if (this.isViewMode()) {
      const visit = this.store.saveVisit(value, this.visitId());
      this.snackBar.open(`Event updated for ${visit.fullName}.`, 'Close', {
        duration: SNACKBAR_DURATION_MS,
      });
      this.router.navigate(['/']);
      return;
    }

    const visit = this.store.createVisit(value);
    this.snackBar.open(`Event created for ${visit.fullName}.`, 'Close', {
      duration: SNACKBAR_DURATION_MS,
    });
    this.router.navigate(['/']);
  }

  close(): void {
    this.router.navigate(['/']);
  }
}
