import { ProfileMenuAction } from './enums/profile-menu-action.enum';
import { ShortcutAction } from './enums/shortcut-action.enum';
import { VisitStatus } from './enums/visit-status.enum';

export interface UserProfile {
  fullName: string;
  role: string;
  employeeId: string;
  avatarInitials: string;
}

export interface ProfileMenuItem {
  label: string;
  icon: string;
  action?: ProfileMenuAction;
}

export interface WorklistAppointment {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  appointmentType: string;
  patientMessage?: string;
  expanded?: boolean;
}

export interface RecentPatient {
  id: string;
  name: string;
  personalId: string;
}

export interface QuickShortcut {
  label: string;
  icon: string;
  badge?: number;
  action: ShortcutAction;
}

export interface ClinicalAction {
  label: string;
  icon: string;
  eventType: string;
}

export interface StickyNote {
  id: string;
  preview?: string;
}

export interface PatientVisitContext {
  providerLine: string;
  timestamp: string;
  doctorName: string;
}

export interface PatientVisitFormModel {
  fullName: string;
  dateOfBirth: string;
  patientId: string;
  eventType: string;
  visitReasons: string;
  status: VisitStatus;
  additionalNotes: string;
  appointmentDateTime: string;
}

export interface PatientVisitPrefill {
  fullName?: string;
  dateOfBirth?: string;
  patientId?: string;
  eventType?: string;
  visitReasons?: string;
}

export interface PatientVisitRecord extends PatientVisitFormModel {
  id: string;
  createdAt: string;
}
