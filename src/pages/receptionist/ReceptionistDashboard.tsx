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
import { Card, StatCard, SectionCard } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

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
  Plus,
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Receptionist Banner Header */}
      <div className="bg-[#5F6FFF] rounded-[16px] p-6 sm:p-8 text-white shadow-md shadow-[#5F6FFF]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-white border border-white/20">
            <Users className="w-3.5 h-3.5" />
            <span>Reception Desk Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Front Desk Management
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Manage patient registrations, appointment desk queues, doctor assignments, and billing invoices.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={() => setPatientModalOpen(true)}
            className="bg-white text-[#5F6FFF] hover:bg-blue-50 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Register Patient
          </Button>

          <Button
            variant="outline"
            onClick={() => setBookModalOpen(true)}
            className="border-white/40 text-white hover:bg-white/10 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Book Appointment
          </Button>

          <Button
            variant="outline"
            onClick={() => setBillModalOpen(true)}
            className="border-white/40 text-white hover:bg-white/10 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider"
          >
            <Receipt className="w-3.5 h-3.5 mr-1.5" /> Issue Invoice
          </Button>

          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-full bg-white/15 border border-white/20 text-white hover:bg-white/25 transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-[12px] text-xs font-bold">
          {error}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered"
          value={`${stats.totalPatients}`}
          subtitle="Patients registered in system"
          icon={<Users className="w-5 h-5 text-[#5F6FFF]" />}
          badgeText="Registry"
          badgeType="primary"
        />

        <StatCard
          title="Today's Appointments"
          value={`${stats.todayAppointments}`}
          subtitle="Scheduled desk queue visits"
          icon={<Calendar className="w-5 h-5 text-indigo-600" />}
          badgeText="Desk Queue"
          badgeType="primary"
        />

        <StatCard
          title="Pending Payments"
          value={`$${stats.pendingPaymentTotal}`}
          subtitle="Unsettled patient invoices"
          icon={<CreditCard className="w-5 h-5 text-amber-600" />}
          badgeText="Due"
          badgeType="warning"
        />

        <StatCard
          title="Invoices Generated"
          value={`${stats.totalBillsCount}`}
          subtitle="Total billing records issued"
          icon={<Receipt className="w-5 h-5 text-emerald-600" />}
          badgeText="Invoices"
          badgeType="success"
        />
      </div>

      {/* Main Content Grid: Appointments Desk Queue & Billing Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 & 2: Recent Appointments Queue */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Active Consultation Queue"
            subtitle="Recent appointments scheduled at the front desk"
            action={
              <a
                href="/receptionist/appointments"
                className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center gap-1"
              >
                Full Desk <ChevronRight className="w-3.5 h-3.5" />
              </a>
            }
          >
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading appointments desk...</div>
            ) : recentAppointments.length === 0 ? (
              <EmptyState
                title="No Active Appointments"
                description="No active appointments recorded in today's desk queue."
                icon={<Calendar className="w-8 h-8 text-[#5F6FFF]" />}
              />
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="p-4 bg-white rounded-[12px] border border-slate-200/80 hover:border-[#5F6FFF]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{apt.patientName || 'Patient'}</span>
                        <StatusBadge status={apt.status} />
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Stethoscope className="w-3.5 h-3.5 text-[#5F6FFF]" />
                          Dr. {apt.doctorName} ({apt.doctorSpeciality})
                        </span>
                        <span>📅 {apt.appointmentDate} • {apt.timeSlot}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPatientIdForDetails(apt.patientId)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" /> Patient
                      </Button>

                      {apt.status === 'scheduled' && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedAppointmentForReschedule(apt)}
                            className="text-xs bg-indigo-50 text-[#5F6FFF] hover:bg-indigo-100 border-none"
                          >
                            Reschedule
                          </Button>

                          <button
                            onClick={() => handleCancelAppointment(apt._id)}
                            className="p-2 rounded-[8px] text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
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
          </SectionCard>
        </div>

        {/* Column 3: Recent Billing & Quick Tools */}
        <div className="space-y-6">
          <SectionCard
            title="Invoicing Activity"
            subtitle="Recent patient bills generated"
            action={
              <a
                href="/receptionist/billing"
                className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center gap-1"
              >
                Billing Desk <ChevronRight className="w-3.5 h-3.5" />
              </a>
            }
          >
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading recent invoices...</div>
            ) : recentBills.length === 0 ? (
              <EmptyState
                title="No Invoices Found"
                description="No recent billing records available."
                icon={<Receipt className="w-7 h-7 text-[#5F6FFF]" />}
              />
            ) : (
              <div className="space-y-3">
                {recentBills.map((bill) => (
                  <div
                    key={bill._id}
                    onClick={() => setSelectedBillForInvoice(bill)}
                    className="p-3.5 bg-slate-50 rounded-[12px] border border-slate-200/80 hover:bg-white hover:border-[#5F6FFF]/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-[#5F6FFF] bg-[#F0F3FF] px-2 py-0.5 rounded-[4px] border border-[#D6DDFF]">
                        #{bill.billNumber}
                      </span>
                      <p className="text-xs font-bold text-slate-900">{bill.patientName || 'Patient'}</p>
                      <p className="text-[11px] text-slate-500">Dr. {bill.doctorName}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-sm font-extrabold text-slate-900">${bill.total}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
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
          </SectionCard>
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

