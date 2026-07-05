import { RecentPatient, WorklistAppointment } from '../interfaces';

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function filterRecentPatients(
  patients: RecentPatient[],
  query: string,
): RecentPatient[] {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) {
    return patients;
  }

  return patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(normalized) ||
      patient.personalId.toLowerCase().includes(normalized),
  );
}

export function filterWorklistAppointments(
  appointments: WorklistAppointment[],
  query: string,
): WorklistAppointment[] {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) {
    return appointments;
  }

  return appointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(normalized) ||
      appointment.patientId.toLowerCase().includes(normalized) ||
      appointment.appointmentType.toLowerCase().includes(normalized),
  );
}
