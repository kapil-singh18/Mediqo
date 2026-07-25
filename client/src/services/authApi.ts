import api from './api';
import { User, AuthResponse } from '../types';
import { LoginFormValues, RegisterFormValues } from '../validations/auth';

export const authApi = {
  register: async (data: Omit<RegisterFormValues, 'confirmPassword'>): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginFormValues): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};
