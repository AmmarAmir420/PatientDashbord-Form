import { Routes } from '@angular/router';

import { APP_ROUTES } from './core/constants';

export const routes: Routes = [
  {
    path: APP_ROUTES.dashboard,
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: APP_ROUTES.patientVisitNew,
    loadComponent: () =>
      import('./features/patient-visit/patient-visit.component').then(
        (m) => m.PatientVisitComponent,
      ),
  },
  {
    path: APP_ROUTES.legacyEventNew,
    redirectTo: APP_ROUTES.patientVisitNew,
  },
  {
    path: '**',
    redirectTo: APP_ROUTES.dashboard,
  },
];
