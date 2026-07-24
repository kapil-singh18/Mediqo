import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doctorApi } from '../../services/doctorApi';
import { Appointment } from '../../types';
import { StatusBadge } from '../../components/doctor/StatusBadge';
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Clock,
  FileText,
  Pill,
  CheckCircle2,
  XCircle,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await doctorApi.getAppointmentDetails(id);
      if (res.success && res.data) {
        setAppointment(res.data.appointment);
        setPatient(res.data.patient);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      await doctorApi.updateAppointmentStatus(id, newStatus);
      fetchDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-xs text-slate-400">
        Loading appointment record...
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="space-y-4">
        <Link to="/doctor/appointments" className="inline-flex items-center text-xs font-bold text-[#5F6FFF]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Appointments
        </Link>
        <div className="bg-rose-50 text-rose-700 p-6 rounded-3xl border border-rose-200 text-xs font-semibold">
          {error || 'Appointment record not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Back button */}
      <Link
        to="/doctor/appointments"
        className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-[#5F6FFF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to All Appointments
      </Link>

      {/* Main Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-extrabold text-slate-900">Consultation Overview</h1>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Appointment ID: #{appointment._id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              navigate(
                `/doctor/prescriptions/new?patientId=${appointment.patientId}&patientName=${encodeURIComponent(
                  appointment.patientName || patient?.name || ''
                )}&patientPhone=${encodeURIComponent(
                  appointment.patientPhone || patient?.phone || ''
                )}&appointmentId=${appointment._id}&appointmentDate=${appointment.appointmentDate}`
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#5F6FFF] hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Pill className="w-4 h-4" />
            Write Prescription
          </button>
        </div>
      </div>

      {/* Grid: Patient Details & Appointment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Snapshot Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-[#5F6FFF]" />
            Patient Profile Snapshot
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Patient Full Name</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {appointment.patientName || patient?.name || 'Alex Morgan'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Age</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {appointment.patientAge || patient?.age ? `${appointment.patientAge || patient?.age} Years` : 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Gender</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {appointment.patientGender || patient?.gender || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="pt-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {appointment.patientPhone || patient?.phone || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-[#5F6FFF]" />
            Consultation Time & Fees
          </h2>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Appointment Date</p>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">{appointment.appointmentDate}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Time Slot</p>
                <p className="text-xs font-extrabold text-[#5F6FFF] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {appointment.timeSlot}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Consultation Fee</p>
              <p className="text-sm font-extrabold text-emerald-600 mt-0.5">${appointment.fees || 50}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Specialty Category</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{appointment.doctorSpeciality}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Reason & Clinical Notes */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#5F6FFF]" />
          Chief Complaint & Reason for Visit
        </h2>

        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 text-xs font-medium text-slate-900 leading-relaxed">
          {appointment.reason}
        </div>

        {appointment.notes && (
          <div className="space-y-1 pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Patient Additional Notes</p>
            <p className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
              {appointment.notes}
            </p>
          </div>
        )}

        {/* Status Actions */}
        <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">Update Consultation Status:</span>
          <div className="flex items-center space-x-2">
            {appointment.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange('completed')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Completed
              </button>
            )}

            {appointment.status !== 'cancelled' && (
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors inline-flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Cancel Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
