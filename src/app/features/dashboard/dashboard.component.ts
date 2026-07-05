import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { ActionGridComponent } from './components/action-grid/action-grid.component';
import { NotesPanelComponent } from './components/notes-panel/notes-panel.component';
import { QuickShortcutsComponent } from './components/quick-shortcuts/quick-shortcuts.component';
import { RecentPatientsComponent } from './components/recent-patients/recent-patients.component';
import { WorklistComponent } from './components/worklist/worklist.component';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MainLayoutComponent,
    QuickShortcutsComponent,
    WorklistComponent,
    NotesPanelComponent,
    ActionGridComponent,
    RecentPatientsComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
