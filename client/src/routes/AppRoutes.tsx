import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { PatientLayout } from '../layouts/PatientLayout';
import { DoctorLayout } from '../layouts/DoctorLayout';
import { ReceptionistLayout } from '../layouts/ReceptionistLayout';

import { LandingPage } from '../pages/LandingPage';
import { DoctorsPage } from '../pages/DoctorsPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

import { PatientDashboard } from '../pages/patient/PatientDashboard';
import { BookAppointmentPage } from '../pages/patient/BookAppointmentPage';
import { MyAppointmentsPage } from '../pages/patient/MyAppointmentsPage';
import { PrescriptionsPage } from '../pages/patient/PrescriptionsPage';
import { BillsPage } from '../pages/patient/BillsPage';
import { ProfilePage } from '../pages/patient/ProfilePage';

import { DoctorDashboard } from '../pages/doctor/DoctorDashboard';
import { DoctorAppointmentsPage } from '../pages/doctor/DoctorAppointmentsPage';
import { AppointmentDetailsPage } from '../pages/doctor/AppointmentDetailsPage';
import { DoctorPrescriptionsPage } from '../pages/doctor/DoctorPrescriptionsPage';
import { CreateEditPrescriptionPage } from '../pages/doctor/CreateEditPrescriptionPage';
import { DoctorAvailabilityPage } from '../pages/doctor/DoctorAvailabilityPage';
import { DoctorProfilePage } from '../pages/doctor/DoctorProfilePage';
import { ReceptionistDashboard } from '../pages/receptionist/ReceptionistDashboard';
import { PatientsPage } from '../pages/receptionist/PatientsPage';
import { ReceptionistAppointmentsPage } from '../pages/receptionist/ReceptionistAppointmentsPage';
import { BillingPage } from '../pages/receptionist/BillingPage';
import { ReceptionistProfilePage } from '../pages/receptionist/ReceptionistProfilePage';

import { ProtectedRoute } from '../components/ProtectedRoute';
import { UserRole } from '../constants';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes with Main Navbar & Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected Patient Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="book" element={<BookAppointmentPage />} />
        <Route path="appointments" element={<MyAppointmentsPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
        <Route path="bills" element={<BillsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Protected Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointmentsPage />} />
        <Route path="appointments/:id" element={<AppointmentDetailsPage />} />
        <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
        <Route path="prescriptions/new" element={<CreateEditPrescriptionPage />} />
        <Route path="prescriptions/edit/:id" element={<CreateEditPrescriptionPage />} />
        <Route path="availability" element={<DoctorAvailabilityPage />} />
        <Route path="profile" element={<DoctorProfilePage />} />
      </Route>

      {/* Protected Receptionist Routes */}
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute allowedRoles={[UserRole.RECEPTIONIST]}>
            <ReceptionistLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ReceptionistDashboard />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="appointments" element={<ReceptionistAppointmentsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="profile" element={<ReceptionistProfilePage />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
