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
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
