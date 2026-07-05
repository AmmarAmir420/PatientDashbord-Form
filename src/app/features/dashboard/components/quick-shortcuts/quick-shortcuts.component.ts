import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { ShortcutAction } from '../../../../shared/enums';
import { QUICK_SHORTCUTS_MOCK } from '../../../../shared/data/mocks/dashboard.mock';
import { IconTileButtonComponent } from '../../../../layouts/ui';
import { QuickShortcut } from '../../../../shared/models';

@Component({
  selector: 'app-quick-shortcuts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconTileButtonComponent],
  templateUrl: './quick-shortcuts.component.html',
})
export class QuickShortcutsComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly shortcuts = computed<QuickShortcut[]>(() =>
    QUICK_SHORTCUTS_MOCK.map((shortcut) =>
      shortcut.action === ShortcutAction.PatientMessages
        ? { ...shortcut, badge: this.store.patientMessageBadge() || undefined }
        : shortcut,
    ),
  );

  onShortcutClick(shortcut: QuickShortcut): void {
    this.store.handleShortcut(shortcut.action);
  }
}
