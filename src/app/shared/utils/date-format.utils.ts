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
