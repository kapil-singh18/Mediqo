import api from './api';
import { User, Appointment, Bill } from '../types';

export interface PatientFormInput {
  name: string;
  phone: string;
  email?: string;
  age?: number;
  gender?: string;
  address?: string;
  bio?: string;
}

export interface BookAppointmentInput {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
  fees?: number;
  notes?: string;
}

export interface RescheduleAppointmentInput {
  appointmentDate: string;
  timeSlot: string;
  doctorId?: string;
  notes?: string;
}

export interface BillItemInput {
  description: string;
  amount: number;
  quantity?: number;
}

export interface BillFormInput {
  patientId: string;
  doctorName: string;
  doctorSpeciality?: string;
  appointmentId?: string;
  appointmentDate?: string;
  consultationFee?: number;
  items?: BillItemInput[];
  discount?: number;
  tax?: number;
  paymentMethod?: string;
  status?: 'Paid' | 'Pending' | 'Partial' | 'Overdue';
  dueDate?: string;
  notes?: string;
}

export interface ReceptionistProfileInput {
  name?: string;
  phone?: string;
  deskLocation?: string;
  shiftHours?: string;
  profileImage?: string;
}

export const receptionistApi = {
  // Dashboard
  getDashboardStats: async () => {
    const res = await api.get('/receptionist/dashboard-stats');
    return res.data;
  },

  // Patients
  getPatients: async (params?: { search?: string; gender?: string; page?: number; limit?: number }) => {
    const res = await api.get('/receptionist/patients', { params });
    return res.data;
  },

  createPatient: async (payload: PatientFormInput) => {
    const res = await api.post('/receptionist/patients', payload);
    return res.data;
  },

  updatePatient: async (id: string, payload: Partial<PatientFormInput>) => {
    const res = await api.put(`/receptionist/patients/${id}`, payload);
    return res.data;
  },

  getPatientDetails: async (id: string) => {
    const res = await api.get(`/receptionist/patients/${id}`);
    return res.data;
  },

  // Appointments
  getAppointments: async (params?: { search?: string; status?: string; date?: string; doctorId?: string }) => {
    const res = await api.get('/receptionist/appointments', { params });
    return res.data;
  },

  bookAppointment: async (payload: BookAppointmentInput) => {
    const res = await api.post('/receptionist/appointments', payload);
    return res.data;
  },

  rescheduleAppointment: async (id: string, payload: RescheduleAppointmentInput) => {
    const res = await api.put(`/receptionist/appointments/${id}/reschedule`, payload);
    return res.data;
  },

  cancelAppointment: async (id: string) => {
    const res = await api.put(`/receptionist/appointments/${id}/cancel`);
    return res.data;
  },

  assignDoctor: async (id: string, doctorId: string) => {
    const res = await api.put(`/receptionist/appointments/${id}/assign-doctor`, { doctorId });
    return res.data;
  },

  // Billing
  getBills: async (params?: { search?: string; status?: string; date?: string }) => {
    const res = await api.get('/receptionist/bills', { params });
    return res.data;
  },

  createBill: async (payload: BillFormInput) => {
    const res = await api.post('/receptionist/bills', payload);
    return res.data;
  },

  updateBill: async (id: string, payload: Partial<BillFormInput>) => {
    const res = await api.put(`/receptionist/bills/${id}`, payload);
    return res.data;
  },

  deleteBill: async (id: string) => {
    const res = await api.delete(`/receptionist/bills/${id}`);
    return res.data;
  },

  // Doctors
  getDoctors: async () => {
    const res = await api.get('/receptionist/doctors');
    return res.data;
  },

  // Profile
  updateProfile: async (payload: ReceptionistProfileInput) => {
    const res = await api.put('/receptionist/profile', payload);
    return res.data;
  },
};
