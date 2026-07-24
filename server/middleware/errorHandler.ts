import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('API Error:', err);

  const statusCode = err.statusCode || 400;
  const message = err.message || 'Server Internal Error';

  return sendError(res, message, statusCode, err.errors || undefined);
};
