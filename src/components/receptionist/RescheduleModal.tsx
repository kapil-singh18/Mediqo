import React, { useState, useEffect } from 'react';
import { Appointment } from '../../types';
import { receptionistApi } from '../../services/receptionistApi';
import { X, Calendar, Clock, Stethoscope, Save, RefreshCw } from 'lucide-react';

interface RescheduleModalProps {
  appointment: Appointment | null;
  doctorsList: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  doctorsList,
  onClose,
  onSuccess,
}) => {
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointment) {
      setAppointmentDate(appointment.appointmentDate || new Date().toISOString().split('T')[0]);
      setTimeSlot(appointment.timeSlot || '09:00 AM');
      setDoctorId(appointment.doctorId || '');
      setNotes(appointment.notes || '');
    }
  }, [appointment]);

  if (!appointment) return null;

  const selectedDoctor = doctorsList.find((d) => d._id === doctorId);
  const availableSlots = selectedDoctor?.availableSlots || [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await receptionistApi.rescheduleAppointment(appointment._id, {
        appointmentDate,
        timeSlot,
        doctorId,
        notes,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <RefreshCw className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">Reschedule & Reassign Doctor</h2>
              <p className="text-xs text-purple-200">
                Patient: <strong>{appointment.patientName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Doctor Reassignment */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
              Assigned Doctor
            </label>
            <div className="relative">
              <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {doctorsList.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.speciality || 'General Medicine'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                New Date *
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Time Slot *
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
              Reschedule Reason / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Patient requested time shift due to personal emergency..."
              className="w-full p-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all shadow-md shadow-purple-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Rescheduling...' : 'Save Reschedule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
