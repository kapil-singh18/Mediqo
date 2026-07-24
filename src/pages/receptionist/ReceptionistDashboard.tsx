import React, { useState, useEffect } from 'react';
import { receptionistApi } from '../../services/receptionistApi';
import { User, Appointment, Bill } from '../../types';
import { StatusBadge } from '../../components/doctor/StatusBadge';
import { PatientModal } from '../../components/receptionist/PatientModal';
import { BookAppointmentModal } from '../../components/receptionist/BookAppointmentModal';
import { CreateBillModal } from '../../components/receptionist/CreateBillModal';
import { RescheduleModal } from '../../components/receptionist/RescheduleModal';
import { BillInvoiceModal } from '../../components/receptionist/BillInvoiceModal';
import { PatientDetailsModal } from '../../components/receptionist/PatientDetailsModal';

import {
  Users,
  Calendar,
  CreditCard,
  Receipt,
  UserPlus,
  PlusCircle,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  Eye,
  XCircle,
  Stethoscope,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const ReceptionistDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingPaymentTotal: 0,
    totalBillsCount: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [patientsList, setPatientsList] = useState<User[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState<Appointment | null>(null);
  const [selectedBillForInvoice, setSelectedBillForInvoice] = useState<Bill | null>(null);
  const [selectedPatientIdForDetails, setSelectedPatientIdForDetails] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashRes, patientsRes, doctorsRes] = await Promise.all([
        receptionistApi.getDashboardStats(),
        receptionistApi.getPatients({ limit: 100 }),
        receptionistApi.getDoctors(),
      ]);

      if (dashRes.success && dashRes.data) {
        setStats(dashRes.data.stats);
        setRecentAppointments(dashRes.data.recentAppointments || []);
        setRecentBills(dashRes.data.recentBills || []);
      }

      if (patientsRes.success && patientsRes.data) {
        setPatientsList(patientsRes.data.patients || []);
      }

      if (doctorsRes.success && doctorsRes.data) {
        setDoctorsList(doctorsRes.data.doctors || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch receptionist dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRegisterPatientSubmit = async (data: any) => {
    await receptionistApi.createPatient(data);
    fetchDashboardData();
  };

  const handleCancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await receptionistApi.cancelAppointment(id);
      fetchDashboardData();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Reception Desk Console
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage patient registrations, appointment desk queues, doctor assignments, and billing invoices.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setPatientModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>

          <button
            onClick={() => setBookModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => setBillModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shadow-slate-900/10"
          >
            <Receipt className="w-4 h-4" />
            <span>Issue Invoice</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Patients */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Total Patients
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {stats.totalPatients}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[11px] text-purple-700 font-bold">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Registered Patients in Registry
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Today's Appointments
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {stats.todayAppointments}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-[11px] text-indigo-700 font-bold flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Scheduled for Today's Queue
          </div>
        </div>

        {/* Pending Payments Total */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Pending Payment Due
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ${stats.pendingPaymentTotal}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-[11px] text-amber-700 font-bold">
            Unsettled patient invoices
          </div>
        </div>

        {/* Total Invoices Issued */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Invoices Generated
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {stats.totalBillsCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-[11px] text-emerald-700 font-bold">
            All billing history records
          </div>
        </div>
      </div>

      {/* Main Content Grid: Appointments Desk Queue & Billing Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 & 2: Recent Appointments Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Active Consultation Queue
                </h2>
                <p className="text-xs text-slate-500">Recent appointments scheduled at the desk</p>
              </div>
              <a
                href="/receptionist/appointments"
                className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
              >
                <span>View Full Desk</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading appointments desk...</div>
            ) : recentAppointments.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No active appointments recorded today.
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{apt.patientName || 'Patient'}</span>
                        <StatusBadge status={apt.status} />
                      </div>
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                          Dr. {apt.doctorName} ({apt.doctorSpeciality})
                        </span>
                        <span>📅 {apt.appointmentDate} • {apt.timeSlot}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedPatientIdForDetails(apt.patientId)}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                        title="View Patient Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        Patient
                      </button>

                      {apt.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => setSelectedAppointmentForReschedule(apt)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelAppointment(apt._id)}
                            className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Recent Billing & Quick Tools */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Invoicing Activity
                </h2>
                <p className="text-xs text-slate-500">Recent patient bills generated</p>
              </div>
              <a
                href="/receptionist/billing"
                className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
              >
                <span>Billing Desk</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading recent invoices...</div>
            ) : recentBills.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No recent bills found.</div>
            ) : (
              <div className="space-y-3">
                {recentBills.map((bill) => (
                  <div
                    key={bill._id}
                    onClick={() => setSelectedBillForInvoice(bill)}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 hover:bg-purple-50/50 hover:border-purple-200 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        #{bill.billNumber}
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-1">{bill.patientName || 'Patient'}</p>
                      <p className="text-[11px] text-slate-500">Doctor: {bill.doctorName}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">${bill.total}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          bill.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PatientModal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        onSubmit={handleRegisterPatientSubmit}
      />

      <BookAppointmentModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSuccess={fetchDashboardData}
        patientsList={patientsList}
        doctorsList={doctorsList}
      />

      <CreateBillModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        onSuccess={fetchDashboardData}
        patientsList={patientsList}
        doctorsList={doctorsList}
      />

      <RescheduleModal
        appointment={selectedAppointmentForReschedule}
        doctorsList={doctorsList}
        onClose={() => setSelectedAppointmentForReschedule(null)}
        onSuccess={fetchDashboardData}
      />

      <BillInvoiceModal
        bill={selectedBillForInvoice}
        onClose={() => setSelectedBillForInvoice(null)}
      />

      <PatientDetailsModal
        patientId={selectedPatientIdForDetails}
        onClose={() => setSelectedPatientIdForDetails(null)}
        onBookAppointment={(pt) => {
          setSelectedPatientIdForDetails(null);
          setBookModalOpen(true);
        }}
        onCreateBill={(pt) => {
          setSelectedPatientIdForDetails(null);
          setBillModalOpen(true);
        }}
      />
    </div>
  );
};
