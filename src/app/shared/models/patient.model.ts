export interface RecentPatient {
  id: string;
  name: string;
  personalId: string;
}

export interface QuickShortcut {
  label: string;
  icon: string;
  badge?: number;
}

export interface ClinicalAction {
  label: string;
  icon: string;
}

export interface StickyNote {
  id: string;
  preview?: string;
}
