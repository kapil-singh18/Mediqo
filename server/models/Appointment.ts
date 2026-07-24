import mongoose, { Schema } from 'mongoose';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IAppointment {
  _id?: any;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorImage?: string;
  fees: number;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "09:00 AM"
  reason: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    doctorSpeciality: {
      type: String,
      required: true,
    },
    doctorImage: {
      type: String,
      default: '',
    },
    fees: {
      type: Number,
      required: true,
      default: 50,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.SCHEDULED,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ patientId: 1, appointmentDate: 1 });

export const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', appointmentSchema);
