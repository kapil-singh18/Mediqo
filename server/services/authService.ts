import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { UserRole } from '../constants/roles.js';
import { RegisterInput, LoginInput } from '../validators/authValidator.js';
import { signToken } from '../utils/jwt.js';
import { getIsDbConnected } from '../config/db.js';

// In-memory user store fallback when MongoDB is not connected
const memoryUserStore = new Map<string, any>();

// Helper to sanitize user object (remove password)
export const sanitizeUser = (user: any) => {
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete obj.password;
  return {
    id: obj._id ? obj._id.toString() : obj.id,
    name: obj.name,
    email: obj.email,
    role: obj.role,
    phone: obj.phone,
    speciality: obj.speciality || '',
    experience: obj.experience || '',
    address: obj.address || '',
    age: obj.age || 0,
    gender: obj.gender || 'Not specified',
    profileImage: obj.profileImage || '',
    qualification: obj.qualification || 'MBBS, MD',
    bio: obj.bio || '',
    clinicAddress: obj.clinicAddress || 'Mediqo Healthcare Tower, 12th Avenue',
    workingDays: obj.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableSlots: obj.availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    consultationDuration: obj.consultationDuration || 20,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

export class AuthService {
  /**
   * Register a new patient
   */
  static async registerPatient(data: RegisterInput) {
    const emailLower = data.email.toLowerCase().trim();

    if (getIsDbConnected()) {
      const existingUser = await (User as any).findOne({ email: emailLower });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const newUser = await (User as any).create({
        name: data.name,
        email: emailLower,
        password: hashedPassword,
        role: UserRole.PATIENT, // Only patient registration allowed!
        phone: data.phone,
      });

      const userObj = sanitizeUser(newUser);
      const token = signToken({
        userId: userObj.id,
        email: userObj.email,
        role: userObj.role,
      });

      return { user: userObj, token };
    } else {
      // In-memory fallback
      if (memoryUserStore.has(emailLower)) {
        throw new Error('User with this email already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const userId = 'mem_user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

      const newUser = {
        _id: userId,
        id: userId,
        name: data.name,
        email: emailLower,
        password: hashedPassword,
        role: UserRole.PATIENT,
        phone: data.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryUserStore.set(emailLower, newUser);

      const userObj = sanitizeUser(newUser);
      const token = signToken({
        userId: userObj.id,
        email: userObj.email,
        role: userObj.role,
      });

      return { user: userObj, token };
    }
  }

  /**
   * Login user of any role (patient, doctor, receptionist)
   */
  static async loginUser(data: LoginInput) {
    const emailLower = data.email.toLowerCase().trim();

    if (getIsDbConnected()) {
      const user = await (User as any).findOne({ email: emailLower }).select('+password');
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(data.password, user.password!);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const userObj = sanitizeUser(user);
      const token = signToken({
        userId: userObj.id,
        email: userObj.email,
        role: userObj.role,
      });

      return { user: userObj, token };
    } else {
      // Memory store fallback
      const user = memoryUserStore.get(emailLower);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const userObj = sanitizeUser(user);
      const token = signToken({
        userId: userObj.id,
        email: userObj.email,
        role: userObj.role,
      });

      return { user: userObj, token };
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserById(userId: string) {
    if (getIsDbConnected()) {
      const user = await (User as any).findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return sanitizeUser(user);
    } else {
      for (const [, user] of memoryUserStore.entries()) {
        if (user._id === userId || user.id === userId) {
          return sanitizeUser(user);
        }
      }
      throw new Error('User not found');
    }
  }

  /**
   * Update patient profile
   */
  static async updateProfile(userId: string, data: { name?: string; phone?: string; address?: string; age?: number; gender?: string; profileImage?: string }) {
    if (getIsDbConnected()) {
      const user = await (User as any).findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (data.name !== undefined) user.name = data.name;
      if (data.phone !== undefined) user.phone = data.phone;
      if (data.address !== undefined) user.address = data.address;
      if (data.age !== undefined) user.age = Number(data.age);
      if (data.gender !== undefined) user.gender = data.gender;
      if (data.profileImage !== undefined) user.profileImage = data.profileImage;

      await user.save();
      return sanitizeUser(user);
    } else {
      let foundUserKey: string | null = null;
      let foundUserObj: any = null;

      for (const [key, user] of memoryUserStore.entries()) {
        if (user._id === userId || user.id === userId) {
          foundUserKey = key;
          foundUserObj = user;
          break;
        }
      }

      if (!foundUserObj || !foundUserKey) {
        throw new Error('User not found');
      }

      if (data.name !== undefined) foundUserObj.name = data.name;
      if (data.phone !== undefined) foundUserObj.phone = data.phone;
      if (data.address !== undefined) foundUserObj.address = data.address;
      if (data.age !== undefined) foundUserObj.age = Number(data.age);
      if (data.gender !== undefined) foundUserObj.gender = data.gender;
      if (data.profileImage !== undefined) foundUserObj.profileImage = data.profileImage;
      foundUserObj.updatedAt = new Date();

      memoryUserStore.set(foundUserKey, foundUserObj);
      return sanitizeUser(foundUserObj);
    }
  }

  /**
   * Seed Indian Doctors, Receptionist, Patients, Appointments, Prescriptions, and Bills
   */
  static async seedUsers() {
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const initialUsers = [
      // Doctors with Indian Names
      {
        name: 'Dr. Rajesh Sharma',
        email: 'dr.rajesh@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+91 98765-43210',
        speciality: 'General Physician',
        experience: '12 Years',
        qualification: 'MBBS, MD (General Medicine)',
        clinicAddress: 'Mediqo Care Center, Bandra West, Mumbai',
        bio: 'Senior consultant specializing in internal medicine, chronic disease management, and preventive care.',
      },
      {
        name: 'Dr. Priya Patel',
        email: 'dr.priya@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+91 98765-43211',
        speciality: 'Gynecologist',
        experience: '8 Years',
        qualification: 'MBBS, MS (Obstetrics & Gynecology)',
        clinicAddress: 'Mediqo Care Center, Indiranagar, Bengaluru',
        bio: 'Specialist in women’s health, maternity care, and laparoscopic reproductive surgery.',
      },
      {
        name: 'Dr. Ananya Iyer',
        email: 'dr.ananya@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+91 98765-43212',
        speciality: 'Dermatologist',
        experience: '6 Years',
        qualification: 'MBBS, MD (Dermatology & Cosmetology)',
        clinicAddress: 'Mediqo Care Center, Anna Nagar, Chennai',
        bio: 'Consultant dermatologist focused on clinical skincare, trichology, and cosmetic dermatology.',
      },
      {
        name: 'Dr. Vikram Malhotra',
        email: 'dr.vikram@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+91 98765-43213',
        speciality: 'Cardiologist',
        experience: '15 Years',
        qualification: 'MBBS, DM (Cardiology)',
        clinicAddress: 'Mediqo Care Center, Connaught Place, New Delhi',
        bio: 'Interventional cardiologist providing comprehensive heart disease risk assessment and care.',
      },
      {
        name: 'Dr. Amit Verma',
        email: 'dr.amit@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+91 98765-43214',
        speciality: 'Orthopedic Surgeon',
        experience: '10 Years',
        qualification: 'MBBS, MS (Orthopedics)',
        clinicAddress: 'Mediqo Care Center, Koregaon Park, Pune',
        bio: 'Expert in joint preservation, sports injury rehabilitation, and joint replacement therapy.',
      },

      // Legacy Aliases for Seamless Single-Click Login Compatibility
      {
        name: 'Dr. Rajesh Sharma',
        email: 'dr.richard@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+91 98765-43210',
        speciality: 'General Physician',
        experience: '12 Years',
        qualification: 'MBBS, MD',
      },
      {
        name: 'Dr. Priya Patel',
        email: 'dr.emily@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+91 98765-43211',
        speciality: 'Gynecologist',
        experience: '8 Years',
        qualification: 'MBBS, MS',
      },
      {
        name: 'Dr. Ananya Iyer',
        email: 'dr.sarah@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+91 98765-43212',
        speciality: 'Dermatologist',
        experience: '6 Years',
        qualification: 'MBBS, MD',
      },

      // Receptionist
      {
        name: 'Sunita Rao',
        email: 'receptionist@mediqo.com',
        role: UserRole.RECEPTIONIST,
        phone: '+91 98765-43200',
        speciality: 'Front Desk Lead',
        experience: '5 Years',
        deskLocation: 'Main Reception Desk - Ground Floor',
        shiftHours: '08:00 AM - 04:00 PM',
      },

      // Patients
      {
        name: 'Aarav Mehta',
        email: 'patient@mediqo.com',
        role: UserRole.PATIENT,
        phone: '+91 98111-22334',
        age: 32,
        gender: 'Male',
        address: 'B-402, Sea View Apartments, Juhu, Mumbai',
        bio: 'No known drug allergies. History of seasonal hypertension.',
      },
      {
        name: 'Aarav Mehta',
        email: 'aarav@mediqo.com',
        role: UserRole.PATIENT,
        phone: '+91 98111-22334',
        age: 32,
        gender: 'Male',
        address: 'B-402, Sea View Apartments, Juhu, Mumbai',
      },
      {
        name: 'Ananya Gupta',
        email: 'ananya.g@mediqo.com',
        role: UserRole.PATIENT,
        phone: '+91 98222-33445',
        age: 28,
        gender: 'Female',
        address: 'House #12, Defence Colony, New Delhi',
      },
      {
        name: 'Rahul Verma',
        email: 'rahul.v@mediqo.com',
        role: UserRole.PATIENT,
        phone: '+91 98333-44556',
        age: 45,
        gender: 'Male',
        address: 'Flat 101, Green Glen Layout, Bellandur, Bengaluru',
      },
      {
        name: 'Priya Singh',
        email: 'priya.s@mediqo.com',
        role: UserRole.PATIENT,
        phone: '+91 98444-55667',
        age: 36,
        gender: 'Female',
        address: 'Villa 15, Kalyani Nagar, Pune',
      },
    ];

    let createdCount = 0;
    const createdUserDocs: Record<string, any> = {};

    for (const u of initialUsers) {
      const emailLower = u.email.toLowerCase().trim();

      if (getIsDbConnected()) {
        let userDoc = await (User as any).findOne({ email: emailLower });
        if (!userDoc) {
          userDoc = await (User as any).create({
            ...u,
            email: emailLower,
            password: hashedPassword,
          });
          createdCount++;
        }
        createdUserDocs[emailLower] = userDoc;
      } else {
        if (!memoryUserStore.has(emailLower)) {
          const userId = 'seed_' + emailLower.replace(/[^a-z0-9]/g, '_');
          const memUser = {
            _id: userId,
            id: userId,
            ...u,
            email: emailLower,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          memoryUserStore.set(emailLower, memUser);
          createdUserDocs[emailLower] = memUser;
          createdCount++;
        } else {
          createdUserDocs[emailLower] = memoryUserStore.get(emailLower);
        }
      }
    }

    // Seed Appointments, Prescriptions & Bills if DB is connected
    if (getIsDbConnected()) {
      try {
        const { Appointment, AppointmentStatus } = await import('../models/Appointment.js');
        const { Prescription } = await import('../models/Prescription.js');
        const { Bill } = await import('../models/Bill.js');

        const aptCount = await (Appointment as any).countDocuments();
        if (aptCount === 0) {
          const rajesh = createdUserDocs['dr.rajesh@mediqo.com'];
          const priya = createdUserDocs['dr.priya@mediqo.com'];
          const ananyaDr = createdUserDocs['dr.ananya@mediqo.com'];
          const aarav = createdUserDocs['patient@mediqo.com'];
          const ananyaPt = createdUserDocs['ananya.g@mediqo.com'];
          const rahul = createdUserDocs['rahul.v@mediqo.com'];

          const todayStr = new Date().toISOString().split('T')[0];

          if (rajesh && aarav) {
            // Appointment 1 - Today
            const apt1 = await (Appointment as any).create({
              patientId: aarav._id.toString(),
              patientName: aarav.name,
              patientPhone: aarav.phone,
              patientAge: aarav.age || 32,
              patientGender: aarav.gender || 'Male',
              doctorId: rajesh._id.toString(),
              doctorName: rajesh.name,
              doctorSpeciality: rajesh.speciality,
              fees: 500,
              appointmentDate: todayStr,
              timeSlot: '10:00 AM',
              reason: 'Routine health checkup & mild fatigue evaluation',
              status: AppointmentStatus.SCHEDULED,
            });

            // Bill for Apt 1
            await (Bill as any).create({
              billNumber: `INV-${todayStr.replace(/-/g, '')}-1001`,
              patientId: aarav._id.toString(),
              patientName: aarav.name,
              patientPhone: aarav.phone,
              doctorId: rajesh._id.toString(),
              doctorName: rajesh.name,
              doctorSpeciality: rajesh.speciality,
              appointmentId: apt1._id.toString(),
              appointmentDate: todayStr,
              consultationFee: 500,
              items: [
                { description: 'Consultation Fee', amount: 500, quantity: 1 },
                { description: 'CBC Complete Blood Count Lab Test', amount: 350, quantity: 1 },
              ],
              discount: 50,
              tax: 30,
              paymentMethod: 'UPI / GPay',
              status: 'Paid',
              date: todayStr,
              dueDate: todayStr,
              total: 830,
              notes: 'Receipt generated at reception.',
            });
          }

          if (priya && ananyaPt) {
            // Appointment 2 - Completed
            const apt2 = await (Appointment as any).create({
              patientId: ananyaPt._id.toString(),
              patientName: ananyaPt.name,
              patientPhone: ananyaPt.phone,
              patientAge: ananyaPt.age || 28,
              patientGender: ananyaPt.gender || 'Female',
              doctorId: priya._id.toString(),
              doctorName: priya.name,
              doctorSpeciality: priya.speciality,
              fees: 600,
              appointmentDate: '2026-07-20',
              timeSlot: '02:00 PM',
              reason: 'Annual wellness check and vitamin evaluation',
              status: AppointmentStatus.COMPLETED,
            });

            // Prescription for Apt 2
            await (Prescription as any).create({
              patientId: ananyaPt._id.toString(),
              patientName: ananyaPt.name,
              patientPhone: ananyaPt.phone,
              doctorId: priya._id.toString(),
              doctorName: priya.name,
              doctorSpeciality: priya.speciality,
              appointmentId: apt2._id.toString(),
              appointmentDate: '2026-07-20',
              diagnosis: 'Mild Vitamin D deficiency & fatigue',
              instructions: 'Take Vitamin D3 capsule weekly after meals with milk. Stay hydrated.',
              followUpDate: '2026-08-20',
              status: 'Completed',
              medicines: [
                { name: 'Vitamin D3 60,000 IU Capsule', dosage: '1 Capsule', frequency: 'Once weekly', duration: '8 Weeks' },
                { name: 'Multivitamin & Mineral Tablet', dosage: '1 Tablet', frequency: 'Once daily after breakfast', duration: '30 Days' },
              ],
            });

            // Bill 2
            await (Bill as any).create({
              billNumber: `INV-20260720-1002`,
              patientId: ananyaPt._id.toString(),
              patientName: ananyaPt.name,
              patientPhone: ananyaPt.phone,
              doctorId: priya._id.toString(),
              doctorName: priya.name,
              doctorSpeciality: priya.speciality,
              appointmentId: apt2._id.toString(),
              appointmentDate: '2026-07-20',
              consultationFee: 600,
              items: [{ description: 'Specialist Consultation', amount: 600, quantity: 1 }],
              discount: 0,
              tax: 0,
              paymentMethod: 'Credit Card',
              status: 'Paid',
              date: '2026-07-20',
              dueDate: '2026-07-20',
              total: 600,
            });
          }

          if (ananyaDr && rahul) {
            // Appointment 3 - Scheduled
            await (Appointment as any).create({
              patientId: rahul._id.toString(),
              patientName: rahul.name,
              patientPhone: rahul.phone,
              patientAge: rahul.age || 45,
              patientGender: rahul.gender || 'Male',
              doctorId: ananyaDr._id.toString(),
              doctorName: ananyaDr.name,
              doctorSpeciality: ananyaDr.speciality,
              fees: 550,
              appointmentDate: todayStr,
              timeSlot: '04:00 PM',
              reason: 'Skin allergic reaction and rash consultation',
              status: AppointmentStatus.SCHEDULED,
            });
          }
        }
      } catch (seedErr) {
        console.error('Error seeding secondary collections:', seedErr);
      }
    }

    console.log(`Mediqo Seed script execution completed. Seeded accounts & sample records.`);
    return { createdCount, totalSeed: initialUsers.length };
  }
}
