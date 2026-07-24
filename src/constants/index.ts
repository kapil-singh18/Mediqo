export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  RECEPTIONIST = 'receptionist',
}

export const APP_NAME = 'Mediqo';
export const APP_TAGLINE = 'Modern Clinic Management System';

export const ROLE_REDIRECTS: Record<UserRole, string> = {
  [UserRole.PATIENT]: '/patient',
  [UserRole.DOCTOR]: '/doctor',
  [UserRole.RECEPTIONIST]: '/receptionist',
};
