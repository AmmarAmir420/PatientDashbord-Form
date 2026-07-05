import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { UI_COPY } from '../../../../core/constants';
import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { SectionHeaderComponent, UiCardComponent } from '../../../../layouts/ui';

@Component({
  selector: 'app-notes-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, SectionHeaderComponent, UiCardComponent],
  templateUrl: './notes-panel.component.html',
})
export class NotesPanelComponent {
  readonly store = inject(HealthcareStoreService);
  readonly copy = UI_COPY;
}
