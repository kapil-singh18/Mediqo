import { Response } from 'express';
import { PrescriptionService } from '../services/prescriptionService.js';
import { createPrescriptionSchema, updatePrescriptionSchema } from '../validators/prescriptionValidator.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { getIsDbConnected } from '../config/db.js';

export class PrescriptionController {
  /**
   * POST /api/prescriptions (Doctor create)
   */
  static async createPrescription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const validation = createPrescriptionSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || 'Validation error';
        return sendError(res, errorMsg, 400, validation.error.format());
      }

      let docName = 'Dr. Practitioner';
      let docSpec = 'General Medicine';

      if (getIsDbConnected()) {
        const docUser = await (User as any).findById(req.user.userId);
        if (docUser) {
          docName = docUser.name;
          docSpec = docUser.speciality || 'General Medicine';
        }
      }

      const prescription = await PrescriptionService.createPrescription(
        req.user.userId,
        docName,
        docSpec,
        validation.data
      );

      return sendSuccess(res, { prescription }, 'Prescription created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create prescription', 400);
    }
  }

  /**
   * GET /api/prescriptions/doctor
   */
  static async getDoctorPrescriptions(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const search = (req.query.search as string) || '';
      const prescriptions = await PrescriptionService.getDoctorPrescriptions(req.user.userId, search);

      return sendSuccess(res, { prescriptions }, 'Doctor prescriptions retrieved', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve prescriptions', 400);
    }
  }

  /**
   * GET /api/prescriptions/:id
   */
  static async getPrescriptionById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const prescription = await PrescriptionService.getPrescriptionById(
        req.params.id,
        req.user.userId,
        req.user.role
      );

      return sendSuccess(res, { prescription }, 'Prescription retrieved', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch prescription details', 400);
    }
  }

  /**
   * PUT /api/prescriptions/:id
   */
  static async updatePrescription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const validation = updatePrescriptionSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || 'Validation error';
        return sendError(res, errorMsg, 400, validation.error.format());
      }

      const prescription = await PrescriptionService.updatePrescription(
        req.params.id,
        req.user.userId,
        validation.data
      );

      return sendSuccess(res, { prescription }, 'Prescription updated successfully', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update prescription', 400);
    }
  }

  /**
   * DELETE /api/prescriptions/:id
   */
  static async deletePrescription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const result = await PrescriptionService.deletePrescription(req.params.id, req.user.userId);
      return sendSuccess(res, result, 'Prescription deleted successfully', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to delete prescription', 400);
    }
  }
}
