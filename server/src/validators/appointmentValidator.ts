import { z } from 'zod';

export const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  doctorName: z.string().optional(),
  doctorSpeciality: z.string().optional(),
  doctorImage: z.string().optional(),
  fees: z.number().optional(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  reason: z.string().min(3, 'Reason must be at least 3 characters long'),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
