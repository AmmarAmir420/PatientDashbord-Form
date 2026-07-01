import { Component, input, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { RECENT_PATIENTS } from '../../../../shared/data/dashboard.data';
import { RecentPatient } from '../../../../shared/models';

@Component({
  selector: 'app-recent-patients',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './recent-patients.component.html',
  styleUrl: './recent-patients.component.scss',
})
export class RecentPatientsComponent {
  readonly patients = input<RecentPatient[]>(RECENT_PATIENTS);
  readonly searchQuery = signal('');

  filteredPatients(): RecentPatient[] {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.patients();
    }

    return this.patients().filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.personalId.toLowerCase().includes(query),
    );
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }
}
