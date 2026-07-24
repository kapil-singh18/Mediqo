import { Response } from 'express';
import { AuthService } from '../services/authService.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class AuthController {
  /**
   * POST /api/auth/register (Patient registration only)
   */
  static async register(req: AuthenticatedRequest, res: Response) {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || 'Validation error';
        return sendError(res, errorMsg, 400, validation.error.format());
      }

      const result = await AuthService.registerPatient(validation.data);
      return sendSuccess(res, result, 'Patient registered successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Registration failed', 400);
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || 'Validation error';
        return sendError(res, errorMsg, 400, validation.error.format());
      }

      const result = await AuthService.loginUser(validation.data);
      return sendSuccess(res, result, 'Login successful', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Login failed', 400);
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return sendError(res, 'User identity missing', 401);
      }

      const user = await AuthService.getUserById(req.user.userId);
      return sendSuccess(res, { user }, 'User profile retrieved', 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch profile', 400);
    }
  }
}
