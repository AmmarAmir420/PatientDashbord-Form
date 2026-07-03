import { ShortcutAction } from './app.model';

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

export type { ShortcutAction } from './app.model';

export interface ClinicalAction {
  label: string;
  icon: string;
  eventType: string;
}

export interface StickyNote {
  id: string;
  preview?: string;
}
