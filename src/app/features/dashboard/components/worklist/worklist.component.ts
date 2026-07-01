import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { WORKLIST_APPOINTMENTS } from '../../../../shared/data/dashboard.data';
import { WorklistAppointment } from '../../../../shared/models';
import { WorklistItemComponent } from '../worklist-item/worklist-item.component';

@Component({
  selector: 'app-worklist',
  imports: [MatButtonModule, MatIconModule, WorklistItemComponent],
  templateUrl: './worklist.component.html',
  styleUrl: './worklist.component.scss',
})
export class WorklistComponent {
  readonly appointments = input<WorklistAppointment[]>(WORKLIST_APPOINTMENTS);

  readonly expandedIds = signal<Set<string>>(
    new Set(WORKLIST_APPOINTMENTS.filter((a) => a.expanded).map((a) => a.id)),
  );

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  setExpanded(id: string, expanded: boolean): void {
    this.expandedIds.update((current) => {
      const next = new Set(current);
      if (expanded) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }
}
