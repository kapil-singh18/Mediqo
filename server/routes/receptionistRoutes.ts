import { Router } from 'express';
import { ReceptionistController } from '../controllers/receptionistController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { UserRole } from '../constants/roles.js';
import {
  validatePatientCreate,
  validateAppointmentBooking,
  validateBillCreate,
} from '../validators/receptionistValidator.js';

const router = Router();

router.use(protect);
router.use(authorize(UserRole.RECEPTIONIST));

// Dashboard
router.get('/dashboard-stats', ReceptionistController.getDashboardStats);

// Patients CRUD
router.get('/patients', ReceptionistController.getPatients);
router.post('/patients', validatePatientCreate, ReceptionistController.createPatient);
router.get('/patients/:id', ReceptionistController.getPatientDetails);
router.put('/patients/:id', ReceptionistController.updatePatient);

// Appointments Desk
router.get('/appointments', ReceptionistController.getAppointments);
router.post('/appointments', validateAppointmentBooking, ReceptionistController.bookAppointment);
router.put('/appointments/:id/reschedule', ReceptionistController.rescheduleAppointment);
router.put('/appointments/:id/cancel', ReceptionistController.cancelAppointment);
router.put('/appointments/:id/assign-doctor', ReceptionistController.assignDoctor);

// Billing Desk
router.get('/bills', ReceptionistController.getBills);
router.post('/bills', validateBillCreate, ReceptionistController.createBill);
router.put('/bills/:id', ReceptionistController.updateBill);
router.delete('/bills/:id', ReceptionistController.deleteBill);

// Doctors List
router.get('/doctors', ReceptionistController.getDoctorsList);

// Profile
router.put('/profile', ReceptionistController.updateProfile);

export default router;
