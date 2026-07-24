import { UserRole } from './constants';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  speciality?: string;
  experience?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  fees: number;
  address: string;
  about: string;
  available: boolean;
}
