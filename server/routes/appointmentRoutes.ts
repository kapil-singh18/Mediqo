import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { UserRole } from '../constants/roles.js';

const router = Router();

router.use(protect);
router.use(authorize(UserRole.PATIENT));

router.post('/', AppointmentController.createAppointment);
router.get('/my', AppointmentController.getMyAppointments);
router.get('/:id', AppointmentController.getAppointmentById);
router.patch('/:id/cancel', AppointmentController.cancelAppointment);

export default router;
