import { User, IUser } from '../models/User.js';
import { Appointment, IAppointment, AppointmentStatus } from '../models/Appointment.js';
import { Bill, IBill } from '../models/Bill.js';
import { UserRole } from '../constants/roles.js';
import bcrypt from 'bcryptjs';

export class ReceptionistService {
  // Dashboard Analytics
  static async getDashboardStats() {
    const todayStr = new Date().toISOString().split('T')[0];

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
  }

  // Patients Management
  static async getPatients(query: { search?: string; gender?: string; page?: number; limit?: number }) {
    const { search = '', gender, page = 1, limit = 20 } = query;

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
  }

  static async getPatientDetails(patientId: string) {
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
  }

  // Appointment Desk Operations
  static async getAppointments(query: {
    search?: string;
    status?: string;
    date?: string;
    doctorId?: string;
  }) {
    const { search = '', status, date, doctorId } = query;

    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (date && date !== 'all') {
      const todayStr = new Date().toISOString().split('T')[0];
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
      fees: data.fees ?? 50,
      appointmentDate: data.appointmentDate,
      timeSlot: data.timeSlot,
      reason: data.reason,
      notes: data.notes || '',
      status: AppointmentStatus.SCHEDULED,
    });

    return { appointment: newAppointment };
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
  }

  static async cancelAppointment(appointmentId: string) {
    const appointment = await (Appointment as any).findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    await appointment.save();

    return { appointment };
  }

  static async assignDoctor(
    appointmentId: string,
    doctorId: string
  ) {
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
  }

  // Billing Desk Operations
  static async getBills(query: { search?: string; status?: string; date?: string }) {
    const { search = '', status, date } = query;

    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (date && date !== 'all') {
      const todayStr = new Date().toISOString().split('T')[0];
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
    const patient = await (User as any).findById(data.patientId);
    if (!patient) {
      throw new Error('Patient record not found');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const billNumber = `INV-${todayStr.replace(/-/g, '')}-${randSuffix}`;

    const consultationFee = Number(data.consultationFee) || 0;
    const items = data.items || [];
    const itemsTotal = items.reduce((sum, item) => sum + (Number(item.amount) * (Number(item.quantity) || 1)), 0);
    const discount = Number(data.discount) || 0;
    const tax = Number(data.tax) || 0;

    const subtotal = consultationFee + itemsTotal;
    const grandTotal = Math.max(0, subtotal - discount + tax);

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

    // Recalculate total if items/fees updated
    const consultationFee = Number(bill.consultationFee) || 0;
    const itemsTotal = (bill.items || []).reduce((sum: number, item: any) => sum + (Number(item.amount) * (Number(item.quantity) || 1)), 0);
    const discount = Number(bill.discount) || 0;
    const tax = Number(bill.tax) || 0;

    bill.total = Math.max(0, consultationFee + itemsTotal - discount + tax);

    await bill.save();

    return { bill };
  }

  static async deleteBill(billId: string) {
    const bill = await (Bill as any).findByIdAndDelete(billId);
    if (!bill) {
      throw new Error('Bill not found');
    }
    return { success: true };
  }

  // Doctor list for assignment
  static async getDoctorsList() {
    const doctors = await (User as any).find({ role: UserRole.DOCTOR })
      .select('name speciality experience fees availableSlots profileImage qualification')
      .lean();

    return {
      doctors: doctors.map((d: any) => ({
        _id: d._id.toString(),
        name: d.name,
        speciality: d.speciality || 'General Medicine',
        experience: d.experience || '5 Years',
        fees: 50,
        availableSlots: d.availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        profileImage: d.profileImage || '',
        qualification: d.qualification || 'MBBS, MD',
      })),
    };
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
  }
}
