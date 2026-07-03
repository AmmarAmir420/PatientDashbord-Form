import { computed, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {
  RECENT_PATIENTS,
  STICKY_NOTES,
  WORKLIST_APPOINTMENTS,
  WORKLIST_TOMORROW,
  WORKLIST_YESTERDAY,
} from '../../shared/data/dashboard.data';
import {
  EventFormPrefill,
  EventFormValue,
  PatientEvent,
  RecentPatient,
  ShortcutAction,
  StickyNote,
  WorklistAppointment,
  WorklistDay,
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class HealthcareStoreService {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private readonly worklists: Record<WorklistDay, WorklistAppointment[]> = {
    yesterday: WORKLIST_YESTERDAY,
    today: WORKLIST_APPOINTMENTS,
    tomorrow: WORKLIST_TOMORROW,
  };

  readonly notes = signal<StickyNote[]>([...STICKY_NOTES]);
  readonly patientMessageBadge = signal(3);
  readonly globalSearch = signal('');
  readonly worklistDay = signal<WorklistDay>('today');
  readonly expandedIds = signal<Set<string>>(
    new Set(WORKLIST_APPOINTMENTS.filter((item) => item.expanded).map((item) => item.id)),
  );
  readonly createdEvents = signal<PatientEvent[]>([]);

  readonly worklistAppointments = computed(() =>
    this.filterAppointments(this.worklists[this.worklistDay()]),
  );

  readonly recentPatients = computed(() => {
    const query = this.globalSearch().trim().toLowerCase();
    if (!query) {
      return RECENT_PATIENTS;
    }

    return RECENT_PATIENTS.filter(
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
      this.worklistDay() === 'tomorrow' ? 'today' : 'yesterday',
    );
    this.resetExpandedForCurrentDay();
  }

  showNextWorklist(): void {
    this.worklistDay.set(
      this.worklistDay() === 'yesterday' ? 'today' : 'tomorrow',
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

  openEventForm(prefill: EventFormPrefill = {}): void {
    this.router.navigate(['/event/new'], {
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
    this.openEventForm({
      fullName: appointment.patientName,
      patientId: appointment.patientId,
      eventType: appointment.appointmentType,
    });
  }

  openRecentPatient(patient: RecentPatient): void {
    this.openEventForm({
      fullName: patient.name,
      patientId: patient.personalId,
    });
  }

  openClinicalAction(eventType: string): void {
    this.openEventForm({ eventType });
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
      case 'patient-review':
        this.globalSearch.set('');
        this.worklistDay.set('today');
        this.notify('Showing today\'s patient review worklist.');
        break;
      case 'patient-messages':
        this.patientMessageBadge.set(0);
        this.notify('3 unread patient messages: James Lake, Michael Cohen, Karl Newman.');
        break;
      case 'doctor-messages':
        this.notify('2 doctor messages waiting in the inbox.');
        break;
      case 'working-hours':
        this.notify('Today\'s schedule: 08:00–16:00. Next break at 12:00.');
        break;
      case 'calendar':
        this.notify('Calendar opened for the current week.');
        break;
      case 'settings':
        this.notify('Settings panel is not available in this demo.');
        break;
      case 'health-portal':
        this.notify('Health portal opened in a new tab.');
        break;
    }
  }

  handleProfileAction(action: 'settings' | 'admin' | 'logout' | undefined): void {
    switch (action) {
      case 'settings':
        this.notify('Settings saved locally for this session.');
        break;
      case 'admin':
        this.notify('Admin panel access is disabled in this demo.');
        break;
      case 'logout':
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

  createEvent(value: EventFormValue): PatientEvent {
    const event: PatientEvent = {
      ...value,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.createdEvents.update((current) => [event, ...current]);
    return event;
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
    this.snackBar.open(message, 'Close', { duration: 3500 });
  }
}
