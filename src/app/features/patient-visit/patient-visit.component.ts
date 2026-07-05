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
import { PATIENT_VISIT_CONTEXT_MOCK } from '../../shared/data/mocks/patient-visit.mock';
import {
  FormFieldComponent,
  IconButtonComponent,
  LabelValueRowComponent,
  PrimaryButtonComponent,
  SecondaryButtonComponent,
  UiCardComponent,
} from '../../layouts/ui';
import {
  createPatientVisitForm,
  getPatientVisitFormValue,
  PatientVisitFormGroup,
} from '../../shared/utils';

@Component({
  selector: 'app-patient-visit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MainLayoutComponent,
    FormFieldComponent,
    IconButtonComponent,
    UiCardComponent,
    LabelValueRowComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
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

  readonly form: PatientVisitFormGroup = createPatientVisitForm(this.fb);

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.form.patchValue({
        fullName: params.get('fullName') ?? '',
        dateOfBirth: params.get('dateOfBirth') ?? '',
        patientId: params.get('patientId') ?? '',
        eventType: params.get('eventType') ?? '',
        visitReasons: params.get('visitReasons') ?? '',
      });
    });
  }

  isInvalid(controlName: keyof PatientVisitFormGroup['controls']): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  createVisit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Please complete the required fields.', 'Close', {
        duration: SNACKBAR_DURATION_MS,
      });
      return;
    }

    const visit = this.store.createVisit(getPatientVisitFormValue(this.form));
    this.snackBar.open(`Event created for ${visit.fullName}.`, 'Close', {
      duration: SNACKBAR_DURATION_MS,
    });
    this.router.navigate(['/']);
  }

  close(): void {
    this.router.navigate(['/']);
  }
}
