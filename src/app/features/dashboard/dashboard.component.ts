import { Component } from '@angular/core';

import { AppHeaderComponent } from '../../shared/components';
import { ActionGridComponent } from './components/action-grid/action-grid.component';
import { NotesPanelComponent } from './components/notes-panel/notes-panel.component';
import { QuickShortcutsComponent } from './components/quick-shortcuts/quick-shortcuts.component';
import { RecentPatientsComponent } from './components/recent-patients/recent-patients.component';
import { WorklistComponent } from './components/worklist/worklist.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    AppHeaderComponent,
    QuickShortcutsComponent,
    WorklistComponent,
    NotesPanelComponent,
    ActionGridComponent,
    RecentPatientsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
