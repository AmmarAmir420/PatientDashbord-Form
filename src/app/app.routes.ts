import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'event/new',
    loadComponent: () =>
      import('./features/event-form/event-form.component').then((m) => m.EventFormComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
