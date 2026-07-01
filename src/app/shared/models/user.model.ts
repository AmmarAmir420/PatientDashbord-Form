export interface UserProfile {
  fullName: string;
  role: string;
  employeeId: string;
  avatarInitials: string;
}

export interface ProfileMenuItem {
  label: string;
  icon: string;
  action?: 'settings' | 'admin' | 'logout';
}
