import React, { useState, useEffect } from 'react';
import { Appointment, User } from '../../types';
import { receptionistApi } from '../../services/receptionistApi';
import { StatusBadge } from '../../components/doctor/StatusBadge';
import { BookAppointmentModal } from '../../components/receptionist/BookAppointmentModal';
import { RescheduleModal } from '../../components/receptionist/RescheduleModal';
import { CreateBillModal } from '../../components/receptionist/CreateBillModal';
import { PatientDetailsModal } from '../../components/receptionist/PatientDetailsModal';

import {
  Calendar,
  Filter,
  PlusCircle,
  RefreshCw,
  Clock,
  Stethoscope,
  XCircle,
  Eye,
  Receipt,
  Phone,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/LayoutPrimitives';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';

export const ReceptionistAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');

  const [patientsList, setPatientsList] = useState<User[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState<Appointment | null>(null);
  const [selectedAppointmentForBill, setSelectedAppointmentForBill] = useState<Appointment | null>(null);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [selectedPatientIdDetails, setSelectedPatientIdDetails] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [aptRes, ptsRes, docsRes] = await Promise.all([
        receptionistApi.getAppointments({
          search,
          status: statusFilter,
          date: dateFilter,
          doctorId: doctorFilter,
        }),
        receptionistApi.getPatients({ limit: 100 }),
        receptionistApi.getDoctors(),
      ]);

      if (aptRes.success && aptRes.data) {
        setAppointments(aptRes.data.appointments || []);
      }

      if (ptsRes.success && ptsRes.data) {
        setPatientsList(ptsRes.data.patients || []);
      }

      if (docsRes.success && docsRes.data) {
        setDoctorsList(docsRes.data.doctors || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [search, dateFilter, statusFilter, doctorFilter]);

  const handleCancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await receptionistApi.cancelAppointment(id);
      fetchAppointments();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Appointments Desk"
        subtitle="Monitor consultation schedules, reschedule slots, reassign doctors, and cancel bookings."
        badgeText="Reception Management"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={() => setBookModalOpen(true)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Book New Appointment
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={fetchAppointments}
              title="Refresh Appointments"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        }
      />

      {/* Toolbar Filters */}
      <Card className="p-4 border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80">
          <SearchInput
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search patient, doctor, complaint..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Date Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-[8px] border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Today's Appointments</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-[8px] border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Doctor Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-[8px] border border-slate-200">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none"
            >
              <option value="all">All Doctors</option>
              {doctorsList.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-[12px] text-xs font-bold">
          {error}
        </div>
      )}

      {/* Appointments List */}
      <Card className="border border-slate-200 overflow-hidden p-0">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading appointments desk data...</div>
        ) : appointments.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No appointments found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-200/80">
                  <th className="p-4 pl-6">Patient</th>
                  <th className="p-4">Assigned Doctor</th>
                  <th className="p-4">Date & Time Slot</th>
                  <th className="p-4">Reason / Complaint</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-extrabold text-slate-900">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{apt.patientName || 'Patient'}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          {apt.patientPhone || 'N/A'}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-[8px] bg-blue-50 text-[#5F6FFF] font-bold flex items-center justify-center text-[10px]">
                          <Stethoscope className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{apt.doctorName}</p>
                          <p className="text-[10px] text-slate-400">{apt.doctorSpeciality}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">📅 {apt.appointmentDate}</p>
                      <p className="text-[10px] text-[#5F6FFF] font-semibold">⏰ {apt.timeSlot}</p>
                    </td>

                    <td className="p-4 text-slate-600 truncate max-w-xs font-medium">
                      {apt.reason}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={apt.status} />
                    </td>

                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedPatientIdDetails(apt.patientId)}
                          className="p-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="View Patient Record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {apt.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => setSelectedAppointmentForReschedule(apt)}
                              className="px-2.5 py-1.5 rounded-[8px] bg-blue-50 hover:bg-blue-100 text-[#5F6FFF] font-bold text-[11px] transition-colors"
                            >
                              Reschedule
                            </button>

                            <button
                              onClick={() => handleCancelAppointment(apt._id)}
                              className="p-2 rounded-[8px] bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Cancel Appointment"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setSelectedAppointmentForBill(apt);
                            setBillModalOpen(true);
                          }}
                          className="p-2 rounded-[8px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          title="Generate Invoice for Appointment"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modals */}
      <BookAppointmentModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSuccess={fetchAppointments}
        patientsList={patientsList}
        doctorsList={doctorsList}
      />

      <RescheduleModal
        appointment={selectedAppointmentForReschedule}
        doctorsList={doctorsList}
        onClose={() => setSelectedAppointmentForReschedule(null)}
        onSuccess={fetchAppointments}
      />

      <CreateBillModal
        isOpen={billModalOpen}
        onClose={() => {
          setBillModalOpen(false);
          setSelectedAppointmentForBill(null);
        }}
        onSuccess={fetchAppointments}
        patientsList={patientsList}
        doctorsList={doctorsList}
        preselectedPatient={
          selectedAppointmentForBill
            ? ({
                id: selectedAppointmentForBill.patientId,
                name: selectedAppointmentForBill.patientName,
                phone: selectedAppointmentForBill.patientPhone,
              } as any)
            : null
        }
      />

      <PatientDetailsModal
        patientId={selectedPatientIdDetails}
        onClose={() => setSelectedPatientIdDetails(null)}
      />
    </div>
  );
};
