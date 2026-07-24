import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, CalendarX, Stethoscope, Clock, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Appointment } from '../../types';
import { patientApi } from '../../services/patientApi';
import { AppointmentTable } from '../../components/patient/AppointmentTable';
import { EmptyState } from '../../components/patient/EmptyState';
import { LoadingSpinner } from '../../components/patient/LoadingSpinner';
import { StatusBadge } from '../../components/patient/StatusBadge';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';

export const MyAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await patientApi.getMyAppointments();
      setAppointments(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id: string) => {
    try {
      await patientApi.cancelAppointment(id);
      toast.success('Appointment cancelled successfully');
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
      );
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel appointment');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-8 border border-slate-100 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#5F6FFF] uppercase tracking-wider">Patient Care Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-sm text-slate-500">
            View, track, or cancel your scheduled medical consultations.
          </p>
        </div>

        <Link to="/patient/book">
          <Button className="bg-[#5F6FFF] hover:bg-[#4F5FEF] text-white rounded-full px-6 py-3 font-bold text-sm shadow-md shadow-indigo-100">
            <Plus className="w-4 h-4 mr-2" /> Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner label="Retrieving your appointment records..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="No Appointments Found"
          description="You haven't scheduled any medical consultations yet. Browse our certified specialists and book your first appointment."
          actionText="Book Doctor Appointment"
          onAction={() => (window.location.href = '/patient/book')}
        />
      ) : (
        <AppointmentTable
          appointments={appointments}
          onCancel={handleCancelAppointment}
          onViewDetails={(apt) => setSelectedAppointment(apt)}
        />
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#5F6FFF] uppercase tracking-wider">Consultation Card</span>
              <h3 className="text-xl font-bold text-slate-900">Appointment Details</h3>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <img
                src={selectedAppointment.doctorImage || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'}
                alt={selectedAppointment.doctorName}
                className="w-16 h-16 rounded-2xl object-cover object-top border border-indigo-200"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedAppointment.doctorName}</h4>
                <p className="text-xs font-bold text-[#5F6FFF]">{selectedAppointment.doctorSpeciality}</p>
                <div className="pt-1">
                  <StatusBadge status={selectedAppointment.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Date</p>
                <p className="font-bold text-slate-800 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-[#5F6FFF]" />
                  {selectedAppointment.appointmentDate}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Time Slot</p>
                <p className="font-bold text-slate-800 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-[#5F6FFF]" />
                  {selectedAppointment.timeSlot}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">Reason for Visit:</p>
              <div className="p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-700 border border-slate-100">
                {selectedAppointment.reason}
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">Patient / Doctor Notes:</p>
                <div className="p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-600 border border-slate-100">
                  {selectedAppointment.notes}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Consultation Fee</span>
                <p className="text-lg font-extrabold text-slate-900">${selectedAppointment.fees}</p>
              </div>

              <div className="flex space-x-2">
                {selectedAppointment.status === 'scheduled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this appointment?')) {
                        handleCancelAppointment(selectedAppointment._id);
                      }
                    }}
                    className="text-rose-600 hover:bg-rose-50 border-rose-200 rounded-full px-4 text-xs font-bold"
                  >
                    Cancel Visit
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setSelectedAppointment(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 text-xs font-bold"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
