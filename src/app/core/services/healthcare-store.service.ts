import { computed, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { APP_ROUTES, SNACKBAR_DURATION_MS } from '../constants';
import {
  ProfileMenuAction,
  ShortcutAction,
  WorklistDay,
} from '../../shared/enums';
import {
  RECENT_PATIENTS_MOCK,
  STICKY_NOTES_MOCK,
  WORKLIST_TODAY_MOCK,
  WORKLIST_TOMORROW_MOCK,
  WORKLIST_YESTERDAY_MOCK,
} from '../../shared/data/mocks/dashboard.mock';
import {
  PatientVisitFormModel,
  PatientVisitPrefill,
  PatientVisitRecord,
  RecentPatient,
  StickyNote,
  WorklistAppointment,
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class HealthcareStoreService {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private readonly worklists: Record<WorklistDay, WorklistAppointment[]> = {
    [WorklistDay.Yesterday]: WORKLIST_YESTERDAY_MOCK,
    [WorklistDay.Today]: WORKLIST_TODAY_MOCK,
    [WorklistDay.Tomorrow]: WORKLIST_TOMORROW_MOCK,
  };

  readonly notes = signal<StickyNote[]>([...STICKY_NOTES_MOCK]);
  readonly patientMessageBadge = signal(3);
  readonly globalSearch = signal('');
  readonly worklistDay = signal<WorklistDay>(WorklistDay.Today);
  readonly expandedIds = signal<Set<string>>(
    new Set(WORKLIST_TODAY_MOCK.filter((item) => item.expanded).map((item) => item.id)),
  );
  readonly createdVisits = signal<PatientVisitRecord[]>([]);

  readonly worklistAppointments = computed(() =>
    this.filterAppointments(this.worklists[this.worklistDay()]),
  );

  readonly recentPatients = computed(() => {
    const query = this.globalSearch().trim().toLowerCase();
    if (!query) {
      return RECENT_PATIENTS_MOCK;
    }

    return RECENT_PATIENTS_MOCK.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.personalId.toLowerCase().includes(query),
    );
  });

  setGlobalSearch(value: string): void {
    this.globalSearch.set(value);
  }

  showPreviousWorklist(): void {
    this.worklistDay.set(
      this.worklistDay() === WorklistDay.Tomorrow ? WorklistDay.Today : WorklistDay.Yesterday,
    );
    this.resetExpandedForCurrentDay();
  }

  showNextWorklist(): void {
    this.worklistDay.set(
      this.worklistDay() === WorklistDay.Yesterday ? WorklistDay.Today : WorklistDay.Tomorrow,
    );
    this.resetExpandedForCurrentDay();
  }

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  setExpanded(id: string, expanded: boolean): void {
    this.expandedIds.update((current) => {
      const next = new Set(current);
      if (expanded) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  openPatientVisitForm(prefill: PatientVisitPrefill = {}): void {
    this.router.navigate([APP_ROUTES.patientVisitNew], {
      queryParams: {
        fullName: prefill.fullName || null,
        dateOfBirth: prefill.dateOfBirth || null,
        patientId: prefill.patientId || null,
        eventType: prefill.eventType || null,
        visitReasons: prefill.visitReasons || null,
      },
    });
  }

  openPatient(appointment: WorklistAppointment): void {
    this.openPatientVisitForm({
      fullName: appointment.patientName,
      patientId: appointment.patientId,
      eventType: appointment.appointmentType,
    });
  }

  openRecentPatient(patient: RecentPatient): void {
    this.openPatientVisitForm({
      fullName: patient.name,
      patientId: patient.personalId,
    });
  }

  openClinicalAction(eventType: string): void {
    this.openPatientVisitForm({ eventType });
  }

  openTelehealthVisit(appointment: WorklistAppointment): void {
    this.notify(`Opening telehealth session for ${appointment.patientName}.`);
  }

  openMessages(appointment: WorklistAppointment): void {
    if (appointment.patientMessage) {
      this.setExpanded(appointment.id, true);
      return;
    }

    this.notify(`No messages for ${appointment.patientName}.`);
  }

  handleShortcut(action: ShortcutAction): void {
    switch (action) {
      case ShortcutAction.PatientReview:
        this.globalSearch.set('');
        this.worklistDay.set(WorklistDay.Today);
        this.notify("Showing today's patient review worklist.");
        break;
      case ShortcutAction.PatientMessages:
        this.patientMessageBadge.set(0);
        this.notify('3 unread patient messages: James Lake, Michael Cohen, Karl Newman.');
        break;
      case ShortcutAction.DoctorMessages:
        this.notify('2 doctor messages waiting in the inbox.');
        break;
      case ShortcutAction.WorkingHours:
        this.notify("Today's schedule: 08:00–16:00. Next break at 12:00.");
        break;
      case ShortcutAction.Calendar:
        this.notify('Calendar opened for the current week.');
        break;
      case ShortcutAction.Settings:
        this.notify('Settings panel is not available in this demo.');
        break;
      case ShortcutAction.HealthPortal:
        this.notify('Health portal opened in a new tab.');
        break;
    }
  }

  handleProfileAction(action: ProfileMenuAction | undefined): void {
    switch (action) {
      case ProfileMenuAction.Settings:
        this.notify('Settings saved locally for this session.');
        break;
      case ProfileMenuAction.Admin:
        this.notify('Admin panel access is disabled in this demo.');
        break;
      case ProfileMenuAction.Logout:
        this.globalSearch.set('');
        this.router.navigate(['/']);
        this.notify('You have been logged out.');
        break;
    }
  }

  showNotifications(): void {
    this.notify('You have 2 system notifications and 3 patient messages.');
  }

  addNote(): void {
    const note: StickyNote = {
      id: crypto.randomUUID(),
      preview: `Note added at ${new Date().toLocaleTimeString()}`,
    };

    this.notes.update((current) => [...current, note]);
    this.notify('Note added.');
  }

  deleteNotes(): void {
    this.notes.set([]);
    this.notify('All notes removed.');
  }

  downloadNotes(): void {
    const payload = JSON.stringify(this.notes(), null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'worklist-notes.json';
    anchor.click();
    URL.revokeObjectURL(url);
    this.notify('Notes downloaded.');
  }

  createVisit(value: PatientVisitFormModel): PatientVisitRecord {
    const visit: PatientVisitRecord = {
      ...value,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.createdVisits.update((current) => [visit, ...current]);
    return visit;
  }

  private filterAppointments(appointments: WorklistAppointment[]): WorklistAppointment[] {
    const query = this.globalSearch().trim().toLowerCase();
    if (!query) {
      return appointments;
    }

    return appointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(query) ||
        appointment.patientId.toLowerCase().includes(query) ||
        appointment.appointmentType.toLowerCase().includes(query),
    );
  }

  private resetExpandedForCurrentDay(): void {
    const defaultExpanded = this.worklists[this.worklistDay()]
      .filter((item) => item.expanded)
      .map((item) => item.id);

    this.expandedIds.set(new Set(defaultExpanded));
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Close', { duration: SNACKBAR_DURATION_MS });
  }
}
