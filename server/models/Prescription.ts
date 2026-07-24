import mongoose, { Schema } from 'mongoose';

export interface IMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface IPrescription {
  _id?: any;
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  appointmentId?: string;
  appointmentDate: string;
  diagnosis: string;
  instructions: string;
  medicines: IMedicine[];
  followUpDate?: string;
  status?: 'Completed' | 'Draft';
  createdAt?: Date;
  updatedAt?: Date;
}

const prescriptionSchema = new Schema<IPrescription>(
  {
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      default: '',
    },
    patientPhone: {
      type: String,
      default: '',
    },
    doctorId: {
      type: String,
      required: true,
      index: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    doctorSpeciality: {
      type: String,
      required: true,
    },
    appointmentId: {
      type: String,
      default: '',
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      default: '',
    },
    followUpDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Completed', 'Draft'],
      default: 'Completed',
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Prescription = mongoose.models.Prescription || mongoose.model<IPrescription>('Prescription', prescriptionSchema);
