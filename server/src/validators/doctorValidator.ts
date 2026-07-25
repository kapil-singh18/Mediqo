import { z } from 'zod';

export const updateAvailabilitySchema = z.object({
  workingDays: z.array(z.string()).min(1, 'Select at least one working day'),
  availableSlots: z.array(z.string()).min(1, 'Select at least one available slot'),
  consultationDuration: z.number().min(5, 'Duration must be at least 5 minutes'),
});

export const updateDoctorProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(5, 'Valid phone number is required'),
  qualification: z.string().optional(),
  speciality: z.string().optional(),
  experience: z.string().optional(),
  clinicAddress: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
});

export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type UpdateDoctorProfileInput = z.infer<typeof updateDoctorProfileSchema>;
