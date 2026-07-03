import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { HealthcareStoreService } from '../../core/services/healthcare-store.service';
import { AppHeaderComponent } from '../../shared/components';
import { EVENT_FORM_CONTEXT } from '../../shared/data/event-form.data';
import { EventStatus } from '../../shared/models';

@Component({
  selector: 'app-event-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    AppHeaderComponent,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(HealthcareStoreService);
  private readonly snackBar = inject(MatSnackBar);

  readonly context = EVENT_FORM_CONTEXT;

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    dateOfBirth: [''],
    patientId: ['', Validators.required],
    eventType: ['', Validators.required],
    visitReasons: [''],
    status: ['draft' as EventStatus],
    additionalNotes: [''],
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.form.patchValue({
        fullName: params.get('fullName') ?? '',
        dateOfBirth: params.get('dateOfBirth') ?? '',
        patientId: params.get('patientId') ?? '',
        eventType: params.get('eventType') ?? '',
        visitReasons: params.get('visitReasons') ?? '',
      });
    });
  }

  createEvent(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Please complete the required fields.', 'Close', { duration: 3500 });
      return;
    }

    const event = this.store.createEvent(this.form.getRawValue());
    this.snackBar.open(`Event created for ${event.fullName}.`, 'Close', { duration: 3500 });
    this.router.navigate(['/']);
  }

  close(): void {
    this.router.navigate(['/']);
  }
}
