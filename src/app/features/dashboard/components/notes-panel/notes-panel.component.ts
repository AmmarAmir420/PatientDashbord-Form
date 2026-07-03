import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';

@Component({
  selector: 'app-notes-panel',
  imports: [MatIconModule],
  templateUrl: './notes-panel.component.html',
  styleUrl: './notes-panel.component.scss',
})
export class NotesPanelComponent {
  readonly store = inject(HealthcareStoreService);
}
