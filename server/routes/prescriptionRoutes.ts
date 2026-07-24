import { Router } from 'express';
import { PrescriptionController } from '../controllers/prescriptionController.js';
import { AppointmentController } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { UserRole } from '../constants/roles.js';

const router = Router();

router.use(protect);

// Patient route
router.get('/my', authorize(UserRole.PATIENT), AppointmentController.getMyPrescriptions);

// Doctor routes
router.post('/', authorize(UserRole.DOCTOR), PrescriptionController.createPrescription);
router.get('/doctor', authorize(UserRole.DOCTOR), PrescriptionController.getDoctorPrescriptions);
router.get('/:id', authorize(UserRole.DOCTOR, UserRole.PATIENT), PrescriptionController.getPrescriptionById);
router.put('/:id', authorize(UserRole.DOCTOR), PrescriptionController.updatePrescription);
router.delete('/:id', authorize(UserRole.DOCTOR), PrescriptionController.deletePrescription);

export default router;
