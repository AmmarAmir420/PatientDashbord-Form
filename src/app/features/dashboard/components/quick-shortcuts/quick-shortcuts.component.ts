import { Component, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';

import { QUICK_SHORTCUTS } from '../../../../shared/data/dashboard.data';
import { QuickShortcut } from '../../../../shared/models';

@Component({
  selector: 'app-quick-shortcuts',
  imports: [MatBadgeModule, MatIconModule],
  templateUrl: './quick-shortcuts.component.html',
  styleUrl: './quick-shortcuts.component.scss',
})
export class QuickShortcutsComponent {
  readonly shortcuts = input<QuickShortcut[]>(QUICK_SHORTCUTS);
}
