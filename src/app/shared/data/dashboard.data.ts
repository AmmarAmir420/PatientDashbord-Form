import {
  ClinicalAction,
  QuickShortcut,
  RecentPatient,
  StickyNote,
  UserProfile,
  ProfileMenuItem,
  WorklistAppointment,
} from '../models';

export const CURRENT_USER: UserProfile = {
  fullName: 'Tuomas Veikko Kerola',
  role: 'Specialist Nursing',
  employeeId: 'Spec. care dept. P0007',
  avatarInitials: 'TK',
};

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { label: 'Settings', icon: 'settings', action: 'settings' },
  { label: 'Open admin panel', icon: 'admin_panel_settings', action: 'admin' },
  { label: 'Log out', icon: 'logout', action: 'logout' },
];

export const QUICK_SHORTCUTS: QuickShortcut[] = [
  { label: 'Patient review', icon: 'create_new_folder' },
  { label: 'Patient messages', icon: 'smartphone', badge: 3 },
  { label: 'Doctor messages', icon: 'forum' },
  { label: 'Working hours', icon: 'schedule' },
  { label: 'Calendar', icon: 'calendar_month' },
  { label: 'Settings', icon: 'settings' },
  { label: 'Health portal', icon: 'health_and_safety' },
];

export const WORKLIST_APPOINTMENTS: WorklistAppointment[] = [
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

export const CLINICAL_ACTIONS: ClinicalAction[] = [
  { label: 'Hospital referral', icon: 'local_hospital' },
  { label: 'Lab order', icon: 'science' },
  { label: 'Certificates', icon: 'description' },
  { label: 'Prescription', icon: 'medication' },
  { label: 'Imaging', icon: 'image_search' },
  { label: 'Medication list', icon: 'medication' },
];

export const RECENT_PATIENTS: RecentPatient[] = [
  { id: '1', name: 'Oliver Wilson', personalId: '240545-123Y' },
  { id: '2', name: 'Eva Cohen', personalId: '240545-123Y' },
  { id: '3', name: 'Matt Newman', personalId: '240545-123Y' },
  { id: '4', name: 'Karl Lake', personalId: '240545-123Y' },
  { id: '5', name: 'James Virtan', personalId: '240545-123Y' },
  { id: '6', name: 'Eric Cohen', personalId: '240545-123Y' },
  { id: '7', name: 'Peter Newman', personalId: '240545-123Y' },
  { id: '8', name: 'George Lake', personalId: '240545-123Y' },
];

export const STICKY_NOTES: StickyNote[] = [
  { id: '1', preview: 'Remember to call the laboratory' },
];
