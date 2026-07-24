import { Router } from 'express';
import { DoctorController } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { UserRole } from '../constants/roles.js';

const router = Router();

router.use(protect);
router.use(authorize(UserRole.DOCTOR));

router.get('/dashboard', DoctorController.getDashboard);
router.get('/appointments', DoctorController.getAppointments);
router.get('/appointments/:id', DoctorController.getAppointmentDetails);
router.patch('/appointments/:id/status', DoctorController.updateAppointmentStatus);
router.get('/availability', DoctorController.getAvailability);
router.put('/availability', DoctorController.updateAvailability);
router.put('/profile', DoctorController.updateProfile);

export default router;
