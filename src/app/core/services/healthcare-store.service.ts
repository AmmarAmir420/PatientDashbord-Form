import { computed, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { APP_ROUTES, SNACKBAR_DURATION_MS } from '../constants';
import {
  ProfileMenuAction,
  ShortcutAction,
  VisitStatus,
  WorklistDay,
} from '../../shared/enums';
import {
  RECENT_PATIENTS_MOCK,
  STICKY_NOTES_MOCK,
  WORKLIST_TODAY_MOCK,
  WORKLIST_TOMORROW_MOCK,
  WORKLIST_YESTERDAY_MOCK,
} from '../data/mocks';
import { PATIENT_VISIT_CONTEXT_MOCK, PATIENT_VISIT_DETAIL_DEFAULTS } from '../data/mocks/patient-visit.mock';
import {
  PatientVisitFormModel,
  PatientVisitPrefill,
  PatientVisitRecord,
  RecentPatient,
  StickyNote,
  WorklistAppointment,
} from '../../shared/interfaces';
import {
  formatWorklistTime,
  formatPatientIdWithAge,
  extractBasePatientId,
  parseDateTimeValue,
  parseDateValue,
  resolveWorklistDay,
  sortWorklistAppointments,
  filterRecentPatients,
  filterWorklistAppointments,
} from '../../shared/utils';

@Injectable({ providedIn: 'root' })
export class HealthcareStoreService {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private readonly worklistState = signal<Record<WorklistDay, WorklistAppointment[]>>({
    [WorklistDay.Yesterday]: [...WORKLIST_YESTERDAY_MOCK],
    [WorklistDay.Today]: [...WORKLIST_TODAY_MOCK],
    [WorklistDay.Tomorrow]: [...WORKLIST_TOMORROW_MOCK],
  });

  readonly notes = signal<StickyNote[]>([...STICKY_NOTES_MOCK]);
  readonly patientMessageBadge = signal(3);
  readonly globalSearch = signal('');
  readonly worklistDay = signal<WorklistDay>(WorklistDay.Today);
  readonly expandedIds = signal<Set<string>>(
    new Set(WORKLIST_TODAY_MOCK.filter((item) => item.expanded).map((item) => item.id)),
  );
  readonly createdVisits = signal<PatientVisitRecord[]>([]);
  private readonly recentPatientsState = signal<RecentPatient[]>([...RECENT_PATIENTS_MOCK]);

  readonly worklistAppointments = computed(() => {
    const appointments = sortWorklistAppointments(
      this.worklistState()[this.worklistDay()].map((appointment) =>
        this.enrichWorklistAppointment(appointment),
      ),
    );

    return filterWorklistAppointments(appointments, this.globalSearch());
  });

  readonly recentPatients = computed(() =>
    filterRecentPatients(this.recentPatientsState(), this.globalSearch()),
  );

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
      const next = expanded ? new Set<string>() : new Set(current);
      if (expanded) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  openPatientVisitForm(prefill: PatientVisitPrefill = {}): void {
    this.navigateToPatientVisit({
      fullName: prefill.fullName,
      dateOfBirth: prefill.dateOfBirth,
      patientId: prefill.patientId,
      eventType: prefill.eventType,
      visitReasons: prefill.visitReasons,
    });
  }

  openPatient(appointment: WorklistAppointment): void {
    this.navigateToPatientVisit({
      mode: 'detail',
      source: 'worklist',
      visitId: appointment.id,
      fullName: appointment.patientName,
      patientId: appointment.patientId,
      eventType: appointment.appointmentType,
    });
  }

  openRecentPatient(patient: RecentPatient): void {
    this.navigateToPatientVisit({
      mode: 'detail',
      source: 'recent',
      visitId: patient.id,
      fullName: patient.name,
      patientId: patient.personalId,
    });
  }

  getPatientVisitDetailModel(
    patientId: string,
    fullName: string,
    options: {
      source: 'recent' | 'worklist';
      visitId?: string | null;
      eventType?: string | null;
    },
  ): PatientVisitFormModel {
    const existing = this.findVisit(options.visitId, patientId, fullName);
    if (existing) {
      return {
        ...existing,
        patientId: extractBasePatientId(existing.patientId),
      };
    }

    const defaults = PATIENT_VISIT_DETAIL_DEFAULTS[options.source];

    return {
      fullName,
      patientId: extractBasePatientId(patientId),
      dateOfBirth: defaults.dateOfBirth,
      eventType: options.eventType ?? defaults.eventType,
      visitReasons: defaults.visitReasons,
      status: defaults.status,
      additionalNotes: defaults.additionalNotes,
      appointmentDateTime: PATIENT_VISIT_CONTEXT_MOCK.timestamp,
    };
  }

  createVisit(value: PatientVisitFormModel): PatientVisitRecord {
    return this.saveVisit(value);
  }

  saveVisit(value: PatientVisitFormModel, visitId?: string | null): PatientVisitRecord {
    const existing = this.findVisit(visitId, value.patientId, value.fullName);

    if (existing) {
      return this.updateVisit(existing.id, value) ?? existing;
    }

    const visit: PatientVisitRecord = {
      ...value,
      id: visitId ?? crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.createdVisits.update((current) => [visit, ...current]);
    this.applyVisitSideEffects(visit, visitId);
    return visit;
  }

  private updateVisit(id: string, value: PatientVisitFormModel): PatientVisitRecord | undefined {
    let updated: PatientVisitRecord | undefined;

    this.createdVisits.update((current) =>
      current.map((visit) => {
        if (visit.id !== id) {
          return visit;
        }

        updated = { ...visit, ...value };
        return updated;
      }),
    );

    if (updated) {
      this.applyVisitSideEffects(updated);
    }

    return updated;
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
        this.openPatientVisitForm();
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

  private applyVisitSideEffects(visit: PatientVisitRecord, recentPatientId?: string | null): void {
    const worklistDay = this.addVisitToWorklist(visit);
    this.worklistDay.set(worklistDay);

    if (visit.status === VisitStatus.Approved) {
      this.removeRecentPatient(visit, recentPatientId);
      return;
    }

    this.prependRecentPatient({
      id: visit.id,
      name: visit.fullName,
      personalId: this.buildPersonalId(visit),
    });
  }

  private removeRecentPatient(visit: PatientVisitRecord, recentPatientId?: string | null): void {
    this.recentPatientsState.update((current) =>
      current.filter((patient) => {
        if (recentPatientId && patient.id === recentPatientId) {
          return false;
        }

        return !(
          patient.name === visit.fullName && this.matchesPatientId(patient.personalId, visit.patientId)
        );
      }),
    );
  }

  private addVisitToWorklist(visit: PatientVisitRecord): WorklistDay {
    const appointment = this.toWorklistAppointment(visit);
    const worklistDay = this.toWorklistDay(parseDateTimeValue(visit.appointmentDateTime));

    this.worklistState.update((state) => {
      const next: Record<WorklistDay, WorklistAppointment[]> = {
        [WorklistDay.Yesterday]: [...state[WorklistDay.Yesterday]],
        [WorklistDay.Today]: [...state[WorklistDay.Today]],
        [WorklistDay.Tomorrow]: [...state[WorklistDay.Tomorrow]],
      };

      for (const day of Object.values(WorklistDay)) {
        next[day] = next[day].filter((item) => item.patientName !== visit.fullName);
      }

      next[worklistDay] = [...next[worklistDay], appointment];
      return next;
    });

    return worklistDay;
  }

  private toWorklistAppointment(visit: PatientVisitRecord): WorklistAppointment {
    const appointmentAt = parseDateTimeValue(visit.appointmentDateTime);

    return {
      id: visit.id,
      time: formatWorklistTime(appointmentAt),
      patientName: visit.fullName,
      patientId: this.buildPersonalId(visit),
      appointmentType: visit.eventType,
      patientMessage: visit.additionalNotes || undefined,
    };
  }

  private toWorklistDay(date: Date | null): WorklistDay {
    switch (resolveWorklistDay(date)) {
      case 'yesterday':
        return WorklistDay.Yesterday;
      case 'tomorrow':
        return WorklistDay.Tomorrow;
      default:
        return WorklistDay.Today;
    }
  }

  private buildPersonalId(visit: PatientVisitFormModel): string {
    return formatPatientIdWithAge(
      visit.patientId,
      parseDateValue(visit.dateOfBirth),
      parseDateTimeValue(visit.appointmentDateTime),
    );
  }

  private matchesPatientId(storedId: string, lookupId: string): boolean {
    if (storedId === lookupId) {
      return true;
    }

    return extractBasePatientId(storedId) === extractBasePatientId(lookupId);
  }

  private prependRecentPatient(patient: RecentPatient): void {
    this.recentPatientsState.update((current) => [
      patient,
      ...current.filter((entry) => entry.personalId !== patient.personalId),
    ]);
  }

  private enrichWorklistAppointment(appointment: WorklistAppointment): WorklistAppointment {
    const visit = this.findVisit(
      appointment.id,
      appointment.patientId,
      appointment.patientName,
    );

    if (!visit) {
      return appointment;
    }

    return {
      ...appointment,
      patientId: this.buildPersonalId(visit),
    };
  }

  private findVisit(
    visitId: string | null | undefined,
    patientId: string,
    fullName?: string,
  ): PatientVisitRecord | undefined {
    if (visitId) {
      const byId = this.createdVisits().find((visit) => visit.id === visitId);
      if (byId) {
        return byId;
      }
    }

    if (!fullName) {
      return undefined;
    }

    return this.createdVisits().find(
      (visit) =>
        visit.fullName === fullName && this.matchesPatientId(visit.patientId, patientId),
    );
  }

  private navigateToPatientVisit(
    queryParams: Record<string, string | null | undefined>,
  ): void {
    this.router.navigate([APP_ROUTES.patientVisitNew], {
      queryParams: Object.fromEntries(
        Object.entries(queryParams).map(([key, value]) => [key, value ?? null]),
      ),
    });
  }

  private resetExpandedForCurrentDay(): void {
    const defaultExpanded = this.worklistState()[this.worklistDay()]
      .filter((item) => item.expanded)
      .map((item) => item.id);

    this.expandedIds.set(new Set(defaultExpanded));
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Close', { duration: SNACKBAR_DURATION_MS });
  }
}
