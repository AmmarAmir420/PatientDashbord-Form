import { Component, computed, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';

import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { QUICK_SHORTCUTS } from '../../../../shared/data/dashboard.data';
import { QuickShortcut } from '../../../../shared/models';

@Component({
  selector: 'app-quick-shortcuts',
  imports: [MatBadgeModule, MatIconModule],
  templateUrl: './quick-shortcuts.component.html',
  styleUrl: './quick-shortcuts.component.scss',
})
export class QuickShortcutsComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly shortcuts = computed<QuickShortcut[]>(() =>
    QUICK_SHORTCUTS.map((shortcut) =>
      shortcut.action === 'patient-messages'
        ? { ...shortcut, badge: this.store.patientMessageBadge() || undefined }
        : shortcut,
    ),
  );

  onShortcutClick(shortcut: QuickShortcut): void {
    this.store.handleShortcut(shortcut.action);
  }
}
