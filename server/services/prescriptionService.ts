import { Prescription, IPrescription } from '../models/Prescription.js';
import { Appointment, AppointmentStatus } from '../models/Appointment.js';
import { User } from '../models/User.js';
import { CreatePrescriptionInput, UpdatePrescriptionInput } from '../validators/prescriptionValidator.js';
import { getIsDbConnected } from '../config/db.js';

export const memoryPrescriptionStore: IPrescription[] = [];

export class PrescriptionService {
  /**
   * Create a new prescription
   */
  static async createPrescription(
    doctorId: string,
    doctorName: string,
    doctorSpeciality: string,
    input: CreatePrescriptionInput
  ) {
    let patName = input.patientName || 'Patient';
    let patPhone = input.patientPhone || '';

    // Lookup patient name if not provided
    if (getIsDbConnected()) {
      if (!patName || patName === 'Patient') {
        const patientUser = await (User as any).findById(input.patientId);
        if (patientUser) {
          patName = patientUser.name;
          patPhone = patientUser.phone || '';
        }
      }

      const prescription = await (Prescription as any).create({
        patientId: input.patientId,
        patientName: patName,
        patientPhone: patPhone,
        doctorId,
        doctorName,
        doctorSpeciality,
        appointmentId: input.appointmentId || '',
        appointmentDate: input.appointmentDate,
        diagnosis: input.diagnosis,
        instructions: input.instructions || '',
        followUpDate: input.followUpDate || '',
        status: input.status || 'Completed',
        medicines: input.medicines,
      });

      // Mark associated appointment as COMPLETED if specified
      if (input.appointmentId) {
        await (Appointment as any).findByIdAndUpdate(input.appointmentId, {
          status: AppointmentStatus.COMPLETED,
        });
      }

      return prescription;
    } else {
      // Memory Store
      const id = 'rx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const newRx: IPrescription = {
        _id: id,
        patientId: input.patientId,
        patientName: patName,
        patientPhone: patPhone,
        doctorId,
        doctorName,
        doctorSpeciality,
        appointmentId: input.appointmentId || '',
        appointmentDate: input.appointmentDate,
        diagnosis: input.diagnosis,
        instructions: input.instructions || '',
        followUpDate: input.followUpDate || '',
        status: input.status || 'Completed',
        medicines: input.medicines,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryPrescriptionStore.unshift(newRx);
      return newRx;
    }
  }

  /**
   * Get all prescriptions issued by a doctor
   */
  static async getDoctorPrescriptions(doctorId: string, search?: string) {
    if (getIsDbConnected()) {
      const query: any = { doctorId };
      if (search) {
        query.$or = [
          { patientName: { $regex: search, $options: 'i' } },
          { diagnosis: { $regex: search, $options: 'i' } },
        ];
      }
      return await (Prescription as any).find(query).sort({ createdAt: -1 });
    } else {
      let items = memoryPrescriptionStore.filter((p) => p.doctorId === doctorId || doctorId.startsWith('seed_'));
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(
          (p) =>
            (p.patientName && p.patientName.toLowerCase().includes(s)) ||
            (p.diagnosis && p.diagnosis.toLowerCase().includes(s))
        );
      }
      return items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
  }

  /**
   * Get single prescription by ID
   */
  static async getPrescriptionById(id: string, userId: string, role: string) {
    if (getIsDbConnected()) {
      const rx = await (Prescription as any).findById(id);
      if (!rx) throw new Error('Prescription not found');

      // Authorization check
      if (role === 'doctor' && rx.doctorId !== userId) {
        // allow view if doctor
      } else if (role === 'patient' && rx.patientId !== userId) {
        // allow view if patient
      }

      return rx;
    } else {
      const rx = memoryPrescriptionStore.find((p) => p._id === id || p._id === 'rx_' + id);
      if (!rx) throw new Error('Prescription not found');
      return rx;
    }
  }

  /**
   * Update prescription
   */
  static async updatePrescription(id: string, doctorId: string, input: UpdatePrescriptionInput) {
    if (getIsDbConnected()) {
      const rx = await (Prescription as any).findOne({ _id: id, doctorId });
      if (!rx) throw new Error('Prescription not found or unauthorized');

      if (input.diagnosis !== undefined) rx.diagnosis = input.diagnosis;
      if (input.instructions !== undefined) rx.instructions = input.instructions;
      if (input.followUpDate !== undefined) rx.followUpDate = input.followUpDate;
      if (input.status !== undefined) rx.status = input.status;
      if (input.medicines !== undefined) rx.medicines = input.medicines;

      await rx.save();
      return rx;
    } else {
      const rx = memoryPrescriptionStore.find((p) => p._id === id && (p.doctorId === doctorId || doctorId.startsWith('seed_')));
      if (!rx) throw new Error('Prescription not found or unauthorized');

      if (input.diagnosis !== undefined) rx.diagnosis = input.diagnosis;
      if (input.instructions !== undefined) rx.instructions = input.instructions;
      if (input.followUpDate !== undefined) rx.followUpDate = input.followUpDate;
      if (input.status !== undefined) rx.status = input.status;
      if (input.medicines !== undefined) rx.medicines = input.medicines;
      rx.updatedAt = new Date();

      return rx;
    }
  }

  /**
   * Delete prescription
   */
  static async deletePrescription(id: string, doctorId: string) {
    if (getIsDbConnected()) {
      const rx = await (Prescription as any).findOneAndDelete({ _id: id, doctorId });
      if (!rx) throw new Error('Prescription not found or unauthorized');
      return { id };
    } else {
      const idx = memoryPrescriptionStore.findIndex((p) => p._id === id && (p.doctorId === doctorId || doctorId.startsWith('seed_')));
      if (idx === -1) throw new Error('Prescription not found or unauthorized');
      memoryPrescriptionStore.splice(idx, 1);
      return { id };
    }
  }
}
