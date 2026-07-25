import mongoose, { Schema } from 'mongoose';

export interface IBillItem {
  description: string;
  amount: number;
  quantity?: number;
}

export interface IBill {
  _id?: any;
  billNumber: string;
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  doctorId?: string;
  doctorName: string;
  doctorSpeciality: string;
  appointmentId?: string;
  appointmentDate: string;
  consultationFee: number;
  items?: IBillItem[];
  discount?: number;
  tax?: number;
  paymentMethod?: string;
  status: 'Paid' | 'Pending' | 'Partial' | 'Overdue';
  date: string;
  dueDate?: string;
  total: number;
  notes?: string;
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
      default: '',
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
    consultationFee: {
      type: Number,
      required: true,
      default: 0,
    },
    items: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      default: 'Cash',
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial', 'Overdue'],
      default: 'Pending',
    },
    date: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      default: '',
    },
    total: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Bill = mongoose.models.Bill || mongoose.model<IBill>('Bill', billSchema);
