import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { CLINICAL_ACTIONS } from '../../../../shared/data/dashboard.data';
import { ClinicalAction } from '../../../../shared/models';

@Component({
  selector: 'app-action-grid',
  imports: [MatIconModule],
  templateUrl: './action-grid.component.html',
  styleUrl: './action-grid.component.scss',
})
export class ActionGridComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly actions = CLINICAL_ACTIONS;

  openAction(action: ClinicalAction): void {
    this.store.openClinicalAction(action.eventType);
  }

  createCustomAction(): void {
    this.store.openEventForm();
  }
}
