import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { ActionButtonComponent } from '../../../../layouts/ui';
import { WorklistAppointment } from '../../../../shared/interfaces';

@Component({
  selector: 'app-worklist-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionButtonComponent, MatIconModule],
  templateUrl: './worklist-item.component.html',
})
export class WorklistItemComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly appointment = input.required<WorklistAppointment>();
  readonly expanded = input(false);
  readonly expandedChange = output<boolean>();

  toggleExpanded(): void {
    this.expandedChange.emit(!this.expanded());
  }

  openPatient(): void {
    this.store.openPatient(this.appointment());
  }

  openTelehealthVisit(): void {
    this.store.openTelehealthVisit(this.appointment());
  }

  openMessages(): void {
    this.store.openMessages(this.appointment());
  }
}
