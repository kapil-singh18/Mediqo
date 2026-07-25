import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { receptionistApi, BookAppointmentInput } from '../../services/receptionistApi';
import { X, Calendar, Clock, Stethoscope, User as UserIcon, Save, AlertCircle } from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientsList: User[];
  doctorsList: any[];
  preselectedPatient?: User | null;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  patientsList,
  doctorsList,
  preselectedPatient,
}) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [reason, setReason] = useState('');
  const [fees, setFees] = useState<number>(50);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedPatient) {
      setPatientId(preselectedPatient.id || (preselectedPatient as any)._id || '');
    } else if (patientsList.length > 0 && !patientId) {
      setPatientId(patientsList[0].id || (patientsList[0] as any)._id || '');
    }
    if (doctorsList.length > 0 && !doctorId) {
      setDoctorId(doctorsList[0]._id || '');
      setFees(doctorsList[0].fees || 50);
    }
  }, [isOpen, preselectedPatient, patientsList, doctorsList]);

  if (!isOpen) return null;

  const selectedDoctor = doctorsList.find((d) => d._id === doctorId);
  const availableSlots = selectedDoctor?.availableSlots || [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  const handleDoctorChange = (id: string) => {
    setDoctorId(id);
    const doc = doctorsList.find((d) => d._id === id);
    if (doc) {
      setFees(doc.fees || 50);
      if (doc.availableSlots && doc.availableSlots.length > 0) {
        setTimeSlot(doc.availableSlots[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setError('Please select a patient');
      return;
    }
    if (!doctorId) {
      setError('Please select a doctor');
      return;
    }
    if (!reason.trim()) {
      setError('Reason for visit is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await receptionistApi.bookAppointment({
        patientId,
        doctorId,
        appointmentDate,
        timeSlot,
        reason,
        fees,
        notes,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
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
              <Calendar className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">Book Patient Appointment</h2>
              <p className="text-xs text-purple-200">Schedule consultation slot on behalf of patient.</p>
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
            <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Patient Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
              Select Patient *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="">-- Choose Patient --</option>
                {patientsList.map((p) => {
                  const id = p.id || (p as any)._id;
                  return (
                    <option key={id} value={id}>
                      {p.name} ({p.phone || p.email})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Doctor Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
              Assign Practitioner / Doctor *
            </label>
            <div className="relative">
              <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={doctorId}
                onChange={(e) => handleDoctorChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="">-- Select Doctor --</option>
                {doctorsList.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.speciality || 'General Medicine'}) - Fee: ${d.fees || 50}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Appointment Date *
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

          {/* Fee & Reason */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Fee ($)
              </label>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2.5 text-xs font-extrabold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Chief Complaint / Reason *
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Routine checkup, Fever & Cough..."
                className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
              Additional Desk Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Patient requested morning slot, brought previous lab reports..."
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
              <span>{loading ? 'Booking...' : 'Confirm Booking'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
