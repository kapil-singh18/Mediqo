import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  User,
  Plus,
  ArrowRight,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Appointment, Prescription, Bill } from '../../types';
import { patientApi } from '../../services/patientApi';
import { StatusBadge } from '../../components/patient/StatusBadge';
import { LoadingSpinner } from '../../components/patient/LoadingSpinner';
import { Button } from '../../components/Button';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [apts, rxs, bls] = await Promise.all([
          patientApi.getMyAppointments(),
          patientApi.getMyPrescriptions(),
          patientApi.getMyBills(),
        ]);
        setAppointments(apts);
        setPrescriptions(rxs);
        setBills(bls);
      } catch (err) {
        console.error('Failed to load patient dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const upcomingAppointment = appointments.find((a) => a.status === 'scheduled');
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const pendingBills = bills.filter((b) => b.status === 'Pending');
  const pendingTotal = pendingBills.reduce((acc, b) => acc + b.total, 0);
  const latestPrescription = prescriptions[0];

  if (loading) {
    return <LoadingSpinner label="Preparing your medical dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#5F6FFF] rounded-3xl p-8 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Patient Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Patient'}!
          </h1>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Your healthcare portal is up to date. Schedule consultations, review past prescriptions, and track active appointments.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link to="/patient/book">
            <Button className="bg-white text-[#5F6FFF] hover:bg-indigo-50 font-bold rounded-full px-6 py-3 shadow-md border-none text-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Book Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Metric & Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Upcoming Appointment Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5F6FFF] flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Scheduled Visit</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Visit</p>
            {upcomingAppointment ? (
              <div className="mt-1 space-y-0.5">
                <p className="text-sm font-extrabold text-slate-900 truncate">{upcomingAppointment.doctorName}</p>
                <p className="text-xs text-[#5F6FFF] font-semibold">{upcomingAppointment.appointmentDate} at {upcomingAppointment.timeSlot}</p>
              </div>
            ) : (
              <p className="text-sm font-extrabold text-slate-400 mt-1">No Active Appointment</p>
            )}
          </div>
          <Link
            to="/patient/appointments"
            className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center pt-2 border-t border-slate-100"
          >
            View All Visits <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* Card 2: Completed Appointments */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">History</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Visits</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{completedCount} Consultations</p>
          </div>
          <Link
            to="/patient/appointments"
            className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center pt-2 border-t border-slate-100"
          >
            View History <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* Card 3: Pending Bills */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {pendingBills.length} Pending
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Bills</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">${pendingTotal} Total</p>
          </div>
          <Link
            to="/patient/bills"
            className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center pt-2 border-t border-slate-100"
          >
            View Bills <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* Card 4: Latest Prescription */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Rx Digital</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Prescription</p>
            {latestPrescription ? (
              <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
                {latestPrescription.diagnosis}
              </p>
            ) : (
              <p className="text-sm font-extrabold text-slate-400 mt-1">No Prescriptions</p>
            )}
          </div>
          <Link
            to="/patient/prescriptions"
            className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center pt-2 border-t border-slate-100"
          >
            View Prescriptions <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Quick Portal Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/patient/book"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#5F6FFF] hover:bg-indigo-50/50 transition-all text-center flex flex-col items-center space-y-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-[#5F6FFF] flex items-center justify-center group-hover:bg-[#5F6FFF] group-hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-[#5F6FFF] transition-colors">
              Book Appointment
            </span>
          </Link>

          <Link
            to="/patient/appointments"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#5F6FFF] hover:bg-indigo-50/50 transition-all text-center flex flex-col items-center space-y-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-[#5F6FFF] flex items-center justify-center group-hover:bg-[#5F6FFF] group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-[#5F6FFF] transition-colors">
              View Appointments
            </span>
          </Link>

          <Link
            to="/patient/bills"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#5F6FFF] hover:bg-indigo-50/50 transition-all text-center flex flex-col items-center space-y-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-[#5F6FFF] flex items-center justify-center group-hover:bg-[#5F6FFF] group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-[#5F6FFF] transition-colors">
              View Invoices & Bills
            </span>
          </Link>

          <Link
            to="/patient/profile"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#5F6FFF] hover:bg-indigo-50/50 transition-all text-center flex flex-col items-center space-y-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-[#5F6FFF] flex items-center justify-center group-hover:bg-[#5F6FFF] group-hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-[#5F6FFF] transition-colors">
              Edit My Profile
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
