import React, { useEffect, useState } from 'react';
import { User, Appointment, Bill } from '../../types';
import { receptionistApi } from '../../services/receptionistApi';
import { StatusBadge } from '../doctor/StatusBadge';
import {
  X,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Receipt,
  PlusCircle,
  Clock,
  Pill,
} from 'lucide-react';

interface PatientDetailsModalProps {
  patientId: string | null;
  onClose: () => void;
  onBookAppointment?: (patient: User) => void;
  onCreateBill?: (patient: User) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patientId,
  onClose,
  onBookAppointment,
  onCreateBill,
}) => {
  const [patient, setPatient] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'appointments' | 'bills'>('appointments');

  useEffect(() => {
    if (patientId) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await receptionistApi.getPatientDetails(patientId);
          if (res.success && res.data) {
            setPatient(res.data.patient);
            setAppointments(res.data.appointments || []);
            setBills(res.data.bills || []);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load patient history');
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [patientId]);

  if (!patientId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-800 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-lg">
              {patient?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h2 className="text-base font-extrabold">{patient?.name || 'Patient Profile'}</h2>
              <p className="text-xs text-purple-200">
                Patient ID: #{patientId.slice(-6).toUpperCase()}
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

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading patient profile details...</div>
        ) : error || !patient ? (
          <div className="p-6 text-center text-xs text-rose-600 font-bold">{error || 'Patient not found'}</div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Quick Overview Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</p>
                <p className="font-extrabold text-slate-900 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {patient.phone}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</p>
                <p className="font-extrabold text-slate-900 mt-0.5">
                  {patient.age ? `${patient.age} Yrs` : 'N/A'} • {patient.gender || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                <p className="font-extrabold text-slate-900 mt-0.5 truncate">
                  {patient.email || 'None registered'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Address</p>
                <p className="font-extrabold text-slate-900 mt-0.5 truncate">
                  {patient.address || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Quick Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'appointments'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Appointments ({appointments.length})
                </button>

                <button
                  onClick={() => setActiveTab('bills')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'bills'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  Billing History ({bills.length})
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {onBookAppointment && (
                  <button
                    onClick={() => onBookAppointment(patient)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors inline-flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Book Appointment
                  </button>
                )}

                {onCreateBill && (
                  <button
                    onClick={() => onCreateBill(patient)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                  >
                    <Receipt className="w-3.5 h-3.5 text-purple-600" />
                    Issue Invoice
                  </button>
                )}
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'appointments' ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {appointments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No consultation records found for this patient.
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">{apt.doctorName}</span>
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                            {apt.doctorSpeciality}
                          </span>
                          <StatusBadge status={apt.status} />
                        </div>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                          <span>📅 {apt.appointmentDate}</span>
                          <span>⏰ {apt.timeSlot}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          Reason: {apt.reason}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-600">${apt.fees || 50}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {bills.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No invoices recorded for this patient.
                  </div>
                ) : (
                  bills.map((bill) => (
                    <div
                      key={bill._id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                            #{bill.billNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              bill.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {bill.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Doctor: <strong>{bill.doctorName}</strong> • Date: {bill.date}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-extrabold text-slate-900">${bill.total}</p>
                        <p className="text-[10px] text-slate-400">{bill.paymentMethod || 'Cash'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
