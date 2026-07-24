import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { doctorApi } from '../../services/doctorApi';
import { Appointment, Prescription } from '../../types';
import { StatusBadge } from '../../components/doctor/StatusBadge';
import { PrescriptionModal } from '../../components/doctor/PrescriptionModal';
import { Card, StatCard, SectionCard } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
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
  Plus,
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Doctor Header Banner */}
      <div className="bg-[#5F6FFF] rounded-[16px] p-6 sm:p-8 text-white shadow-md shadow-[#5F6FFF]/10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-white border border-white/20">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Consultant Doctor Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Welcome back, {user?.name || 'Doctor'}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Specialization: <strong className="text-white">{user?.speciality || 'General Medicine'}</strong> • Experience: <strong className="text-white">{user?.experience || '5+ Years'}</strong>
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5">
          <Link to="/doctor/prescriptions/new">
            <Button variant="secondary" className="bg-white text-[#5F6FFF] hover:bg-blue-50 font-bold px-5 py-2 rounded-full text-xs uppercase tracking-wider">
              <Plus className="w-3.5 h-3.5 mr-1" /> Write Prescription
            </Button>
          </Link>
          <Link to="/doctor/appointments">
            <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-5 py-2 rounded-full text-xs uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 mr-1" /> Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Today's Total"
          value={`${todayTotal}`}
          subtitle="Scheduled patient consults"
          icon={<Users className="w-5 h-5 text-[#5F6FFF]" />}
          badgeText="Today"
          badgeType="primary"
        />

        <StatCard
          title="Completed Consults"
          value={`${completedToday}`}
          subtitle="Consultations finished"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          badgeText="Done"
          badgeType="success"
        />

        <StatCard
          title="Upcoming Schedule"
          value={`${upcomingCount}`}
          subtitle="Booked future visits"
          icon={<Calendar className="w-5 h-5 text-amber-600" />}
          badgeText="Booked"
          badgeType="warning"
        />

        <StatCard
          title="Recent Prescriptions"
          value={`${recentPrescriptions.length}`}
          subtitle="Digital Rx issued"
          icon={<FileText className="w-5 h-5 text-purple-600" />}
          badgeText="Rx Issued"
          badgeType="primary"
        />
      </div>

      {/* Quick Actions Bar */}
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h3>
          <p className="text-xs text-slate-500 font-normal">Fast access to patient management workflows</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/doctor/appointments">
            <Button variant="outline" size="sm" className="text-xs">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Full Schedule
            </Button>
          </Link>

          <Link to="/doctor/prescriptions/new">
            <Button variant="primary" size="sm" className="text-xs">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Write Prescription
            </Button>
          </Link>

          <Link to="/doctor/availability">
            <Button variant="outline" size="sm" className="text-xs">
              <Settings className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Manage Slots
            </Button>
          </Link>
        </div>
      </Card>

      {/* Main Grid: Today's Queue & Recent Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Queue Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Today's Consultation Queue"
            subtitle="Patients scheduled for consultation today"
            action={
              <Link
                to="/doctor/appointments?dateRange=today"
                className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center gap-1"
              >
                See All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading queue...
              </div>
            ) : todayQueue.length === 0 ? (
              <EmptyState
                title="Consultation Queue Clear"
                description="No pending patients scheduled for today."
                icon={<CheckCircle2 className="w-8 h-8 text-emerald-500" />}
              />
            ) : (
              <div className="space-y-3">
                {todayQueue.map((apt) => (
                  <div
                    key={apt._id}
                    className="bg-white rounded-[12px] p-4 border border-slate-200/80 hover:border-[#5F6FFF]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#F0F3FF] text-[#5F6FFF] font-bold text-xs flex items-center justify-center shrink-0 border border-[#D6DDFF]">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{apt.patientName || 'Patient'}</p>
                          <StatusBadge status={apt.status} />
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-3">
                          <span className="font-semibold text-[#5F6FFF]">⏰ {apt.timeSlot}</span>
                          {apt.patientPhone && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Phone className="w-3 h-3" /> {apt.patientPhone}
                            </span>
                          )}
                        </p>
                        {apt.reason && (
                          <p className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-[6px] border border-slate-100 inline-block italic">
                            "{apt.reason}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/doctor/appointments/${apt._id}`)}
                        className="text-xs"
                      >
                        Details
                      </Button>

                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          navigate(
                            `/doctor/prescriptions/new?patientId=${apt.patientId}&patientName=${encodeURIComponent(
                              apt.patientName || ''
                            )}&patientPhone=${encodeURIComponent(apt.patientPhone || '')}&appointmentId=${apt._id}&appointmentDate=${
                              apt.appointmentDate
                            }`
                          )
                        }
                        className="text-xs"
                      >
                        <Pill className="w-3.5 h-3.5 mr-1" /> Prescribe
                      </Button>

                      {apt.status === 'scheduled' && (
                        <button
                          onClick={() => handleMarkCompleted(apt._id)}
                          className="p-2 rounded-[8px] text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
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
          </SectionCard>
        </div>

        {/* Recent Prescriptions Column (1 Col) */}
        <div className="space-y-4">
          <SectionCard
            title="Recent Prescriptions"
            subtitle="Recently issued digital Rx"
            action={
              <Link
                to="/doctor/prescriptions"
                className="text-xs font-bold text-[#5F6FFF] hover:underline flex items-center gap-1"
              >
                All Rx <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {recentPrescriptions.length === 0 ? (
              <EmptyState
                title="No Recent Prescriptions"
                description="No digital prescriptions issued yet."
                icon={<FileText className="w-7 h-7 text-[#5F6FFF]" />}
              />
            ) : (
              <div className="space-y-3">
                {recentPrescriptions.map((rx) => (
                  <div
                    key={rx._id}
                    onClick={() => setSelectedPrescription(rx)}
                    className="bg-slate-50 rounded-[12px] p-3.5 border border-slate-200/80 hover:bg-white hover:border-[#5F6FFF]/40 transition-all cursor-pointer group space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#5F6FFF] transition-colors">
                        {rx.patientName || 'Patient'}
                      </p>
                      <span className="text-[10px] font-medium text-slate-400">{rx.appointmentDate}</span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{rx.diagnosis}</p>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{rx.medicines?.length || 0} Medicines</span>
                      <span className="text-[#5F6FFF] font-bold flex items-center gap-0.5">
                        View Rx <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
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

