import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { STICKY_NOTES } from '../../../../shared/data/dashboard.data';
import { StickyNote } from '../../../../shared/models';

@Component({
  selector: 'app-notes-panel',
  imports: [MatIconModule],
  templateUrl: './notes-panel.component.html',
  styleUrl: './notes-panel.component.scss',
})
export class NotesPanelComponent {
  readonly notes = input<StickyNote[]>(STICKY_NOTES);
}
