import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { UI_COPY } from '../../../../core/constants';
import { HealthcareStoreService } from '../../../../core/services/healthcare-store.service';
import { SearchInputComponent, UiCardComponent } from '../../../../layouts/ui';
import { RecentPatient } from '../../../../shared/interfaces';
import { filterRecentPatients } from '../../../../shared/utils';

@Component({
  selector: 'app-recent-patients',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchInputComponent, UiCardComponent],
  templateUrl: './recent-patients.component.html',
})
export class RecentPatientsComponent {
  private readonly store = inject(HealthcareStoreService);

  readonly copy = UI_COPY;
  readonly localSearchQuery = signal('');

  readonly patients = computed(() =>
    filterRecentPatients(this.store.recentPatients(), this.localSearchQuery()),
  );

  onSearch(value: string): void {
    this.localSearchQuery.set(value);
  }

  openPatient(patient: RecentPatient): void {
    this.store.openRecentPatient(patient);
  }
}
