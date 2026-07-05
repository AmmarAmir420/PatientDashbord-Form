import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { UI_COPY } from '../../../../core/constants';
import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { ShortcutAction, WorklistDay } from '../../../../shared/enums';
import { SectionHeaderComponent, UiCardComponent } from '../../../../layouts/ui';
import { WorklistItemComponent } from '../worklist-item/worklist-item.component';

@Component({
  selector: 'app-worklist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, SectionHeaderComponent, UiCardComponent, WorklistItemComponent],
  templateUrl: './worklist.component.html',
})
export class WorklistComponent {
  readonly store = inject(HealthcareStoreService);
  readonly copy = UI_COPY;
  readonly WorklistDay = WorklistDay;

  readonly worklistTitle = computed(() => {
    switch (this.store.worklistDay()) {
      case WorklistDay.Yesterday:
        return this.copy.yesterdayList;
      case WorklistDay.Tomorrow:
        return this.copy.tomorrowList;
      default:
        return this.copy.worklist;
    }
  });

  showPreviousList(): void {
    this.store.showPreviousWorklist();
  }

  showNextList(): void {
    this.store.showNextWorklist();
  }

  openCalendar(): void {
    this.store.handleShortcut(ShortcutAction.Calendar);
  }
}
