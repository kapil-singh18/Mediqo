import { Request, Response, NextFunction } from 'express';

export const validatePatientCreate = (req: Request, res: Response, next: NextFunction) => {
  const { name, phone, email } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ success: false, message: 'Patient name is required' });
    return;
  }
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    res.status(400).json({ success: false, message: 'Patient phone number is required' });
    return;
  }
  next();
};

export const validateAppointmentBooking = (req: Request, res: Response, next: NextFunction) => {
  const { patientId, doctorId, appointmentDate, timeSlot, reason } = req.body;
  if (!patientId) {
    res.status(400).json({ success: false, message: 'Patient selection is required' });
    return;
  }
  if (!doctorId) {
    res.status(400).json({ success: false, message: 'Doctor assignment is required' });
    return;
  }
  if (!appointmentDate) {
    res.status(400).json({ success: false, message: 'Appointment date is required' });
    return;
  }
  if (!timeSlot) {
    res.status(400).json({ success: false, message: 'Time slot selection is required' });
    return;
  }
  if (!reason || !reason.trim()) {
    res.status(400).json({ success: false, message: 'Reason for visit is required' });
    return;
  }
  next();
};

export const validateBillCreate = (req: Request, res: Response, next: NextFunction) => {
  const { patientId, doctorName, date, total } = req.body;
  if (!patientId) {
    res.status(400).json({ success: false, message: 'Patient is required for bill generation' });
    return;
  }
  if (!doctorName) {
    res.status(400).json({ success: false, message: 'Doctor name is required' });
    return;
  }
  if (total === undefined || total === null || Number(total) < 0) {
    res.status(400).json({ success: false, message: 'Valid bill total is required' });
    return;
  }
  next();
};
