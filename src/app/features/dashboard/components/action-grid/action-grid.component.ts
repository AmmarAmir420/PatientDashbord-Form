import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { CLINICAL_ACTIONS } from '../../../../shared/data/dashboard.data';
import { ClinicalAction } from '../../../../shared/models';

@Component({
  selector: 'app-action-grid',
  imports: [MatIconModule],
  templateUrl: './action-grid.component.html',
  styleUrl: './action-grid.component.scss',
})
export class ActionGridComponent {
  readonly actions = input<ClinicalAction[]>(CLINICAL_ACTIONS);
}
