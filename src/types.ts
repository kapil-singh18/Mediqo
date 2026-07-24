import { UserRole } from './constants';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  speciality?: string;
  experience?: string;
  address?: string;
  age?: number;
  gender?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  fees: number;
  address: string;
  about: string;
  available: boolean;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorImage?: string;
  fees: number;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  appointmentDate: string;
  diagnosis: string;
  instructions: string;
  medicines: Medicine[];
  createdAt?: string;
}

export interface Bill {
  _id: string;
  billNumber: string;
  patientId: string;
  doctorName: string;
  doctorSpeciality: string;
  appointmentDate: string;
  consultationFee: number;
  status: 'Paid' | 'Pending';
  date: string;
  total: number;
  createdAt?: string;
}

