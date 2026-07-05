import { ProfileMenuAction } from '../../enums/profile-menu-action.enum';
import { ShortcutAction } from '../../enums/shortcut-action.enum';
import {
  ClinicalAction,
  ProfileMenuItem,
  QuickShortcut,
  RecentPatient,
  StickyNote,
  UserProfile,
  WorklistAppointment,
} from '../../models';

export const CURRENT_USER_MOCK: UserProfile = {
  fullName: 'Tuomas Veikko Kerola',
  role: 'Specialist Nursing',
  employeeId: 'Spec. care dept. P0007',
  avatarInitials: 'TK',
};

export const PROFILE_MENU_ITEMS_MOCK: ProfileMenuItem[] = [
  { label: 'Settings', icon: 'settings', action: ProfileMenuAction.Settings },
  { label: 'Open admin panel', icon: 'admin_panel_settings', action: ProfileMenuAction.Admin },
  { label: 'Log out', icon: 'logout', action: ProfileMenuAction.Logout },
];

export const QUICK_SHORTCUTS_MOCK: QuickShortcut[] = [
  { label: 'Patient review', icon: 'create_new_folder', action: ShortcutAction.PatientReview },
  {
    label: 'Patient messages',
    icon: 'smartphone',
    badge: 3,
    action: ShortcutAction.PatientMessages,
  },
  { label: 'Doctor messages', icon: 'forum', action: ShortcutAction.DoctorMessages },
  { label: 'Working hours', icon: 'schedule', action: ShortcutAction.WorkingHours },
  { label: 'Calendar', icon: 'calendar_month', action: ShortcutAction.Calendar },
  { label: 'Settings', icon: 'settings', action: ShortcutAction.Settings },
  { label: 'Health portal', icon: 'health_and_safety', action: ShortcutAction.HealthPortal },
];

export const WORKLIST_TODAY_MOCK: WorklistAppointment[] = [
  {
    id: '1',
    time: '09:00 AM',
    patientName: 'James Lake',
    patientId: '240545-123Y',
    appointmentType: 'Telehealth visit',
    expanded: true,
    patientMessage:
      'Hello doctor, thank you for approving the appointment. I am ready for the visit at 09:00. I have had chest pain last week and would like to discuss it.',
  },
  {
    id: '2',
    time: '09:30 AM',
    patientName: 'Michael Cohen',
    patientId: '240545-123Y',
    appointmentType: 'Telehealth visit',
  },
  {
    id: '3',
    time: '10:00 AM',
    patientName: 'Karl Newman',
    patientId: '240545-123Y',
    appointmentType: 'Telehealth visit',
  },
  {
    id: '4',
    time: '11:00 AM',
    patientName: 'George Virtan',
    patientId: '240545-123Y',
    appointmentType: 'Telehealth visit',
  },
];

export const WORKLIST_YESTERDAY_MOCK: WorklistAppointment[] = [
  {
    id: 'y1',
    time: '02:00 PM',
    patientName: 'Oliver Wilson',
    patientId: '240545-123Y',
    appointmentType: 'Follow-up visit',
    patientMessage: 'Follow-up on blood pressure medication.',
  },
  {
    id: 'y2',
    time: '03:30 PM',
    patientName: 'Eva Cohen',
    patientId: '240545-123Y',
    appointmentType: 'Telehealth visit',
  },
];

export const WORKLIST_TOMORROW_MOCK: WorklistAppointment[] = [
  {
    id: 't1',
    time: '08:30 AM',
    patientName: 'Matt Newman',
    patientId: '240545-123Y',
    appointmentType: 'In-person visit',
  },
  {
    id: 't2',
    time: '01:00 PM',
    patientName: 'Karl Lake',
    patientId: '240545-123Y',
    appointmentType: 'Telehealth visit',
  },
];

export const CLINICAL_ACTIONS_MOCK: ClinicalAction[] = [
  { label: 'Hospital referral', icon: 'local_hospital', eventType: 'Hospital referral' },
  { label: 'Lab order', icon: 'science', eventType: 'Lab order' },
  { label: 'Certificates', icon: 'description', eventType: 'Certificate' },
  { label: 'Prescription', icon: 'medication', eventType: 'Prescription' },
  { label: 'Imaging', icon: 'image_search', eventType: 'Imaging' },
  { label: 'Medication list', icon: 'medication', eventType: 'Medication list' },
];

export const RECENT_PATIENTS_MOCK: RecentPatient[] = [
  { id: '1', name: 'Oliver Wilson', personalId: '240545-123Y' },
  { id: '2', name: 'Eva Cohen', personalId: '240545-123Y' },
  { id: '3', name: 'Matt Newman', personalId: '240545-123Y' },
  { id: '4', name: 'Karl Lake', personalId: '240545-123Y' },
  { id: '5', name: 'James Virtan', personalId: '240545-123Y' },
  { id: '6', name: 'Eric Cohen', personalId: '240545-123Y' },
  { id: '7', name: 'Peter Newman', personalId: '240545-123Y' },
  { id: '8', name: 'George Lake', personalId: '240545-123Y' },
];

export const STICKY_NOTES_MOCK: StickyNote[] = [
  { id: '1', preview: 'Remember to call the laboratory' },
];
