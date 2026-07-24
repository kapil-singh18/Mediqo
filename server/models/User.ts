import mongoose, { Schema } from 'mongoose';
import { UserRole } from '../constants/roles.js';

export interface IUser {
  _id?: any;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  speciality?: string;
  experience?: string;
  address?: string;
  age?: number;
  gender?: string;
  profileImage?: string;
  qualification?: string;
  bio?: string;
  clinicAddress?: string;
  workingDays?: string[];
  availableSlots?: string[];
  consultationDuration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PATIENT,
      required: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    speciality: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      default: 'Not specified',
    },
    profileImage: {
      type: String,
      default: '',
    },
    qualification: {
      type: String,
      default: 'MBBS, MD',
    },
    bio: {
      type: String,
      default: '',
    },
    clinicAddress: {
      type: String,
      default: '',
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    availableSlots: {
      type: [String],
      default: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    },
    consultationDuration: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
