import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';

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
export class EventFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly context = EVENT_FORM_CONTEXT;

  readonly form = this.fb.nonNullable.group({
    fullName: [''],
    dateOfBirth: [''],
    patientId: [''],
    eventType: [''],
    visitReasons: [''],
    status: ['draft' as EventStatus],
    additionalNotes: [''],
  });

  createEvent(): void {
    if (this.form.invalid) {
      return;
    }
    this.router.navigate(['/']);
  }

  close(): void {
    this.router.navigate(['/']);
  }
}
