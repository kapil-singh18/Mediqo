import { Request, Response, NextFunction } from 'express';
import { ReceptionistService } from '../services/receptionistService.js';

export class ReceptionistController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReceptionistService.getDashboardStats();
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  // Patients
  static async getPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, gender, page, limit } = req.query;
      const data = await ReceptionistService.getPatients({
        search: search as string,
        gender: gender as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReceptionistService.createPatient(req.body);
      res.status(201).json({
        success: true,
        message: 'Patient registered successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await ReceptionistService.updatePatient(id, req.body);
      res.json({
        success: true,
        message: 'Patient profile updated',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPatientDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await ReceptionistService.getPatientDetails(id);
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  // Appointments
  static async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, status, date, doctorId } = req.query;
      const data = await ReceptionistService.getAppointments({
        search: search as string,
        status: status as string,
        date: date as string,
        doctorId: doctorId as string,
      });
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async bookAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReceptionistService.bookAppointment(req.body);
      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async rescheduleAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await ReceptionistService.rescheduleAppointment(id, req.body);
      res.json({
        success: true,
        message: 'Appointment rescheduled successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await ReceptionistService.cancelAppointment(id);
      res.json({
        success: true,
        message: 'Appointment cancelled',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async assignDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { doctorId } = req.body;
      const data = await ReceptionistService.assignDoctor(id, doctorId);
      res.json({
        success: true,
        message: 'Doctor assigned successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  // Billing
  static async getBills(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, status, date } = req.query;
      const data = await ReceptionistService.getBills({
        search: search as string,
        status: status as string,
        date: date as string,
      });
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createBill(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReceptionistService.createBill(req.body);
      res.status(201).json({
        success: true,
        message: 'Bill created successfully',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateBill(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await ReceptionistService.updateBill(id, req.body);
      res.json({
        success: true,
        message: 'Bill invoice updated',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBill(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ReceptionistService.deleteBill(id);
      res.json({
        success: true,
        message: 'Bill deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  // Doctors
  static async getDoctorsList(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReceptionistService.getDoctorsList();
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  // Profile
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?._id;
      const data = await ReceptionistService.updateProfile(userId, req.body);
      res.json({
        success: true,
        message: 'Receptionist profile updated',
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}
