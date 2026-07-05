import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { CLINICAL_ACTIONS_MOCK } from '../../../../core/data/mocks';
import { IconTileButtonComponent, UiCardComponent } from '../../../../layouts/ui';
import { ClinicalAction } from '../../../../shared/interfaces';

@Component({
  selector: 'app-action-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconTileButtonComponent, UiCardComponent],
  templateUrl: './action-grid.component.html',
})
export class ActionGridComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly actions = CLINICAL_ACTIONS_MOCK;

  openAction(action: ClinicalAction): void {
    this.store.openClinicalAction(action.eventType);
  }

  createCustomAction(): void {
    this.store.openPatientVisitForm();
  }
}
