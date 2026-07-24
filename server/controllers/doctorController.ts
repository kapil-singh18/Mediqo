import { Response } from 'express';
import { DoctorService } from '../services/doctorService.js';
import { updateAvailabilitySchema, updateDoctorProfileSchema } from '../validators/doctorValidator.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { getIsDbConnected } from '../config/db.js';

export class DoctorController {
  /**
   * GET /api/doctor/dashboard
   */
  static async getDashboard(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      let doctorUser = null;
      if (getIsDbConnected()) {
        doctorUser = await (User as any).findById(req.user.userId);
      }

      const stats = await DoctorService.getDashboardStats(req.user.userId, doctorUser);
      return sendSuccess(res, stats, 'Doctor dashboard statistics retrieved', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch dashboard data', 400);
    }
  }

  /**
   * GET /api/doctor/appointments
   */
  static async getAppointments(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const { search, status, dateRange } = req.query;
      const appointments = await DoctorService.getDoctorAppointments(req.user.userId, {
        search: search as string,
        status: status as string,
        dateRange: dateRange as string,
      });

      return sendSuccess(res, { appointments }, 'Appointments retrieved', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch doctor appointments', 400);
    }
  }

  /**
   * GET /api/doctor/appointments/:id
   */
  static async getAppointmentDetails(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const data = await DoctorService.getAppointmentDetails(req.params.id, req.user.userId);
      return sendSuccess(res, data, 'Appointment details retrieved', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch appointment details', 400);
    }
  }

  /**
   * PATCH /api/doctor/appointments/:id/status
   */
  static async updateAppointmentStatus(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const { status } = req.body;
      if (!status) {
        return sendError(res, 'Status is required', 400);
      }

      const updated = await DoctorService.updateAppointmentStatus(req.params.id, req.user.userId, status);
      return sendSuccess(res, { appointment: updated }, 'Appointment status updated', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update status', 400);
    }
  }

  /**
   * GET /api/doctor/availability
   */
  static async getAvailability(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const availability = await DoctorService.getDoctorAvailability(req.user.userId);
      return sendSuccess(res, availability, 'Doctor availability retrieved', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch availability', 400);
    }
  }

  /**
   * PUT /api/doctor/availability
   */
  static async updateAvailability(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const validation = updateAvailabilitySchema.safeParse(req.body);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || 'Validation error';
        return sendError(res, errorMsg, 400, validation.error.format());
      }

      const availability = await DoctorService.updateDoctorAvailability(req.user.userId, validation.data);
      return sendSuccess(res, availability, 'Availability updated successfully', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update availability', 400);
    }
  }

  /**
   * PUT /api/doctor/profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const validation = updateDoctorProfileSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || 'Validation error';
        return sendError(res, errorMsg, 400, validation.error.format());
      }

      const updatedProfile = await DoctorService.updateDoctorProfile(req.user.userId, validation.data);
      return sendSuccess(res, { user: updatedProfile }, 'Doctor profile updated successfully', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update doctor profile', 400);
    }
  }
}
