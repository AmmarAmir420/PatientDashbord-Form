import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { WorklistAppointment } from '../../../../shared/models';

@Component({
  selector: 'app-worklist-item',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './worklist-item.component.html',
  styleUrl: './worklist-item.component.scss',
})
export class WorklistItemComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly appointment = input.required<WorklistAppointment>();
  readonly expanded = input(false);
  readonly expandedChange = output<boolean>();

  toggleExpanded(): void {
    this.expandedChange.emit(!this.expanded());
  }

  openTelehealthVisit(): void {
    this.store.openTelehealthVisit(this.appointment());
  }

  openPatient(): void {
    this.store.openPatient(this.appointment());
  }

  openMessages(): void {
    this.store.openMessages(this.appointment());
  }
}
