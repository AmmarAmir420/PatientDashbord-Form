export interface WorklistAppointment {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  appointmentType: string;
  patientMessage?: string;
  expanded?: boolean;
}
