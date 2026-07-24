import mongoose, { Schema } from 'mongoose';

export interface IBill {
  _id?: any;
  billNumber: string;
  patientId: string;
  doctorName: string;
  doctorSpeciality: string;
  appointmentDate: string;
  consultationFee: number;
  status: 'Paid' | 'Pending';
  date: string;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const billSchema = new Schema<IBill>(
  {
    billNumber: {
      type: String,
      required: true,
      unique: true,
    },
    patientId: {
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
    appointmentDate: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending',
    },
    date: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Bill = mongoose.models.Bill || mongoose.model<IBill>('Bill', billSchema);
