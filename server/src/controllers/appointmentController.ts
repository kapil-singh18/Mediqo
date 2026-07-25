import { Response } from 'express';
import { AppointmentService } from '../services/appointmentService.js';
import { createAppointmentSchema } from '../validators/appointmentValidator.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class AppointmentController {
  /**
   * POST /api/appointments
   */
  static async createAppointment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const validation = createAppointmentSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || 'Validation error';
        return sendError(res, errorMsg, 400, validation.error.format());
      }

      const appointment = await AppointmentService.createAppointment(req.user.userId, validation.data);
      return sendSuccess(res, { appointment }, 'Appointment scheduled successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to book appointment', 400);
    }
  }

  /**
   * GET /api/appointments/my
   */
  static async getMyAppointments(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const appointments = await AppointmentService.getMyAppointments(req.user.userId);
      return sendSuccess(res, { appointments }, 'My appointments retrieved successfully', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve appointments', 400);
    }
  }

  /**
   * GET /api/appointments/:id
   */
  static async getAppointmentById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const appointment = await AppointmentService.getAppointmentById(req.params.id, req.user.userId);
      return sendSuccess(res, { appointment }, 'Appointment details retrieved', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch appointment details', 400);
    }
  }

  /**
   * PATCH /api/appointments/:id/cancel
   */
  static async cancelAppointment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const appointment = await AppointmentService.cancelAppointment(req.params.id, req.user.userId);
      return sendSuccess(res, { appointment }, 'Appointment cancelled successfully', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to cancel appointment', 400);
    }
  }

  /**
   * GET /api/prescriptions/my
   */
  static async getMyPrescriptions(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const prescriptions = await AppointmentService.getMyPrescriptions(req.user.userId);
      return sendSuccess(res, { prescriptions }, 'Prescriptions retrieved successfully', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve prescriptions', 400);
    }
  }

  /**
   * GET /api/bills/my
   */
  static async getMyBills(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const bills = await AppointmentService.getMyBills(req.user.userId);
      return sendSuccess(res, { bills }, 'Bills retrieved successfully', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve bills', 400);
    }
  }
}
