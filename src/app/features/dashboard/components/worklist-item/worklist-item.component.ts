import { Component, input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { WorklistAppointment } from '../../../../shared/models';

@Component({
  selector: 'app-worklist-item',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './worklist-item.component.html',
  styleUrl: './worklist-item.component.scss',
})
export class WorklistItemComponent {
  readonly appointment = input.required<WorklistAppointment>();
  readonly expanded = model(false);

  toggleExpanded(): void {
    this.expanded.update((value) => !value);
  }
}