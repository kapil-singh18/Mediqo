import { Appointment, AppointmentStatus, IAppointment } from '../models/Appointment.js';
import { Prescription } from '../models/Prescription.js';
import { Bill } from '../models/Bill.js';
import { CreateAppointmentInput } from '../validators/appointmentValidator.js';
import { getIsDbConnected } from '../config/db.js';

const memoryAppointmentStore: IAppointment[] = [];
const memoryPrescriptionStore: any[] = [];
const memoryBillStore: any[] = [];

export class AppointmentService {
  /**
   * Create a new appointment
   */
  static async createAppointment(patientId: string, input: CreateAppointmentInput) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (input.appointmentDate < todayStr) {
      throw new Error('Cannot book appointments for past dates');
    }

    // Default doctor details if not provided
    const docName = input.doctorName || 'Dr. Richard James';
    const docSpec = input.doctorSpeciality || 'General Physician';
    const docImg = input.doctorImage || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400';
    const fee = input.fees || 50;

    if (getIsDbConnected()) {
      // Check duplicate appointment
      const existing = await (Appointment as any).findOne({
        patientId,
        appointmentDate: input.appointmentDate,
        timeSlot: input.timeSlot,
        status: { $ne: AppointmentStatus.CANCELLED },
      });

      if (existing) {
        throw new Error('You already have an active appointment scheduled at this date and time slot');
      }

      const newAppointment = await (Appointment as any).create({
        patientId,
        doctorId: input.doctorId,
        doctorName: docName,
        doctorSpeciality: docSpec,
        doctorImage: docImg,
        fees: fee,
        appointmentDate: input.appointmentDate,
        timeSlot: input.timeSlot,
        reason: input.reason,
        notes: input.notes || '',
        status: AppointmentStatus.SCHEDULED,
      });

      // Also create a pending bill record for this appointment
      const billNo = 'INV-' + Math.floor(100000 + Math.random() * 900000);
      await (Bill as any).create({
        billNumber: billNo,
        patientId,
        doctorName: docName,
        doctorSpeciality: docSpec,
        appointmentDate: input.appointmentDate,
        consultationFee: fee,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        total: fee,
      });

      return newAppointment;
    } else {
      // Memory store logic
      const existing = memoryAppointmentStore.find(
        (a) =>
          (a.patientId === patientId || patientId.startsWith('mem_') || patientId.startsWith('seed_')) &&
          a.appointmentDate === input.appointmentDate &&
          a.timeSlot === input.timeSlot &&
          a.status !== AppointmentStatus.CANCELLED
      );

      if (existing) {
        throw new Error('You already have an active appointment scheduled at this date and time slot');
      }

      const id = 'apt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const newAppointment: IAppointment = {
        _id: id,
        patientId,
        doctorId: input.doctorId,
        doctorName: docName,
        doctorSpeciality: docSpec,
        doctorImage: docImg,
        fees: fee,
        appointmentDate: input.appointmentDate,
        timeSlot: input.timeSlot,
        reason: input.reason,
        notes: input.notes || '',
        status: AppointmentStatus.SCHEDULED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryAppointmentStore.unshift(newAppointment);

      // Add corresponding pending bill
      const billNo = 'INV-' + Math.floor(100000 + Math.random() * 900000);
      memoryBillStore.unshift({
        _id: 'bill_' + Date.now(),
        billNumber: billNo,
        patientId,
        doctorName: docName,
        doctorSpeciality: docSpec,
        appointmentDate: input.appointmentDate,
        consultationFee: fee,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        total: fee,
        createdAt: new Date(),
      });

      return newAppointment;
    }
  }

  /**
   * Get all appointments for a patient
   */
  static async getMyAppointments(patientId: string) {
    await this.seedPatientDummyDataIfEmpty(patientId);

    if (getIsDbConnected()) {
      return await (Appointment as any)
        .find({ patientId })
        .sort({ appointmentDate: -1, createdAt: -1 });
    } else {
      return memoryAppointmentStore
        .filter((a) => a.patientId === patientId || a.patientId === 'all_demo_patients')
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
  }

  /**
   * Get single appointment details
   */
  static async getAppointmentById(id: string, patientId: string) {
    if (getIsDbConnected()) {
      const apt = await (Appointment as any).findOne({ _id: id, patientId });
      if (!apt) throw new Error('Appointment not found');
      return apt;
    } else {
      const apt = memoryAppointmentStore.find(
        (a) => a._id === id && (a.patientId === patientId || a.patientId === 'all_demo_patients')
      );
      if (!apt) throw new Error('Appointment not found');
      return apt;
    }
  }

  /**
   * Cancel appointment
   */
  static async cancelAppointment(id: string, patientId: string) {
    if (getIsDbConnected()) {
      const apt = await (Appointment as any).findOne({ _id: id, patientId });
      if (!apt) throw new Error('Appointment not found');
      if (apt.status === AppointmentStatus.CANCELLED) {
        throw new Error('Appointment is already cancelled');
      }
      apt.status = AppointmentStatus.CANCELLED;
      await apt.save();
      return apt;
    } else {
      const apt = memoryAppointmentStore.find(
        (a) => a._id === id && (a.patientId === patientId || a.patientId === 'all_demo_patients')
      );
      if (!apt) throw new Error('Appointment not found');
      if (apt.status === AppointmentStatus.CANCELLED) {
        throw new Error('Appointment is already cancelled');
      }
      apt.status = AppointmentStatus.CANCELLED;
      apt.updatedAt = new Date();
      return apt;
    }
  }

  /**
   * Get patient prescriptions
   */
  static async getMyPrescriptions(patientId: string) {
    await this.seedPatientDummyDataIfEmpty(patientId);

    if (getIsDbConnected()) {
      return await (Prescription as any)
        .find({ patientId })
        .sort({ createdAt: -1 });
    } else {
      return memoryPrescriptionStore.filter(
        (p) => p.patientId === patientId || p.patientId === 'all_demo_patients'
      );
    }
  }

  /**
   * Get patient bills
   */
  static async getMyBills(patientId: string) {
    await this.seedPatientDummyDataIfEmpty(patientId);

    if (getIsDbConnected()) {
      return await (Bill as any).find({ patientId }).sort({ createdAt: -1 });
    } else {
      return memoryBillStore.filter(
        (b) => b.patientId === patientId || b.patientId === 'all_demo_patients'
      );
    }
  }

  /**
   * Seeds initial realistic dummy appointments, prescriptions, and bills for new/empty patients
   */
  static async seedPatientDummyDataIfEmpty(patientId: string) {
    if (getIsDbConnected()) {
      const count = await (Appointment as any).countDocuments({ patientId });
      if (count === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 2);
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 5);

        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const pastDateStr = pastDate.toISOString().split('T')[0];

        // Seed 1 scheduled, 1 completed, 1 cancelled appointment
        await (Appointment as any).create([
          {
            patientId,
            doctorId: 'doc_101',
            doctorName: 'Dr. Richard James',
            doctorSpeciality: 'General Physician',
            doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
            fees: 50,
            appointmentDate: tomorrowStr,
            timeSlot: '10:00 AM',
            reason: 'Routine health checkup and wellness consultation',
            notes: 'Please bring recent blood test reports if available.',
            status: AppointmentStatus.SCHEDULED,
          },
          {
            patientId,
            doctorId: 'doc_102',
            doctorName: 'Dr. Emily Larson',
            doctorSpeciality: 'Gynecologist',
            doctorImage: 'https://images.unsplash.com/photo-1594824813566-88855ce7890f?auto=format&fit=crop&q=80&w=400',
            fees: 60,
            appointmentDate: pastDateStr,
            timeSlot: '02:30 PM',
            reason: 'Annual preventive screening and dietary guidance',
            notes: 'Completed successfully.',
            status: AppointmentStatus.COMPLETED,
          },
        ]);

        // Seed 1 Prescription
        await (Prescription as any).create({
          patientId,
          doctorId: 'doc_102',
          doctorName: 'Dr. Emily Larson',
          doctorSpeciality: 'Gynecologist',
          appointmentDate: pastDateStr,
          diagnosis: 'Mild seasonal vitamin deficiency and general fatigue',
          instructions: 'Take vitamins after breakfast. Drink plenty of water (min 3L daily) and ensure 8 hours of sleep.',
          medicines: [
            { name: 'Multivitamin Complex 500mg', dosage: '1 tablet', frequency: 'Once daily (Morning)', duration: '30 Days' },
            { name: 'Vitamin D3 60,000 IU', dosage: '1 capsule', frequency: 'Once weekly (Sunday)', duration: '8 Weeks' },
          ],
        });

        // Seed 2 Bills
        await (Bill as any).create([
          {
            billNumber: 'INV-882194',
            patientId,
            doctorName: 'Dr. Richard James',
            doctorSpeciality: 'General Physician',
            appointmentDate: tomorrowStr,
            consultationFee: 50,
            status: 'Pending',
            date: today.toISOString().split('T')[0],
            total: 50,
          },
          {
            billNumber: 'INV-741029',
            patientId,
            doctorName: 'Dr. Emily Larson',
            doctorSpeciality: 'Gynecologist',
            appointmentDate: pastDateStr,
            consultationFee: 60,
            status: 'Paid',
            date: pastDateStr,
            total: 60,
          },
        ]);
      }
    } else {
      // Memory store check
      const hasApt = memoryAppointmentStore.some((a) => a.patientId === patientId);
      if (!hasApt) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 2);
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 5);

        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const pastDateStr = pastDate.toISOString().split('T')[0];

        memoryAppointmentStore.push(
          {
            _id: 'mem_apt_1_' + patientId,
            patientId,
            doctorId: 'doc_101',
            doctorName: 'Dr. Richard James',
            doctorSpeciality: 'General Physician',
            doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
            fees: 50,
            appointmentDate: tomorrowStr,
            timeSlot: '10:00 AM',
            reason: 'Routine health checkup and wellness consultation',
            notes: 'Please bring recent blood test reports if available.',
            status: AppointmentStatus.SCHEDULED,
            createdAt: new Date(),
          },
          {
            _id: 'mem_apt_2_' + patientId,
            patientId,
            doctorId: 'doc_102',
            doctorName: 'Dr. Emily Larson',
            doctorSpeciality: 'Gynecologist',
            doctorImage: 'https://images.unsplash.com/photo-1594824813566-88855ce7890f?auto=format&fit=crop&q=80&w=400',
            fees: 60,
            appointmentDate: pastDateStr,
            timeSlot: '02:30 PM',
            reason: 'Annual preventive screening and dietary guidance',
            notes: 'Completed successfully.',
            status: AppointmentStatus.COMPLETED,
            createdAt: pastDate,
          }
        );

        memoryPrescriptionStore.push({
          _id: 'mem_rx_1_' + patientId,
          patientId,
          doctorId: 'doc_102',
          doctorName: 'Dr. Emily Larson',
          doctorSpeciality: 'Gynecologist',
          appointmentDate: pastDateStr,
          diagnosis: 'Mild seasonal vitamin deficiency and general fatigue',
          instructions: 'Take vitamins after breakfast. Drink plenty of water (min 3L daily) and ensure 8 hours of sleep.',
          medicines: [
            { name: 'Multivitamin Complex 500mg', dosage: '1 tablet', frequency: 'Once daily (Morning)', duration: '30 Days' },
            { name: 'Vitamin D3 60,000 IU', dosage: '1 capsule', frequency: 'Once weekly (Sunday)', duration: '8 Weeks' },
          ],
          createdAt: pastDate,
        });

        memoryBillStore.push(
          {
            _id: 'mem_bill_1_' + patientId,
            billNumber: 'INV-882194',
            patientId,
            doctorName: 'Dr. Richard James',
            doctorSpeciality: 'General Physician',
            appointmentDate: tomorrowStr,
            consultationFee: 50,
            status: 'Pending',
            date: today.toISOString().split('T')[0],
            total: 50,
            createdAt: new Date(),
          },
          {
            _id: 'mem_bill_2_' + patientId,
            billNumber: 'INV-741029',
            patientId,
            doctorName: 'Dr. Emily Larson',
            doctorSpeciality: 'Gynecologist',
            appointmentDate: pastDateStr,
            consultationFee: 60,
            status: 'Paid',
            date: pastDateStr,
            total: 60,
            createdAt: pastDate,
          }
        );
      }
    }
  }
}
