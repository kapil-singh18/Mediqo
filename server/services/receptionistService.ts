import { User, IUser } from '../models/User.js';
import { Appointment, IAppointment, AppointmentStatus } from '../models/Appointment.js';
import { Bill, IBill } from '../models/Bill.js';
import { UserRole } from '../constants/roles.js';
import { getIsDbConnected } from '../config/db.js';
import bcrypt from 'bcryptjs';

// Fallback in-memory stores when MongoDB is not connected
const memoryPatients: any[] = [
  {
    _id: 'pat_101',
    id: 'pat_101',
    name: 'Aarav Mehta',
    email: 'patient@mediqo.com',
    phone: '+91 98111-22334',
    role: UserRole.PATIENT,
    age: 32,
    gender: 'Male',
    address: 'B-402, Sea View Apartments, Juhu, Mumbai',
    bio: 'No known allergies.',
    createdAt: new Date(),
  },
  {
    _id: 'pat_102',
    id: 'pat_102',
    name: 'Ananya Gupta',
    email: 'ananya.g@mediqo.com',
    phone: '+91 98222-33445',
    role: UserRole.PATIENT,
    age: 28,
    gender: 'Female',
    address: 'House #12, Defence Colony, New Delhi',
    bio: 'Seasonal allergies.',
    createdAt: new Date(),
  },
  {
    _id: 'pat_103',
    id: 'pat_103',
    name: 'Rahul Verma',
    email: 'rahul.v@mediqo.com',
    phone: '+91 98333-44556',
    role: UserRole.PATIENT,
    age: 45,
    gender: 'Male',
    address: 'Flat 101, Green Glen Layout, Bellandur, Bengaluru',
    bio: 'Diabetic history.',
    createdAt: new Date(),
  },
];

const getTodayStr = () => new Date().toISOString().split('T')[0];

const memoryAppointments: any[] = [
  {
    _id: 'apt_101',
    patientId: 'pat_101',
    patientName: 'Aarav Mehta',
    patientPhone: '+91 98111-22334',
    patientAge: 32,
    patientGender: 'Male',
    doctorId: 'doc_101',
    doctorName: 'Dr. Rajesh Sharma',
    doctorSpeciality: 'General Physician',
    fees: 500,
    appointmentDate: getTodayStr(),
    timeSlot: '10:00 AM',
    reason: 'Routine health checkup & mild fatigue evaluation',
    status: AppointmentStatus.SCHEDULED,
    createdAt: new Date(),
  },
  {
    _id: 'apt_102',
    patientId: 'pat_102',
    patientName: 'Ananya Gupta',
    patientPhone: '+91 98222-33445',
    patientAge: 28,
    patientGender: 'Female',
    doctorId: 'doc_102',
    doctorName: 'Dr. Priya Patel',
    doctorSpeciality: 'Gynecologist',
    fees: 600,
    appointmentDate: getTodayStr(),
    timeSlot: '02:00 PM',
    reason: 'Annual wellness check and vitamin evaluation',
    status: AppointmentStatus.COMPLETED,
    createdAt: new Date(),
  },
];

const memoryBills: any[] = [
  {
    _id: 'bill_101',
    billNumber: 'INV-20260724-1001',
    patientId: 'pat_101',
    patientName: 'Aarav Mehta',
    patientPhone: '+91 98111-22334',
    doctorName: 'Dr. Rajesh Sharma',
    doctorSpeciality: 'General Physician',
    appointmentId: 'apt_101',
    appointmentDate: getTodayStr(),
    consultationFee: 500,
    items: [{ description: 'CBC Complete Blood Count', amount: 350, quantity: 1 }],
    discount: 50,
    tax: 30,
    paymentMethod: 'UPI / GPay',
    status: 'Pending',
    date: getTodayStr(),
    dueDate: getTodayStr(),
    total: 830,
    createdAt: new Date(),
  },
  {
    _id: 'bill_102',
    billNumber: 'INV-20260720-1002',
    patientId: 'pat_102',
    patientName: 'Ananya Gupta',
    patientPhone: '+91 98222-33445',
    doctorName: 'Dr. Priya Patel',
    doctorSpeciality: 'Gynecologist',
    appointmentId: 'apt_102',
    appointmentDate: '2026-07-20',
    consultationFee: 600,
    items: [],
    discount: 0,
    tax: 0,
    paymentMethod: 'Credit Card',
    status: 'Paid',
    date: '2026-07-20',
    dueDate: '2026-07-20',
    total: 600,
    createdAt: new Date(),
  },
];

const memoryDoctors = [
  {
    _id: 'doc_101',
    name: 'Dr. Rajesh Sharma',
    speciality: 'General Physician',
    experience: '12 Years',
    fees: 500,
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    qualification: 'MBBS, MD',
  },
  {
    _id: 'doc_102',
    name: 'Dr. Priya Patel',
    speciality: 'Gynecologist',
    experience: '8 Years',
    fees: 600,
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    profileImage: 'https://images.unsplash.com/photo-1594824813566-78a9c39ce425?w=600&auto=format&fit=crop&q=80',
    qualification: 'MBBS, MS',
  },
  {
    _id: 'doc_103',
    name: 'Dr. Ananya Iyer',
    speciality: 'Dermatologist',
    experience: '6 Years',
    fees: 550,
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
    qualification: 'MBBS, MD',
  },
];

export class ReceptionistService {
  // Dashboard Analytics
  static async getDashboardStats() {
    const todayStr = getTodayStr();

    if (getIsDbConnected()) {
      const [
        totalPatients,
        todayAppointments,
        pendingBills,
        totalBillsCount,
        recentAppointments,
        recentBills,
      ] = await Promise.all([
        (User as any).countDocuments({ role: UserRole.PATIENT }),
        (Appointment as any).countDocuments({ appointmentDate: todayStr }),
        (Bill as any).find({ status: { $in: ['Pending', 'Partial', 'Overdue'] } }),
        (Bill as any).countDocuments({}),
        (Appointment as any).find({})
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
        (Bill as any).find({})
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
      ]);

      const pendingPaymentTotal = pendingBills.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);

      return {
        stats: {
          totalPatients,
          todayAppointments,
          pendingPaymentTotal,
          totalBillsCount,
        },
        recentAppointments,
        recentBills,
      };
    } else {
      // Memory Store Fallback
      const pendingPaymentTotal = memoryBills
        .filter((b) => ['Pending', 'Partial', 'Overdue'].includes(b.status))
        .reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);

      return {
        stats: {
          totalPatients: memoryPatients.length,
          todayAppointments: memoryAppointments.filter((a) => a.appointmentDate === todayStr).length,
          pendingPaymentTotal,
          totalBillsCount: memoryBills.length,
        },
        recentAppointments: memoryAppointments.slice(0, 6),
        recentBills: memoryBills.slice(0, 6),
      };
    }
  }

  // Patients Management
  static async getPatients(query: { search?: string; gender?: string; page?: number; limit?: number }) {
    const { search = '', gender, page = 1, limit = 20 } = query;

    if (getIsDbConnected()) {
      const filter: any = { role: UserRole.PATIENT };

      if (search.trim()) {
        filter.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { phone: { $regex: search.trim(), $options: 'i' } },
          { email: { $regex: search.trim(), $options: 'i' } },
        ];
      }

      if (gender && gender !== 'all') {
        filter.gender = gender;
      }

      const skip = (page - 1) * limit;

      const [patients, total] = await Promise.all([
        (User as any).find(filter)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        (User as any).countDocuments(filter),
      ]);

      return {
        patients: patients.map((p: any) => ({
          ...p,
          _id: p._id ? p._id.toString() : p.id,
        })),
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit) || 1,
        },
      };
    } else {
      // Memory Fallback
      let list = [...memoryPatients];
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        list = list.filter(
          (p) =>
            (p.name && p.name.toLowerCase().includes(s)) ||
            (p.phone && p.phone.includes(s)) ||
            (p.email && p.email.toLowerCase().includes(s))
        );
      }
      if (gender && gender !== 'all') {
        list = list.filter((p) => p.gender === gender);
      }

      const total = list.length;
      const skip = (page - 1) * limit;
      const paginated = list.slice(skip, skip + limit);

      return {
        patients: paginated,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit) || 1,
        },
      };
    }
  }

  static async createPatient(data: {
    name: string;
    phone: string;
    email?: string;
    age?: number;
    gender?: string;
    address?: string;
    bio?: string;
  }) {
    let email = data.email?.trim().toLowerCase();
    if (!email) {
      email = `patient_${Date.now()}@mediqo.local`;
    }

    if (getIsDbConnected()) {
      const existingUser = await (User as any).findOne({ email });
      if (existingUser) {
        throw new Error('A user with this email address already exists.');
      }

      const hashedPassword = await bcrypt.hash('Patient@123', 10);

      const newPatient = await (User as any).create({
        name: data.name,
        phone: data.phone,
        email,
        password: hashedPassword,
        role: UserRole.PATIENT,
        age: data.age || 0,
        gender: data.gender || 'Not specified',
        address: data.address || '',
        bio: data.bio || '',
      });

      return {
        patient: {
          _id: newPatient._id.toString(),
          name: newPatient.name,
          email: newPatient.email,
          phone: newPatient.phone,
          role: newPatient.role,
          age: newPatient.age,
          gender: newPatient.gender,
          address: newPatient.address,
          bio: newPatient.bio,
        },
      };
    } else {
      const id = 'pat_' + Date.now();
      const patientObj = {
        _id: id,
        id,
        name: data.name,
        email,
        phone: data.phone,
        role: UserRole.PATIENT,
        age: data.age || 0,
        gender: data.gender || 'Not specified',
        address: data.address || '',
        bio: data.bio || '',
        createdAt: new Date(),
      };
      memoryPatients.unshift(patientObj);
      return { patient: patientObj };
    }
  }

  static async updatePatient(
    patientId: string,
    data: {
      name?: string;
      phone?: string;
      email?: string;
      age?: number;
      gender?: string;
      address?: string;
      bio?: string;
    }
  ) {
    if (getIsDbConnected()) {
      const patient = await (User as any).findById(patientId);
      if (!patient || patient.role !== UserRole.PATIENT) {
        throw new Error('Patient record not found');
      }

      if (data.name) patient.name = data.name;
      if (data.phone) patient.phone = data.phone;
      if (data.email) patient.email = data.email.toLowerCase();
      if (data.age !== undefined) patient.age = data.age;
      if (data.gender) patient.gender = data.gender;
      if (data.address !== undefined) patient.address = data.address;
      if (data.bio !== undefined) patient.bio = data.bio;

      await patient.save();

      return {
        patient: {
          _id: patient._id.toString(),
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          age: patient.age,
          gender: patient.gender,
          address: patient.address,
          bio: patient.bio,
        },
      };
    } else {
      const patient = memoryPatients.find((p) => p._id === patientId || p.id === patientId);
      if (!patient) throw new Error('Patient record not found');

      if (data.name) patient.name = data.name;
      if (data.phone) patient.phone = data.phone;
      if (data.email) patient.email = data.email.toLowerCase();
      if (data.age !== undefined) patient.age = data.age;
      if (data.gender) patient.gender = data.gender;
      if (data.address !== undefined) patient.address = data.address;
      if (data.bio !== undefined) patient.bio = data.bio;

      return { patient };
    }
  }

  static async getPatientDetails(patientId: string) {
    if (getIsDbConnected()) {
      const patient = await (User as any).findById(patientId).select('-password').lean();
      if (!patient) {
        throw new Error('Patient record not found');
      }

      const [appointments, bills] = await Promise.all([
        (Appointment as any).find({ patientId: patient._id ? patient._id.toString() : patientId })
          .sort({ createdAt: -1 })
          .lean(),
        (Bill as any).find({ patientId: patient._id ? patient._id.toString() : patientId })
          .sort({ createdAt: -1 })
          .lean(),
      ]);

      return {
        patient: {
          ...patient,
          _id: patient._id ? patient._id.toString() : patientId,
        },
        appointments,
        bills,
      };
    } else {
      const patient = memoryPatients.find((p) => p._id === patientId || p.id === patientId) || memoryPatients[0];
      const appointments = memoryAppointments.filter((a) => a.patientId === patient._id || a.patientId === patient.id);
      const bills = memoryBills.filter((b) => b.patientId === patient._id || b.patientId === patient.id);

      return {
        patient,
        appointments,
        bills,
      };
    }
  }

  // Appointment Desk Operations
  static async getAppointments(query: {
    search?: string;
    status?: string;
    date?: string;
    doctorId?: string;
  }) {
    const { search = '', status, date, doctorId } = query;

    if (getIsDbConnected()) {
      const filter: any = {};

      if (status && status !== 'all') {
        filter.status = status;
      }

      if (date && date !== 'all') {
        const todayStr = getTodayStr();
        if (date === 'today') {
          filter.appointmentDate = todayStr;
        } else if (date === 'upcoming') {
          filter.appointmentDate = { $gte: todayStr };
        } else {
          filter.appointmentDate = date;
        }
      }

      if (doctorId && doctorId !== 'all') {
        filter.doctorId = doctorId;
      }

      if (search.trim()) {
        filter.$or = [
          { patientName: { $regex: search.trim(), $options: 'i' } },
          { patientPhone: { $regex: search.trim(), $options: 'i' } },
          { doctorName: { $regex: search.trim(), $options: 'i' } },
          { reason: { $regex: search.trim(), $options: 'i' } },
        ];
      }

      const appointments = await (Appointment as any).find(filter)
        .sort({ createdAt: -1 })
        .lean();

      return { appointments };
    } else {
      // Memory fallback
      let list = [...memoryAppointments];
      if (status && status !== 'all') {
        list = list.filter((a) => a.status === status);
      }
      if (date && date !== 'all') {
        const todayStr = getTodayStr();
        if (date === 'today') {
          list = list.filter((a) => a.appointmentDate === todayStr);
        } else if (date === 'upcoming') {
          list = list.filter((a) => a.appointmentDate >= todayStr);
        } else {
          list = list.filter((a) => a.appointmentDate === date);
        }
      }
      if (doctorId && doctorId !== 'all') {
        list = list.filter((a) => a.doctorId === doctorId);
      }
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        list = list.filter(
          (a) =>
            (a.patientName && a.patientName.toLowerCase().includes(s)) ||
            (a.patientPhone && a.patientPhone.includes(s)) ||
            (a.doctorName && a.doctorName.toLowerCase().includes(s)) ||
            (a.reason && a.reason.toLowerCase().includes(s))
        );
      }

      return { appointments: list };
    }
  }

  static async bookAppointment(data: {
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    timeSlot: string;
    reason: string;
    fees?: number;
    notes?: string;
  }) {
    if (getIsDbConnected()) {
      const [patient, doctor] = await Promise.all([
        (User as any).findById(data.patientId),
        (User as any).findById(data.doctorId),
      ]);

      if (!patient) {
        throw new Error('Selected patient does not exist');
      }
      if (!doctor || doctor.role !== UserRole.DOCTOR) {
        throw new Error('Selected doctor does not exist');
      }

      const newAppointment = await (Appointment as any).create({
        patientId: patient._id.toString(),
        patientName: patient.name,
        patientPhone: patient.phone,
        patientAge: patient.age || 0,
        patientGender: patient.gender || 'Not specified',
        doctorId: doctor._id.toString(),
        doctorName: doctor.name,
        doctorSpeciality: doctor.speciality || 'General Practitioner',
        doctorImage: doctor.profileImage || '',
        fees: data.fees ?? 500,
        appointmentDate: data.appointmentDate,
        timeSlot: data.timeSlot,
        reason: data.reason,
        notes: data.notes || '',
        status: AppointmentStatus.SCHEDULED,
      });

      return { appointment: newAppointment };
    } else {
      const pat = memoryPatients.find((p) => p._id === data.patientId || p.id === data.patientId) || memoryPatients[0];
      const doc = memoryDoctors.find((d) => d._id === data.doctorId) || memoryDoctors[0];

      const newAppointment = {
        _id: 'apt_' + Date.now(),
        patientId: pat._id,
        patientName: pat.name,
        patientPhone: pat.phone,
        patientAge: pat.age || 30,
        patientGender: pat.gender || 'Male',
        doctorId: doc._id,
        doctorName: doc.name,
        doctorSpeciality: doc.speciality,
        fees: data.fees ?? doc.fees,
        appointmentDate: data.appointmentDate,
        timeSlot: data.timeSlot,
        reason: data.reason,
        notes: data.notes || '',
        status: AppointmentStatus.SCHEDULED,
        createdAt: new Date(),
      };

      memoryAppointments.unshift(newAppointment);
      return { appointment: newAppointment };
    }
  }

  static async rescheduleAppointment(
    appointmentId: string,
    data: {
      appointmentDate: string;
      timeSlot: string;
      doctorId?: string;
      notes?: string;
    }
  ) {
    if (getIsDbConnected()) {
      const appointment = await (Appointment as any).findById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      if (data.doctorId && data.doctorId !== appointment.doctorId) {
        const newDoc = await (User as any).findById(data.doctorId);
        if (newDoc && newDoc.role === UserRole.DOCTOR) {
          appointment.doctorId = newDoc._id.toString();
          appointment.doctorName = newDoc.name;
          appointment.doctorSpeciality = newDoc.speciality || 'General Practitioner';
          appointment.doctorImage = newDoc.profileImage || '';
        }
      }

      appointment.appointmentDate = data.appointmentDate;
      appointment.timeSlot = data.timeSlot;
      if (data.notes !== undefined) {
        appointment.notes = data.notes;
      }
      appointment.status = AppointmentStatus.SCHEDULED;

      await appointment.save();

      return { appointment };
    } else {
      const appointment = memoryAppointments.find((a) => a._id === appointmentId);
      if (!appointment) throw new Error('Appointment not found');

      if (data.doctorId) {
        const doc = memoryDoctors.find((d) => d._id === data.doctorId);
        if (doc) {
          appointment.doctorId = doc._id;
          appointment.doctorName = doc.name;
          appointment.doctorSpeciality = doc.speciality;
        }
      }

      appointment.appointmentDate = data.appointmentDate;
      appointment.timeSlot = data.timeSlot;
      if (data.notes !== undefined) appointment.notes = data.notes;
      appointment.status = AppointmentStatus.SCHEDULED;

      return { appointment };
    }
  }

  static async cancelAppointment(appointmentId: string) {
    if (getIsDbConnected()) {
      const appointment = await (Appointment as any).findById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      appointment.status = AppointmentStatus.CANCELLED;
      await appointment.save();

      return { appointment };
    } else {
      const appointment = memoryAppointments.find((a) => a._id === appointmentId);
      if (!appointment) throw new Error('Appointment not found');
      appointment.status = AppointmentStatus.CANCELLED;
      return { appointment };
    }
  }

  static async assignDoctor(
    appointmentId: string,
    doctorId: string
  ) {
    if (getIsDbConnected()) {
      const appointment = await (Appointment as any).findById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      const doctor = await (User as any).findById(doctorId);
      if (!doctor || doctor.role !== UserRole.DOCTOR) {
        throw new Error('Doctor record not found');
      }

      appointment.doctorId = doctor._id.toString();
      appointment.doctorName = doctor.name;
      appointment.doctorSpeciality = doctor.speciality || 'General Practitioner';
      appointment.doctorImage = doctor.profileImage || '';

      await appointment.save();

      return { appointment };
    } else {
      const appointment = memoryAppointments.find((a) => a._id === appointmentId);
      if (!appointment) throw new Error('Appointment not found');
      const doc = memoryDoctors.find((d) => d._id === doctorId);
      if (doc) {
        appointment.doctorId = doc._id;
        appointment.doctorName = doc.name;
        appointment.doctorSpeciality = doc.speciality;
      }
      return { appointment };
    }
  }

  // Billing Desk Operations
  static async getBills(query: { search?: string; status?: string; date?: string }) {
    const { search = '', status, date } = query;

    if (getIsDbConnected()) {
      const filter: any = {};

      if (status && status !== 'all') {
        filter.status = status;
      }

      if (date && date !== 'all') {
        const todayStr = getTodayStr();
        if (date === 'today') {
          filter.date = todayStr;
        } else {
          filter.date = date;
        }
      }

      if (search.trim()) {
        filter.$or = [
          { billNumber: { $regex: search.trim(), $options: 'i' } },
          { patientName: { $regex: search.trim(), $options: 'i' } },
          { patientPhone: { $regex: search.trim(), $options: 'i' } },
          { doctorName: { $regex: search.trim(), $options: 'i' } },
        ];
      }

      const bills = await (Bill as any).find(filter)
        .sort({ createdAt: -1 })
        .lean();

      return { bills };
    } else {
      let list = [...memoryBills];
      if (status && status !== 'all') {
        list = list.filter((b) => b.status === status);
      }
      if (date && date !== 'all') {
        const todayStr = getTodayStr();
        if (date === 'today') {
          list = list.filter((b) => b.date === todayStr);
        } else {
          list = list.filter((b) => b.date === date);
        }
      }
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        list = list.filter(
          (b) =>
            (b.billNumber && b.billNumber.toLowerCase().includes(s)) ||
            (b.patientName && b.patientName.toLowerCase().includes(s)) ||
            (b.patientPhone && b.patientPhone.includes(s)) ||
            (b.doctorName && b.doctorName.toLowerCase().includes(s))
        );
      }

      return { bills: list };
    }
  }

  static async createBill(data: {
    patientId: string;
    doctorName: string;
    doctorSpeciality?: string;
    appointmentId?: string;
    appointmentDate?: string;
    consultationFee?: number;
    items?: { description: string; amount: number; quantity?: number }[];
    discount?: number;
    tax?: number;
    paymentMethod?: string;
    status?: 'Paid' | 'Pending' | 'Partial' | 'Overdue';
    dueDate?: string;
    notes?: string;
  }) {
    const todayStr = getTodayStr();
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const billNumber = `INV-${todayStr.replace(/-/g, '')}-${randSuffix}`;

    const consultationFee = Number(data.consultationFee) || 0;
    const items = data.items || [];
    const itemsTotal = items.reduce((sum, item) => sum + (Number(item.amount) * (Number(item.quantity) || 1)), 0);
    const discount = Number(data.discount) || 0;
    const tax = Number(data.tax) || 0;

    const subtotal = consultationFee + itemsTotal;
    const grandTotal = Math.max(0, subtotal - discount + tax);

    if (getIsDbConnected()) {
      const patient = await (User as any).findById(data.patientId);
      if (!patient) {
        throw new Error('Patient record not found');
      }

      const newBill = await (Bill as any).create({
        billNumber,
        patientId: patient._id.toString(),
        patientName: patient.name,
        patientPhone: patient.phone,
        doctorName: data.doctorName,
        doctorSpeciality: data.doctorSpeciality || 'General Medicine',
        appointmentId: data.appointmentId || '',
        appointmentDate: data.appointmentDate || todayStr,
        consultationFee,
        items,
        discount,
        tax,
        paymentMethod: data.paymentMethod || 'Cash',
        status: data.status || 'Pending',
        date: todayStr,
        dueDate: data.dueDate || todayStr,
        total: grandTotal,
        notes: data.notes || '',
      });

      return { bill: newBill };
    } else {
      const pat = memoryPatients.find((p) => p._id === data.patientId || p.id === data.patientId) || memoryPatients[0];

      const newBill = {
        _id: 'bill_' + Date.now(),
        billNumber,
        patientId: pat._id,
        patientName: pat.name,
        patientPhone: pat.phone,
        doctorName: data.doctorName,
        doctorSpeciality: data.doctorSpeciality || 'General Medicine',
        appointmentId: data.appointmentId || '',
        appointmentDate: data.appointmentDate || todayStr,
        consultationFee,
        items,
        discount,
        tax,
        paymentMethod: data.paymentMethod || 'Cash',
        status: data.status || 'Pending',
        date: todayStr,
        dueDate: data.dueDate || todayStr,
        total: grandTotal,
        notes: data.notes || '',
        createdAt: new Date(),
      };

      memoryBills.unshift(newBill);
      return { bill: newBill };
    }
  }

  static async updateBill(
    billId: string,
    data: {
      status?: 'Paid' | 'Pending' | 'Partial' | 'Overdue';
      paymentMethod?: string;
      items?: { description: string; amount: number; quantity?: number }[];
      consultationFee?: number;
      discount?: number;
      tax?: number;
      notes?: string;
    }
  ) {
    if (getIsDbConnected()) {
      const bill = await (Bill as any).findById(billId);
      if (!bill) {
        throw new Error('Bill invoice not found');
      }

      if (data.status) bill.status = data.status;
      if (data.paymentMethod) bill.paymentMethod = data.paymentMethod;
      if (data.items !== undefined) bill.items = data.items;
      if (data.consultationFee !== undefined) bill.consultationFee = data.consultationFee;
      if (data.discount !== undefined) bill.discount = data.discount;
      if (data.tax !== undefined) bill.tax = data.tax;
      if (data.notes !== undefined) bill.notes = data.notes;

      const consultationFee = Number(bill.consultationFee) || 0;
      const itemsTotal = (bill.items || []).reduce((sum: number, item: any) => sum + (Number(item.amount) * (Number(item.quantity) || 1)), 0);
      const discount = Number(bill.discount) || 0;
      const tax = Number(bill.tax) || 0;

      bill.total = Math.max(0, consultationFee + itemsTotal - discount + tax);

      await bill.save();

      return { bill };
    } else {
      const bill = memoryBills.find((b) => b._id === billId);
      if (!bill) throw new Error('Bill invoice not found');

      if (data.status) bill.status = data.status;
      if (data.paymentMethod) bill.paymentMethod = data.paymentMethod;
      if (data.items !== undefined) bill.items = data.items;
      if (data.consultationFee !== undefined) bill.consultationFee = data.consultationFee;
      if (data.discount !== undefined) bill.discount = data.discount;
      if (data.tax !== undefined) bill.tax = data.tax;
      if (data.notes !== undefined) bill.notes = data.notes;

      const consultationFee = Number(bill.consultationFee) || 0;
      const itemsTotal = (bill.items || []).reduce((sum: number, item: any) => sum + (Number(item.amount) * (Number(item.quantity) || 1)), 0);
      const discount = Number(bill.discount) || 0;
      const tax = Number(bill.tax) || 0;

      bill.total = Math.max(0, consultationFee + itemsTotal - discount + tax);

      return { bill };
    }
  }

  static async deleteBill(billId: string) {
    if (getIsDbConnected()) {
      const bill = await (Bill as any).findByIdAndDelete(billId);
      if (!bill) {
        throw new Error('Bill not found');
      }
      return { success: true };
    } else {
      const idx = memoryBills.findIndex((b) => b._id === billId);
      if (idx !== -1) memoryBills.splice(idx, 1);
      return { success: true };
    }
  }

  // Doctor list for assignment
  static async getDoctorsList() {
    if (getIsDbConnected()) {
      const doctors = await (User as any).find({ role: UserRole.DOCTOR })
        .select('name speciality experience fees availableSlots profileImage qualification')
        .lean();

      return {
        doctors: doctors.map((d: any) => ({
          _id: d._id.toString(),
          name: d.name,
          speciality: d.speciality || 'General Medicine',
          experience: d.experience || '5 Years',
          fees: 500,
          availableSlots: d.availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
          profileImage: d.profileImage || '',
          qualification: d.qualification || 'MBBS, MD',
        })),
      };
    } else {
      return { doctors: memoryDoctors };
    }
  }

  // Profile Management
  static async updateProfile(
    userId: string,
    data: {
      name?: string;
      phone?: string;
      deskLocation?: string;
      shiftHours?: string;
      profileImage?: string;
    }
  ) {
    if (getIsDbConnected()) {
      const user = await (User as any).findById(userId);
      if (!user) {
        throw new Error('User account not found');
      }

      if (data.name) user.name = data.name;
      if (data.phone) user.phone = data.phone;
      if (data.deskLocation) user.deskLocation = data.deskLocation;
      if (data.shiftHours) user.shiftHours = data.shiftHours;
      if (data.profileImage !== undefined) user.profileImage = data.profileImage;

      await user.save();

      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          deskLocation: user.deskLocation,
          shiftHours: user.shiftHours,
          profileImage: user.profileImage,
        },
      };
    } else {
      return {
        user: {
          id: userId,
          name: data.name || 'Sunita Rao',
          email: 'receptionist@mediqo.com',
          phone: data.phone || '+91 98765-43200',
          role: UserRole.RECEPTIONIST,
          deskLocation: data.deskLocation || 'Main Reception Desk - Ground Floor',
          shiftHours: data.shiftHours || '08:00 AM - 04:00 PM',
          profileImage: data.profileImage || '',
        },
      };
    }
  }
}
