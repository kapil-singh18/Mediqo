import { z } from 'zod';

export const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage is required (e.g. 1 tablet)'),
  frequency: z.string().min(1, 'Frequency is required (e.g. Twice daily)'),
  duration: z.string().min(1, 'Duration is required (e.g. 5 days)'),
});

export const createPrescriptionSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().optional(),
  patientPhone: z.string().optional(),
  appointmentId: z.string().optional(),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  diagnosis: z.string().min(2, 'Diagnosis is required'),
  instructions: z.string().optional().default(''),
  followUpDate: z.string().optional().default(''),
  status: z.enum(['Completed', 'Draft']).default('Completed'),
  medicines: z.array(medicineSchema).min(1, 'At least one medicine is required'),
});

export const updatePrescriptionSchema = createPrescriptionSchema.partial();

export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
export type UpdatePrescriptionInput = z.infer<typeof updatePrescriptionSchema>;
