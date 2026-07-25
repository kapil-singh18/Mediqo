import { Appointment, AppointmentStatus, IAppointment } from '../models/Appointment.js';
import { Prescription } from '../models/Prescription.js';
import { User, IUser } from '../models/User.js';
import { getIsDbConnected } from '../config/db.js';
import { sanitizeUser } from './authService.js';
import { memoryPrescriptionStore } from './prescriptionService.js';
import { UpdateAvailabilityInput, UpdateDoctorProfileInput } from '../validators/doctorValidator.js';

export class DoctorService {
  /**
   * Seed realistic appointments & prescriptions for seeded doctors if empty
   */
  static async seedDoctorDataIfEmpty(doctorId: string, doctorName: string, doctorSpeciality: string) {
    const todayStr = new Date().toISOString().split('T')[0];
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);
    const pastDateStr = pastDate.toISOString().split('T')[0];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (getIsDbConnected()) {
      const count = await (Appointment as any).countDocuments({ doctorId });
      if (count === 0) {
        // Seed 3 realistic appointments for doctor
        const createdApts = await (Appointment as any).create([
          {
            patientId: 'demo_patient_1',
            patientName: 'Alex Morgan',
            patientPhone: '+1 555-0199',
            patientAge: 32,
            patientGender: 'Male',
            doctorId,
            doctorName,
            doctorSpeciality,
            doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
            fees: 50,
            appointmentDate: todayStr,
            timeSlot: '09:00 AM',
            reason: 'Persistent sore throat and mild fever for 2 days',
            notes: 'Patient reports high allergy sensitivity.',
            status: AppointmentStatus.SCHEDULED,
          },
          {
            patientId: 'demo_patient_2',
            patientName: 'Sophia Chen',
            patientPhone: '+1 555-0188',
            patientAge: 28,
            patientGender: 'Female',
            doctorId,
            doctorName,
            doctorSpeciality,
            doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
            fees: 60,
            appointmentDate: todayStr,
            timeSlot: '11:30 AM',
            reason: 'Follow-up consultation for seasonal asthma',
            notes: 'Inhaler prescription review.',
            status: AppointmentStatus.COMPLETED,
          },
          {
            patientId: 'demo_patient_3',
            patientName: 'Michael Brown',
            patientPhone: '+1 555-0177',
            patientAge: 45,
            patientGender: 'Male',
            doctorId,
            doctorName,
            doctorSpeciality,
            doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
            fees: 55,
            appointmentDate: tomorrowStr,
            timeSlot: '02:00 PM',
            reason: 'Annual cholesterol and blood pressure check',
            notes: 'Fasting blood tests done yesterday.',
            status: AppointmentStatus.SCHEDULED,
          },
        ]);

        // Seed 1 Prescription for completed appointment
        if (createdApts && createdApts[1]) {
          await (Prescription as any).create({
            patientId: 'demo_patient_2',
            patientName: 'Sophia Chen',
            patientPhone: '+1 555-0188',
            doctorId,
            doctorName,
            doctorSpeciality,
            appointmentId: createdApts[1]._id.toString(),
            appointmentDate: todayStr,
            diagnosis: 'Acute Bronchitis & Allergic Cough',
            instructions: 'Steam inhalation twice daily. Avoid cold beverages and dust exposure.',
            followUpDate: tomorrowStr,
            status: 'Completed',
            medicines: [
              { name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Thrice daily (After meals)', duration: '5 Days' },
              { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily (Night)', duration: '7 Days' },
            ],
          });
        }
      }
    }
  }

  /**
   * Get Doctor Dashboard Overview Statistics & Recent Items
   */
  static async getDashboardStats(doctorId: string, doctorUser: any) {
    await this.seedDoctorDataIfEmpty(
      doctorId,
      doctorUser?.name || 'Dr. Practitioner',
      doctorUser?.speciality || 'General Medicine'
    );

    const todayStr = new Date().toISOString().split('T')[0];

    if (getIsDbConnected()) {
      const todayAppointments = await (Appointment as any).find({
        doctorId,
        appointmentDate: todayStr,
      }).sort({ timeSlot: 1 });

      const completedToday = todayAppointments.filter((a: any) => a.status === AppointmentStatus.COMPLETED).length;

      const upcomingAppointments = await (Appointment as any).find({
        doctorId,
        appointmentDate: { $gte: todayStr },
        status: AppointmentStatus.SCHEDULED,
      }).sort({ appointmentDate: 1, timeSlot: 1 }).limit(10);

      const recentPrescriptions = await (Prescription as any).find({
        doctorId,
      }).sort({ createdAt: -1 }).limit(5);

      return {
        todayTotalCount: todayAppointments.length,
        completedTodayCount: completedToday,
        upcomingCount: upcomingAppointments.length,
        todayAppointments,
        upcomingAppointments,
        recentPrescriptions,
      };
    } else {
      // Memory Store Fallback
      return {
        todayTotalCount: 2,
        completedTodayCount: 1,
        upcomingCount: 2,
        todayAppointments: [
          {
            _id: 'mem_doc_apt_1',
            patientId: 'demo_patient_1',
            patientName: 'Alex Morgan',
            patientPhone: '+1 555-0199',
            patientAge: 32,
            patientGender: 'Male',
            doctorId,
            doctorName: doctorUser?.name || 'Dr. Richard James',
            doctorSpeciality: doctorUser?.speciality || 'General Medicine',
            fees: 50,
            appointmentDate: todayStr,
            timeSlot: '09:00 AM',
            reason: 'Persistent sore throat and mild fever for 2 days',
            notes: 'Patient reports high allergy sensitivity.',
            status: AppointmentStatus.SCHEDULED,
            createdAt: new Date(),
          },
          {
            _id: 'mem_doc_apt_2',
            patientId: 'demo_patient_2',
            patientName: 'Sophia Chen',
            patientPhone: '+1 555-0188',
            patientAge: 28,
            patientGender: 'Female',
            doctorId,
            doctorName: doctorUser?.name || 'Dr. Richard James',
            doctorSpeciality: doctorUser?.speciality || 'General Medicine',
            fees: 60,
            appointmentDate: todayStr,
            timeSlot: '11:30 AM',
            reason: 'Follow-up consultation for seasonal asthma',
            notes: 'Inhaler prescription review.',
            status: AppointmentStatus.COMPLETED,
            createdAt: new Date(),
          },
        ],
        upcomingAppointments: [],
        recentPrescriptions: memoryPrescriptionStore.slice(0, 5),
      };
    }
  }

  /**
   * Get all doctor appointments with search and filters
   */
  static async getDoctorAppointments(
    doctorId: string,
    filters: { search?: string; status?: string; dateRange?: string }
  ) {
    const todayStr = new Date().toISOString().split('T')[0];

    if (getIsDbConnected()) {
      const query: any = { doctorId };

      if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
      }

      if (filters.dateRange === 'today') {
        query.appointmentDate = todayStr;
      } else if (filters.dateRange === 'future') {
        query.appointmentDate = { $gte: todayStr };
      }

      if (filters.search) {
        query.$or = [
          { patientName: { $regex: filters.search, $options: 'i' } },
          { patientPhone: { $regex: filters.search, $options: 'i' } },
          { reason: { $regex: filters.search, $options: 'i' } },
        ];
      }

      return await (Appointment as any)
        .find(query)
        .sort({ appointmentDate: -1, timeSlot: 1 });
    } else {
      // Memory Store Fallback
      let list = [
        {
          _id: 'mem_doc_apt_1',
          patientId: 'demo_patient_1',
          patientName: 'Alex Morgan',
          patientPhone: '+1 555-0199',
          patientAge: 32,
          patientGender: 'Male',
          doctorId,
          doctorName: 'Dr. Practitioner',
          doctorSpeciality: 'General Medicine',
          fees: 50,
          appointmentDate: todayStr,
          timeSlot: '09:00 AM',
          reason: 'Persistent sore throat and mild fever for 2 days',
          notes: 'Patient reports high allergy sensitivity.',
          status: AppointmentStatus.SCHEDULED,
          createdAt: new Date(),
        },
        {
          _id: 'mem_doc_apt_2',
          patientId: 'demo_patient_2',
          patientName: 'Sophia Chen',
          patientPhone: '+1 555-0188',
          patientAge: 28,
          patientGender: 'Female',
          doctorId,
          doctorName: 'Dr. Practitioner',
          doctorSpeciality: 'General Medicine',
          fees: 60,
          appointmentDate: todayStr,
          timeSlot: '11:30 AM',
          reason: 'Follow-up consultation for seasonal asthma',
          notes: 'Inhaler prescription review.',
          status: AppointmentStatus.COMPLETED,
          createdAt: new Date(),
        },
      ];

      if (filters.status && filters.status !== 'all') {
        list = list.filter((a) => a.status === filters.status);
      }

      if (filters.search) {
        const s = filters.search.toLowerCase();
        list = list.filter(
          (a) =>
            (a.patientName && a.patientName.toLowerCase().includes(s)) ||
            (a.patientPhone && a.patientPhone.includes(s)) ||
            (a.reason && a.reason.toLowerCase().includes(s))
        );
      }

      return list;
    }
  }

  /**
   * Get single appointment details for doctor
   */
  static async getAppointmentDetails(appointmentId: string, doctorId: string) {
    if (getIsDbConnected()) {
      const apt = await (Appointment as any).findOne({ _id: appointmentId, doctorId });
      if (!apt) throw new Error('Appointment not found');

      // Fetch patient profile if exists
      let patientDetails = null;
      if (apt.patientId) {
        patientDetails = await (User as any).findById(apt.patientId).select('-password');
      }

      return {
        appointment: apt,
        patient: patientDetails || {
          _id: apt.patientId,
          name: apt.patientName || 'Patient',
          phone: apt.patientPhone || 'N/A',
          age: apt.patientAge || 0,
          gender: apt.patientGender || 'Not specified',
        },
      };
    } else {
      return {
        appointment: {
          _id: appointmentId,
          patientId: 'demo_patient_1',
          patientName: 'Alex Morgan',
          patientPhone: '+1 555-0199',
          patientAge: 32,
          patientGender: 'Male',
          doctorId,
          doctorName: 'Dr. Practitioner',
          doctorSpeciality: 'General Medicine',
          fees: 50,
          appointmentDate: new Date().toISOString().split('T')[0],
          timeSlot: '09:00 AM',
          reason: 'Persistent sore throat and mild fever for 2 days',
          notes: 'Patient reports high allergy sensitivity.',
          status: AppointmentStatus.SCHEDULED,
        },
        patient: {
          _id: 'demo_patient_1',
          name: 'Alex Morgan',
          phone: '+1 555-0199',
          age: 32,
          gender: 'Male',
        },
      };
    }
  }

  /**
   * Update appointment status by doctor
   */
  static async updateAppointmentStatus(appointmentId: string, doctorId: string, status: AppointmentStatus) {
    if (getIsDbConnected()) {
      const apt = await (Appointment as any).findOne({ _id: appointmentId, doctorId });
      if (!apt) throw new Error('Appointment not found');

      apt.status = status;
      await apt.save();
      return apt;
    } else {
      return {
        _id: appointmentId,
        status,
        updatedAt: new Date(),
      };
    }
  }

  /**
   * Get doctor availability
   */
  static async getDoctorAvailability(doctorId: string) {
    if (getIsDbConnected()) {
      const doc = await (User as any).findById(doctorId);
      if (!doc) throw new Error('Doctor not found');

      return {
        workingDays: doc.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableSlots: doc.availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        consultationDuration: doc.consultationDuration || 20,
      };
    } else {
      return {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        consultationDuration: 20,
      };
    }
  }

  /**
   * Update doctor availability
   */
  static async updateDoctorAvailability(doctorId: string, input: UpdateAvailabilityInput) {
    if (getIsDbConnected()) {
      const doc = await (User as any).findById(doctorId);
      if (!doc) throw new Error('Doctor not found');

      doc.workingDays = input.workingDays;
      doc.availableSlots = input.availableSlots;
      doc.consultationDuration = input.consultationDuration;

      await doc.save();
      return {
        workingDays: doc.workingDays,
        availableSlots: doc.availableSlots,
        consultationDuration: doc.consultationDuration,
      };
    } else {
      return {
        workingDays: input.workingDays,
        availableSlots: input.availableSlots,
        consultationDuration: input.consultationDuration,
      };
    }
  }

  /**
   * Update doctor profile
   */
  static async updateDoctorProfile(doctorId: string, input: UpdateDoctorProfileInput) {
    if (getIsDbConnected()) {
      const doc = await (User as any).findById(doctorId);
      if (!doc) throw new Error('Doctor not found');

      if (input.name !== undefined) doc.name = input.name;
      if (input.phone !== undefined) doc.phone = input.phone;
      if (input.qualification !== undefined) doc.qualification = input.qualification;
      if (input.speciality !== undefined) doc.speciality = input.speciality;
      if (input.experience !== undefined) doc.experience = input.experience;
      if (input.clinicAddress !== undefined) doc.clinicAddress = input.clinicAddress;
      if (input.bio !== undefined) doc.bio = input.bio;
      if (input.profileImage !== undefined) doc.profileImage = input.profileImage;

      await doc.save();
      return sanitizeUser(doc);
    } else {
      return {
        id: doctorId,
        name: input.name || 'Doctor',
        phone: input.phone || '',
        qualification: input.qualification || 'MBBS, MD',
        speciality: input.speciality || 'General Physician',
        experience: input.experience || '5 Years',
        clinicAddress: input.clinicAddress || '',
        bio: input.bio || '',
        profileImage: input.profileImage || '',
      };
    }
  }
}
