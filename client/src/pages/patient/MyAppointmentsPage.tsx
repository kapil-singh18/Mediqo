import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, CalendarX, Clock, X } from 'lucide-react';
import { Appointment } from '../../types';
import { patientApi } from '../../services/patientApi';
import { AppointmentTable } from '../../components/patient/AppointmentTable';
import { EmptyState } from '../../components/patient/EmptyState';
import { LoadingSpinner } from '../../components/patient/LoadingSpinner';
import { StatusBadge } from '../../components/patient/StatusBadge';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/LayoutPrimitives';
import { Modal } from '../../components/ui/Modal';
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
      <PageHeader
        title="My Appointments"
        subtitle="View, track, or cancel your scheduled medical consultations."
        badgeText="Patient Care Portal"
        action={
          <Link to="/patient/book">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Book New Appointment
            </Button>
          </Link>
        }
      />

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner label="Retrieving your appointment records..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={<CalendarX className="w-8 h-8" />}
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
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title="Appointment Details"
          subtitle="Consultation Summary Card"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 rounded-[12px] bg-[#F0F3FF] border border-[#5F6FFF]/20">
              <img
                src={selectedAppointment.doctorImage || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'}
                alt={selectedAppointment.doctorName}
                className="w-16 h-16 rounded-full object-cover border border-[#5F6FFF]/30 shrink-0"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedAppointment.doctorName}</h4>
                <p className="text-xs font-bold text-[#5F6FFF]">{selectedAppointment.doctorSpeciality}</p>
                <div className="pt-1.5">
                  <StatusBadge status={selectedAppointment.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-[10px] border border-slate-200 space-y-1">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Date</p>
                <p className="font-bold text-slate-800 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#5F6FFF]" />
                  {selectedAppointment.appointmentDate}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-[10px] border border-slate-200 space-y-1">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Time Slot</p>
                <p className="font-bold text-slate-800 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-[#5F6FFF]" />
                  {selectedAppointment.timeSlot}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-700">Reason for Visit:</p>
              <div className="p-3.5 rounded-[10px] bg-slate-50 text-xs text-slate-700 border border-slate-200">
                {selectedAppointment.reason}
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-700">Patient / Doctor Notes:</p>
                <div className="p-3.5 rounded-[10px] bg-slate-50 text-xs text-slate-600 border border-slate-200">
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
                    className="text-rose-600 hover:bg-rose-50 border-rose-200"
                  >
                    Cancel Visit
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
