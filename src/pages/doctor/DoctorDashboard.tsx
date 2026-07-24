import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { doctorApi } from '../../services/doctorApi';
import { Appointment, Prescription } from '../../types';
import { StatusBadge } from '../../components/doctor/StatusBadge';
import { PrescriptionModal } from '../../components/doctor/PrescriptionModal';
import {
  Stethoscope,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  PlusCircle,
  ChevronRight,
  User,
  Phone,
  Pill,
  ArrowRight,
  Settings,
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [todayTotal, setTodayTotal] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

  const [todayQueue, setTodayQueue] = useState<Appointment[]>([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState<Prescription[]>([]);

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await doctorApi.getDashboard();
      if (res.success && res.data) {
        setTodayTotal(res.data.todayTotalCount || 0);
        setCompletedToday(res.data.completedTodayCount || 0);
        setUpcomingCount(res.data.upcomingCount || 0);
        setTodayQueue(res.data.todayAppointments || []);
        setRecentPrescriptions(res.data.recentPrescriptions || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load doctor dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkCompleted = async (aptId: string) => {
    try {
      await doctorApi.updateAppointmentStatus(aptId, 'completed');
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update appointment status');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-[#5F6FFF] to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold border border-white/20">
            <Stethoscope className="w-4 h-4 text-white" />
            <span>Consultant Doctor Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Doctor'}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Specialization: <strong className="text-white">{user?.speciality || 'General Medicine'}</strong> • Experience: <strong className="text-white">{user?.experience || '5+ Years'}</strong>
          </p>
        </div>
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <Stethoscope className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#5F6FFF] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Total</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{todayTotal} Patients</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Today</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{completedToday} Consults</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Schedule</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{upcomingCount} Booked</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recent Rx</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{recentPrescriptions.length} Issued</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Quick Portal Actions</h3>
          <p className="text-xs text-slate-500">Fast access to patient management workflows</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/doctor/appointments"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>View Full Schedule</span>
          </Link>

          <Link
            to="/doctor/prescriptions/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5F6FFF] hover:bg-blue-700 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write Prescription</span>
          </Link>

          <Link
            to="/doctor/availability"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Manage Slots</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Today's Queue & Recent Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Queue Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5F6FFF]" />
                Today's Consultations Queue
              </h2>
              <p className="text-xs text-slate-500">Patients scheduled for today</p>
            </div>
            <Link
              to="/doctor/appointments?dateRange=today"
              className="text-xs font-bold text-[#5F6FFF] hover:text-blue-700 flex items-center gap-1"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-400">
              Loading queue...
            </div>
          ) : todayQueue.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Queue is clear for today</p>
              <p className="text-xs text-slate-500">No pending patients scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayQueue.map((apt) => (
                <div
                  key={apt._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#5F6FFF] font-bold text-xs flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-extrabold text-slate-900">{apt.patientName || 'Alex Morgan'}</p>
                        <StatusBadge status={apt.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                        <span className="font-semibold text-[#5F6FFF]">{apt.timeSlot}</span>
                        {apt.patientPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {apt.patientPhone}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-600 mt-1.5 italic bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 inline-block">
                        "{apt.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => navigate(`/doctor/appointments/${apt._id}`)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Details
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/doctor/prescriptions/new?patientId=${apt.patientId}&patientName=${encodeURIComponent(
                            apt.patientName || ''
                          )}&patientPhone=${encodeURIComponent(apt.patientPhone || '')}&appointmentId=${apt._id}&appointmentDate=${
                            apt.appointmentDate
                          }`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#5F6FFF] hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      Prescribe
                    </button>

                    {apt.status === 'scheduled' && (
                      <button
                        onClick={() => handleMarkCompleted(apt._id)}
                        className="p-1.5 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                        title="Mark Completed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Prescriptions Column (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Recent Prescriptions
            </h2>
            <Link
              to="/doctor/prescriptions"
              className="text-xs font-bold text-[#5F6FFF] hover:text-blue-700 flex items-center gap-1"
            >
              All Rx <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentPrescriptions.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center text-xs text-slate-400">
              No recent prescriptions issued yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentPrescriptions.map((rx) => (
                <div
                  key={rx._id}
                  onClick={() => setSelectedPrescription(rx)}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-slate-900 group-hover:text-[#5F6FFF] transition-colors">
                      {rx.patientName || 'Patient'}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400">{rx.appointmentDate}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1 truncate">{rx.diagnosis}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{rx.medicines?.length || 0} Medicines</span>
                    <span className="text-[#5F6FFF] font-bold flex items-center gap-0.5">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescription View Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
};
