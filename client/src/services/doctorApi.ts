import api from './api';

export interface DoctorFilters {
  search?: string;
  status?: string;
  dateRange?: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PrescriptionPayload {
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  appointmentId?: string;
  appointmentDate: string;
  diagnosis: string;
  instructions?: string;
  followUpDate?: string;
  status?: 'Completed' | 'Draft';
  medicines: PrescriptionMedicine[];
}

export interface AvailabilityPayload {
  workingDays: string[];
  availableSlots: string[];
  consultationDuration: number;
}

export interface DoctorProfilePayload {
  name: string;
  phone: string;
  qualification?: string;
  speciality?: string;
  experience?: string;
  clinicAddress?: string;
  bio?: string;
  profileImage?: string;
}

export const doctorApi = {
  getDashboard: async () => {
    const res = await api.get('/doctor/dashboard');
    return res.data;
  },

  getAppointments: async (filters?: DoctorFilters) => {
    const res = await api.get('/doctor/appointments', { params: filters });
    return res.data;
  },

  getAppointmentDetails: async (id: string) => {
    const res = await api.get(`/doctor/appointments/${id}`);
    return res.data;
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    const res = await api.patch(`/doctor/appointments/${id}/status`, { status });
    return res.data;
  },

  getPrescriptions: async (search?: string) => {
    const res = await api.get('/prescriptions/doctor', { params: { search } });
    return res.data;
  },

  getPrescriptionById: async (id: string) => {
    const res = await api.get(`/prescriptions/${id}`);
    return res.data;
  },

  createPrescription: async (data: PrescriptionPayload) => {
    const res = await api.post('/prescriptions', data);
    return res.data;
  },

  updatePrescription: async (id: string, data: Partial<PrescriptionPayload>) => {
    const res = await api.put(`/prescriptions/${id}`, data);
    return res.data;
  },

  deletePrescription: async (id: string) => {
    const res = await api.delete(`/prescriptions/${id}`);
    return res.data;
  },

  getAvailability: async () => {
    const res = await api.get('/doctor/availability');
    return res.data;
  },

  updateAvailability: async (data: AvailabilityPayload) => {
    const res = await api.put('/doctor/availability', data);
    return res.data;
  },

  updateProfile: async (data: DoctorProfilePayload) => {
    const res = await api.put('/doctor/profile', data);
    return res.data;
  },
};
