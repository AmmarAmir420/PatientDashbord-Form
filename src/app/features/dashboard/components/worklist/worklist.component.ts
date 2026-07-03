import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { WorklistItemComponent } from '../worklist-item/worklist-item.component';

@Component({
  selector: 'app-worklist',
  imports: [MatButtonModule, MatIconModule, WorklistItemComponent],
  templateUrl: './worklist.component.html',
  styleUrl: './worklist.component.scss',
})
export class WorklistComponent {
  readonly store = inject(HealthcareStoreService);

  readonly worklistDayLabel = {
    yesterday: "Yesterday's list",
    today: 'Worklist',
    tomorrow: "Tomorrow's list",
  } as const;

  showPreviousList(): void {
    this.store.showPreviousWorklist();
  }

  showNextList(): void {
    this.store.showNextWorklist();
  }

  openCalendar(): void {
    this.store.handleShortcut('calendar');
  }
}
