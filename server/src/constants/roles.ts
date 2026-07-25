export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  RECEPTIONIST = 'receptionist',
}

export const ROLES = [UserRole.PATIENT, UserRole.DOCTOR, UserRole.RECEPTIONIST] as const;
