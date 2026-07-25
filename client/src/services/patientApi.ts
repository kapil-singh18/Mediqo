import api from './api';
import { Appointment, Prescription, Bill, User } from '../types';

export interface BookAppointmentInput {
  doctorId: string;
  doctorName?: string;
  doctorSpeciality?: string;
  doctorImage?: string;
  fees?: number;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
  notes?: string;
}

export interface ProfileUpdateInput {
  name?: string;
  phone?: string;
  address?: string;
  age?: number;
  gender?: string;
  profileImage?: string;
}

export const patientApi = {
  // Appointments
  getMyAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments/my');
    return response.data.data.appointments;
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data.data.appointment;
  },

  bookAppointment: async (data: BookAppointmentInput): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data.data.appointment;
  },

  cancelAppointment: async (id: string): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/cancel`);
    return response.data.data.appointment;
  },

  // Prescriptions
  getMyPrescriptions: async (): Promise<Prescription[]> => {
    const response = await api.get('/prescriptions/my');
    return response.data.data.prescriptions;
  },

  // Bills
  getMyBills: async (): Promise<Bill[]> => {
    const response = await api.get('/bills/my');
    return response.data.data.bills;
  },

  // Profile
  updateProfile: async (data: ProfileUpdateInput): Promise<User> => {
    const response = await api.put('/auth/profile', data);
    return response.data.data.user;
  },
};
