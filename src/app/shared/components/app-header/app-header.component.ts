import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

import { HealthcareStoreService } from '../../../core/services/healthcare-store.service';
import {
  CURRENT_USER,
  PROFILE_MENU_ITEMS,
} from '../../data/dashboard.data';
import { UserProfile } from '../../models';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly user = input<UserProfile>(CURRENT_USER);
  readonly menuItems = PROFILE_MENU_ITEMS;
  readonly profileMenuOpen = signal(false);
  readonly searchQuery = this.store.globalSearch;

  onSearch(value: string): void {
    this.store.setGlobalSearch(value);
  }

  onNotificationClick(): void {
    this.store.showNotifications();
  }

  onProfileAction(action: 'settings' | 'admin' | 'logout' | undefined): void {
    this.store.handleProfileAction(action);
  }
}
