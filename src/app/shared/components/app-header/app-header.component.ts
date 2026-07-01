import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

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
  readonly user = input<UserProfile>(CURRENT_USER);
  readonly menuItems = PROFILE_MENU_ITEMS;
  readonly profileMenuOpen = signal(false);
}
