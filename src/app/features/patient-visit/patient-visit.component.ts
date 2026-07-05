import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
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
  extractBasePatientId,
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
    MatMenuModule,
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
  readonly formMode = signal<'create' | 'detail'>('create');
  readonly visitId = signal<string | null>(null);
  readonly maxBirthDate = startOfToday();

  readonly isCreateMode = computed(() => this.formMode() === 'create');
  readonly isDetailMode = computed(() => this.formMode() === 'detail');

  readonly appointmentPickerDate = signal<Date | null>(null);
  readonly appointmentPickerTime = signal('');

  @ViewChild('appointmentMenuTrigger') appointmentMenuTrigger?: MatMenuTrigger;

  readonly form: PatientVisitFormGroup = createPatientVisitForm(this.fb);

  readonly birthDateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    return date <= this.maxBirthDate;
  };

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const mode = params.get('mode');
      this.visitId.set(params.get('visitId'));
      this.submitted.set(false);

      if (mode === 'detail') {
        this.formMode.set('detail');
        const patientId = params.get('patientId') ?? '';
        const fullName = params.get('fullName') ?? '';
        const source = params.get('source') === 'worklist' ? 'worklist' : 'recent';
        const model = this.store.getPatientVisitDetailModel(patientId, fullName, {
          source,
          visitId: this.visitId(),
          eventType: params.get('eventType'),
        });
        this.patchFormFromModel(model);
        this.applyDetailModeReadOnly();
        return;
      }

      this.formMode.set('create');
      this.form.enable({ emitEvent: false });
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
    });
  }

  private patchFormFromModel(model: PatientVisitFormModel): void {
    this.form.patchValue(
      {
        fullName: model.fullName,
        dateOfBirth: parseDateValue(model.dateOfBirth),
        patientId: extractBasePatientId(model.patientId),
        eventType: model.eventType,
        visitReasons: model.visitReasons,
        status: model.status,
        additionalNotes: model.additionalNotes,
        appointmentAt: parseDateTimeValue(model.appointmentDateTime || this.context.timestamp),
      },
      { emitEvent: false },
    );
  }

  private applyDetailModeReadOnly(): void {
    this.form.disable({ emitEvent: false });
  }

  appointmentDateTimeDisplay(): string {
    return formatDisplayDateTime(this.form.controls.appointmentAt.value) || this.context.timestamp;
  }

  openAppointmentDateTimePicker(): void {
    if (!this.isCreateMode()) {
      return;
    }

    this.initAppointmentPicker();
    this.appointmentMenuTrigger?.openMenu();
  }

  initAppointmentPicker(): void {
    const current =
      this.form.controls.appointmentAt.value ?? parseDateTimeValue(this.context.timestamp) ?? new Date();
    this.appointmentPickerDate.set(current);
    this.appointmentPickerTime.set(toTimeInputValue(current));
  }

  onAppointmentPickerDateChange(date: Date | null): void {
    this.appointmentPickerDate.set(date);
    this.commitAppointmentPicker();
  }

  onAppointmentPickerTimeChange(time: string): void {
    this.appointmentPickerTime.set(time);
    this.commitAppointmentPicker();
  }

  private commitAppointmentPicker(): void {
    const date = this.appointmentPickerDate();
    if (!date) {
      return;
    }

    const updated = applyTimeToDate(date, this.appointmentPickerTime());
    if (!updated) {
      return;
    }

    this.form.controls.appointmentAt.setValue(updated);
    this.form.controls.appointmentAt.markAsDirty();
  }

  isInvalid(controlName: keyof PatientVisitFormGroup['controls']): boolean {
    if (!this.isCreateMode()) {
      return false;
    }

    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  submitForm(): void {
    if (this.isDetailMode()) {
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
