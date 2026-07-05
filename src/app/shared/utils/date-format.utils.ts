/** Parses `dd/MM/yyyy` or ISO date strings into a local Date. */
export function parseDateValue(value: string | null | undefined): Date | null {
  if (!value?.trim()) {
    return null;
  }

  const displayMatch = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (displayMatch) {
    const [, day, month, year] = displayMatch.map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Parses `dd/MM/yyyy HH:mm` into a local Date. */
export function parseDateTimeValue(value: string | null | undefined): Date | null {
  if (!value?.trim()) {
    return null;
  }

  const displayMatch = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
  if (displayMatch) {
    const [, day, month, year, hour, minute] = displayMatch.map(Number);
    return new Date(year, month - 1, day, hour, minute);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDisplayDate(date: Date | null): string {
  if (!date) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDisplayDateTime(date: Date | null): string {
  if (!date) {
    return '';
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formatDisplayDate(date)} ${hours}:${minutes}`;
}

export function toTimeInputValue(date: Date | null): string {
  if (!date) {
    return '';
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function applyTimeToDate(date: Date | null, time: string): Date | null {
  if (!time) {
    return date;
  }

  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return date;
  }

  const base = date ? new Date(date) : new Date();
  base.setHours(hours, minutes, 0, 0);
  return base;
}

export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function calculateAge(
  dateOfBirth: Date | null,
  referenceDate: Date | null = null,
): number | null {
  if (!dateOfBirth) {
    return null;
  }

  const reference = referenceDate ?? new Date();
  let age = reference.getFullYear() - dateOfBirth.getFullYear();
  const hasBirthdayPassed =
    reference.getMonth() > dateOfBirth.getMonth() ||
    (reference.getMonth() === dateOfBirth.getMonth() &&
      reference.getDate() >= dateOfBirth.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age >= 0 ? age : null;
}

export function extractBasePatientId(patientId: string): string {
  const trimmed = patientId.trim();
  const match = trimmed.match(/^(.*)-\d+Y$/i);
  return match ? match[1] : trimmed;
}

export function formatPatientIdWithAge(
  patientId: string,
  dateOfBirth: Date | null,
  referenceDate: Date | null = null,
): string {
  const baseId = extractBasePatientId(patientId);
  if (!baseId) {
    return '';
  }

  const age = calculateAge(dateOfBirth, referenceDate);
  if (age === null) {
    return baseId;
  }

  return `${baseId}-${age}Y`;
}

export function formatWorklistTime(date: Date | null): string {
  if (!date) {
    return '';
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function parseWorklistTimeValue(time: string): number {
  const trimmed = time.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    const parsed = Date.parse(`1970/01/01 ${trimmed}`);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12;
  } else if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

export function compareWorklistTimes(left: string, right: string): number {
  return parseWorklistTimeValue(left) - parseWorklistTimeValue(right);
}

export function sortWorklistAppointments<T extends { time: string }>(appointments: T[]): T[] {
  return [...appointments].sort((left, right) => compareWorklistTimes(left.time, right.time));
}

export function resolveWorklistDay(date: Date | null): 'yesterday' | 'today' | 'tomorrow' {
  if (!date) {
    return 'today';
  }

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const today = startOfToday();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (target.getTime() === yesterday.getTime()) {
    return 'yesterday';
  }

  if (target.getTime() === tomorrow.getTime()) {
    return 'tomorrow';
  }

  return 'today';
}
