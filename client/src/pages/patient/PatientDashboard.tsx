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
  Pill,
  Receipt,
  UserCheck,
} from 'lucide-react';
import { Appointment, Prescription, Bill } from '../../types';
import { patientApi } from '../../services/patientApi';
import { StatusBadge } from '../../components/patient/StatusBadge';
import { LoadingSpinner } from '../../components/patient/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { Card, StatCard, SectionCard } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { doctorsData } from '../../assets/assets';

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

  // Helper to find doctor image
  const getDoctorImage = (doctorName: string) => {
    const match = doctorsData.find(
      (d) => d.name.toLowerCase() === doctorName.toLowerCase() || doctorName.toLowerCase().includes(d.name.toLowerCase())
    );
    return match ? match.image : null;
  };

  if (loading) {
    return <LoadingSpinner label="Preparing your medical dashboard..." />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-[#5F6FFF] rounded-[16px] p-6 sm:p-8 text-white shadow-md shadow-[#5F6FFF]/10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-white border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Verified Patient Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Welcome back, {user?.name || 'Patient'}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Your healthcare dashboard is active. Schedule consultations, view prescriptions, and review payment receipts seamlessly.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link to="/patient/book">
            <Button variant="secondary" className="bg-white text-[#5F6FFF] hover:bg-blue-50 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Book Consultation
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Next Scheduled Visit"
          value={upcomingAppointment ? upcomingAppointment.timeSlot : 'No Visit'}
          subtitle={upcomingAppointment ? `${upcomingAppointment.doctorName} • ${upcomingAppointment.appointmentDate}` : 'No upcoming appointment'}
          icon={<Calendar className="w-5 h-5 text-[#5F6FFF]" />}
          badgeText={upcomingAppointment ? 'Scheduled' : 'Clear'}
          badgeType={upcomingAppointment ? 'primary' : 'neutral'}
          action={
            <Link to="/patient/appointments" className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center">
              View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          }
        />

        <StatCard
          title="Completed Consultations"
          value={`${completedCount}`}
          subtitle="Past medical consultations"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          badgeText="Completed"
          badgeType="success"
          action={
            <Link to="/patient/appointments" className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center">
              History <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          }
        />

        <StatCard
          title="Pending Invoices"
          value={`$${pendingTotal}`}
          subtitle={`${pendingBills.length} unpaid bill${pendingBills.length === 1 ? '' : 's'}`}
          icon={<CreditCard className="w-5 h-5 text-amber-600" />}
          badgeText={pendingBills.length > 0 ? `${pendingBills.length} Due` : 'Settled'}
          badgeType={pendingBills.length > 0 ? 'warning' : 'success'}
          action={
            <Link to="/patient/bills" className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center">
              Pay <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          }
        />

        <StatCard
          title="Latest Digital Rx"
          value={latestPrescription ? 'Issued' : 'None'}
          subtitle={latestPrescription ? latestPrescription.diagnosis : 'No active prescriptions'}
          icon={<FileText className="w-5 h-5 text-purple-600" />}
          badgeText={latestPrescription ? 'Digital Rx' : 'Empty'}
          badgeType={latestPrescription ? 'primary' : 'neutral'}
          action={
            <Link to="/patient/prescriptions" className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center">
              View Rx <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          }
        />
      </div>

      {/* Quick Portal Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h3>
          <span className="text-xs text-slate-400">Direct Patient Services</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/patient/book"
            className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/80 hover:border-[#5F6FFF] hover:bg-[#F0F3FF] transition-all text-center flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-[10px] bg-white border border-slate-200 text-[#5F6FFF] flex items-center justify-center group-hover:bg-[#5F6FFF] group-hover:text-white transition-all shadow-2xs">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#5F6FFF] transition-colors">
              Book Appointment
            </span>
          </Link>

          <Link
            to="/patient/appointments"
            className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/80 hover:border-[#5F6FFF] hover:bg-[#F0F3FF] transition-all text-center flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-[10px] bg-white border border-slate-200 text-[#5F6FFF] flex items-center justify-center group-hover:bg-[#5F6FFF] group-hover:text-white transition-all shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#5F6FFF] transition-colors">
              My Appointments
            </span>
          </Link>

          <Link
            to="/patient/bills"
            className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/80 hover:border-[#5F6FFF] hover:bg-[#F0F3FF] transition-all text-center flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-[10px] bg-white border border-slate-200 text-[#5F6FFF] flex items-center justify-center group-hover:bg-[#5F6FFF] group-hover:text-white transition-all shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#5F6FFF] transition-colors">
              Bills & Receipts
            </span>
          </Link>

          <Link
            to="/patient/profile"
            className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/80 hover:border-[#5F6FFF] hover:bg-[#F0F3FF] transition-all text-center flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-[10px] bg-white border border-slate-200 text-[#5F6FFF] flex items-center justify-center group-hover:bg-[#5F6FFF] group-hover:text-white transition-all shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#5F6FFF] transition-colors">
              My Profile
            </span>
          </Link>
        </div>
      </Card>

      {/* Upcoming & Active Appointments List */}
      <SectionCard
        title="Upcoming Consultations"
        subtitle="Scheduled appointments with Mediqo specialists"
        action={
          <Link to="/patient/appointments" className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center gap-1">
            View All Visits <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {appointments.length === 0 ? (
          <EmptyState
            title="No Scheduled Visits"
            description="You do not have any active appointments scheduled. Find a specialist and book a visit in a few clicks."
            icon={<Calendar className="w-8 h-8 text-[#5F6FFF]" />}
            actionButton={
              <Link to="/patient/book">
                <Button size="sm" variant="primary">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Book Consultation
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 3).map((apt) => {
              const docImg = getDoctorImage(apt.doctorName);
              return (
                <div
                  key={apt._id}
                  className="p-4 rounded-[12px] bg-white border border-slate-200/80 hover:border-[#5F6FFF]/40 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {docImg ? (
                      <img
                        src={docImg}
                        alt={apt.doctorName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#F0F3FF] text-[#5F6FFF] flex items-center justify-center font-bold text-sm shrink-0 border border-[#D6DDFF]">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{apt.doctorName}</h4>
                        <StatusBadge status={apt.status} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {apt.doctorSpeciality || 'General Medicine'}
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-3">
                        <span className="font-semibold text-[#5F6FFF]">
                          📅 {apt.appointmentDate}
                        </span>
                        <span className="font-semibold text-slate-600">
                          ⏰ {apt.timeSlot}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link to="/patient/appointments">
                      <Button variant="outline" size="sm" className="text-xs">
                        Visit Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Two-Column Grid: Recent Prescriptions & Unpaid Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent Digital Prescriptions */}
        <SectionCard
          title="Recent Digital Prescriptions"
          subtitle="Prescribed medications & dosage directions"
          action={
            <Link to="/patient/prescriptions" className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center gap-1">
              All Rx <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {prescriptions.length === 0 ? (
            <EmptyState
              title="No Digital Prescriptions"
              description="No prescriptions have been issued to your account yet."
              icon={<Pill className="w-7 h-7 text-[#5F6FFF]" />}
            />
          ) : (
            <div className="space-y-3">
              {prescriptions.slice(0, 3).map((rx) => (
                <div
                  key={rx._id}
                  className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-[#5F6FFF]/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rx.doctorName || 'Consultant'}</span>
                    <span className="text-[11px] font-medium text-slate-400">{rx.appointmentDate}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#5F6FFF] bg-[#F0F3FF] px-2.5 py-1 rounded-[6px] inline-block">
                    Diagnosis: {rx.diagnosis}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>{rx.medicines?.length || 0} Prescribed Medicines</span>
                    <Link to="/patient/prescriptions" className="font-bold text-[#5F6FFF] hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Right Column: Outstanding Bills & Payments */}
        <SectionCard
          title="Invoices & Medical Bills"
          subtitle="Billing details for recent clinic consultations"
          action={
            <Link to="/patient/bills" className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center gap-1">
              All Invoices <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {bills.length === 0 ? (
            <EmptyState
              title="No Invoices Found"
              description="You do not have any billing statements or pending invoices."
              icon={<Receipt className="w-7 h-7 text-[#5F6FFF]" />}
            />
          ) : (
            <div className="space-y-3">
              {bills.slice(0, 3).map((bill) => (
                <div
                  key={bill._id}
                  className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-[#5F6FFF]/30 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">
                        #{bill.billNumber}
                      </span>
                      <StatusBadge status={bill.status} />
                    </div>
                    <p className="text-xs text-slate-500">
                      Dr. {bill.doctorName} • {bill.date || bill.appointmentDate}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-sm font-extrabold text-slate-900">${bill.total}</p>
                    <Link to="/patient/bills" className="text-xs font-bold text-[#5F6FFF] hover:underline block">
                      View Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

