import { Component, computed, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { RecentPatient } from '../../../../shared/models';

@Component({
  selector: 'app-recent-patients',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './recent-patients.component.html',
  styleUrl: './recent-patients.component.scss',
})
export class RecentPatientsComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly localSearchQuery = signal('');

  readonly patients = computed(() => {
    const query = this.localSearchQuery().trim().toLowerCase();
    const patients = this.store.recentPatients();

    if (!query) {
      return patients;
    }

    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.personalId.toLowerCase().includes(query),
    );
  });

  onSearch(value: string): void {
    this.localSearchQuery.set(value);
  }

  openPatient(patient: RecentPatient): void {
    this.store.openRecentPatient(patient);
  }
}
