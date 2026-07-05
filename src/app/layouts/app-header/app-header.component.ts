import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { UI_COPY } from '../../core/constants';
import { HealthcareStoreService } from '../../core/services/healthcare-store.service';
import {
  CURRENT_USER_MOCK,
  PROFILE_MENU_ITEMS_MOCK,
} from '../../core/data/mocks';
import { ProfileMenuAction } from '../../shared/enums';
import { UserProfile } from '../../shared/interfaces';
import { AvatarComponent } from '../ui/avatar/avatar.component';
import { IconButtonComponent } from '../ui/buttons/app-buttons.component';
import { SearchInputComponent } from '../ui/search-input/search-input.component';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatMenuModule,
    AvatarComponent,
    IconButtonComponent,
    SearchInputComponent,
  ],
  templateUrl: './app-header.component.html',
  host: { class: 'sticky top-0 z-40 block border-b border-gray-200 bg-white' },
})
export class AppHeaderComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly copy = UI_COPY;
  readonly user = input<UserProfile>(CURRENT_USER_MOCK);
  readonly menuItems = PROFILE_MENU_ITEMS_MOCK;
  readonly profileMenuOpen = signal(false);
  readonly searchQuery = this.store.globalSearch;

  onSearch(value: string): void {
    this.store.setGlobalSearch(value);
  }

  onNotificationClick(): void {
    this.store.showNotifications();
  }

  onProfileAction(action: ProfileMenuAction | undefined): void {
    this.store.handleProfileAction(action);
  }
}
