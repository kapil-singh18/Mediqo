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
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  appointmentDate: string;
  diagnosis: string;
  instructions: string;
  medicines: IMedicine[];
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
