import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doctorApi } from '../../services/doctorApi';
import { Appointment } from '../../types';
import { StatusBadge } from '../../components/doctor/StatusBadge';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  Pill,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export const DoctorAppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>(searchParams.get('dateRange') || 'all');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await doctorApi.getAppointments({
        search: searchTerm,
        status: statusFilter,
        dateRange: dateRangeFilter,
      });
      if (res.success) {
        setAppointments(res.data.appointments || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateRangeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

  const handleStatusChange = async (aptId: string, newStatus: string) => {
    try {
      await doctorApi.updateAppointmentStatus(aptId, newStatus);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to update appointment status');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#5F6FFF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
            Patient Consultation Management
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">My Appointments</h1>
          <p className="text-xs text-slate-500 mt-1">
            View scheduled consultations, filter patient lists, and manage clinical statuses.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh List
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient name, phone, or reason..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#5F6FFF] hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3">
          {/* Date Range Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'today', label: "Today's Schedule" },
              { id: 'future', label: 'Upcoming' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDateRangeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  dateRangeFilter === tab.id
                    ? 'bg-white text-[#5F6FFF] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Dropdown Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-xs text-slate-400">
          Fetching appointments...
        </div>
      ) : error ? (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-xs font-semibold border border-rose-200">
          {error}
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No appointments found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting search parameters or checking a different date filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#5F6FFF]" />
                    {apt.patientName || 'Alex Morgan'}
                  </span>
                  <StatusBadge status={apt.status} />

                  {(apt.patientAge || apt.patientGender) && (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {apt.patientAge ? `${apt.patientAge} yrs` : ''} {apt.patientGender || ''}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date: <strong className="text-slate-900">{apt.appointmentDate}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Slot: <strong className="text-[#5F6FFF]">{apt.timeSlot}</strong></span>
                  </p>
                  {apt.patientPhone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Phone: <strong className="text-slate-900">{apt.patientPhone}</strong></span>
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Reason for Visit</p>
                  <p className="text-slate-800 font-medium mt-0.5">{apt.reason}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap md:flex-col gap-2 shrink-0 justify-end">
                <button
                  onClick={() => navigate(`/doctor/appointments/${apt._id}`)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 justify-center"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  View Details
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
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5F6FFF] hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5 justify-center"
                >
                  <Pill className="w-3.5 h-3.5" />
                  Write Prescription
                </button>

                {apt.status === 'scheduled' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(apt._id, 'completed')}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(apt._id, 'cancelled')}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
